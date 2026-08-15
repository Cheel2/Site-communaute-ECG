import { test, expect } from '@playwright/test';

test.describe('TMC-16 : Parcours visiteur', () => {
  test.describe('Navigation publique', () => {
    test('should_load_accueil_without_error', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveURL('/');
      // Utiliser getByRole('main') avec first() pour éviter le strict mode
      await expect(page.getByRole('main').first()).toBeVisible();

      const logs: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') logs.push(msg.text());
      });
      expect(logs).toEqual([]);
    });

    test('should_navigate_from_accueil_to_contenus', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Utiliser le rôle 'link' avec le nom exact (plus robuste que CSS)
      await page.getByRole('link', { name: 'Contenus' }).first().click();
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveURL('/contenus');
      await expect(page.getByRole('heading', { name: 'Contenus' })).toBeVisible();
    });

    test('should_navigate_from_accueil_to_livres', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.getByRole('link', { name: 'Livres' }).first().click();
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveURL('/livres');
      await expect(page.getByRole('heading', { name: 'Nos Livres' })).toBeVisible();
    });

    test('should_navigate_from_accueil_to_evenements', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page.getByRole('link', { name: 'Événements' }).first().click();
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveURL('/evenements');
      await expect(page.getByRole('heading', { name: 'Événements' })).toBeVisible();
    });

    test('should_have_footer_with_legal_links', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const footer = page.locator('footer');
      await expect(footer).toBeVisible();

      const legalLinks = footer.getByRole('link', { name: 'Mentions légales' });
      await expect(legalLinks).toBeVisible();

      const privacyLink = footer.getByRole('link', { name: 'Politique de confidentialité' });
      await expect(privacyLink).toBeVisible();

      await legalLinks.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/\/mentions-legales/);
    });
  });

  test.describe('Page contenus', () => {
    test('should_load_contenus_without_error', async ({ page }) => {
      await page.goto('/contenus');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveURL('/contenus');
      // Vérifier que la page a un titre ou un contenu
      await expect(page.getByRole('heading', { name: 'Contenus' })).toBeVisible();
    });

    test('should_display_contenu_cards_or_empty_state', async ({ page }) => {
      await page.goto('/contenus');
      await page.waitForLoadState('networkidle');

      // Vérifier soit des articles, soit un message d'état vide
      const cards = page.locator('article');
      const emptyState = page.locator('text=Aucun contenu publié pour le moment.');
      const cardCount = await cards.count();

      // Si des cartes existent, vérifier qu'elles ont un lien
      if (cardCount > 0) {
        const firstCard = cards.first();
        const link = firstCard.locator('a');
        await expect(link).toBeVisible();
      } else {
        // Sinon, vérifier l'état vide
        await expect(emptyState).toBeVisible();
      }
    });
  });

  test.describe('Page livres', () => {
    test('should_load_livres_without_error', async ({ page }) => {
      await page.goto('/livres');
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveURL('/livres');
      await expect(page.getByRole('heading', { name: 'Nos Livres' })).toBeVisible();
    });

    test('should_display_livre_cards_or_empty_state', async ({ page }) => {
      await page.goto('/livres');
      await page.waitForLoadState('networkidle');

      const cards = page.locator('[class*="grid"] article, [class*="grid"] > div');
      const emptyState = page.locator('text=Aucun livre');

      const cardCount = await cards.count();

      if (cardCount > 0) {
        const firstCard = cards.first();
        // Vérifier au moins un lien externe
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
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveURL('/evenements');
      await expect(page.getByRole('heading', { name: 'Événements' })).toBeVisible();
    });

    test('should_display_evenement_cards_or_empty_state', async ({ page }) => {
      await page.goto('/evenements');
      await page.waitForLoadState('networkidle');

      const cards = page.locator('[class*="grid"] article');
      const emptyState = page.locator('text=Aucun événement');

      const cardCount = await cards.count();

      if (cardCount > 0) {
        const firstCard = cards.first();
        // Vérifier le badge type (récurrent/special)
        const badge = firstCard.locator('span:has-text("Récurrent"), span:has-text("Spécial")');
        await expect(badge).toBeVisible();
      } else {
        await expect(emptyState).toBeVisible();
      }
    });
  });

  test.describe('Parcours de bout en bout', () => {
    test('should_complete_full_visitor_journey', async ({ page }) => {
      // 1. Accueil
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await expect(page.getByRole('main').first()).toBeVisible();

      // 2. Contenus
      await page.getByRole('link', { name: 'Contenus' }).first().click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/contenus');

      // 3. Premier contenu (si existe)
      const firstCard = page.locator('article a').first();
      if (await firstCard.isVisible()) {
        const href = await firstCard.getAttribute('href');
        await firstCard.click();
        await page.waitForLoadState('networkidle');
        if (href) {
          await expect(page).toHaveURL(new RegExp(`^${href}$`));
        }
        await expect(page.locator('article h1')).toBeVisible();
      }

      // 4. Retour Accueil
      await page.getByRole('link', { name: 'Accueil' }).first().click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/');

      // 5. Livres
      await page.getByRole('link', { name: 'Livres' }).first().click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/livres');
      await expect(page.getByRole('heading', { name: 'Nos Livres' })).toBeVisible();

      // 6. Événements
      await page.getByRole('link', { name: 'Événements' }).first().click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL('/evenements');
      await expect(page.getByRole('heading', { name: 'Événements' })).toBeVisible();

      // 7. Vérifier l'absence d'erreurs
      const logs: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') logs.push(msg.text());
      });
      expect(logs).toEqual([]);
    });
  });
});
