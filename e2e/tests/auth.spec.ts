import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Check page loaded
    await expect(page.locator('h2')).toContainText('Sapphire');
    
    // Fill form
    await page.fill('input[type="email"]', 'admin@sapphire.luxury');
    await page.fill('input[type="password"]', 'Password123!');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await page.waitForURL('**/dashboard**', { timeout: 10_000 });
    await expect(page.locator('h2')).toContainText('Dashboard');
  });
  
  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[type="email"]', 'admin@sapphire.luxury');
    await page.fill('input[type="password"]', 'WrongPassword');
    
    await page.click('button[type="submit"]');
    
    // Should show error
    await expect(page.locator('[role="alert"]')).toContainText('incorrect');
  });
  
  test('should logout', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@sapphire.luxury');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard**');
    
    // Logout
    await page.click('text=admin@sapphire.luxury, button:has-text("Déconnexion")');
    
    // Should redirect to login
    await page.waitForURL('**/login**');
  });
});
