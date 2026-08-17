# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-crud-contenu-final.spec.ts >> TMC-18 : Scénario Admin CRUD contenu complet >> Modification d'un contenu >> should_modifier_un_contenu_existant
- Location: e2e/admin-crud-contenu-final.spec.ts:75:9

# Error details

```
TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=f1e1]:
  - generic [ref=f1e2]:
    - complementary [ref=f1e3]:
      - heading "Ministère Pastoral" [level=1] [ref=f1e5]
      - navigation [ref=f1e6]:
        - list [ref=f1e7]:
          - listitem [ref=f1e8]:
            - link "Tableau de bord" [ref=f1e9] [cursor=pointer]:
              - /url: /admin/tableau-de-bord
          - listitem [ref=f1e10]:
            - link "Contenus" [ref=f1e11] [cursor=pointer]:
              - /url: /admin/contenus
          - listitem [ref=f1e12]:
            - link "Rubriques" [ref=f1e13] [cursor=pointer]:
              - /url: /admin/rubriques
          - listitem [ref=f1e14]:
            - link "Livres" [ref=f1e15] [cursor=pointer]:
              - /url: /admin/livres
          - listitem [ref=f1e16]:
            - link "Événements" [ref=f1e17] [cursor=pointer]:
              - /url: /admin/evenements
          - listitem [ref=f1e18]:
            - link "Partenaires" [ref=f1e19] [cursor=pointer]:
              - /url: /admin/partenaires
          - listitem [ref=f1e20]:
            - link "Contacts" [ref=f1e21] [cursor=pointer]:
              - /url: /admin/contacts
          - listitem [ref=f1e22]:
            - link "Utilisateurs" [ref=f1e23] [cursor=pointer]:
              - /url: /admin/utilisateurs
          - listitem [ref=f1e24]:
            - link "Paramètres" [ref=f1e25] [cursor=pointer]:
              - /url: /admin/parametres
    - generic [ref=f1e26]:
      - generic [ref=f1e27]:
        - button "Ouvrir le menu" [ref=f1e28]
        - generic [ref=f1e31]:
          - text: admin@test.com
          - button "Déconnexion" [ref=f1e32]
      - banner [ref=f1e33]:
        - heading "Back-office" [level=2] [ref=f1e34]
        - generic [ref=f1e35]:
          - text: admin@test.comAdministrateur
          - button "Déconnexion" [ref=f1e36]
      - main [ref=f1e37]:
        - generic [ref=f1e38]:
          - generic [ref=f1e39]:
            - generic [ref=f1e40]:
              - heading "Contenus" [level=1] [ref=f1e41]
              - paragraph [ref=f1e42]: Créez, modifiez ou supprimez les contenus éditoriaux du site.
            - button "Nouveau contenu" [ref=f1e43]
          - generic [ref=f1e44]:
            - generic [ref=f1e45]:
              - generic [ref=f1e46]: Titre *
              - textbox "Titre *" [ref=f1e47]:
                - /placeholder: Titre du contenu
                - text: Contenu E2E 1787002238444
            - generic [ref=f1e48]:
              - generic [ref=f1e49]: Rubrique *
              - combobox "Rubrique *" [ref=f1e50]:
                - option "— Sélectionner une rubrique —"
                - option "Général" [selected]
                - option "Pensées du jour"
                - option "Enseignements"
                - option "Encouragements"
            - generic [ref=f1e51]:
              - text: Texte
              - generic [ref=f1e52]:
                - toolbar "Barre d'outils de formatage" [ref=f1e53]:
                  - button "Gras" [ref=f1e54]: B
                  - button "Italique" [ref=f1e55]: I
                  - button "Titre 2" [ref=f1e56]: H2
                  - button "Titre 3" [ref=f1e57]: H3
                  - button "Liste à puces" [ref=f1e58]: •
                  - button "Liste numérotée" [ref=f1e59]: "1."
                  - button "Lien" [ref=f1e60]: 🔗
                - textbox [ref=f1e63]:
                  - paragraph [ref=f1e64]: Ceci est un contenu créé automatiquement par le test E2E.
              - paragraph [ref=f1e66]: Sauvegarde automatique toutes les 30 secondes
            - generic [ref=f1e67]:
              - text: Image (URL)
              - textbox "Image (URL)" [ref=f1e68]:
                - /placeholder: URL de l'image (optionnel)
            - generic [ref=f1e69]:
              - text: Statut
              - combobox "Statut" [ref=f1e70]:
                - option "Non publié"
                - option "Publié" [selected]
            - generic [ref=f1e71]:
              - button "Modifier le contenu" [ref=f1e72]
              - button "Annuler" [ref=f1e73]
          - generic [ref=f1e74]:
            - generic [ref=f1e75]:
              - heading "Contenus existants" [level=2] [ref=f1e76]
              - generic [ref=f1e77]: 4 contenus
            - table [ref=f1e79]:
              - rowgroup [ref=f1e80]:
                - row [ref=f1e81]:
                  - columnheader "Titre" [ref=f1e82]
                  - columnheader "Rubrique" [ref=f1e83]
                  - columnheader "Statut" [ref=f1e84]
                  - columnheader "Actions" [ref=f1e85]
              - rowgroup [ref=f1e86]:
                - row [ref=f1e87]:
                  - cell "Contenu E2E 1787002238444" [ref=f1e88]
                  - cell "Général" [ref=f1e89]
                  - cell "Publié" [ref=f1e90]
                  - cell [ref=f1e91]:
                    - generic [ref=f1e92]:
                      - button "Modifier" [active] [ref=f1e93]
                      - button "Supprimer" [ref=f1e94]
                - row [ref=f1e95]:
                  - cell "Parcours E2E 1787000415205" [ref=f1e96]
                  - cell "Général" [ref=f1e97]
                  - cell "Publié" [ref=f1e98]
                  - cell [ref=f1e99]:
                    - generic [ref=f1e100]:
                      - button "Modifier" [ref=f1e101]
                      - button "Supprimer" [ref=f1e102]
                - row [ref=f1e103]:
                  - cell "Contenu E2E 1787000391721" [ref=f1e104]
                  - cell "Général" [ref=f1e105]
                  - cell "Publié" [ref=f1e106]
                  - cell [ref=f1e107]:
                    - generic [ref=f1e108]:
                      - button "Modifier" [ref=f1e109]
                      - button "Supprimer" [ref=f1e110]
                - row [ref=f1e111]:
                  - cell "Test Manuel" [ref=f1e112]
                  - cell "Général" [ref=f1e113]
                  - cell "Publié" [ref=f1e114]
                  - cell [ref=f1e115]:
                    - generic [ref=f1e116]:
                      - button "Modifier" [ref=f1e117]
                      - button "Supprimer" [ref=f1e118]
            - list [ref=f1e119]:
              - listitem [ref=f1e120]:
                - generic [ref=f1e121]:
                  - generic [ref=f1e122]:
                    - paragraph [ref=f1e123]: Contenu E2E 1787002238444
                    - paragraph [ref=f1e124]: "Rubrique : Général"
                  - text: Publié
                - generic [ref=f1e125]:
                  - button "Modifier" [ref=f1e126]
                  - button "Supprimer" [ref=f1e127]
              - listitem [ref=f1e128]:
                - generic [ref=f1e129]:
                  - generic [ref=f1e130]:
                    - paragraph [ref=f1e131]: Parcours E2E 1787000415205
                    - paragraph [ref=f1e132]: "Rubrique : Général"
                  - text: Publié
                - generic [ref=f1e133]:
                  - button "Modifier" [ref=f1e134]
                  - button "Supprimer" [ref=f1e135]
              - listitem [ref=f1e136]:
                - generic [ref=f1e137]:
                  - generic [ref=f1e138]:
                    - paragraph [ref=f1e139]: Contenu E2E 1787000391721
                    - paragraph [ref=f1e140]: "Rubrique : Général"
                  - text: Publié
                - generic [ref=f1e141]:
                  - button "Modifier" [ref=f1e142]
                  - button "Supprimer" [ref=f1e143]
              - listitem [ref=f1e144]:
                - generic [ref=f1e145]:
                  - generic [ref=f1e146]:
                    - paragraph [ref=f1e147]: Test Manuel
                    - paragraph [ref=f1e148]: "Rubrique : Général"
                  - text: Publié
                - generic [ref=f1e149]:
                  - button "Modifier" [ref=f1e150]
                  - button "Supprimer" [ref=f1e151]
  - alert [ref=f1e152]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('TMC-18 : Scénario Admin CRUD contenu complet', () => {
  4   | 
  5   |   test.describe('Authentification admin', () => {
  6   |     test('should_se_connecter_avec_identifiants_valides', async ({ page }) => {
  7   |       await page.goto('/admin/login');
  8   |       await page.waitForLoadState('domcontentloaded');
  9   |       await page.getByLabel('Email').fill('admin@test.com');
  10  |       await page.getByLabel('Mot de passe').fill('Admin123!');
  11  |       await page.getByRole('button', { name: 'Se connecter' }).click();
  12  |       await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, { timeout: 10000 });
  13  |     });
  14  | 
  15  |     test('should_refuser_login_avec_mot_de_passe_invalide', async ({ page }) => {
  16  |       await page.goto('/admin/login');
  17  |       await page.waitForLoadState('domcontentloaded');
  18  |       await page.getByLabel('Email').fill('admin@test.com');
  19  |       await page.getByLabel('Mot de passe').fill('wrongpassword');
  20  |       await page.getByRole('button', { name: 'Se connecter' }).click();
  21  |       await expect(page.getByRole('alert')).toBeVisible({ timeout: 5000 });
  22  |       await expect(page).toHaveURL('/admin/login');
  23  |     });
  24  |   });
  25  | 
  26  |   test.describe('Création d\'un contenu', () => {
  27  |     test('should_creer_un_contenu_et_le_publier', async ({ page }) => {
  28  |       await page.goto('/admin/login');
  29  |       await page.waitForLoadState('domcontentloaded');
  30  |       await page.getByLabel('Email').fill('admin@test.com');
  31  |       await page.getByLabel('Mot de passe').fill('Admin123!');
  32  |       await page.getByRole('button', { name: 'Se connecter' }).click();
  33  |       await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, { timeout: 10000 });
  34  | 
  35  |       await page.goto('/admin/contenus/nouveau');
  36  |       await page.waitForLoadState('domcontentloaded');
  37  | 
  38  |       await expect(page.getByLabel('Titre *')).toBeVisible({ timeout: 5000 });
  39  | 
  40  |       const titreTest = `Contenu E2E ${Date.now()}`;
  41  |       await page.getByLabel('Titre *').fill(titreTest);
  42  |       await page.getByLabel('Rubrique *').selectOption({ index: 1 });
  43  |       await page.getByLabel('Texte').fill('Ceci est un contenu créé automatiquement par le test E2E.');
  44  |       await page.getByLabel('Statut').selectOption('publie');
  45  | 
  46  |       await page.getByRole('button', { name: /Créer le contenu/ }).click();
  47  | 
  48  |       await expect(page).toHaveURL(/\/admin\/contenus/, { timeout: 10000 });
  49  |       await expect(page.getByText(titreTest).first()).toBeVisible({ timeout: 10000 });
  50  |     });
  51  | 
  52  |     test('should_afficher_erreur_si_titre_vide', async ({ page }) => {
  53  |       await page.goto('/admin/login');
  54  |       await page.waitForLoadState('domcontentloaded');
  55  |       await page.getByLabel('Email').fill('admin@test.com');
  56  |       await page.getByLabel('Mot de passe').fill('Admin123!');
  57  |       await page.getByRole('button', { name: 'Se connecter' }).click();
  58  |       await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, { timeout: 10000 });
  59  | 
  60  |       await page.goto('/admin/contenus/nouveau');
  61  |       await page.waitForLoadState('domcontentloaded');
  62  | 
  63  |       await page.getByLabel('Titre *').fill('   ');
  64  |       await page.getByLabel('Rubrique *').selectOption({ index: 1 });
  65  |       await page.getByLabel('Texte').fill('Texte de test');
  66  | 
  67  |       await page.getByRole('button', { name: /Créer le contenu/ }).click();
  68  | 
  69  |       await expect(page.locator('[role="alert"]').first()).toBeVisible({ timeout: 5000 });
  70  |       await expect(page.locator('[role="alert"]').first()).toContainText('titre', { ignoreCase: true });
  71  |     });
  72  |   });
  73  | 
  74  |   test.describe('Modification d\'un contenu', () => {
  75  |     test('should_modifier_un_contenu_existant', async ({ page }) => {
  76  |       await page.goto('/admin/login');
  77  |       await page.waitForLoadState('domcontentloaded');
  78  |       await page.getByLabel('Email').fill('admin@test.com');
  79  |       await page.getByLabel('Mot de passe').fill('Admin123!');
  80  |       await page.getByRole('button', { name: 'Se connecter' }).click();
  81  |       await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, { timeout: 10000 });
  82  | 
  83  |       await page.goto('/admin/contenus');
  84  |       await page.waitForLoadState('domcontentloaded');
  85  | 
  86  |       const hasContenus = await page.locator('table tbody tr').count() > 0;
  87  |       if (!hasContenus) {
  88  |         test.skip('Aucun contenu existant pour le test de modification');
  89  |         return;
  90  |       }
  91  | 
  92  |       // ✅ Récupérer le titre et l'ID du premier contenu
  93  |       const firstRow = page.locator('table tbody tr:first-child');
  94  |       const titreOriginal = await firstRow.locator('td:first-child').textContent();
  95  |       const editButton = firstRow.locator('button:has-text("Modifier")');
  96  |       
  97  |       // ✅ Cliquer sur "Modifier"
  98  |       await editButton.click();
  99  | 
  100 |       // ✅ Attendre la redirection (timeout long)
> 101 |       await page.waitForURL(/\/admin\/contenus\/[a-f0-9-]+\/modifier/, { timeout: 15000 });
      |                  ^ TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
  102 | 
  103 |       const titreInput = page.getByLabel('Titre *');
  104 |       await expect(titreInput).toBeVisible({ timeout: 5000 });
  105 |       
  106 |       const nouveauTitre = `Modifié ${Date.now()}`;
  107 |       await titreInput.fill(nouveauTitre);
  108 |       await page.getByRole('button', { name: /Modifier|Mettre à jour/ }).click();
  109 | 
  110 |       // ✅ Aller à la liste et attendre
  111 |       await page.goto('/admin/contenus');
  112 |       await page.waitForLoadState('domcontentloaded');
  113 |       
  114 |       // ✅ Vérifier que le nouveau titre apparaît (timeout long)
  115 |       await expect(page.getByText(nouveauTitre).first()).toBeVisible({ timeout: 15000 });
  116 |     });
  117 |   });
  118 | 
  119 |   test.describe('Suppression d\'un contenu', () => {
  120 |     test('should_supprimer_un_contenu_via_la_liste', async ({ page }) => {
  121 |       await page.goto('/admin/login');
  122 |       await page.waitForLoadState('domcontentloaded');
  123 |       await page.getByLabel('Email').fill('admin@test.com');
  124 |       await page.getByLabel('Mot de passe').fill('Admin123!');
  125 |       await page.getByRole('button', { name: 'Se connecter' }).click();
  126 |       await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, { timeout: 10000 });
  127 | 
  128 |       await page.goto('/admin/contenus');
  129 |       await page.waitForLoadState('domcontentloaded');
  130 | 
  131 |       const hasContenus = await page.locator('table tbody tr').count() > 0;
  132 |       if (!hasContenus) {
  133 |         test.skip('Aucun contenu existant pour le test de suppression');
  134 |         return;
  135 |       }
  136 | 
  137 |       const titreContenu = await page.locator('table tbody tr:first-child td:first-child').textContent();
  138 |       const deleteButton = page.locator('table tbody tr:first-child button:has-text("Supprimer")');
  139 |       await deleteButton.click();
  140 | 
  141 |       await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
  142 |       await page.locator('.bg-red-600:has-text("Supprimer")').first().click();
  143 | 
  144 |       if (titreContenu) {
  145 |         await expect(page.getByText(titreContenu).first()).not.toBeVisible({ timeout: 5000 });
  146 |       }
  147 |     });
  148 |   });
  149 | 
  150 |   test.describe('Parcours complet', () => {
  151 |     test('should_complete_full_admin_contenu_journey', async ({ page }) => {
  152 |       await page.goto('/admin/login');
  153 |       await page.waitForLoadState('domcontentloaded');
  154 |       await page.getByLabel('Email').fill('admin@test.com');
  155 |       await page.getByLabel('Mot de passe').fill('Admin123!');
  156 |       await page.getByRole('button', { name: 'Se connecter' }).click();
  157 |       await expect(page).toHaveURL(/\/admin\/(tableau-de-bord|contenus)/, { timeout: 10000 });
  158 | 
  159 |       await page.goto('/admin/contenus/nouveau');
  160 |       await page.waitForLoadState('domcontentloaded');
  161 |       await expect(page.getByLabel('Titre *')).toBeVisible({ timeout: 5000 });
  162 | 
  163 |       const titreTest = `Parcours E2E ${Date.now()}`;
  164 |       await page.getByLabel('Titre *').fill(titreTest);
  165 |       await page.getByLabel('Rubrique *').selectOption({ index: 1 });
  166 |       await page.getByLabel('Texte').fill('Texte du parcours complet.');
  167 |       await page.getByLabel('Statut').selectOption('publie');
  168 | 
  169 |       await page.getByRole('button', { name: /Créer le contenu/ }).click();
  170 |       await expect(page).toHaveURL(/\/admin\/contenus/, { timeout: 10000 });
  171 |       await expect(page.getByText(titreTest).first()).toBeVisible({ timeout: 10000 });
  172 | 
  173 |       const deleteButton = page.locator(`table tbody tr:has-text("${titreTest}") button:has-text("Supprimer")`);
  174 |       if (await deleteButton.isVisible()) {
  175 |         await deleteButton.click();
  176 |         await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
  177 |         await page.locator('.bg-red-600:has-text("Supprimer")').first().click();
  178 |         await expect(page.getByText(titreTest).first()).not.toBeVisible({ timeout: 5000 });
  179 |       }
  180 |     });
  181 |   });
  182 | });
  183 | 
```