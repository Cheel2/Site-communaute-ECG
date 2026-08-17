import { test, expect } from '@playwright/test';

test.describe('TMC-18 — DEBUG Création contenu', () => {
  test('should_creer_un_contenu_et_voir_lerreur', async ({ page }) => {
    const logs: string[] = [];
    const errors: string[] = [];

    page.on('console', (msg) => {
      logs.push(msg.text());
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/admin/login');
    await page.waitForLoadState('domcontentloaded');

    await page.getByLabel('Email').fill('admin@test.com');
    await page.getByLabel('Mot de passe').fill('Admin123!');
    await page.getByRole('button', { name: 'Se connecter' }).click();

    await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, {
      timeout: 10000,
    });

    await page.goto('/admin/contenus');
    await page.waitForLoadState('domcontentloaded');

    await page.getByRole('button', { name: 'Nouveau contenu' }).click();
    await expect(page.getByLabel('Titre *')).toBeVisible({ timeout: 5000 });

    const titreTest = `Debug ${Date.now()}`;
    await page.getByLabel('Titre *').fill(titreTest);
    await page.getByLabel('Rubrique *').selectOption({ index: 0 });
    await page.locator('.tiptap').fill('Texte de debug.');

    await page.getByRole('button', { name: /Créer|Enregistrer/ }).click();

    // Attendre un peu pour que l'action se produise
    await page.waitForTimeout(3000);

    // Afficher tous les logs
    console.log('=== LOGS CONSOLE ===');
    logs.forEach((log) => console.log(`[LOG] ${log}`));

    console.log('=== ERREURS CONSOLE ===');
    errors.forEach((err) => console.log(`[ERROR] ${err}`));

    // Vérifier la liste des contenus
    await page.goto('/admin/contenus');
    await page.waitForLoadState('domcontentloaded');

    const hasContenu = await page.getByText(titreTest).isVisible();
    console.log(`Contenu trouvé: ${hasContenu}`);

    expect(hasContenu).toBe(true);
  });
});
