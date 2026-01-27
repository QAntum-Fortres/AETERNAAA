/**
 * Adaptive Retry System
 * Self-healing retry logic with exponential backoff and circuit breaker integration
 */

import { EventEmitter } from 'events';
import { Logger } from '../telemetry/Logger';

export interface RetryConfig {
    maxAttempts: number;
    baseDelay: number;
    maxDelay: number;
    jitter: boolean;
    backoffMultiplier: number;
    retryableErrors: string[];
}

export interface RetryResult<T> {
    success: boolean;
    result?: T;
    attempts: number;
    totalDuration: number;
    error?: Error;
}

export interface CircuitBreakerState {
    state: 'closed' | 'open' | 'half-open';
    failures: number;
    successes: number;
    lastFailureTime: number;
    openUntil: number;
}

/**
 * Adaptive Retry System with Circuit Breaker
 * Prevents cascade failures and adapts to service health
 */
export class AdaptiveRetrySystem extends EventEmitter {
    private logger: Logger;
    private circuitBreakers: Map<string, CircuitBreakerState> = new Map();
    private retryStats: Map<string, RetryStats> = new Map();
    
    private readonly DEFAULT_CONFIG: RetryConfig = {
        maxAttempts: 3,
        baseDelay: 100,
        maxDelay: 5000,
        jitter: true,
        backoffMultiplier: 2,
        retryableErrors: ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN', '500', '502', '503', '504']
    };

    constructor() {
        super();
        this.logger = Logger.getInstance();
    }

    /**
     * Execute function with adaptive retry
     */
    async executeWithRetry<T>(
        fn: () => Promise<T>,
        serviceKey: string,
        config: Partial<RetryConfig> = {}
    ): Promise<RetryResult<T>> {
        const finalConfig = { ...this.DEFAULT_CONFIG, ...config };
        const circuitBreaker = this.getOrCreateCircuitBreaker(serviceKey);
        
        // Check circuit breaker state
        if (this.isCircuitBreakerOpen(circuitBreaker)) {
            return {
                success: false,
                attempts: 0,
                totalDuration: 0,
                error: new Error(`Circuit breaker open for ${serviceKey}`)
            };
        }

        const startTime = Date.now();
        let lastError: Error | null = null;
        
        for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
            try {
                // Add delay for retry attempts
                if (attempt > 1) {
                    const delay = this.calculateDelay(attempt - 1, finalConfig);
                    await this.sleep(delay);
                }

                const result = await fn();
                
                // Success - reset circuit breaker
                this.recordSuccess(serviceKey, circuitBreaker);
                this.updateRetryStats(serviceKey, attempt, Date.now() - startTime, true);

                return {
                    success: true,
                    result,
                    attempts: attempt,
                    totalDuration: Date.now() - startTime
                };

            } catch (error: any) {
                lastError = error;
                
                // Check if error is retryable
                if (!this.isRetryableError(error, finalConfig)) {
                    this.recordFailure(serviceKey, circuitBreaker);
                    break;
                }

                this.logger.warn('RETRY', `Attempt ${attempt} failed for ${serviceKey}`, error.message);
                
                // Record failure for circuit breaker
                this.recordFailure(serviceKey, circuitBreaker);
                
                // If last attempt, don't continue
                if (attempt === finalConfig.maxAttempts) {
                    break;
                }
            }
        }

        // All attempts failed
        this.updateRetryStats(serviceKey, finalConfig.maxAttempts, Date.now() - startTime, false);
        
