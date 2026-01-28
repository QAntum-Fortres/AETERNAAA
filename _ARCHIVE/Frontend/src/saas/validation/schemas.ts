import { z } from 'zod';

/**
 * Zod Schemas for SaaS Data Integrity
 */

// Basic types
const CurrencyCode = z.string().length(3).regex(/^[A-Z]{3}$/);
const Timestamp = z.string().datetime(); // ISO 8601

// Invoice Schema - Zero Tolerance for bad financial data
export const InvoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().int().positive("Quantity must be positive integer"),
  unitAmount: z.number().nonnegative("Unit amount cannot be negative"),
  amount: z.number().nonnegative("Total amount cannot be negative"),
});

export const InvoiceSchema = z.object({
  id: z.string().min(1),
  subscriptionId: z.string().uuid().or(z.string().min(1)),
  amount: z.number().nonnegative(),
  currency: CurrencyCode,
  status: z.enum(['draft', 'open', 'paid', 'void', 'uncollectible']),
  periodStart: Timestamp,
  periodEnd: Timestamp,
  items: z.array(InvoiceItemSchema).nonempty("Invoice must have at least one item"),
  createdAt: Timestamp,
  paidAt: Timestamp.optional(),
});

// Webhook Payload Schema
// Ensures incoming webhooks from SaaS provider match expected contract
export const WebhookEventSchema = z.object({
  id: z.string(),
  object: z.literal('event'),
  api_version: z.string().optional(),
  created: z.number(),
  type: z.string(),
  data: z.object({
    object: z.record(z.any()), // The actual resource payload
  }),
});

// Idempotency Key Header Validation
export const IdempotencyHeaderSchema = z.string().uuid("Idempotency-Key must be a valid UUID");

// Helper to safely parse sensitive financial data
export function safeParseInvoice(json: unknown) {
  const result = InvoiceSchema.safeParse(json);
  if (!result.success) {
    console.error("[Schema Violation] Invalid Invoice Data:", result.error.format());
    return null; // or throw specialized error
  }
  return result.data;
}

export type Invoice = z.infer<typeof InvoiceSchema>;
export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;
