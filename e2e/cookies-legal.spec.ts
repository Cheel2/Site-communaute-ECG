import { test, expect } from '@playwright/test';

test.describe('TMC-20 : Scénario Cookies + Legal', () => {
  // Clé localStorage exacte issue du code source (CookieBanner.tsx)
  const COOKIE_CONSENT_KEY = 'cookie_consent_pastoral';
  const VALEUR_ACCEPTE = 'accepted';
  const VALEUR_REFUSE = 'rejected';

  test.describe('Bandeau cookies', () => {
    test('should_afficher_le_bandeau_cookies_a_la_premiere_visite', async ({ page }) => {
      // Supprime tout consentement préexistant pour simuler la première visite
      await page.goto('/');
      await page.evaluate((key) => localStorage.removeItem(key), COOKIE_CONSENT_KEY);
      await page.reload();

      // Le bandeau est rendu avec role="dialog"
      const banner = page.getByRole('dialog', { name: 'Consentement aux cookies' });
      await expect(banner).toBeVisible({ timeout: 5000 });

      // Vérifie le message
      await expect(
        page.getByText(
          'Ce site utilise uniquement des cookies techniques essentiels à son fonctionnement.'
        )
      ).toBeVisible();

      // Vérifie les deux boutons
      await expect(page.getByRole('button', { name: 'Accepter' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Refuser' })).toBeVisible();
    });

    test('should_fermer_le_bandeau_apres_acceptation', async ({ page }) => {
      // Supprime tout consentement préexistant
      await page.goto('/');
      await page.evaluate((key) => localStorage.removeItem(key), COOKIE_CONSENT_KEY);
      await page.reload();

      const banner = page.getByRole('dialog', { name: 'Consentement aux cookies' });
      await expect(banner).toBeVisible();

      // Accepte les cookies
      await page.getByRole('button', { name: 'Accepter' }).click();

      // Le bandeau disparaît immédiatement
      await expect(banner).not.toBeVisible();

      // Recharge la page
      await page.reload();

      // Le bandeau ne réapparaît pas
      await expect(banner).not.toBeVisible();

      // Vérifie que le consentement est stocké
      const consentement = await page.evaluate((key) => localStorage.getItem(key), COOKIE_CONSENT_KEY);
      expect(consentement).toBe(VALEUR_ACCEPTE);
    });

    test('should_fermer_le_bandeau_apres_refus', async ({ page }) => {
      await page.goto('/');
      await page.evaluate((key) => localStorage.removeItem(key), COOKIE_CONSENT_KEY);
      await page.reload();

      const banner = page.getByRole('dialog', { name: 'Consentement aux cookies' });
      await expect(banner).toBeVisible();

      await page.getByRole('button', { name: 'Refuser' }).click();

      await expect(banner).not.toBeVisible();

      await page.reload();

      await expect(banner).not.toBeVisible();

      const consentement = await page.evaluate((key) => localStorage.getItem(key), COOKIE_CONSENT_KEY);
      expect(consentement).toBe(VALEUR_REFUSE);
    });

    test('should_persiste_le_consentement_entre_les_pages', async ({ page }) => {
      // Accepte les cookies sur la page d'accueil
      await page.goto('/');
      await page.evaluate((key) => localStorage.removeItem(key), COOKIE_CONSENT_KEY);
      await page.reload();

      const banner = page.getByRole('dialog', { name: 'Consentement aux cookies' });
      await expect(banner).toBeVisible();

      await page.getByRole('button', { name: 'Accepter' }).click();
      await expect(banner).not.toBeVisible();

      // Navigue vers une autre page publique
      await page.goto('/contact');
      await page.waitForLoadState('domcontentloaded');

      // Le bandeau n'apparaît PAS sur la nouvelle page
      await expect(banner).not.toBeVisible();

      // Vérifie que le localStorage a toujours le consentement
      const consentement = await page.evaluate((key) => localStorage.getItem(key), COOKIE_CONSENT_KEY);
      expect(consentement).toBe(VALEUR_ACCEPTE);
    });
  });

  test.describe('Pages légales depuis le footer', () => {
    test('should_naviguer_vers_mentions_legales_depuis_le_footer', async ({ page }) => {
      await page.goto('/');

      // Scrolle jusqu'au footer pour s'assurer que les liens sont visibles
      await page.locator('footer').scrollIntoViewIfNeeded();

      // Clic sur le lien "Mentions légales"
      await page.getByRole('link', { name: /Mentions légales/i }).click();

      // Vérifie l'URL
      await expect(page).toHaveURL('/mentions-legales');

      // Vérifie le H1 de la page
      await expect(page.getByRole('heading', { name: 'Mentions légales', level: 1 })).toBeVisible();

      // Vérifie la présence de contenu substantiel (au moins un paragraphe)
      const paragraphs = page.locator('article p');
      await expect(paragraphs.first()).toBeVisible();
      const count = await paragraphs.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should_naviguer_vers_politique_confidentialite_depuis_le_footer', async ({ page }) => {
      await page.goto('/');

      await page.locator('footer').scrollIntoViewIfNeeded();

      await page.getByRole('link', { name: /Politique de confidentialité/i }).click();

      await expect(page).toHaveURL('/politique-confidentialite');

      await expect(
        page.getByRole('heading', { name: 'Politique de confidentialité', level: 1 })
      ).toBeVisible();

      const paragraphs = page.locator('article p');
      await expect(paragraphs.first()).toBeVisible();
      const count = await paragraphs.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should_naviguer_vers_les_deux_pages_legales_sans_erreur_console', async ({ page }) => {
      const logs: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          logs.push(msg.text());
        }
      });

      await page.goto('/');
      await page.locator('footer').scrollIntoViewIfNeeded();

      // Mentions légales
      await page.getByRole('link', { name: /Mentions légales/i }).click();
      await expect(page).toHaveURL('/mentions-legales');

      // Politique confidentialité
      await page.getByRole('link', { name: /Politique de confidentialité/i }).click();
      await expect(page).toHaveURL('/politique-confidentialite');

      // Vérifie qu'il n'y a pas d'erreur console
      expect(logs).toEqual([]);
    });
  });

  test.describe('Parcours complet cookies + legal', () => {
    test('should_complete_full_cookies_journey', async ({ page }) => {
      // 1. Première visite : bandeau visible
      await page.goto('/');
      await page.evaluate((key) => localStorage.removeItem(key), COOKIE_CONSENT_KEY);
      await page.reload();

      const banner = page.getByRole('dialog', { name: 'Consentement aux cookies' });
      await expect(banner).toBeVisible();

      // 2. Acceptation
      await page.getByRole('button', { name: 'Accepter' }).click();
      await expect(banner).not.toBeVisible();

      // 3. Vérifier la persistance
      const consentement = await page.evaluate((key) => localStorage.getItem(key), COOKIE_CONSENT_KEY);
      expect(consentement).toBe(VALEUR_ACCEPTE);

      // 4. Navigation vers mentions légales depuis footer
      await page.locator('footer').scrollIntoViewIfNeeded();
      await page.getByRole('link', { name: /Mentions légales/i }).click();
      await expect(page).toHaveURL('/mentions-legales');

      // 5. Vérifier que le bandeau n'est PAS réapparu
      await expect(banner).not.toBeVisible();

      // 6. Vérifier le contenu de la page
      await expect(
        page.getByRole('heading', { name: 'Mentions légales', level: 1 })
      ).toBeVisible();
    });
  });
});
