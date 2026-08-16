import { test, expect } from '@playwright/test';

test.describe('TMC-18 : Scénario Admin CRUD contenu complet', () => {
  // ============================================================
  // 1. AUTHENTIFICATION
  // ============================================================
  test.describe('Authentification admin', () => {
    test('should_se_connecter_avec_identifiants_valides', async ({ page }) => {
      await page.goto('/admin/login');
      await page.waitForLoadState('domcontentloaded');

      await expect(page).toHaveURL('/admin/login');

      const emailInput = page.getByLabel('Email');
      const passwordInput = page.getByLabel('Mot de passe');
      const submitButton = page.getByRole('button', { name: 'Se connecter' });

      await expect(emailInput).toBeVisible();
      await expect(passwordInput).toBeVisible();
      await expect(submitButton).toBeVisible();

      const testEmail = process.env.ADMIN_TEST_EMAIL || 'admin@test.com';
      const testPassword = process.env.ADMIN_TEST_PASSWORD || 'Admin123!';

      await emailInput.fill(testEmail);
      await passwordInput.fill(testPassword);
      await submitButton.click();

      await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, {
        timeout: 10000,
      });
    });

    test('should_refuser_login_avec_mot_de_passe_invalide', async ({ page }) => {
      await page.goto('/admin/login');
      await page.waitForLoadState('domcontentloaded');

      await page.getByLabel('Email').fill('admin@test.com');
      await page.getByLabel('Mot de passe').fill('wrongpassword');
      await page.getByRole('button', { name: 'Se connecter' }).click();

      await expect(page.getByRole('alert')).toBeVisible({
        timeout: 5000,
      });
      await expect(page).toHaveURL('/admin/login');
    });
  });

  // ============================================================
  // 2. CRÉATION D'UN CONTENU
  // ============================================================
  test.describe('Création d\'un contenu', () => {
    test('should_creer_un_contenu_et_le_publier', async ({ page }) => {
      const testEmail = process.env.ADMIN_TEST_EMAIL || 'admin@test.com';
      const testPassword = process.env.ADMIN_TEST_PASSWORD || 'Admin123!';

      await page.goto('/admin/login');
      await page.waitForLoadState('domcontentloaded');

      await page.getByLabel('Email').fill(testEmail);
      await page.getByLabel('Mot de passe').fill(testPassword);
      await page.getByRole('button', { name: 'Se connecter' }).click();

      await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, {
        timeout: 10000,
      });

      await page.goto('/admin/contenus');
      await page.waitForLoadState('domcontentloaded');

      await page.getByRole('button', { name: 'Nouveau contenu' }).click();
      await expect(page).toHaveURL(/\/admin\/contenus\/nouveau/);

      const titreTest = `Contenu E2E ${Date.now()}`;
      const texteTest = 'Ceci est un contenu créé automatiquement par le test E2E.';

      await page.getByLabel('Titre').fill(titreTest);
      await page.getByLabel('Rubrique').selectOption({ index: 1 });
      await page.locator('.tiptap').fill(texteTest);
      await page.getByLabel('Statut').selectOption('publie');

      await page.getByRole('button', { name: /Créer|Enregistrer/ }).click();

      await expect(page.getByRole('status')).toContainText('Contenu créé avec succès.', {
        timeout: 10000,
      });
    });

    test('should_afficher_erreur_si_titre_vide', async ({ page }) => {
      const testEmail = process.env.ADMIN_TEST_EMAIL || 'admin@test.com';
      const testPassword = process.env.ADMIN_TEST_PASSWORD || 'Admin123!';

      await page.goto('/admin/login');
      await page.waitForLoadState('domcontentloaded');

      await page.getByLabel('Email').fill(testEmail);
      await page.getByLabel('Mot de passe').fill(testPassword);
      await page.getByRole('button', { name: 'Se connecter' }).click();

      await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, {
        timeout: 10000,
      });

      await page.goto('/admin/contenus/nouveau');
      await page.waitForLoadState('domcontentloaded');

      await page.getByLabel('Titre').fill('   ');
      await page.getByLabel('Rubrique').selectOption({ index: 1 });
      await page.locator('.tiptap').fill('Texte de test');

      await page.getByRole('button', { name: /Créer|Enregistrer/ }).click();

      await expect(page.getByRole('alert')).toBeVisible({
        timeout: 5000,
      });
      await expect(page.getByRole('alert')).toContainText('titre');
    });
  });

  // ============================================================
  // 3. MODIFICATION D'UN CONTENU
  // ============================================================
  test.describe('Modification d\'un contenu', () => {
    test('should_modifier_un_contenu_existant', async ({ page }) => {
      const testEmail = process.env.ADMIN_TEST_EMAIL || 'admin@test.com';
      const testPassword = process.env.ADMIN_TEST_PASSWORD || 'Admin123!';

      await page.goto('/admin/login');
      await page.waitForLoadState('domcontentloaded');

      await page.getByLabel('Email').fill(testEmail);
      await page.getByLabel('Mot de passe').fill(testPassword);
      await page.getByRole('button', { name: 'Se connecter' }).click();

      await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, {
        timeout: 10000,
      });

      await page.goto('/admin/contenus');
      await page.waitForLoadState('domcontentloaded');

      const editButton = page.locator('table tbody tr:first-child button:has-text("Modifier")');
      await editButton.click();

      await expect(page).toHaveURL(/\/admin\/contenus\/[a-f0-9-]+\/modifier/);

      const titreInput = page.getByLabel('Titre');
      await expect(titreInput).toHaveValue(/.+/);

      const nouveauTitre = `Modifié ${Date.now()}`;
      await titreInput.fill(nouveauTitre);

      await page.getByRole('button', { name: /Modifier|Mettre à jour/ }).click();

      await expect(page.getByRole('status')).toContainText('Contenu modifié avec succès.', {
        timeout: 10000,
      });
    });
  });

  // ============================================================
  // 4. SUPPRESSION D'UN CONTENU
  // ============================================================
  test.describe('Suppression d\'un contenu', () => {
    test('should_supprimer_un_contenu_via_la_liste', async ({ page }) => {
      const testEmail = process.env.ADMIN_TEST_EMAIL || 'admin@test.com';
      const testPassword = process.env.ADMIN_TEST_PASSWORD || 'Admin123!';

      await page.goto('/admin/login');
      await page.waitForLoadState('domcontentloaded');

      await page.getByLabel('Email').fill(testEmail);
      await page.getByLabel('Mot de passe').fill(testPassword);
      await page.getByRole('button', { name: 'Se connecter' }).click();

      await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, {
        timeout: 10000,
      });

      await page.goto('/admin/contenus');
      await page.waitForLoadState('domcontentloaded');

      const titreContenu = await page
        .locator('table tbody tr:first-child td:first-child')
        .textContent();

      const deleteButton = page.locator('table tbody tr:first-child button:has-text("Supprimer")');
      await deleteButton.click();

      await expect(page.getByRole('dialog')).toBeVisible({
        timeout: 5000,
      });

      await page.getByRole('button', { name: /Supprimer|Confirmer/ }).click();

      if (titreContenu) {
        await expect(page.getByText(titreContenu)).not.toBeVisible({
          timeout: 5000,
        });
      }

      await expect(page.getByRole('status')).toContainText('Contenu supprimé avec succès.', {
        timeout: 10000,
      });
    });
  });

  // ============================================================
  // 5. PARCOURS COMPLET
  // ============================================================
  test.describe('Parcours complet', () => {
    test('should_complete_full_admin_contenu_journey', async ({ page }) => {
      const testEmail = process.env.ADMIN_TEST_EMAIL || 'admin@test.com';
      const testPassword = process.env.ADMIN_TEST_PASSWORD || 'Admin123!';

      await page.goto('/admin/login');
      await page.waitForLoadState('domcontentloaded');

      await page.getByLabel('Email').fill(testEmail);
      await page.getByLabel('Mot de passe').fill(testPassword);
      await page.getByRole('button', { name: 'Se connecter' }).click();

      await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, {
        timeout: 10000,
      });

      await page.goto('/admin/contenus');
      await page.waitForLoadState('domcontentloaded');

      await expect(page.getByRole('heading', { name: 'Contenus' })).toBeVisible();

      await page.getByRole('button', { name: 'Nouveau contenu' }).click();
      await expect(page).toHaveURL(/\/admin\/contenus\/nouveau/);

      const titreTest = `Parcours E2E ${Date.now()}`;
      await page.getByLabel('Titre').fill(titreTest);
      await page.getByLabel('Rubrique').selectOption({ index: 1 });
      await page.locator('.tiptap').fill('Texte du parcours complet.');
      await page.getByLabel('Statut').selectOption('publie');

      await page.getByRole('button', { name: /Créer|Enregistrer/ }).click();
      await expect(page.getByRole('status')).toContainText('Contenu créé avec succès.', {
        timeout: 10000,
      });

      const url = page.url();
      const match = url.match(/\/admin\/contenus\/([a-f0-9-]+)/);
      const contenuId = match ? match[1] : null;

      if (contenuId) {
        await page.goto(`/contenus/${contenuId}`);
        await page.waitForLoadState('domcontentloaded');
        await expect(page.locator('article h1')).toHaveText(titreTest);
      }

      await page.goto('/admin/contenus');
      await page.waitForLoadState('domcontentloaded');

      const deleteButton = page.locator(
        `table tbody tr:has-text("${titreTest}") button:has-text("Supprimer")`
      );
      await deleteButton.click();
      await page.getByRole('button', { name: /Supprimer|Confirmer/ }).click();

      await expect(page.getByText(titreTest)).not.toBeVisible({
        timeout: 5000,
      });
    });
  });
});
