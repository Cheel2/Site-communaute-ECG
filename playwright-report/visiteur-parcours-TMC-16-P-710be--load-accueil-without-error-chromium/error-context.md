# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visiteur-parcours.spec.ts >> TMC-16 : Parcours visiteur >> Navigation publique >> should_load_accueil_without_error
- Location: e2e/visiteur-parcours.spec.ts:5:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('main').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('main').first()

```

```yaml
- text: missing required error components, refreshing...
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('TMC-16 : Parcours visiteur', () => {
  4   |   test.describe('Navigation publique', () => {
  5   |     test('should_load_accueil_without_error', async ({ page }) => {
  6   |       await page.goto('/');
  7   |       await page.waitForLoadState('domcontentloaded');
  8   |       await expect(page).toHaveURL('/');
> 9   |       await expect(page.locator('main').first()).toBeVisible();
      |                                                  ^ Error: expect(locator).toBeVisible() failed
  10  | 
  11  |       const logs: string[] = [];
  12  |       page.on('console', (msg) => {
  13  |         if (msg.type() === 'error') logs.push(msg.text());
  14  |       });
  15  |       expect(logs).toEqual([]);
  16  |     });
  17  | 
  18  |     test('should_navigate_from_accueil_to_contenus', async ({ page }) => {
  19  |       await page.goto('/');
  20  |       await page.waitForLoadState('domcontentloaded');
  21  |       await page.getByRole('link', { name: 'Contenus' }).first().click();
  22  |       await page.waitForLoadState('domcontentloaded');
  23  |       await expect(page).toHaveURL('/contenus');
  24  |       await expect(page.getByRole('heading', { name: 'Contenus' })).toBeVisible();
  25  |     });
  26  | 
  27  |     test('should_navigate_from_accueil_to_livres', async ({ page }) => {
  28  |       await page.goto('/');
  29  |       await page.waitForLoadState('domcontentloaded');
  30  |       await page.getByRole('link', { name: 'Livres' }).first().click();
  31  |       await page.waitForLoadState('domcontentloaded');
  32  |       await expect(page).toHaveURL('/livres');
  33  |       await expect(page.getByRole('heading', { name: 'Nos Livres' })).toBeVisible();
  34  |     });
  35  | 
  36  |     test('should_navigate_from_accueil_to_evenements', async ({ page }) => {
  37  |       await page.goto('/');
  38  |       await page.waitForLoadState('domcontentloaded');
  39  |       await page.getByRole('link', { name: 'Événements' }).first().click();
  40  |       await page.waitForLoadState('domcontentloaded');
  41  |       await expect(page).toHaveURL('/evenements');
  42  |       await expect(page.getByRole('heading', { name: 'Événements' })).toBeVisible();
  43  |     });
  44  | 
  45  |     test('should_have_footer_with_legal_links', async ({ page }) => {
  46  |       await page.goto('/');
  47  |       await page.waitForLoadState('domcontentloaded');
  48  |       const footer = page.locator('footer');
  49  |       await expect(footer).toBeVisible();
  50  |       const legalLinks = footer.getByRole('link', { name: 'Mentions légales' });
  51  |       await expect(legalLinks).toBeVisible();
  52  |       const privacyLink = footer.getByRole('link', { name: 'Politique de confidentialité' });
  53  |       await expect(privacyLink).toBeVisible();
  54  |       await legalLinks.click();
  55  |       await page.waitForLoadState('domcontentloaded');
  56  |       await expect(page).toHaveURL(/\/mentions-legales/);
  57  |     });
  58  |   });
  59  | 
  60  |   test.describe('Page contenus', () => {
  61  |     test('should_load_contenus_without_error', async ({ page }) => {
  62  |       await page.goto('/contenus');
  63  |       await page.waitForLoadState('domcontentloaded');
  64  |       await expect(page).toHaveURL('/contenus');
  65  |       await expect(page.getByRole('heading', { name: 'Contenus' })).toBeVisible();
  66  |     });
  67  | 
  68  |     test('should_display_contenu_cards_or_empty_state', async ({ page }) => {
  69  |       await page.goto('/contenus');
  70  |       await page.waitForLoadState('domcontentloaded');
  71  |       const cards = page.locator('article');
  72  |       const emptyState = page.locator('text=Aucun contenu publié pour le moment.');
  73  |       const cardCount = await cards.count();
  74  |       if (cardCount > 0) {
  75  |         const firstCard = cards.first();
  76  |         const link = firstCard.locator('a');
  77  |         await expect(link).toBeVisible();
  78  |       } else {
  79  |         await expect(emptyState).toBeVisible();
  80  |       }
  81  |     });
  82  |   });
  83  | 
  84  |   test.describe('Page livres', () => {
  85  |     test('should_load_livres_without_error', async ({ page }) => {
  86  |       await page.goto('/livres');
  87  |       await page.waitForLoadState('domcontentloaded');
  88  |       await expect(page).toHaveURL('/livres');
  89  |       await expect(page.getByRole('heading', { name: 'Nos Livres' })).toBeVisible();
  90  |     });
  91  | 
  92  |     test('should_display_livre_cards_or_empty_state', async ({ page }) => {
  93  |       await page.goto('/livres');
  94  |       await page.waitForLoadState('domcontentloaded');
  95  |       const cards = page.locator('[class*="grid"] article, [class*="grid"] > div');
  96  |       const emptyState = page.locator('text=Aucun livre');
  97  |       const cardCount = await cards.count();
  98  |       if (cardCount > 0) {
  99  |         const firstCard = cards.first();
  100 |         const amazonLink = firstCard.locator('a[href*="amazon"]');
  101 |         const waLink = firstCard.locator('a[href^="https://wa.me"]');
  102 |         const hasLink = (await amazonLink.count()) > 0 || (await waLink.count()) > 0;
  103 |         expect(hasLink).toBe(true);
  104 |       } else {
  105 |         await expect(emptyState).toBeVisible();
  106 |       }
  107 |     });
  108 |   });
  109 | 
```