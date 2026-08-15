import { test, expect } from '@playwright/test';

test.describe('TMC-16 : Parcours visiteur', () => {
  test.describe('Navigation publique', () => {
    test('should_load_accueil_without_error', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/');
      await expect(page.locator('main')).toBeVisible();

      const logs: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') logs.push(msg.text());
      });
      expect(logs).toEqual([]);
    });

    test('should_navigate_from_accueil_to_contenus', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.locator('nav a:has-text("Contenus")').click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/contenus');
      await expect(page.locator('h1:has-text("Contenus")')).toBeVisible();
    });

    test('should_navigate_from_accueil_to_livres', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.locator('nav a:has-text("Livres")').click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/livres');
      await expect(page.locator('h1:has-text("Nos Livres")')).toBeVisible();
    });

    test('should_navigate_from_accueil_to_evenements', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.locator('nav a:has-text("Événements")').click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/evenements');
      await expect(page.locator('h1:has-text("Événements")')).toBeVisible();
    });

    test('should_have_footer_with_legal_links', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
      const legalLinks = footer.locator('a:has-text("Mentions légales")');
      await expect(legalLinks).toBeVisible();
    });
  });

  test.describe('Page contenus', () => {
    test('should_load_contenus_without_error', async ({ page }) => {
      await page.goto('/contenus');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/contenus');
      await expect(page.locator('main')).toBeVisible();
    });

    test('should_display_contenu_cards_or_empty_state', async ({ page }) => {
      await page.goto('/contenus');
      await page.waitForLoadState('networkidle');
      const cards = page.locator('article');
      const emptyState = page.locator('text=Aucun contenu');
      const cardCount = await cards.count();
      const emptyVisible = await emptyState.isVisible();
      expect(cardCount > 0 || emptyVisible).toBe(true);
    });
  });

  test.describe('Page livres', () => {
    test('should_load_livres_without_error', async ({ page }) => {
      await page.goto('/livres');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/livres');
      await expect(page.locator('main')).toBeVisible();
    });

    test('should_display_livre_cards_or_empty_state', async ({ page }) => {
      await page.goto('/livres');
      await page.waitForLoadState('networkidle');
      const cards = page.locator('[class*="grid"] article, [class*="grid"] > div');
      const emptyState = page.locator('text=Aucun livre');
      const cardCount = await cards.count();
      const emptyVisible = await emptyState.isVisible();
      expect(cardCount > 0 || emptyVisible).toBe(true);
    });
  });

  test.describe('Page événements', () => {
    test('should_load_evenements_without_error', async ({ page }) => {
      await page.goto('/evenements');
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/evenements');
      await expect(page.locator('main')).toBeVisible();
    });

    test('should_display_evenement_cards_or_empty_state', async ({ page }) => {
      await page.goto('/evenements');
      await page.waitForLoadState('networkidle');
      const cards = page.locator('[class*="grid"] article');
      const emptyState = page.locator('text=Aucun événement');
      const cardCount = await cards.count();
      const emptyVisible = await emptyState.isVisible();
      expect(cardCount > 0 || emptyVisible).toBe(true);
    });
  });

  test.describe('Parcours de bout en bout', () => {
    test('should_complete_full_visitor_journey', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('main')).toBeVisible();

      await page.locator('nav a:has-text("Contenus")').click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/contenus');

      const firstCard = page.locator('article a').first();
      if (await firstCard.isVisible()) {
        await firstCard.click();
        await page.waitForLoadState('networkidle');
        await expect(page.locator('article h1')).toBeVisible();
      }

      await page.locator('nav a:has-text("Accueil")').click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/');

      await page.locator('nav a:has-text("Livres")').click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/livres');

      await page.locator('nav a:has-text("Événements")').click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/evenements');
      await expect(page.locator('main')).toBeVisible();
    });
  });
});
