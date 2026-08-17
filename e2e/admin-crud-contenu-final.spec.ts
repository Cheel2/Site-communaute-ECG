import { test, expect } from '@playwright/test';

test.describe('TMC-18 : Scénario Admin CRUD contenu complet', () => {

  test.describe('Authentification admin', () => {
    test('should_se_connecter_avec_identifiants_valides', async ({ page }) => {
      await page.goto('/admin/login');
      await page.waitForLoadState('domcontentloaded');
      await page.getByLabel('Email').fill('admin@test.com');
      await page.getByLabel('Mot de passe').fill('Admin123!');
      await page.getByRole('button', { name: 'Se connecter' }).click();
      await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, { timeout: 10000 });
    });

    test('should_refuser_login_avec_mot_de_passe_invalide', async ({ page }) => {
      await page.goto('/admin/login');
      await page.waitForLoadState('domcontentloaded');
      await page.getByLabel('Email').fill('admin@test.com');
      await page.getByLabel('Mot de passe').fill('wrongpassword');
      await page.getByRole('button', { name: 'Se connecter' }).click();
      await expect(page.getByRole('alert')).toBeVisible({ timeout: 5000 });
      await expect(page).toHaveURL('/admin/login');
    });
  });

  test.describe('Création d\'un contenu', () => {
    test('should_creer_un_contenu_et_le_publier', async ({ page }) => {
      await page.goto('/admin/login');
      await page.waitForLoadState('domcontentloaded');
      await page.getByLabel('Email').fill('admin@test.com');
      await page.getByLabel('Mot de passe').fill('Admin123!');
      await page.getByRole('button', { name: 'Se connecter' }).click();
      await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, { timeout: 10000 });

      await page.goto('/admin/contenus/nouveau');
      await page.waitForLoadState('domcontentloaded');

      await expect(page.getByLabel('Titre *')).toBeVisible({ timeout: 5000 });

      const titreTest = `Contenu E2E ${Date.now()}`;
      await page.getByLabel('Titre *').fill(titreTest);
      await page.getByLabel('Rubrique *').selectOption({ index: 1 });
      await page.getByLabel('Texte').fill('Ceci est un contenu créé automatiquement par le test E2E.');
      await page.getByLabel('Statut').selectOption('publie');

      await page.getByRole('button', { name: /Créer le contenu/ }).click();

      await expect(page).toHaveURL(/\/admin\/contenus/, { timeout: 10000 });
      await expect(page.getByText(titreTest).first()).toBeVisible({ timeout: 10000 });
    });

    test('should_afficher_erreur_si_titre_vide', async ({ page }) => {
      await page.goto('/admin/login');
      await page.waitForLoadState('domcontentloaded');
      await page.getByLabel('Email').fill('admin@test.com');
      await page.getByLabel('Mot de passe').fill('Admin123!');
      await page.getByRole('button', { name: 'Se connecter' }).click();
      await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, { timeout: 10000 });

      await page.goto('/admin/contenus/nouveau');
      await page.waitForLoadState('domcontentloaded');

      await page.getByLabel('Titre *').fill('   ');
      await page.getByLabel('Rubrique *').selectOption({ index: 1 });
      await page.getByLabel('Texte').fill('Texte de test');

      await page.getByRole('button', { name: /Créer le contenu/ }).click();

      await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 5000 });
      await expect(page.locator('[role="alert"]').first()).toContainText('titre', { ignoreCase: true });
    });
  });

  test.describe('Modification d\'un contenu', () => {
    test('should_modifier_un_contenu_existant', async ({ page }) => {
      await page.goto('/admin/login');
      await page.waitForLoadState('domcontentloaded');
      await page.getByLabel('Email').fill('admin@test.com');
      await page.getByLabel('Mot de passe').fill('Admin123!');
      await page.getByRole('button', { name: 'Se connecter' }).click();
      await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, { timeout: 10000 });

      await page.goto('/admin/contenus');
      await page.waitForLoadState('domcontentloaded');

      const hasContenus = await page.locator('table tbody tr').count() > 0;
      if (!hasContenus) {
        test.skip('Aucun contenu existant pour le test de modification');
        return;
      }

      // ✅ Récupérer le titre et l'ID du premier contenu
      const firstRow = page.locator('table tbody tr:first-child');
      const titreOriginal = await firstRow.locator('td:first-child').textContent();
      const editButton = firstRow.locator('button:has-text("Modifier")');
      
      // ✅ Cliquer sur "Modifier"
      await editButton.click();

      // ✅ Attendre la redirection (timeout long)
      await page.waitForURL(/\/admin\/contenus\/[a-f0-9-]+\/modifier/, { timeout: 15000 });

      const titreInput = page.getByLabel('Titre *');
      await expect(titreInput).toBeVisible({ timeout: 5000 });
      
      const nouveauTitre = `Modifié ${Date.now()}`;
      await titreInput.fill(nouveauTitre);
      await page.getByRole('button', { name: /Modifier|Mettre à jour/ }).click();

      // ✅ Aller à la liste et attendre
      await page.goto('/admin/contenus');
      await page.waitForLoadState('domcontentloaded');
      
      // ✅ Vérifier que le nouveau titre apparaît (timeout long)
      await expect(page.getByText(nouveauTitre).first()).toBeVisible({ timeout: 15000 });
    });
  });

  test.describe('Suppression d\'un contenu', () => {
    test('should_supprimer_un_contenu_via_la_liste', async ({ page }) => {
      await page.goto('/admin/login');
      await page.waitForLoadState('domcontentloaded');
      await page.getByLabel('Email').fill('admin@test.com');
      await page.getByLabel('Mot de passe').fill('Admin123!');
      await page.getByRole('button', { name: 'Se connecter' }).click();
      await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, { timeout: 10000 });

      await page.goto('/admin/contenus');
      await page.waitForLoadState('domcontentloaded');

      const hasContenus = await page.locator('table tbody tr').count() > 0;
      if (!hasContenus) {
        test.skip('Aucun contenu existant pour le test de suppression');
        return;
      }

      const titreContenu = await page.locator('table tbody tr:first-child td:first-child').textContent();
      const deleteButton = page.locator('table tbody tr:first-child button:has-text("Supprimer")');
      await deleteButton.click();

      await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
      await page.locator('.bg-red-600:has-text("Supprimer")').first().click();

      if (titreContenu) {
        await expect(page.getByText(titreContenu).first()).not.toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Parcours complet', () => {
    test('should_complete_full_admin_contenu_journey', async ({ page }) => {
      await page.goto('/admin/login');
      await page.waitForLoadState('domcontentloaded');
      await page.getByLabel('Email').fill('admin@test.com');
      await page.getByLabel('Mot de passe').fill('Admin123!');
      await page.getByRole('button', { name: 'Se connecter' }).click();
      await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, { timeout: 10000 });

      await page.goto('/admin/contenus/nouveau');
      await page.waitForLoadState('domcontentloaded');
      await expect(page.getByLabel('Titre *')).toBeVisible({ timeout: 5000 });

      const titreTest = `Parcours E2E ${Date.now()}`;
      await page.getByLabel('Titre *').fill(titreTest);
      await page.getByLabel('Rubrique *').selectOption({ index: 1 });
      await page.getByLabel('Texte').fill('Texte du parcours complet.');
      await page.getByLabel('Statut').selectOption('publie');

      await page.getByRole('button', { name: /Créer le contenu/ }).click();
      await expect(page).toHaveURL(/\/admin\/contenus/, { timeout: 10000 });
      await expect(page.getByText(titreTest).first()).toBeVisible({ timeout: 10000 });

      const deleteButton = page.locator(`table tbody tr:has-text("${titreTest}") button:has-text("Supprimer")`);
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
        await page.locator('.bg-red-600:has-text("Supprimer")').first().click();
        await expect(page.getByText(titreTest).first()).not.toBeVisible({ timeout: 5000 });
      }
    });
  });
});
