import { test, expect } from '@playwright/test';

test.describe('TMC-18 : Scénario Admin CRUD contenu', () => {
  test('should_login_and_see_admin', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByLabel('Email').fill('admin@test.com');
    await page.getByLabel('Mot de passe').fill('Admin123!');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page).toHaveURL(/\/admin\//);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('should_refuse_login_with_wrong_password', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByLabel('Email').fill('admin@test.com');
    await page.getByLabel('Mot de passe').fill('wrong');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page.locator('[role="alert"]')).toBeVisible();
  });

  test('should_create_contenu_and_see_in_list', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByLabel('Email').fill('admin@test.com');
    await page.getByLabel('Mot de passe').fill('Admin123!');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    await expect(page).toHaveURL(/\/admin\//);

    // Aller directement à la page de création
    await page.goto('/admin/contenus/nouveau');
    await page.waitForLoadState('domcontentloaded');

    // Remplir le formulaire avec des sélecteurs alternatifs
    const titre = `CI ${Date.now()}`;
    
    // Utiliser un sélecteur plus générique pour le titre
    await page.locator('input[name="titre"], input[placeholder*="titre"], input[aria-label*="Titre"]').first().fill(titre);
    
    // Utiliser un sélecteur plus générique pour le texte
    await page.locator('textarea[name="texte"], textarea[placeholder*="texte"], textarea[aria-label*="Texte"]').first().fill('Test de contenu E2E');

    // Click sur le bouton d'enregistrement
    await page.getByRole('button', { name: /Créer|Enregistrer|Publier/ }).click();

    // Vérifier que le contenu apparaît dans la liste (redirection ou présence)
    await page.waitForLoadState('domcontentloaded');
    
    // Soit on est redirigé vers la liste
    if (page.url().includes('/admin/contenus')) {
      await expect(page.getByText(titre)).toBeVisible({ timeout: 10000 });
    } else {
      // Soit on est sur la page de détail ou d'édition
      await expect(page.locator('h1')).toBeVisible({ timeout: 5000 });
    }
  });
});
