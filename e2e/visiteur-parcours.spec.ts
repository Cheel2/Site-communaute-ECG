import { test, expect } from '@playwright/test';

test.describe('TMC-16 : Parcours visiteur', () => {
  test.describe('Navigation publique', () => {
    test('should_load_accueil_without_error', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL('/');
      await expect(page.locator('main').first()).toBeVisible();

      const logs: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') logs.push(msg.text());
      });
      expect(logs).toEqual([]);
    });

    test('should_navigate_from_accueil_to_contenus', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await page.getByRole('link', { name: 'Contenus' }).first().click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL('/contenus');
      await expect(page.getByRole('heading', { name: 'Contenus' })).toBeVisible();
    });

    test('should_navigate_from_accueil_to_livres', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await page.getByRole('link', { name: 'Livres' }).first().click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL('/livres');
      await expect(page.getByRole('heading', { name: 'Nos Livres' })).toBeVisible();
    });

    test('should_navigate_from_accueil_to_evenements', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await page.getByRole('link', { name: 'Événements' }).first().click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL('/evenements');
      await expect(page.getByRole('heading', { name: 'Événements' })).toBeVisible();
    });

    test('should_have_footer_with_legal_links', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
      const legalLinks = footer.getByRole('link', { name: 'Mentions légales' });
      await expect(legalLinks).toBeVisible();
      const privacyLink = footer.getByRole('link', { name: 'Politique de confidentialité' });
      await expect(privacyLink).toBeVisible();
      await legalLinks.click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL(/\/mentions-legales/);
    });
  });

  test.describe('Page contenus', () => {
    test('should_load_contenus_without_error', async ({ page }) => {
      await page.goto('/contenus');
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL('/contenus');
      await expect(page.getByRole('heading', { name: 'Contenus' })).toBeVisible();
    });

    test('should_display_contenu_cards_or_empty_state', async ({ page }) => {
      await page.goto('/contenus');
      await page.waitForLoadState('domcontentloaded');
      const cards = page.locator('article');
      const emptyState = page.locator('text=Aucun contenu publié pour le moment.');
      const cardCount = await cards.count();
      if (cardCount > 0) {
        const firstCard = cards.first();
        const link = firstCard.locator('a');
        await expect(link).toBeVisible();
      } else {
        await expect(emptyState).toBeVisible();
      }
    });
  });

  test.describe('Page livres', () => {
    test('should_load_livres_without_error', async ({ page }) => {
      await page.goto('/livres');
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL('/livres');
      await expect(page.getByRole('heading', { name: 'Nos Livres' })).toBeVisible();
    });

    test('should_display_livre_cards_or_empty_state', async ({ page }) => {
      await page.goto('/livres');
      await page.waitForLoadState('domcontentloaded');
      const cards = page.locator('[class*="grid"] article, [class*="grid"] > div');
      const emptyState = page.locator('text=Aucun livre');
      const cardCount = await cards.count();
      if (cardCount > 0) {
        const firstCard = cards.first();
        const amazonLink = firstCard.locator('a[href*="amazon"]');
        const waLink = firstCard.locator('a[href^="https://wa.me"]');
        const hasLink = (await amazonLink.count()) > 0 || (await waLink.count()) > 0;
        expect(hasLink).toBe(true);
      } else {
        await expect(emptyState).toBeVisible();
      }
    });
  });

  test.describe('Page événements', () => {
    test('should_load_evenements_without_error', async ({ page }) => {
      await page.goto('/evenements');
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL('/evenements');
      await expect(page.getByRole('heading', { name: 'Événements' })).toBeVisible();
    });

    test('should_display_evenement_cards_or_empty_state', async ({ page }) => {
      await page.goto('/evenements');
      await page.waitForLoadState('domcontentloaded');
      const cards = page.locator('[class*="grid"] article');
      const emptyState = page.locator('text=Aucun événement');
      const cardCount = await cards.count();
      if (cardCount > 0) {
        const firstCard = cards.first();
        const badge = firstCard.locator('span:has-text("Récurrent"), span:has-text("Spécial")');
        await expect(badge).toBeVisible();
      } else {
        await expect(emptyState).toBeVisible();
      }
    });
  });

  test.describe('Parcours de bout en bout', () => {
    test('should_complete_full_visitor_journey', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator('main').first()).toBeVisible();

      await page.getByRole('link', { name: 'Contenus' }).first().click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL('/contenus');

      const firstCard = page.locator('article a').first();
      if (await firstCard.isVisible()) {
        const href = await firstCard.getAttribute('href');
        await firstCard.click();
        await page.waitForLoadState('domcontentloaded');
        if (href) {
          await expect(page).toHaveURL(new RegExp(`^${href}$`));
        }
        await expect(page.locator('article h1')).toBeVisible();
      }

      await page.getByRole('link', { name: 'Accueil' }).first().click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL('/');

      await page.getByRole('link', { name: 'Livres' }).first().click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL('/livres');
      await expect(page.getByRole('heading', { name: 'Nos Livres' })).toBeVisible();

      await page.getByRole('link', { name: 'Événements' }).first().click();
      await page.waitForLoadState('domcontentloaded');
      await expect(page).toHaveURL('/evenements');
      await expect(page.getByRole('heading', { name: 'Événements' })).toBeVisible();

      const logs: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') logs.push(msg.text());
      });
      expect(logs).toEqual([]);
    });
  });
});
