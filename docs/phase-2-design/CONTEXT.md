# CONTEXT.md

## Stack Technique

| Technologie | Rôle | Version |
|---|---|---|
| Next.js | Framework React (App Router) | 15 |
| React | UI library | 19 |
| TypeScript | Langage | 5.x |
| Tailwind CSS | Styling | 3.x |
| Supabase | Backend (PostgreSQL, Auth, Storage, Edge Functions) | latest |
| Zod | Validation schémas | 3.x |
| TipTap | Éditeur texte riche (ProseMirror) | 2.x |
| Recharts | Graphiques tableau de bord | 2.x |
| Vercel | Hébergement serverless | free plan |

## Commandes

- `npm run dev` — Développement local (localhost:3000)
- `npm run build` — Build production (pré-rendu SSG + SSR)
- `npm run start` — Démarrage mode production local
- `npm run lint` — Linting ESLint + TypeScript

## Structure de dossiers

```
src/
  app/
    (public)/
      page.tsx
      contenus/
      livres/
      evenements/
      partenariat/
      contact/
      mentions-legales/
      politique-confidentialite/
    (admin)/
      login/
      mot-de-passe-reinitialiser/
      tableau-de-bord/
      contenus/
      rubriques/
      livres/
      evenements/
      partenaires/
      contacts/
      utilisateurs/
      parametres/
  features/
    [module]/
      schema.ts
      actions.ts
      queries.ts
      components/
  lib/
    supabase.ts
  types/
    api.ts
  components/
    ui/
```

## Conventions de code

- Un dossier `features/[module]/` par entité métier
- `schema.ts` : schémas Zod exportés (création, modification, validation)
- `actions.ts` : Server Actions exportées (mutations uniquement)
- `queries.ts` : fonctions Server Query exportées (lectures uniquement)
- Composants clients : directive `'use client'` en première ligne
- Composants serveur : pas de directive (par défaut Next.js)
- Messages d'erreur utilisateur : toujours en français
- Nommage : `camelCase` variables/fonctions, `PascalCase` composants/types, `kebab-case` fichiers
- Imports : chemins absolus avec alias `@/` (ex: `@/features/contenus/schema`)

## Frontières et contraintes

- Pas de vidéo, pas d'audio, pas de streaming
- Pas de paiement intégré, pas de panier, pas d'e-commerce
- Pas de SEO payant, pas de publicité
- Pas d'inscription publique (back-office manuel uniquement)
- Images uniquement : upload ≤ 500 Ko, affichage ≤ 200 Ko, largeur max 1200px, format WebP/JPG
- CSV exports : séparateur point-virgule, encodage UTF-8 BOM
- Auto-save brouillon : intervalle 30 secondes
- Session back-office : expiration 30 minutes d'inactivité
- Session visiteur (compteur vues) : fenêtre 5 minutes d'inactivité
- Performance : First Contentful Paint ≤ 3.0s sur connexion 3G
- Responsive : 100% des tâches CRUD réalisables sur 375px sans zoom
- Supabase free : 500 MB storage, 60 connexions simultanées, 500 000 lignes DB
- Vercel free : 100 GB bande passante/mois, 100 builds/mois, 100h functions/mois
- Soft-delete : uniquement sur la table `utilisateur` (champ `statut`). Hard-delete sur toutes les autres tables.
- Doublons email acceptés : `partenaire.email` et `contact.email` sans contrainte UNIQUE

## Patterns clés

