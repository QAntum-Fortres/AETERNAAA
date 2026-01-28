/**
 * Exponential Backoff with Jitter for robust API calls
 */

const RETRY_CODES = new Set([408, 429, 500, 502, 503, 504]);

interface RetryOptions {
  baseDelay?: number;
  maxDelay?: number;
  maxAttempts?: number;
  retryCodes?: Set<number>;
}

export async function callWithRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    baseDelay = 200,
    maxDelay = 5000,
    maxAttempts = 5,
    retryCodes = RETRY_CODES,
  } = options;

  let lastError: any;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const status = error?.response?.status || error?.status;

      // Don't retry if status is not in retry codes (e.g. 400 Bad Request)
      // If status is undefined (network error), usually we retry
      if (status && !retryCodes.has(status)) {
        throw error;
      }

      // Last attempt failed, throw
      if (attempt === maxAttempts - 1) {
        throw error;
      }

      // Calculate delay with Full Jitter:
      // sleep = random_between(0, min(cap, base * 2 ** attempt))
      const exponentialDelay = Math.min(maxDelay, baseDelay * Math.pow(2, attempt));
      const jitterDelay = Math.random() * exponentialDelay;
      
      console.warn(`[Retry] Attempt ${attempt + 1} failed. Retrying in ${Math.round(jitterDelay)}ms...`, error.message);
      
      await new Promise((resolve) => setTimeout(resolve, jitterDelay));
    }
  }

  // If we get here, all retries failed.
  // CRITICAL: Log this event for manual intervention (Dead Letter Queue pattern)
  console.error(`[CRITICAL] All retries failed for operation. Last error:`, lastError);
  // trace.recordMetric('dlq_exhausted', 1); // If telemetry is available

  throw lastError;
}
