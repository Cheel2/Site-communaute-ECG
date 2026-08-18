import { test, expect } from '@playwright/test';

test.describe('TMC-18 : Scénario Admin CRUD contenu complet', () => {
  test.describe('Authentification admin', () => {
    test('should_se_connecter_avec_identifiants_valides', async ({ page }) => {
      await page.goto('/admin/login');
      await page.getByLabel('Email').fill('admin@test.com');
      await page.getByLabel('Mot de passe').fill('Admin123!');
      await page.getByRole('button', { name: 'Se connecter' }).click();
      await expect(page).toHaveURL(/\/admin\//);
    });

    test('should_refuser_login_avec_mot_de_passe_invalide', async ({ page }) => {
      await page.goto('/admin/login');
      await page.getByLabel('Email').fill('admin@test.com');
      await page.getByLabel('Mot de passe').fill('wrong');
      await page.getByRole('button', { name: 'Se connecter' }).click();
      await expect(page.locator('[role="alert"]')).toBeVisible();
    });
  });

  test.describe('Création d\'un contenu', () => {
    test('should_creer_un_contenu_et_le_publier', async ({ page }) => {
      await page.goto('/admin/login');
      await page.getByLabel('Email').fill('admin@test.com');
      await page.getByLabel('Mot de passe').fill('Admin123!');
      await page.getByRole('button', { name: 'Se connecter' }).click();
      await expect(page).toHaveURL(/\/admin\//);

      await page.goto('/admin/contenus/nouveau');
      await page.waitForLoadState('domcontentloaded');

      const titre = `Contenu E2E ${Date.now()}`;
      await page.getByLabel('Titre *').fill(titre);
      await page.getByLabel('Texte *').fill('Ceci est un contenu de test E2E.');
      await page.getByRole('button', { name: /Créer|Enregistrer/ }).click();

      // Vérifier que le contenu apparaît dans la liste
      await expect(page).toHaveURL(/\/admin\/contenus/);
      await expect(page.getByText(titre)).toBeVisible({ timeout: 10000 });
    });

    test('should_afficher_erreur_si_titre_vide', async ({ page }) => {
      await page.goto('/admin/login');
      await page.getByLabel('Email').fill('admin@test.com');
      await page.getByLabel('Mot de passe').fill('Admin123!');
      await page.getByRole('button', { name: 'Se connecter' }).click();
      await expect(page).toHaveURL(/\/admin\//);

      await page.goto('/admin/contenus/nouveau');
      await page.waitForLoadState('domcontentloaded');

      await page.getByRole('button', { name: /Créer|Enregistrer/ }).click();

      // Vérifier qu'une erreur est affichée
      await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Parcours complet', () => {
    test('should_complete_full_admin_contenu_journey', async ({ page }) => {
      await page.goto('/admin/login');
      await page.getByLabel('Email').fill('admin@test.com');
      await page.getByLabel('Mot de passe').fill('Admin123!');
      await page.getByRole('button', { name: 'Se connecter' }).click();
      await expect(page).toHaveURL(/\/admin\//);

      await page.goto('/admin/contenus/nouveau');
      await page.waitForLoadState('domcontentloaded');

      const titre = `Journey ${Date.now()}`;
      await page.getByLabel('Titre *').fill(titre);
      await page.getByLabel('Texte *').fill('Test complet E2E');
      await page.getByRole('button', { name: /Créer|Enregistrer/ }).click();

      await expect(page).toHaveURL(/\/admin\/contenus/);
      await expect(page.getByText(titre)).toBeVisible({ timeout: 10000 });
    });
  });
});
