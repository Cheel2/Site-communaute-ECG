import { test, expect } from '@playwright/test';

test.describe('TMC-18 — TEST SIMPLE', () => {
  test('should_afficher_formulaire_apres_clic_nouveau', async ({ page }) => {
    // 1. Login
    await page.goto('/admin/login');
    await page.waitForLoadState('domcontentloaded');
    await page.getByLabel('Email').fill('admin@test.com');
    await page.getByLabel('Mot de passe').fill('Admin123!');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, { timeout: 10000 });

    // 2. Aller sur /admin/contenus
    await page.goto('/admin/contenus');
    await page.waitForLoadState('domcontentloaded');

    // 3. Cliquer sur "Nouveau contenu"
    const nouveauBtn = page.getByRole('button', { name: 'Nouveau contenu' });
    await expect(nouveauBtn).toBeVisible();
    await nouveauBtn.click();

    // 4. Vérifier que le formulaire est visible
    const titreInput = page.getByLabel('Titre *');
    const rubriqueSelect = page.getByLabel('Rubrique *');
    const tiptapEditor = page.locator('.tiptap');

    await expect(titreInput).toBeVisible({ timeout: 5000 });
    await expect(rubriqueSelect).toBeVisible();
    await expect(tiptapEditor).toBeVisible();

    console.log('✅ Formulaire visible !');
  });
});
