// [PURIFIED_BY_AETERNA: 59f81003-82b2-43e7-b9aa-1634bd9788c9]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 9a179796-2018-4abf-ad69-12a4eb25267c]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 732c7113-8cfa-4637-82b9-7ec13c134844]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 732c7113-8cfa-4637-82b9-7ec13c134844]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: eeecc2de-f5ea-45bd-afd3-d87c868567e7]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: cca40a5b-efe2-40a7-ac2c-1f9df3b988da]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: cca40a5b-efe2-40a7-ac2c-1f9df3b988da]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: a42e0c80-f65d-44d2-8a1d-6db842581cf8]
// Suggestion: Review and entrench stable logic.
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * BRAIN ROUTER - Intelligent Model Selection System
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * "Избираме модела базирано на сложността. RTX 4050 за бързо. DeepSeek за дълбоко."
 *
 * Routing Logic:
 * - Complexity < 7: LOCAL_LLAMA_3.1_8B (Fast, Free, Local)
 * - Complexity >= 7: CLOUD_DEEPSEEK_V3 (Slow, Paid, Infinite)
 *
 * @author Димитър Продромов / Mister Mind
 * @copyright 2026 QAntum Empire. All Rights Reserved.
 * @version 28.5.0 - THE AWAKENING
 */
import { EventEmitter } from 'events';
export type ModelProvider = 'LOCAL_LLAMA_3.1_8B' | 'LOCAL_CODELLAMA_13B' | 'LOCAL_MISTRAL_7B' | 'CLOUD_DEEPSEEK_V3' | 'CLOUD_GPT4O' | 'CLOUD_CLAUDE_OPUS';
export interface TaskAnalysis {
    complexity: number;
    taskType: TaskType;
    requiredCapabilities: string[];
    estimatedTokens: number;
    securityLevel: 'public' | 'sensitive' | 'classified';
}
export type TaskType = 'code-generation' | 'code-fix' | 'security-analysis' | 'proposal-generation' | 'semantic-search' | 'general-chat' | 'complex-reasoning' | 'future-simulation';
export interface RoutingDecision {
    provider: ModelProvider;
    model: string;
    reason: string;
    estimatedCost: number;
    estimatedLatency: number;
}
export declare class BrainRouter extends EventEmitter {
    private static instance;
    private readonly localEngine;
    private readonly MODEL_CONFIG;
    private readonly COMPLEXITY_THRESHOLD;
    private routingHistory;
    private constructor();
    static getInstance(): BrainRouter;
    /**
     * Route task to optimal model based on complexity and type
     */
    route(prompt: string, taskType?: TaskType): Promise<RoutingDecision>;
    /**
     * Execute task with automatic routing
     */
    execute(prompt: string, taskType?: TaskType, context?: Record<string, any>): Promise<string | null>;
    private analyzeTask;
    private detectTaskType;
    private calculateComplexity;
    private determineSecurityLevel;
    private extractCapabilities;
    private executeCloud;
    /**
     * Quick routing decision based on complexity score
     */
    static routeByComplexity(taskComplexity: number): Promise<ModelProvider>;
    getRoutingHistory(): RoutingDecision[];
    getRoutingStats(): {
        local: number;
        cloud: number;
        totalCost: number;
    };
}
export declare const brainRouter: BrainRouter;
export default BrainRouter;
