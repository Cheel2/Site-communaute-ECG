# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visiteur-parcours.spec.ts >> TMC-16 : Parcours visiteur >> Page événements >> should_load_evenements_without_error
- Location: e2e/visiteur-parcours.spec.ts:111:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Événements' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Événements' })

```

```yaml
- text: missing required error components, refreshing...
```

# Test source

```ts
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
  110 |   test.describe('Page événements', () => {
  111 |     test('should_load_evenements_without_error', async ({ page }) => {
  112 |       await page.goto('/evenements');
  113 |       await page.waitForLoadState('domcontentloaded');
  114 |       await expect(page).toHaveURL('/evenements');
> 115 |       await expect(page.getByRole('heading', { name: 'Événements' })).toBeVisible();
      |                                                                       ^ Error: expect(locator).toBeVisible() failed
  116 |     });
  117 | 
  118 |     test('should_display_evenement_cards_or_empty_state', async ({ page }) => {
  119 |       await page.goto('/evenements');
  120 |       await page.waitForLoadState('domcontentloaded');
  121 |       const cards = page.locator('[class*="grid"] article');
  122 |       const emptyState = page.locator('text=Aucun événement');
  123 |       const cardCount = await cards.count();
  124 |       if (cardCount > 0) {
  125 |         const firstCard = cards.first();
  126 |         const badge = firstCard.locator('span:has-text("Récurrent"), span:has-text("Spécial")');
  127 |         await expect(badge).toBeVisible();
  128 |       } else {
  129 |         await expect(emptyState).toBeVisible();
  130 |       }
  131 |     });
  132 |   });
  133 | 
  134 |   test.describe('Parcours de bout en bout', () => {
  135 |     test('should_complete_full_visitor_journey', async ({ page }) => {
  136 |       await page.goto('/');
  137 |       await page.waitForLoadState('domcontentloaded');
  138 |       await expect(page.locator('main').first()).toBeVisible();
  139 | 
  140 |       await page.getByRole('link', { name: 'Contenus' }).first().click();
  141 |       await page.waitForLoadState('domcontentloaded');
  142 |       await expect(page).toHaveURL('/contenus');
  143 | 
  144 |       const firstCard = page.locator('article a').first();
  145 |       if (await firstCard.isVisible()) {
  146 |         const href = await firstCard.getAttribute('href');
  147 |         await firstCard.click();
  148 |         await page.waitForLoadState('domcontentloaded');
  149 |         if (href) {
  150 |           await expect(page).toHaveURL(new RegExp(`^${href}$`));
  151 |         }
  152 |         await expect(page.locator('article h1')).toBeVisible();
  153 |       }
  154 | 
  155 |       await page.getByRole('link', { name: 'Accueil' }).first().click();
  156 |       await page.waitForLoadState('domcontentloaded');
  157 |       await expect(page).toHaveURL('/');
  158 | 
  159 |       await page.getByRole('link', { name: 'Livres' }).first().click();
  160 |       await page.waitForLoadState('domcontentloaded');
  161 |       await expect(page).toHaveURL('/livres');
  162 |       await expect(page.getByRole('heading', { name: 'Nos Livres' })).toBeVisible();
  163 | 
  164 |       await page.getByRole('link', { name: 'Événements' }).first().click();
  165 |       await page.waitForLoadState('domcontentloaded');
  166 |       await expect(page).toHaveURL('/evenements');
  167 |       await expect(page.getByRole('heading', { name: 'Événements' })).toBeVisible();
  168 | 
  169 |       const logs: string[] = [];
  170 |       page.on('console', (msg) => {
  171 |         if (msg.type() === 'error') logs.push(msg.text());
  172 |       });
  173 |       expect(logs).toEqual([]);
  174 |     });
  175 |   });
  176 | });
  177 | 
```