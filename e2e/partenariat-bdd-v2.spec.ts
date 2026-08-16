import { test, expect } from '@playwright/test';

test.describe('DIAGNOSTIC : Insertion BDD v2', () => {
  test('should_see_what_submit_returns', async ({ page }) => {
    // 1. Capturer TOUS les logs
    const logs = [];
    page.on('console', (msg) => {
      const text = msg.text();
      logs.push(`[${msg.type()}] ${text}`);
      console.log(`[BROWSER] ${msg.type()}: ${text}`);
    });

    // 2. Intercepter les requêtes Supabase
    const supabaseResponses = [];
    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('supabase.co')) {
        const status = response.status();
        let body = '';
        try { body = await response.text(); } catch {}
        supabaseResponses.push({ status, url, body });
        console.log(`[SUPABASE] ${status} ${url.split('?')[0]}`);
        if (status >= 400) {
          console.log(`[SUPABASE ERROR] ${status} - ${body.substring(0, 200)}`);
        }
      }
    });

    // 3. Naviguer
    console.log('🔍 1. Navigation vers /partenariat');
    await page.goto('/partenariat');
    await page.waitForLoadState('domcontentloaded');

    // 4. Remplir
    console.log('🔍 2. Remplissage du formulaire');
    await page.getByLabel('Nom').fill('Test BDD');
    await page.getByLabel('Email').fill('test.bdd@example.com');
    await page.getByLabel('Pays').fill('France');

    // 5. Soumettre
    console.log('🔍 3. Soumission');
    const submitButton = page.getByRole('button', { name: 'Devenir partenaire' });
    const buttonText = await submitButton.textContent();
    console.log(`🔘 Texte du bouton AVANT : "${buttonText}"`);

    await submitButton.click();

    // 6. Attendre et capturer l'état
    console.log('🔍 4. Attente de la réponse...');
    await page.waitForTimeout(3000);

    // 7. Vérifier ce qui est visible
    console.log('🔍 5. Analyse de la page après soumission');

    // Vérifier si le formulaire existe toujours
    const formExists = await page.locator('form').count();
    console.log(`📝 Formulaire présent : ${formExists > 0 ? 'OUI' : 'NON'}`);

    // Vérifier le message de succès
    const successLocator = page.getByText(/enregistrée|enregistree|demande.*partenariat|succès|merci/i);
    const successVisible = await successLocator.isVisible().catch(() => false);
    if (successVisible) {
      const text = await successLocator.textContent();
      console.log(`✅ MESSAGE DE SUCCÈS : "${text}"`);
    } else {
      console.log('❌ Aucun message de succès visible');
    }

    // Vérifier les messages d'erreur
    const errorLocators = [
      page.getByText(/erreur|error|impossible/i),
      page.locator('[role="alert"]'),
      page.locator('.bg-red-50'),
      page.locator('.text-red-800')
    ];
    let errorFound = false;
    for (const locator of errorLocators) {
      const visible = await locator.isVisible().catch(() => false);
      if (visible) {
        const text = await locator.textContent();
        console.log(`❌ MESSAGE D'ERREUR : "${text}"`);
        errorFound = true;
        break;
      }
    }
    if (!errorFound) {
      console.log('✅ Aucun message d\'erreur visible');
    }

    // 8. Capturer tout le texte de la page
    const bodyText = await page.textContent('body');
    console.log('📄 Extrait du DOM :');
    console.log(bodyText?.substring(0, 800));

    // 9. Afficher les logs Supabase
    console.log('');
    console.log(`📊 Réponses Supabase : ${supabaseResponses.length}`);
    for (const res of supabaseResponses) {
      console.log(`  ${res.status} ${res.url.split('?')[0]}`);
      if (res.status >= 400) {
        console.log(`    Body: ${res.body.substring(0, 150)}`);
      }
    }

    // 10. Afficher les logs console
    console.log('');
    console.log('📋 Logs console :');
    logs.forEach(log => console.log(log));

    // Le test passe toujours
    expect(true).toBe(true);
  });
});
