import { test, expect, type Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

async function loginAndNavigate(page: Page, path: string) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByLabel(/email/i).fill('admin@zafir.luxury');
  await page.getByLabel(/mot de passe|password/i).fill('Password123!');
  await page.getByRole('button', { name: /se connecter|login/i }).click();
  await page.waitForURL(`**`, { waitUntil: 'domcontentloaded' });
  await page.goto(`${BASE_URL}/${path}`);
  await page.waitForLoadState('networkidle');
}

const DASHBOARDS = ['arrivals', 'housekeeping', 'reservations', 'guests', 'billing'];

test.describe('Navigation — tous les dashboards chargent', () => {
  for (const tab of DASHBOARDS) {
    test(`Charge ${tab} sans erreur JS`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (err) => errors.push(err.message));
      page.on('console', (msg) => {
        if (msg.type() === 'error' && !msg.text().includes('favicon')) {
          errors.push(msg.text());
        }
      });

      await loginAndNavigate(page, tab);
      await page.waitForSelector('h1, [data-testid=page-title]', { timeout: 10_000 });

      expect(errors.join('\n'), `Erreurs JS sur /${tab}: ${errors.join(', ')}`).toBe('');
    });
  }
});

test.describe('Arrivals dashboard', () => {
  test('affiche la liste et les stats', async ({ page }) => {
    await loginAndNavigate(page, 'arrivals');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    // Stats cards exist
    const statsArea = page.locator('[data-testid=stats], .grid').first();
    await expect(statsArea).toBeVisible();
  });
});

test.describe('Reservations dashboard', () => {
  test('affiche le tableau avec filtres', async ({ page }) => {
    await loginAndNavigate(page, 'reservations');
    await expect(page.locator('table')).toBeVisible();
    // Search input
    const search = page.getByPlaceholder(/référence|nom|email|search/i).first();
    if (await search.isVisible()) {
      await search.fill('test');
      await page.waitForTimeout(400);
      await search.clear();
    }
  });
});

test.describe('RBAC — Tabs restreints', () => {
  test('affiche ClearanceLock sur un tab restreint', async ({ page }) => {
    await loginAndNavigate(page, 'strategic-intelligence');
    // Either ClearanceLock overlay or redirect
    const restricted = page.getByText(/restricted|clearance|accès refusé/i).first();
    const isRestricted = await restricted.isVisible().catch(() => false);
    // Accept either restriction message or redirect to home
    if (!isRestricted) {
      await expect(page).not.toHaveURL(/strategic-intelligence/);
    }
  });
});
