import { z } from 'zod';

/**
 * Secure Environment Configuration
 * Validates critical SaaS keys on startup.
 */

const EnvSchema = z.object({
  // Use VITE_ prefix for client-side variables
  VITE_SAAS_API_URL: z.string().url().default('https://api.aeterna.website'),
  VITE_STRIPE_PUBLIC_KEY: z.string().startsWith('pk_'),
  // If we were server side:
  // NODE_ENV: z.enum(['development', 'production', 'test']),
});

function loadConfig() {
  try {
    // For Vite, we use import.meta.env
    // Ensure all required fields are present
    const env = {
      VITE_SAAS_API_URL: import.meta.env.VITE_SAAS_API_URL,
      VITE_STRIPE_PUBLIC_KEY: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
    };

    return EnvSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ FATAL: Invalid Environment Configuration');
      console.error(error.format());
      // In a strict environment, we might verify this logic
      // Since this is generic code, user intervention is required 
      // to ensure .env has these values.
    }
    // Return a safe fallback or re-throw if critical
    throw new Error('SaaS Configuration Failed to Load');
  }
}

// Lazy load config to avoid side effects during module import if env is not ready
export const config = {
  get: () => loadConfig()
};
