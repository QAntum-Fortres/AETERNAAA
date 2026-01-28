/**
 * Circuit Breaker pattern to prevent cascading failures
 */

type BreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitBreakerOptions {
  failureThreshold?: number; // Number of failures before opening
  failureWindow?: number;   // Time window for failures in ms (e.g. 30s)
  resetTimeout?: number;    // Time to wait before trying again (HALF_OPEN) in ms
  monitor?: (event: string, details: any) => void;
}

export class CircuitBreaker {
  private state: BreakerState = 'CLOSED';
  private failures = 0;
  private lastFailureTime = 0;
  private nextAttempt = 0;
  
  private readonly failureThreshold: number;
  private readonly failureWindow: number;
  private readonly resetTimeout: number;
  private readonly monitor: (event: string, details: any) => void;

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.failureWindow = options.failureWindow || 30000;
    this.resetTimeout = options.resetTimeout || 10000;
    this.monitor = options.monitor || (() => {});
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttempt) {
        this.transition('HALF_OPEN');
      } else {
        const error = new Error('Circuit Breaker is OPEN');
        (error as any).code = 'CIRCUIT_OPEN';
        this.monitor('blocked', { nextAttempt: this.nextAttempt });
        throw error;
      }
    }

    try {
      const result = await fn();
      
      if (this.state === 'HALF_OPEN') {
        this.success();
      }
      
      return result;
    } catch (error) {
      this.failure(error);
      throw error;
    }
  }

  private success() {
    this.failures = 0;
    this.transition('CLOSED');
    this.monitor('success', { failures: 0 });
  }

  private failure(error: any) {
    this.failures++;
    this.lastFailureTime = Date.now();
    this.monitor('failure', { failures: this.failures, error: error.message });

    if (this.state === 'HALF_OPEN' || this.failures >= this.failureThreshold) {
      // Check if failures happened within the window
      // (If state is HALF_OPEN, a single failure opens it back up)
      this.transition('OPEN');
    }
  }

  private transition(newState: BreakerState) {
    const oldState = this.state;
    this.state = newState;
    
    if (newState === 'OPEN') {
      this.nextAttempt = Date.now() + this.resetTimeout;
    }
    
    if (oldState !== newState) {
      console.warn(`[CircuitBreaker] Transition: ${oldState} -> ${newState}`);
      this.monitor('transition', { from: oldState, to: newState });
    }
  }

  getState(): BreakerState {
    return this.state;
  }
}
