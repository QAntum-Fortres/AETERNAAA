// [PURIFIED_BY_AETERNA: 7920a541-d5d1-4ce0-a96b-be549abdf054]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: fd4d9495-b492-4305-84c0-565524e5adfa]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 8223e9ff-2cd7-4cad-be36-e73192e132e9]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 8223e9ff-2cd7-4cad-be36-e73192e132e9]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 8feabaf5-9f2f-482f-b110-83f50b700134]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 27b07feb-0b18-43e3-9c77-c5daaa677c9d]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: 27b07feb-0b18-43e3-9c77-c5daaa677c9d]
// Suggestion: Review and entrench stable logic.
// [PURIFIED_BY_AETERNA: c73f7de0-f699-4998-84fa-f308bb0979a9]
// Suggestion: Review and entrench stable logic.
import { proxyActivities } from '@temporalio/workflow';
import type * as activities from './activities';

const { validateInput, synthesizePlan, executeCognitiveTask, handleSecurityScan, finalizeOutput } =
    proxyActivities<typeof activities>({
        startToCloseTimeout: '1 minute',
        retry: {
            initialInterval: '1 second',
            maximumAttempts: 3,
            backoffCoefficient: 2,
        }
    });

/**
 * 🌀 VORTEX DURABLE ORCHESTRATOR
 * The "Nervous System" that makes every decision persistent and unstoppable.
 */
export async function vortexOrchestrator(goal: string): Promise<any> {
    // 1. Validate Input
    const isValid = await validateInput(goal);
    if (!isValid) {
        throw new Error(`[VORTEX_ERROR] Invalid goal definition: ${goal}`);
    }

    // 2. Initial Security Pre-check (Immune System)
    await handleSecurityScan();

    // 3. Synthesize the Plan (Neural Map)
    const plan = await synthesizePlan(goal);
    const results = [];

    // 4. Execute Workflow Steps (Durable Loop)
    for (const step of plan.steps) {
        // If the process crashes here, Temporal will resume from this specific step!
        const stepResult = await executeCognitiveTask(step);
        results.push({
            step,
            result: stepResult
        });
    }

    // 5. Finalize and Consolidate
    return await finalizeOutput(results);
}
