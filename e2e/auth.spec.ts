import { test, expect, type Page } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const API_URL  = process.env.API_URL  || 'http://localhost:5000';

const VALID_USER   = { email: 'admin@zafir.luxury', password: 'Password123!' };
const INVALID_USER = { email: 'wrong@example.com',   password: 'badpassword' };

async function fillLogin(page: Page, user = VALID_USER) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByLabel(/email/i).fill(user.email);
  await page.getByLabel(/mot de passe|password/i).fill(user.password);
  await page.getByRole('button', { name: /se connecter|connexion|login/i }).click();
}

test.describe('Authentication', () => {
  test('affiche la page de login', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page).toHaveTitle(/zafir/i);
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/mot de passe|password/i)).toBeVisible();
  });

  test('login avec credentials valides', async ({ page }) => {
    await fillLogin(page);
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('aside, nav[aria-label="sidebar"], [data-testid=sidebar]')).toBeVisible();
  });

  test('rejette des credentials invalides', async ({ page }) => {
    await fillLogin(page, INVALID_USER);
    await expect(page.getByText(/invalide|incorrect|erreur|error|invalid/i).first()).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('protège les routes non authentifiées', async ({ page }) => {
    await page.goto(`${BASE_URL}/arrivals`);
    await expect(page).toHaveURL(/\/login/);
  });

  test('logout redirige vers /login', async ({ page }) => {
    await fillLogin(page);
    await page.waitForURL(`**`, { waitUntil: 'networkidle' });
    // Trouver et cliquer le bouton logout (peut être dans un menu profil)
    const logoutBtn = page.getByRole('button', { name: /déconnexion|logout|sign out/i });
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
    } else {
      // Peut-être derrière un avatar menu
      await page.locator('[data-testid=profile-menu], [aria-label="profile"]').first().click();
      await page.getByRole('button', { name: /déconnexion|logout/i }).click();
    }
    await expect(page).toHaveURL(/\/login/);
  });
});
