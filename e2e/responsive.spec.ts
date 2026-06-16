import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

const VIEWPORTS = [
  { name: 'mobile-small', width: 375, height: 667 },
  { name: 'tablet',       width: 768, height: 1024 },
  { name: 'desktop',      width: 1440, height: 900 },
];

async function doLogin(page: import('@playwright/test').Page) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByLabel(/email/i).fill('admin@zafir.luxury');
  await page.getByLabel(/mot de passe|password/i).fill('Password123!');
  await page.getByRole('button', { name: /se connecter|login/i }).click();
  await page.waitForURL(`**`, { waitUntil: 'domcontentloaded' });
}

test.describe('Responsive design — login page', () => {
  for (const vp of VIEWPORTS) {
    test(`Login visible sur ${vp.name} (${vp.width}px)`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}/login`);
      const form = page.locator('form').first();
      await expect(form).toBeVisible();
      const box = await form.boundingBox();
      expect(box?.width ?? 0).toBeLessThanOrEqual(vp.width);
    });
  }
});

test.describe('Responsive design — dashboard', () => {
  test('Pas de scroll horizontal sur mobile après login', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await doLogin(page);

    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth
    );
    expect(overflow).toBe(false);
  });

  test('Sidebar visible sur desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await doLogin(page);
    await expect(page.locator('aside, nav[aria-label="sidebar"]').first()).toBeVisible();
  });
});

test.describe('Performance', () => {
  test('Login page charge en < 4s', async ({ page }) => {
    const start = Date.now();
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(4000);
  });

  test('Dashboard render < 8s après login', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await page.getByLabel(/email/i).fill('admin@zafir.luxury');
    await page.getByLabel(/mot de passe|password/i).fill('Password123!');

    const start = Date.now();
    await page.getByRole('button', { name: /se connecter|login/i }).click();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;
    expect(loadTime).toBeLessThan(8000);
  });
});
