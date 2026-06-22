import { test, expect } from '@playwright/test';

test.describe('Housekeeping (Mobile)', () => {
  test.use({ viewport: { width: 390, height: 844 } }); // iPhone 14
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'staff@sapphire.luxury');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard**');
  });
  
  test('should display housekeeping board on mobile', async ({ page }) => {
    await page.goto('/housekeeping');
    
    // Should show stats cards
    await expect(page.locator('text=En attente')).toBeVisible();
    await expect(page.locator('text=En cours')).toBeVisible();
  });
  
  test('should auto-generate tasks from checkouts', async ({ page }) => {
    await page.goto('/housekeeping');
    
    // Click auto-generate
    await page.click('button:has-text("Auto-générer")');
    
    // Should show success notification
    await expect(page.locator('text=Tâches générées')).toBeVisible({ timeout: 10_000 });
  });
});
