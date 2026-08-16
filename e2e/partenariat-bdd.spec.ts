import { test, expect } from '@playwright/test';

test.describe('DIAGNOSTIC : Insertion BDD', () => {
  test('should_see_what_submit_returns', async ({ page }) => {
    // 1. Capturer TOUS les logs
    page.on('console', (msg) => {
      console.log(`[BROWSER] ${msg.type()}: ${msg.text()}`);
    });

    // 2. Intercepter les requêtes Supabase pour voir les réponses
    const responses = [];
    page.on('response', async (response) => {
      if (response.url().includes('supabase.co')) {
        const status = response.status();
        let body = '';
        try {
          body = await response.text();
        } catch {}
        console.log(`[SUPABASE] ${status} ${response.url().split('?')[0]}`);
        if (status >= 400) {
          console.log(`[SUPABASE ERROR] ${status} - ${body.substring(0, 200)}`);
        }
        responses.push({ status, url: response.url(), body });
      }
    });

    // 3. Naviguer
    await page.goto('/partenariat');
    await page.waitForLoadState('domcontentloaded');

    // 4. Remplir le formulaire
    await page.getByLabel('Nom').fill('Test BDD');
    await page.getByLabel('Email').fill('test.bdd@example.com');
    await page.getByLabel('Pays').fill('France');

    // 5. Intercepter le submit
    const submitButton = page.getByRole('button', { name: 'Devenir partenaire' });
    console.log('🔘 Bouton avant click :', await submitButton.textContent());

    // 6. Soumettre
    await submitButton.click();

    // 7. Attendre
    await page.waitForTimeout(3000);

    // 8. Vérifier l'état du bouton
    const buttonText = await submitButton.textContent();
    console.log('🔘 Bouton après click :', buttonText);

    // 9. Vérifier le DOM
    const bodyText = await page.textContent('body');
    console.log('📄 Extrait du DOM (premiers 500 caractères) :');
    console.log(bodyText?.substring(0, 500));

    // 10. Vérifier s'il y a des messages
    const messages = await page.locator('[role="alert"], .bg-green-50, .bg-red-50, .error, .success').all();
    console.log(`📝 Nombre de messages d'alerte : ${messages.length}`);
    for (const msg of messages) {
      const text = await msg.textContent();
      console.log(`  - ${text}`);
    }

    // 11. Vérifier les logs Supabase
    console.log(`📊 Nombre de réponses Supabase : ${responses.length}`);
    for (const res of responses) {
      console.log(`  ${res.status} ${res.url.split('?')[0]}`);
      if (res.status >= 400) {
        console.log(`    Body: ${res.body.substring(0, 100)}`);
      }
    }

    // 12. Le test passe toujours (c'est du diagnostic)
    expect(true).toBe(true);
  });
});