        return {
            success: false,
            attempts: finalConfig.maxAttempts,
            totalDuration: Date.now() - startTime,
            error: lastError || new Error('Unknown error')
        };
    }

    /**
     * Calculate delay with exponential backoff and jitter
     */
    private calculateDelay(attempt: number, config: RetryConfig): number {
        let delay = config.baseDelay * Math.pow(config.backoffMultiplier, attempt);
        
        if (config.jitter) {
            // Add jitter to prevent thundering herd
            const jitterAmount = delay * 0.1;
            delay += Math.random() * jitterAmount;
        }
        
        return Math.min(delay, config.maxDelay);
    }

    /**
     * Check if error is retryable
     */
    private isRetryableError(error: Error, config: RetryConfig): boolean {
        const errorMessage = error.message.toLowerCase();
        const errorCode = (error as any).code;
        const statusCode = (error as any).status?.toString();
        
        return config.retryableErrors.some(retryableError => 
            errorMessage.includes(retryableError.toLowerCase()) ||
            errorCode === retryableError ||
            statusCode === retryableError
        );
    }

    /**
     * Circuit breaker management
     */
    private getOrCreateCircuitBreaker(serviceKey: string): CircuitBreakerState {
        if (!this.circuitBreakers.has(serviceKey)) {
            this.circuitBreakers.set(serviceKey, {
                state: 'closed',
                failures: 0,
                successes: 0,
                lastFailureTime: 0,
                openUntil: 0
            });
        }
        
        return this.circuitBreakers.get(serviceKey)!;
    }

    private isCircuitBreakerOpen(circuitBreaker: CircuitBreakerState): boolean {
        if (circuitBreaker.state === 'open') {
            if (Date.now() > circuitBreaker.openUntil) {
                // Transition to half-open
                circuitBreaker.state = 'half-open';
                circuitBreaker.successes = 0;
                return false;
            }
            return true;
        }
        return false;
    }

    private recordSuccess(serviceKey: string, circuitBreaker: CircuitBreakerState): void {
        circuitBreaker.successes++;
        
        if (circuitBreaker.state === 'half-open' && circuitBreaker.successes >= 2) {
            // Close circuit breaker
            circuitBreaker.state = 'closed';
            circuitBreaker.failures = 0;
            this.logger.info('CIRCUIT_BREAKER', `Circuit closed for ${serviceKey}`);
        }
    }

    private recordFailure(serviceKey: string, circuitBreaker: CircuitBreakerState): void {
        circuitBreaker.failures++;
        circuitBreaker.lastFailureTime = Date.now();
        
        // Open circuit breaker if failure threshold reached
        if (circuitBreaker.failures >= 5 && circuitBreaker.state === 'closed') {
            circuitBreaker.state = 'open';
            circuitBreaker.openUntil = Date.now() + 60000; // 1 minute
            this.logger.warn('CIRCUIT_BREAKER', `Circuit opened for ${serviceKey}`);
            
            this.emit('circuit_breaker_opened', { serviceKey, failures: circuitBreaker.failures });
        }
    }

    /**
     * Update retry statistics for monitoring
     */
    private updateRetryStats(serviceKey: string, attempts: number, duration: number, success: boolean): void {
        const stats = this.retryStats.get(serviceKey) || {
            totalCalls: 0,
            totalRetries: 0,
            successRate: 0,
            avgDuration: 0,
            lastUpdated: Date.now()
        };

        stats.totalCalls++;
        stats.totalRetries += (attempts - 1);
        stats.successRate = ((stats.successRate * (stats.totalCalls - 1)) + (success ? 1 : 0)) / stats.totalCalls;
        stats.avgDuration = ((stats.avgDuration * (stats.totalCalls - 1)) + duration) / stats.totalCalls;
        stats.lastUpdated = Date.now();

        this.retryStats.set(serviceKey, stats);
    }

    /**
     * Get retry statistics for service
     */
    getRetryStats(serviceKey: string): RetryStats | undefined {
        return this.retryStats.get(serviceKey);
    }

    /**
     * Get all circuit breaker states
     */
    getCircuitBreakerStates(): Map<string, CircuitBreakerState> {
        return this.circuitBreakers;
    }

    /**
     * Force close circuit breaker (admin override)
     */
    forceCloseCircuitBreaker(serviceKey: string): void {
        const circuitBreaker = this.circuitBreakers.get(serviceKey);
        if (circuitBreaker) {
            circuitBreaker.state = 'closed';
            circuitBreaker.failures = 0;
            circuitBreaker.successes = 0;
            this.logger.info('CIRCUIT_BREAKER', `Circuit force-closed for ${serviceKey}`);
        }
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

interface RetryStats {
    totalCalls: number;
    totalRetries: number;
    successRate: number;
    avgDuration: number;
    lastUpdated: number;
}

export { CircuitBreakerState, RetryStats };