import { test, expect } from '@playwright/test';

test.describe('Rooms', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@sapphire.luxury');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard**');
  });
  
  test('should display rooms list', async ({ page }) => {
    await page.goto('/rooms');
    
    // Should have at least 1 room
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });
  
  test('should filter rooms by search', async ({ page }) => {
    await page.goto('/rooms');
    
    await page.fill('input[placeholder*="Rechercher"]', '101');
    
    // Wait for filter
    await page.waitForTimeout(500);
    
    // Should only show matching rooms
    const rows = page.locator('table tbody tr');
    await expect(rows).toHaveCount(1);
  });
  
  test('should change room status', async ({ page }) => {
    await page.goto('/rooms');
    
    // Click on first room's status menu
    const firstRow = page.locator('table tbody tr').first();
    await firstRow.locator('button[aria-label*="Action"]').click();
    
    // Select new status (Maintenance)
    await page.click('text=Maintenance');
    
    // Should show success notification
    await expect(page.locator('text=Statut modifié')).toBeVisible({ timeout: 5_000 });
  });
});
