# ADR-001 : Décisions d'architecture

## Contexte

Projet : Site web pour un ministère pastoral francophone.
Stack : Next.js 15, React 19, TypeScript 5, Tailwind CSS 3, Supabase (PostgreSQL, Auth, Storage, Edge Functions), Zod 3, TipTap 2, Recharts 2, Vercel free plan.
Contraintes : 100% gratuit (Supabase free : 500 MB storage, 60 connexions, 500K lignes. Vercel free : 100 GB bande passante, 100 builds, 100h functions).
Équipe : Petite (pasteur + assistante + vibe coding avec IA). Pas de SRE dédié.

## Décision

Nous choisissons une architecture Monolithe Modulaire avec les patterns associés suivants :

- Traitement : Requêtes synchrones (pas d'Event-Driven, pas de message broker)
- Code : Layered simple (Pages → Server Actions/Queries → Supabase) avec structure Feature-based
- Rendu : SSG + revalidation tag-based pour le site public, SSR pour le back-office

## Justification

### Reliability
- Pas de réseau inter-service → pas de risque de cascade de pannes
- Middleware Next.js unique pour l'authentification → point de contrôle centralisé
- RLS policies sur chaque table → sécurité par défaut même si le code oublie de vérifier le rôle

### Scalability
- Scalabilité verticale uniquement (scale-up) dans les limites du plan gratuit Supabase
- Revalidation tag-based ne re-prérend que les pages impactées → charge minimale au re-render
- Limites connues : 60 connexions simultanées (suffisant pour un trafic réseaux sociaux modéré)

### Maintainability
- Feature-based : un développeur (ou une IA) peut travailler sur un module sans toucher aux autres
- Un seul dépôt Git, une seule pipeline CI/CD (Vercel)
- Pas de distributed tracing, pas de service mesh, pas d'orchestration complexe

## Décisions spécifiques

| ID | Décision | Option retenue | Alternative écartée | Raison de l'écart |
|---|---|---|---|---|
| D1 | Structure de dossiers | Feature-based | Layered par couche technique | Isolation par module métier plutôt que par type de fichier. Réduit les conflits de merge. |
| D2 | Pattern de code | Layered simple | Hexagonal | Pas besoin de ports/adapters pour un monolithe avec une seule base de données. |
| D3 | Rendu pages publiques | SSG + revalidation tag-based | SSR pour tout | FCP ≤ 3s garanti sur 3G via edge caching Vercel. Seules les pages modifiées sont re-rendues. |
| D4 | Éditeur texte riche | TipTap (ProseMirror) | Quill, Slate | Support tactile natif, tree-shakeable (extensions minimales = bundle plus petit), compatible React 19. |
| D5 | Librairie graphiques | Recharts | Chart.js, Nivo | API déclarative React, responsive natif, imports nommés permettent un bundle minimal. |
| D6 | Validation formulaires | Zod | Yup, Joi | Type-safe natif avec TypeScript, un seul schéma client/serveur, intégration directe avec Server Actions. |

## Compromis acceptés

| ID | Compromis | Décision | Sacrifié | Gagné |
|---|---|---|---|---|
| T1 | Rendu public/admin | SSG public, SSR admin | FCP optimal du back-office | Simplicité de maintenance, données admin toujours fraîches |
| T2 | Index contenu | Simple sur date_publication (composite ajouté comme index manquant) | Perf max de la requête accueil | Lisibilité du schéma, maintenance simplifiée |
| T3 | Statistiques | Conservation indéfinie, archivage à 400K lignes | Simplicité à long terme | Zéro complexité au lancement |
| T4 | UI Library | Tailwind CSS pur, shadcn/ui reporté Phase 3 | Vitesse de développement initial | Contrôle total du markup et du style, zéro dépendance UI |
| T5 | Revalidation | Tag-based par entité | Revalidation globale par chemin | Précision (seules les pages impactées sont re-rendues), performance |
| T6 | Compression images | Edge Function seule, pas de fallback client | Résilience en cas de panne de l'Edge Function | Simplicité côté client, garantie du respect des contraintes |
| T7 | Plan Supabase | Rester free, migrer quand 2 des 3 seuils atteints | Tranquillité d'esprit | Zéro coût opérationnel au lancement |
| T8 | Stratégie de suppression | Hard-delete contenus/livres/événements, soft-delete uniquement utilisateurs | Récupération des contenus supprimés par erreur | Simplicité du schéma et des requêtes |

## Risques résiduels

| Risque | Probabilité | Impact | Seuil de réévaluation | Mitigation |
|---|---|---|---|---|
| Dépassement 500K lignes DB | Faible (court terme) | Élevé | 400K lignes dans statistique | Archivage mensuel planifié dans T3 |
| Dépassement 60 connexions simultanées | Faible | Élevé | Pics réguliers à 50+ connexions | Connection pooling Supabase + page d'erreur custom |
| Dépassement 100 GB bande passante | Faible | Moyen | 80 GB/mois réguliers | Optimisation images (WebP, compression), suppression du cache si nécessaire |
| Performance dégradée avec SSG | Faible | Moyen | FCP > 3s sur 3G | Ajouter ISR avec revalidation time-based |
| Équipe ne maîtrise pas TipTap | Moyenne | Faible | Éditeur ne répond pas au besoin | Fallback sur textarea avec Markdown (plan B non implémenté, à documenter) |

## Plan d'évolution

- Points de fragilité : Le passage à SSR complet (si FCP reste > 3s après optimisations), la gestion du cache si le volume de contenus dépasse 1000 articles
- Strangler pattern : Si besoin de microservices, extraire un module feature par feature vers un dépôt séparé
- Seuils de réévaluation : Si le trafic régulier dépasse 5000 visiteurs/jour, réévaluer le cache CDN et l'architecture ISR

## Conséquences

Positives : Simplicité maximale pour l'équipe, coûts nuls, déploiement en un clic sur Vercel, contexte clair pour Qwen Coder
Négatives : Scalabilité limitée au plan gratuit, pas de redondance géographique, single point of failure sur Vercel

## Approbations

Architecte (GLM) : Validé le 2026-08-04
Tech Lead (GLM) : Validé le 2026-08-04
Product Owner (Humain) : Validé le 2026-08-04
