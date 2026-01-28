/**
 * Idempotency Middleware Logic
 * 
 * Prevents duplicate processing of the same request using a unique key.
 * Ideally backed by Redis, but using generic interface for flexibility.
 */

interface IdempotencyStore {
  get(key: string): Promise<any | null>;
  set(key: string, data: any, ttlSeconds: number): Promise<void>;
}

// Simple In-Memory Store (Use Redis for production!)
// TODO [PRODUCTION-CRITICAL]: Replace with RedisIdempotencyStore before deploying to multiple instances!
// Current implementation works for single-instance deployments but is not shared across clusters.
export class InMemoryIdempotencyStore implements IdempotencyStore {
  private cache = new Map<string, { data: any; expires: number }>();

  async get(key: string): Promise<any | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  async set(key: string, data: any, ttlSeconds: number): Promise<void> {
    // In a real Redis implementation, use SETEX
    this.cache.set(key, {
      data,
      expires: Date.now() + ttlSeconds * 1000
    });

    // Self-cleaning: Delete from memory after expiration
    setTimeout(() => {
      this.cache.delete(key);
    }, ttlSeconds * 1000);
  }
}

interface RequestContext {
  headers: Record<string, string | undefined>;
  method: string;
  path: string;
}

export class IdempotencyHandler {
  constructor(private store: IdempotencyStore, private ttlSeconds = 86400) {}

  /**
   * Checks idempotency key. Returns existing response if found.
   * If not found, returns null (proceed with processing).
   */
  async check(ctx: RequestContext): Promise<any | null> {
    if (ctx.method !== 'POST' && ctx.method !== 'PATCH') {
      return null; // Idempotency mainly for state-changing requests
    }

    const key = ctx.headers['idempotency-key'] || ctx.headers['Idempotency-Key'];
    
    if (!key) {
      // In strict mode, we might want to throw an error here
      // throw new Error("Missing Idempotency-Key header");
      return null;
    }

    const cached = await this.store.get(key);
    if (cached) {
      console.log(`[Idempotency] Hit! Returning cached response for key: ${key}`);
      return cached;
    }

    return null;
  }

  /**
   * Saves the response for a given idempotency key.
   */
  async save(ctx: RequestContext, responseData: any): Promise<void> {
    const key = ctx.headers['idempotency-key'] || ctx.headers['Idempotency-Key'];
    if (key) {
      await this.store.set(key, responseData, this.ttlSeconds);
       console.log(`[Idempotency] Saved response for key: ${key}`);
    }
  }
}
