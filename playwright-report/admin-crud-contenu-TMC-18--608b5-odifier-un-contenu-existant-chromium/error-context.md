# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-crud-contenu.spec.ts >> TMC-18 : Scénario Admin CRUD contenu complet >> Modification d'un contenu >> should_modifier_un_contenu_existant
- Location: e2e/admin-crud-contenu.spec.ts:124:9

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/admin\/(tableau-de-bord|contenus)/
Received string:  "http://localhost:3000/admin/login"
Timeout: 10000ms

Call log:
  - Expect "toHaveURL" with timeout 10000ms
    24 × locator resolved to <html lang="fr">…</html>
       - unexpected value "http://localhost:3000/admin/login"

```

```yaml
- complementary:
  - heading "Ministère Pastoral" [level=1]
  - navigation:
    - list:
      - listitem:
        - link "Tableau de bord":
          - /url: /admin/tableau-de-bord
      - listitem:
        - link "Contenus":
          - /url: /admin/contenus
      - listitem:
        - link "Rubriques":
          - /url: /admin/rubriques
      - listitem:
        - link "Livres":
          - /url: /admin/livres
      - listitem:
        - link "Événements":
          - /url: /admin/evenements
      - listitem:
        - link "Partenaires":
          - /url: /admin/partenaires
      - listitem:
        - link "Contacts":
          - /url: /admin/contacts
      - listitem:
        - link "Utilisateurs":
          - /url: /admin/utilisateurs
      - listitem:
        - link "Paramètres":
          - /url: /admin/parametres
- button "Ouvrir le menu":
  - text: Ouvrir le menu
  - img
- button "Déconnexion"
- banner:
  - heading "Back-office" [level=2]
  - text: Lecture seule
  - button "Déconnexion"
- main:
  - heading "Connexion" [level=1]
  - paragraph: Accédez au back-office du ministère.
  - alert: Identifiants invalides
  - text: Email
  - textbox "Email"
  - text: Mot de passe
  - textbox "Mot de passe"
  - button "Se connecter"
- status:
  - img
  - text: Static route
  - button "Hide static indicator":
    - img
