import { test, expect } from '@playwright/test';

test.describe('Control Panel Integration', () => {
  // Adjust base URL to match your local dev server
  const BASE_URL = 'http://localhost:5173'; 

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('should display the Control Panel', async ({ page }) => {
    // Check for the header text we added
    await expect(page.getByText('NIGHT-POWER COMMAND CENTER')).toBeVisible();
    await expect(page.getByText('QAntum Sovereign Engine v2.0')).toBeVisible();
  });

  test('should display system status', async ({ page }) => {
    // Check if system health indicator exists
    await expect(page.locator('span.text-cyan-400', { hasText: 'HEALTHY' })).toBeVisible();
  });

  test('should allow mode switching', async ({ page }) => {
    // Check default mode
    const autonomyBtn = page.getByRole('button', { name: /FULL AUTONOMY/i });
    await expect(autonomyBtn).toBeVisible();
    
    // Switch to Manual Mode
    const manualBtn = page.getByRole('button', { name: /MANUAL UX OVERRIDE/i });
    await manualBtn.click();
    
    // Verify console output in the simulated log
    await expect(page.getByText('[WARN] Human override engaged')).toBeVisible();
    
    // Switch back to Hybrid
    const hybridBtn = page.getByRole('button', { name: /HYBRID/i });
    await hybridBtn.click();
  });

  test('should display revenue metrics', async ({ page }) => {
    await expect(page.getByText('REVENUE STREAM')).toBeVisible();
    await expect(page.getByText('$1,240K')).toBeVisible();
  });
});
