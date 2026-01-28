import { http, HttpResponse, delay } from 'msw';

/**
 * Mock Service Worker handlers for Zero-Error testing
 */

const SAAS_API_BASE = 'https://api.qantum-saas.com/v1';

export const handlers = [
  // 1. Happy Path: Get Subscription
  http.get(`${SAAS_API_BASE}/subscriptions/:id`, async () => {
    await delay(100); // Simulate network latency
    return HttpResponse.json({
      id: 'sub_123',
      status: 'active',
      plan: 'pro',
      current_period_end: new Date(Date.now() + 86400000).toISOString()
    });
  }),

  // 2. Latency Spike Simulation (Golden Signal: Latency)
  http.get(`${SAAS_API_BASE}/simulate/slow`, async () => {
    await delay(2000); // 2s delay - should trigger warning alerts
    return HttpResponse.json({ status: 'ok' });
  }),

  // 3. Error Rate Simulation (Golden Signal: Errors)
  http.post(`${SAAS_API_BASE}/simulate/error`, () => {
    return new HttpResponse(null, { status: 500, statusText: 'Internal Server Error' });
  }),

  // 4. Rate Limit Simulation (Retry Strategy Test)
  http.post(`${SAAS_API_BASE}/simulate/throttled`, () => {
    return new HttpResponse(null, {
      status: 429,
      statusText: 'Too Many Requests',
      headers: {
        'Retry-After': '5', // seconds
      },
    });
  }),

  // 5. Malformed Data (Contract Test)
  http.get(`${SAAS_API_BASE}/simulate/malformed`, () => {
    return HttpResponse.json({
      id: 12345, // Should be string per schema
      amount: -50, // Should be nonnegative
      // Missing currency
    });
  }),
];
