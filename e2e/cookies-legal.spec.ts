import { test, expect } from '@playwright/test';

test.describe('TMC-20 : Scénario Cookies + Legal', () => {
  const COOKIE_CONSENT_KEY = 'cookie_consent_pastoral';
  const VALEUR_ACCEPTE = 'accepted';
  const VALEUR_REFUSE = 'rejected';

  test.describe('Bandeau cookies', () => {
    test('should_afficher_le_bandeau_cookies_a_la_premiere_visite', async ({ page }) => {
      await page.goto('/');
      await page.evaluate((key) => localStorage.removeItem(key), COOKIE_CONSENT_KEY);
      await page.reload();

      const banner = page.getByRole('dialog', { name: 'Consentement aux cookies' });
      await expect(banner).toBeVisible({ timeout: 5000 });

      await expect(
        page.getByText(
          'Ce site utilise uniquement des cookies techniques essentiels à son fonctionnement.'
        )
      ).toBeVisible();

      await expect(page.getByRole('button', { name: 'Accepter' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Refuser' })).toBeVisible();
    });

    test('should_fermer_le_bandeau_apres_acceptation', async ({ page }) => {
      await page.goto('/');
      await page.evaluate((key) => localStorage.removeItem(key), COOKIE_CONSENT_KEY);
      await page.reload();

      const banner = page.getByRole('dialog', { name: 'Consentement aux cookies' });
      await expect(banner).toBeVisible();

      await page.getByRole('button', { name: 'Accepter' }).click();
      await expect(banner).not.toBeVisible();

      await page.reload();
      await expect(banner).not.toBeVisible();

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
      await page.goto('/');
      await page.evaluate((key) => localStorage.removeItem(key), COOKIE_CONSENT_KEY);
      await page.reload();

      const banner = page.getByRole('dialog', { name: 'Consentement aux cookies' });
      await expect(banner).toBeVisible();

      await page.getByRole('button', { name: 'Accepter' }).click();
      await expect(banner).not.toBeVisible();

      await page.goto('/contact');
      await page.waitForLoadState('domcontentloaded');

      await expect(banner).not.toBeVisible();

      const consentement = await page.evaluate((key) => localStorage.getItem(key), COOKIE_CONSENT_KEY);
      expect(consentement).toBe(VALEUR_ACCEPTE);
    });
  });

  test.describe('Pages légales depuis le footer', () => {
    test('should_naviguer_vers_mentions_legales_depuis_le_footer', async ({ page }) => {
      await page.goto('/');
      await page.locator('footer').scrollIntoViewIfNeeded();
      await page.getByRole('link', { name: /Mentions légales/i }).click();
      await expect(page).toHaveURL('/mentions-legales');
      await expect(page.getByRole('heading', { name: 'Mentions légales', level: 1 })).toBeVisible();
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
      await page.getByRole('link', { name: /Mentions légales/i }).click();
      await expect(page).toHaveURL('/mentions-legales');
      await page.getByRole('link', { name: /Politique de confidentialité/i }).click();
      await expect(page).toHaveURL('/politique-confidentialite');

      expect(logs).toEqual([]);
    });
  });

  test.describe('Parcours complet cookies + legal', () => {
    test('should_complete_full_cookies_journey', async ({ page }) => {
      await page.goto('/');
      await page.evaluate((key) => localStorage.removeItem(key), COOKIE_CONSENT_KEY);
      await page.reload();

      const banner = page.getByRole('dialog', { name: 'Consentement aux cookies' });
      await expect(banner).toBeVisible();

      await page.getByRole('button', { name: 'Accepter' }).click();
      await expect(banner).not.toBeVisible();

      const consentement = await page.evaluate((key) => localStorage.getItem(key), COOKIE_CONSENT_KEY);
      expect(consentement).toBe(VALEUR_ACCEPTE);

      await page.locator('footer').scrollIntoViewIfNeeded();
      await page.getByRole('link', { name: /Mentions légales/i }).click();
      await expect(page).toHaveURL('/mentions-legales');

      await expect(banner).not.toBeVisible();
      await expect(
        page.getByRole('heading', { name: 'Mentions légales', level: 1 })
      ).toBeVisible();
    });
  });
});