- **Rendu public** : SSG (Static Site Generation) avec revalidation on-demand par tag
- **Rendu admin** : SSR (Server-Side Rendering), données toujours fraîches
- **Architecture code** : Layered simple (Pages → Services → Données Supabase)
- **Structure** : Feature-based (`src/features/[module]/`)
- **Validation** : Zod partagé client/serveur (React Hook Form côté client, `.safeParse()` côté serveur)
- **Authentification** : Supabase Auth JWT + middleware Next.js pour protection `/admin`
- **Autorisation** : Row Level Security (RLS) par rôle (`total` / `lecture_seule`)
- **Mutations** : Server Actions uniquement (pas d'API routes REST)
- **Tracking** : Server Actions avec client `service_role` (bypass RLS) pour inserts statistiques
- **Compression images** : Supabase Edge Function (côté serveur uniquement, pas de fallback client)
- **Exports CSV** : génération en mémoire côté serveur, retour Blob téléchargeable

## Gestion des erreurs

**Type standard**

```typescript
export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
};

export type ApiResponse<T> =
  | { data: T; error?: never }
  | { data?: never; error: ApiError };
```

**Codes d'erreur**

| Code | Usage |
|---|---|
| VALIDATION_ERROR | Schéma Zod invalide, données malformées |
| NOT_FOUND | Ressource inexistante en base |
| CONFLICT | Violation contrainte unique (23505), doublon |
| UNAUTHORIZED | Identifiants invalides, token expiré |
| FORBIDDEN | RLS refusé (42501), accès interdit au rôle |
| INTERNAL_ERROR | Exception non gérée, timeout, erreur réseau |

**Mapping erreurs Supabase**

| Code PostgreSQL | Code ApiError |
|---|---|
| 23505 (unique violation) | CONFLICT |
| 23503 (foreign key violation) | VALIDATION_ERROR |
| 42501 (RLS violation) | FORBIDDEN |
| PGRST116 (row not found) | NOT_FOUND |

## Décisions d'architecture

| ID | Décision | Option | Justification clé |
|---|---|---|---|
| D1 | Structure de dossiers | Feature-based | Isolation des modifications par module, réduction des conflits de merge |
| D2 | Pattern de code | Layered simple | Lisibilité immédiate, adapté à monolithe OLTP avec un développeur |
| D3 | Rendu pages publiques | SSG + ISR tag-based | FCP ≤ 3s garanti sur 3G, bande passante réduite, edge Vercel |
| D4 | Éditeur texte riche | TipTap (ProseMirror) | Support tactile natif, tree-shakeable, extensions minimales |
| D5 | Librairie graphiques | Recharts | API déclarative React, responsive natif, imports nommés |
| D6 | Validation formulaires | Zod | Type-safe natif, un schéma client/serveur, intégration Server Actions |

## Compromis validés

| ID | Compromis | Décision | Sacrifié | Gagné |
|---|---|---|---|---|
| T1 | SSG public vs SSR admin | SSR pour admin uniquement | FCP optimal admin | Simplicité maintenance, données toujours fraîches |
| T2 | Index simple vs composite contenu | Index simple sur `date_publication` | Perf max requête accueil | Lisibilité schéma, maintenance simplifiée |
| T3 | Statistiques infinies vs purge | Conservation indéfinie, archivage à 400K lignes | Simplicité long terme | Zéro complexité au lancement |
| T4 | Tailwind pur vs shadcn/ui | Tailwind pur, shadcn reporté Phase 3 | Vitesse développement initial | Contrôle total markup/style, zéro dépendance |
| T5 | Revalidation tag vs path | Tag-based par entité | Simplicité revalidation globale | Précision et performance (seules pages impactées) |
| T6 | Edge Function vs fallback client | Pas de fallback client | Résilience panne Edge Function | Simplicité client, garantie contraintes images |
| T7 | Supabase free vs payant | Rester free, migrer à 2 seuils atteints | Tranquillité d'esprit | Zéro coût opérationnel au lancement |
| T8 | Hard-delete vs soft-delete contenus | Hard-delete contenus, soft-delete uniquement utilisateurs | Récupération contenus supprimés | Simplicité schéma et requêtes |

## Checklist avant chaque tâche

- [ ] Identifier le module `features/[module]/` concerné
- [ ] Vérifier l'existence du schéma Zod dans `schema.ts` du module
- [ ] Vérifier les RLS policies applicables à la table concernée
- [ ] Vérifier les indexes PostgreSQL pour les requêtes de lecture
- [ ] Si mutation : prévoir la revalidation SSG tag-based (`revalidateTag`)
- [ ] Si upload image : vérifier l'appel à l'Edge Function de compression
- [ ] Vérifier le responsive mobile (375px) pour les composants d'interface
- [ ] Vérifier que les messages d'erreur retournés sont en français
- [ ] Vérifier l'absence de vidéo, audio, paiement ou e-commerce dans l'implémentation
- [ ] Vérifier que les Server Actions retournent `ApiResponse<T>` et non des exceptions brutes

## Pièges à éviter

- Ne jamais oublier `revalidateTag` après une mutation impactant le site public
- Ne jamais créer d'API routes REST (toutes les mutations passent par Server Actions)
- Ne jamais dupliquer la logique de validation (un seul schéma Zod par module dans `schema.ts`)
- Ne jamais stocker de mot de passe dans la table `utilisateur` (Supabase Auth gère `auth.users`)
- Ne jamais oublier les RLS policies sur une nouvelle table
- Ne jamais utiliser le client Supabase anonyme pour le tracking (utiliser `service_role`)
- Ne jamais implémenter de soft-delete sur `contenu`, `livre`, `evenement` (hard-delete uniquement)
- Ne jamais ajouter de contrainte UNIQUE sur `partenaire.email` ou `contact.email`
- Ne jamais oublier l'encodage UTF-8 BOM et le séparateur point-virgule dans les exports CSV
- Ne jamais compresser les images côté client (Edge Function uniquement, pas de fallback)
- Ne jamais retourner un `void` depuis une Server Action (toujours retourner `{ success: true }` ou `ApiResponse<T>`)
- Ne jamais exposer de clé `service_role` côté client (uniquement dans les Server Actions)

## Modules features

| Module | Sous-dossiers | Fichiers |
|---|---|---|
| `features/auth/` | — | `schema.ts`, `actions.ts`, `components/` |
| `features/contenus/` | — | `schema.ts`, `actions.ts`, `queries.ts`, `components/` |
| `features/rubriques/` | — | `schema.ts`, `actions.ts`, `queries.ts`, `components/` |
| `features/livres/` | — | `schema.ts`, `actions.ts`, `queries.ts`, `components/` |
| `features/evenements/` | — | `schema.ts`, `actions.ts`, `queries.ts`, `components/` |
| `features/partenaire/` | — | `schema.ts`, `actions.ts`, `queries.ts`, `components/` |
| `features/contact/` | — | `schema.ts`, `actions.ts`, `queries.ts`, `components/` |
| `features/utilisateur/` | — | `schema.ts`, `actions.ts`, `queries.ts`, `components/` |
| `features/parametres/` | `banniere/`, `seo/`, `whatsapp/`, `dashboard/` | Chaque sous-dossier : `schema.ts`, `actions.ts`, `queries.ts`, `components/` sauf `dashboard/` (pas de `schema.ts`, pas de `components/`) |

## Schéma SQL

| Table | Colonnes | Contraintes | Foreign Keys |
|---|---|---|---|
| `rubrique` | id (UUID PK), nom (TEXT UNIQUE NOT NULL), ordre_affichage (INT NOT NULL DEFAULT 0), date_creation (TIMESTAMPTZ), date_modification (TIMESTAMPTZ) | nom UNIQUE NOT NULL | Aucune |
| `contenu` | id (UUID PK), titre (TEXT NOT NULL), rubrique_id (UUID NOT NULL), texte (TEXT DEFAULT ''), image_url (TEXT), statut (TEXT NOT NULL DEFAULT 'non_publie' CHECK statut IN ('publie','non_publie')), mis_en_avant (BOOLEAN DEFAULT FALSE), compteur_vues (INT DEFAULT 0), date_creation (TIMESTAMPTZ), date_modification (TIMESTAMPTZ), date_publication (TIMESTAMPTZ) | statut CHECK IN ('publie','non_publie') | rubrique_id → rubrique(id) ON DELETE RESTRICT |
| `livre` | id (UUID PK), titre (TEXT NOT NULL), description (TEXT DEFAULT ''), prix (DECIMAL(10,2) DEFAULT 0), image_couverture_url (TEXT), lien_amazon (TEXT), lien_whatsapp (TEXT), compteur_clics_amazon (INT DEFAULT 0), compteur_clics_whatsapp (INT DEFAULT 0), date_creation (TIMESTAMPTZ), date_modification (TIMESTAMPTZ) | Aucune | Aucune |
| `evenement` | id (UUID PK), titre (TEXT NOT NULL), description (TEXT DEFAULT ''), date (DATE NOT NULL), inscription_requise (BOOLEAN DEFAULT FALSE), type (TEXT NOT NULL DEFAULT 'special' CHECK IN ('recurrent','special')), date_creation (TIMESTAMPTZ), date_modification (TIMESTAMPTZ) | type CHECK IN ('recurrent','special') | Aucune |
| `banniere` | id (UUID PK), image_url (TEXT), message (TEXT DEFAULT ''), date_modification (TIMESTAMPTZ) | Aucune | Aucune |
| `partenaire` | id (UUID PK), nom (TEXT NOT NULL), email (TEXT NOT NULL), pays (TEXT NOT NULL), date_soumission (TIMESTAMPTZ), statut (TEXT DEFAULT 'soumis') | Aucune | Aucune |
| `contact` | id (UUID PK), nom (TEXT NOT NULL), email (TEXT NOT NULL), message (TEXT NOT NULL), date_soumission (TIMESTAMPTZ) | Aucune | Aucune |
| `utilisateur` | id (UUID PK), email (TEXT UNIQUE NOT NULL), role (TEXT NOT NULL DEFAULT 'lecture_seule' CHECK role IN ('total','lecture_seule')), statut (TEXT NOT NULL DEFAULT 'actif' CHECK statut IN ('actif','desactive')), date_creation (TIMESTAMPTZ), date_modification (TIMESTAMPTZ) | email UNIQUE NOT NULL, role CHECK IN ('total','lecture_seule'), statut CHECK IN ('actif','desactive') | id → auth.users(id) ON DELETE CASCADE |
| `parametre` | id (UUID PK), cle (TEXT UNIQUE NOT NULL), valeur (TEXT DEFAULT '') | cle UNIQUE NOT NULL | Aucune |
| `statistique` | id (UUID PK), type (TEXT NOT NULL CHECK type IN ('visite','vue_contenu','clic_whatsapp','clic_amazon','formulaire_partenariat','formulaire_contact')), valeur (INT DEFAULT 1), date (TIMESTAMPTZ) | type CHECK IN ('visite','vue_contenu','clic_whatsapp','clic_amazon','formulaire_partenariat','formulaire_contact') | Aucune |
| `brouillon` | id (UUID PK), contenu_id (UUID), titre (TEXT DEFAULT ''), rubrique_id (UUID), texte (TEXT DEFAULT ''), image_url (TEXT), date_derniere_sauvegarde (TIMESTAMPTZ) | Aucune | contenu_id → contenu(id) ON DELETE SET NULL, rubrique_id → rubrique(id) ON DELETE SET NULL |
| `page_seo` | id (UUID PK), chemin (TEXT UNIQUE NOT NULL), titre (TEXT DEFAULT ''), meta_description (TEXT DEFAULT ''), mots_cles (TEXT DEFAULT ''), date_modification (TIMESTAMPTZ) | chemin UNIQUE NOT NULL | Aucune |

Note : La table utilisateur est un profil lié à auth.users. Le mot de passe est géré par Supabase Auth, pas stocké ici.

## Indexes PostgreSQL

| Nom | Table | Colonnes | Note |
|---|---|---|---|
| (PK auto) | toutes | id | Créé automatiquement |
| (UNIQUE auto) | rubrique | nom | Créé automatiquement |
| (UNIQUE auto) | utilisateur | email | Créé automatiquement |
| (UNIQUE auto) | parametre | cle | Créé automatiquement |
| (UNIQUE auto) | page_seo | chemin | Créé automatiquement |
| idx_contenu_rubrique_id | contenu | rubrique_id | Explicite |
| idx_contenu_statut | contenu | statut | Explicite |
| idx_contenu_mis_en_avant | contenu | mis_en_avant | Partiel : WHERE mis_en_avant = TRUE |
| idx_contenu_date_publication | contenu | date_publication DESC | Explicite |
| idx_contenu_statut_date_publication | contenu | statut, date_publication DESC | Manquant — À AJOUTER |
| idx_evenement_date | evenement | date DESC | Explicite |
| idx_partenaire_date_soumission | partenaire | date_soumission DESC | Explicite |
| idx_contact_date_soumission | contact | date_soumission DESC | Explicite |
| idx_statistique_type_date | statistique | type, date DESC | Explicite |
| idx_statistique_date | statistique | date DESC | Manquant — À AJOUTER |
| idx_brouillon_contenu_id | brouillon | contenu_id | Explicite |

## Tags de revalidation SSG

**Mutations → Tags**

| Mutation | Tag(s) |
|---|---|
| Créer/Modifier/Supprimer/Toggler un contenu | `contenus` |
| Créer/Modifier/Supprimer une rubrique | `rubriques`, `contenus` |
| Créer/Modifier/Supprimer un livre | `livres` |
| Créer/Modifier/Supprimer un événement | `evenements` |
| Modifier la bannière | `banniere` |
| Modifier un paramètre SEO | `parametres` |
| Modifier le numéro WhatsApp | `parametres` |

**Pages publiques → Tags**

| Page | Tag(s) |
|---|---|
| Accueil | `banniere`, `contenus` |
| Liste contenus | `contenus` |
| Fiche contenu | `contenus` |
| Liste livres | `livres` |
| Fiche livre | `livres` |
| Liste événements | `evenements` |
| Fiche événement | `evenements` |

## Schémas Zod par module

| Module | Schémas exportés |
|---|---|
| `features/auth/schema.ts` | `loginSchema`, `resetPasswordSchema`, `newPasswordSchema` |
| `features/contenus/schema.ts` | `createContenuSchema`, `updateContenuSchema`, `deleteContenuSchema`, `toggleMiseEnAvantSchema`, `autoSaveBrouillonSchema`, `restoreBrouillonSchema` |
| `features/rubriques/schema.ts` | `createRubriqueSchema`, `updateRubriqueSchema`, `deleteRubriqueSchema` |
| `features/livres/schema.ts` | `createLivreSchema`, `updateLivreSchema`, `deleteLivreSchema` |
| `features/evenements/schema.ts` | `createEvenementSchema`, `updateEvenementSchema`, `deleteEvenementSchema` |
| `features/partenaire/schema.ts` | `submitPartenariatSchema` |
| `features/contact/schema.ts` | `submitContactSchema` |
| `features/utilisateur/schema.ts` | `createUserSchema`, `updateUserSchema` |
| `features/parametres/banniere/schema.ts` | `updateBanniereSchema` |
| `features/parametres/seo/schema.ts` | `updateSeoSchema` |
| `features/parametres/whatsapp/schema.ts` | `updateWhatsAppSchema` |
| `lib/` | `trackingEventSchema` |

## RLS Policies

| Profil | Tables | Accès |
|---|---|---|
| Anonyme | contenu (lignes où statut='publie'), livre, evenement, bannière, rubrique, parametre (cle='numero_whatsapp'), page_seo | SELECT |
| Anonyme | partenaire, contact | INSERT |
| Authentifié rôle='total' | contenu, rubrique, livre, evenement, banniere, partenaire, contact, utilisateur, parametre, page_seo, brouillon | ALL |
| Authentifié rôle='lecture_seule' | contenu, rubrique, livre, evenement, bannière, partenaire, contact, utilisateur, parametre, page_seo, brouillon | SELECT uniquement |
| service_role | statistique | BYPASS RLS |

## Edge Function compression

| Attribut | Valeur |
|---|---|
| Emplacement | `supabase/functions/compress-image/index.ts` |
| Entrée | Image brute (multipart), max_width (1200), max_size_kb (500), format (webp/jpg) |
| Sortie | Image compressée (base64 ou URL Storage) |
| Contrainte | Pas de fallback côté client — si l'Edge Function échoue, l'upload échoue |
