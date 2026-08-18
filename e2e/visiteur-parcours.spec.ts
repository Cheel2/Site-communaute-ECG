import { test, expect } from '@playwright/test';

test.describe('TMC-16 : Parcours visiteur', () => {
  test('should_load_accueil_without_error', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main').first()).toBeVisible();
  });

  test('should_navigate_from_accueil_to_contenus', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Contenus/i }).first().click();
    await expect(page).toHaveURL('/contenus');
    await expect(page.locator('main').first()).toBeVisible();
  });

  test('should_navigate_from_accueil_to_livres', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Livres/i }).first().click();
    await expect(page).toHaveURL('/livres');
    await expect(page.locator('main').first()).toBeVisible();
  });

  test('should_navigate_from_accueil_to_evenements', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Événements/i }).first().click();
    await expect(page).toHaveURL('/evenements');
    await expect(page.locator('main').first()).toBeVisible();
  });

  test('should_have_footer_with_legal_links', async ({ page }) => {
    await page.goto('/');
    await page.locator('footer').scrollIntoViewIfNeeded();
    await expect(page.getByRole('link', { name: /Mentions légales/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Politique de confidentialité/i })).toBeVisible();
  });

  test('should_load_contenus_without_error', async ({ page }) => {
    await page.goto('/contenus');
    await expect(page.locator('main').first()).toBeVisible();
  });

  test('should_load_livres_without_error', async ({ page }) => {
    await page.goto('/livres');
    await expect(page.locator('main').first()).toBeVisible();
  });

  test('should_load_evenements_without_error', async ({ page }) => {
    await page.goto('/evenements');
    await expect(page.locator('main').first()).toBeVisible();
  });
});