- alert
```

# Test source

```ts
  35  |       await page.goto('/admin/login');
  36  |       await page.waitForLoadState('domcontentloaded');
  37  | 
  38  |       await page.getByLabel('Email').fill('admin@test.com');
  39  |       await page.getByLabel('Mot de passe').fill('wrongpassword');
  40  |       await page.getByRole('button', { name: 'Se connecter' }).click();
  41  | 
  42  |       await expect(page.getByRole('alert')).toBeVisible({
  43  |         timeout: 5000,
  44  |       });
  45  |       await expect(page).toHaveURL('/admin/login');
  46  |     });
  47  |   });
  48  | 
  49  |   // ============================================================
  50  |   // 2. CRÉATION D'UN CONTENU
  51  |   // ============================================================
  52  |   test.describe('Création d\'un contenu', () => {
  53  |     test('should_creer_un_contenu_et_le_publier', async ({ page }) => {
  54  |       const testEmail = process.env.ADMIN_TEST_EMAIL || 'admin@test.com';
  55  |       const testPassword = process.env.ADMIN_TEST_PASSWORD || 'Admin123!';
  56  | 
  57  |       await page.goto('/admin/login');
  58  |       await page.waitForLoadState('domcontentloaded');
  59  | 
  60  |       await page.getByLabel('Email').fill(testEmail);
  61  |       await page.getByLabel('Mot de passe').fill(testPassword);
  62  |       await page.getByRole('button', { name: 'Se connecter' }).click();
  63  | 
  64  |       await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, {
  65  |         timeout: 10000,
  66  |       });
  67  | 
  68  |       await page.goto('/admin/contenus');
  69  |       await page.waitForLoadState('domcontentloaded');
  70  | 
  71  |       await page.getByRole('button', { name: 'Nouveau contenu' }).click();
  72  |       await expect(page).toHaveURL(/\/admin\/contenus\/nouveau/);
  73  | 
  74  |       const titreTest = `Contenu E2E ${Date.now()}`;
  75  |       const texteTest = 'Ceci est un contenu créé automatiquement par le test E2E.';
  76  | 
  77  |       await page.getByLabel('Titre').fill(titreTest);
  78  |       await page.getByLabel('Rubrique').selectOption({ index: 1 });
  79  |       await page.locator('.tiptap').fill(texteTest);
  80  |       await page.getByLabel('Statut').selectOption('publie');
  81  | 
  82  |       await page.getByRole('button', { name: /Créer|Enregistrer/ }).click();
  83  | 
  84  |       await expect(page.getByRole('status')).toContainText('Contenu créé avec succès.', {
  85  |         timeout: 10000,
  86  |       });
  87  |     });
  88  | 
  89  |     test('should_afficher_erreur_si_titre_vide', async ({ page }) => {
  90  |       const testEmail = process.env.ADMIN_TEST_EMAIL || 'admin@test.com';
  91  |       const testPassword = process.env.ADMIN_TEST_PASSWORD || 'Admin123!';
  92  | 
  93  |       await page.goto('/admin/login');
  94  |       await page.waitForLoadState('domcontentloaded');
  95  | 
  96  |       await page.getByLabel('Email').fill(testEmail);
  97  |       await page.getByLabel('Mot de passe').fill(testPassword);
  98  |       await page.getByRole('button', { name: 'Se connecter' }).click();
  99  | 
  100 |       await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, {
  101 |         timeout: 10000,
  102 |       });
  103 | 
  104 |       await page.goto('/admin/contenus/nouveau');
  105 |       await page.waitForLoadState('domcontentloaded');
  106 | 
  107 |       await page.getByLabel('Titre').fill('   ');
  108 |       await page.getByLabel('Rubrique').selectOption({ index: 1 });
  109 |       await page.locator('.tiptap').fill('Texte de test');
  110 | 
  111 |       await page.getByRole('button', { name: /Créer|Enregistrer/ }).click();
  112 | 
  113 |       await expect(page.getByRole('alert')).toBeVisible({
  114 |         timeout: 5000,
  115 |       });
  116 |       await expect(page.getByRole('alert')).toContainText('titre');
  117 |     });
  118 |   });
  119 | 
  120 |   // ============================================================
  121 |   // 3. MODIFICATION D'UN CONTENU
  122 |   // ============================================================
  123 |   test.describe('Modification d\'un contenu', () => {
  124 |     test('should_modifier_un_contenu_existant', async ({ page }) => {
  125 |       const testEmail = process.env.ADMIN_TEST_EMAIL || 'admin@test.com';
  126 |       const testPassword = process.env.ADMIN_TEST_PASSWORD || 'Admin123!';
  127 | 
  128 |       await page.goto('/admin/login');
  129 |       await page.waitForLoadState('domcontentloaded');
  130 | 
  131 |       await page.getByLabel('Email').fill(testEmail);
  132 |       await page.getByLabel('Mot de passe').fill(testPassword);
  133 |       await page.getByRole('button', { name: 'Se connecter' }).click();
  134 | 
> 135 |       await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, {
      |                          ^ Error: expect(page).toHaveURL(expected) failed
  136 |         timeout: 10000,
  137 |       });
  138 | 
  139 |       await page.goto('/admin/contenus');
  140 |       await page.waitForLoadState('domcontentloaded');
  141 | 
  142 |       const editButton = page.locator('table tbody tr:first-child button:has-text("Modifier")');
  143 |       await editButton.click();
  144 | 
  145 |       await expect(page).toHaveURL(/\/admin\/contenus\/[a-f0-9-]+\/modifier/);
  146 | 
  147 |       const titreInput = page.getByLabel('Titre');
  148 |       await expect(titreInput).toHaveValue(/.+/);
  149 | 
  150 |       const nouveauTitre = `Modifié ${Date.now()}`;
  151 |       await titreInput.fill(nouveauTitre);
  152 | 
  153 |       await page.getByRole('button', { name: /Modifier|Mettre à jour/ }).click();
  154 | 
  155 |       await expect(page.getByRole('status')).toContainText('Contenu modifié avec succès.', {
  156 |         timeout: 10000,
  157 |       });
  158 |     });
  159 |   });
  160 | 
  161 |   // ============================================================
  162 |   // 4. SUPPRESSION D'UN CONTENU
  163 |   // ============================================================
  164 |   test.describe('Suppression d\'un contenu', () => {
  165 |     test('should_supprimer_un_contenu_via_la_liste', async ({ page }) => {
  166 |       const testEmail = process.env.ADMIN_TEST_EMAIL || 'admin@test.com';
  167 |       const testPassword = process.env.ADMIN_TEST_PASSWORD || 'Admin123!';
  168 | 
  169 |       await page.goto('/admin/login');
  170 |       await page.waitForLoadState('domcontentloaded');
  171 | 
  172 |       await page.getByLabel('Email').fill(testEmail);
  173 |       await page.getByLabel('Mot de passe').fill(testPassword);
  174 |       await page.getByRole('button', { name: 'Se connecter' }).click();
  175 | 
  176 |       await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, {
  177 |         timeout: 10000,
  178 |       });
  179 | 
  180 |       await page.goto('/admin/contenus');
  181 |       await page.waitForLoadState('domcontentloaded');
  182 | 
  183 |       const titreContenu = await page
  184 |         .locator('table tbody tr:first-child td:first-child')
  185 |         .textContent();
  186 | 
  187 |       const deleteButton = page.locator('table tbody tr:first-child button:has-text("Supprimer")');
  188 |       await deleteButton.click();
  189 | 
  190 |       await expect(page.getByRole('dialog')).toBeVisible({
  191 |         timeout: 5000,
  192 |       });
  193 | 
  194 |       await page.getByRole('button', { name: /Supprimer|Confirmer/ }).click();
  195 | 
  196 |       if (titreContenu) {
  197 |         await expect(page.getByText(titreContenu)).not.toBeVisible({
  198 |           timeout: 5000,
  199 |         });
  200 |       }
  201 | 
  202 |       await expect(page.getByRole('status')).toContainText('Contenu supprimé avec succès.', {
  203 |         timeout: 10000,
  204 |       });
  205 |     });
  206 |   });
  207 | 
  208 |   // ============================================================
  209 |   // 5. PARCOURS COMPLET
  210 |   // ============================================================
  211 |   test.describe('Parcours complet', () => {
  212 |     test('should_complete_full_admin_contenu_journey', async ({ page }) => {
  213 |       const testEmail = process.env.ADMIN_TEST_EMAIL || 'admin@test.com';
  214 |       const testPassword = process.env.ADMIN_TEST_PASSWORD || 'Admin123!';
  215 | 
  216 |       await page.goto('/admin/login');
  217 |       await page.waitForLoadState('domcontentloaded');
  218 | 
  219 |       await page.getByLabel('Email').fill(testEmail);
  220 |       await page.getByLabel('Mot de passe').fill(testPassword);
  221 |       await page.getByRole('button', { name: 'Se connecter' }).click();
  222 | 
  223 |       await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, {
  224 |         timeout: 10000,
  225 |       });
  226 | 
  227 |       await page.goto('/admin/contenus');
  228 |       await page.waitForLoadState('domcontentloaded');
  229 | 
  230 |       await expect(page.getByRole('heading', { name: 'Contenus' })).toBeVisible();
  231 | 
  232 |       await page.getByRole('button', { name: 'Nouveau contenu' }).click();
  233 |       await expect(page).toHaveURL(/\/admin\/contenus\/nouveau/);
  234 | 
  235 |       const titreTest = `Parcours E2E ${Date.now()}`;
```