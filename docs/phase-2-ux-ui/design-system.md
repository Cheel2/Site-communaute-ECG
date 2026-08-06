# Design System

## Principes

1. **Sobriété spirituelle** : L'interface reflète la dignité et la sérénité d'un ministère pastoral.
2. **Lisibilité avant tout** : Typographie claire, contrastes suffisants, hiérarchie visuelle évidente.
3. **Chaleur humaine** : Tons terreux et chauds qui évoquent l'accueil et l'authenticité.
4. **Responsive universel** : Expérience cohérente du desktop au smartphone 375px.
5. **Parcours simplifiés** : L'achat de livres et l'adhésion au partenariat doivent être intuitifs.

## Palette de couleurs

| Rôle | Couleur (hex) | Usage |
|---|---|---|
| Primary | #8B5E3C | Boutons principaux, liens actifs, accents |
| Primary Dark | #6B4423 | Hover des boutons primaires |
| Secondary | #2C5F5D | Boutons secondaires, badges, éléments d'interface admin |
| Background | #FAF8F5 | Fond de page principal |
| Surface | #FFFFFF | Cartes, modales, formulaires |
| Text Primary | #1A1A1A | Titres, texte principal |
| Text Secondary | #5C5C5C | Sous-titres, descriptions |
| Border | #E5E0D8 | Bordures de champs, séparateurs |
| Success | #4A7C59 | Messages de succès, statut publié |
| Danger | #B54242 | Erreurs, suppressions, statut désactivé |
| Warning | #C78D3A | Alertes, mises en garde |

## Typographie

| Élément | Police | Poids | Taille |
|---|---|---|---|
| H1 (page titre) | Merriweather | 700 | 2.25rem (36px) |
| H2 (section) | Merriweather | 700 | 1.75rem (28px) |
| H3 (sous-section) | Merriweather | 600 | 1.375rem (22px) |
| Body | Inter | 400 | 1rem (16px) |
| Body Small | Inter | 400 | 0.875rem (14px) |
| Label / Caption | Inter | 500 | 0.75rem (12px) |
| Button | Inter | 600 | 0.875rem (14px) |

## Spacing

| Token | Valeur | Usage |
|---|---|---|
| xs | 0.25rem (4px) | Espacement interne minimal (icônes + texte) |
| sm | 0.5rem (8px) | Padding interne composants compacts |
| md | 1rem (16px) | Padding standard champs et cartes |
| lg | 1.5rem (24px) | Espacement entre sections |
| xl | 2rem (32px) | Marge de section principale |
| 2xl | 3rem (48px) | Marge de page complète |

## Composants UI

| Composant | Rôle (5 mots) | Variants |
|---|---|---|
| Button | Action principale ou secondaire | Primary, Secondary, Danger |
| Input | Saisie texte courte | Text, Email, Password |
| Textarea | Saisie texte longue | Default, Resizable |
| Select | Choix dans une liste | Default, Searchable |
| Card | Conteneur de contenu | Default, Hoverable, Bordered |
| Badge | Indicateur de statut | Success, Warning, Danger, Neutral |
| Table | Affichage de données tabulaires | Default, Striped, Compact |
| Modal | Fenêtre de dialogue superposée | Default, Confirm, Form |
| Toast | Notification temporaire | Success, Error, Info |
| Tabs | Navigation par onglets | Default, Pills, Underline |
| Pagination | Navigation entre pages | Default, Compact |
| EmptyState | État vide avec message | Default, WithAction |
| Alert | Message contextuel | Info, Success, Warning, Error |
| LoadingSpinner | Indicateur de chargement | Small, Medium, Large |
| ConfirmModal | Confirmation de suppression | Danger, Warning |
