# Plan de Phase 2 — Site Web Ministère Pastoral

## Phase 2A — Cadre

### Objectif

Poser les fondations architecturales et le plan de tâches initial avant de construire quoi que ce soit.

### Livrables produits

- ADR-001 : Décisions d'architecture
- Plan de tâches initial (itération exploratoire)

## Phase 2B — Fondation

### Objectif

Construire les décisions techniques fondamentales : modèle de données, interfaces, scalabilité.

### Livrables produits

- Schéma SQL complet (12 tables, 15 indexes, RLS policies)
- Contrats d'API (18+ schémas Zod, type ApiError, mapping erreurs)
- Plan de scalabilité (identifié comme non applicable pour ce projet — limites du plan gratuit)

## Phase 2C — Synthèse

### Objectif

Consolider les décisions, produire le contexte pour la Phase 3, et raffiner le plan de tâches final.

### Livrables produits

- Analyse des compromis (8 trade-offs documentés dans l'ADR)
- CONTEXT.md complet (18 sections pour Qwen Coder)
- Plan de tâches final (91 tâches atomiques avec dépendances)
- Guide de style, arborescence et wireframes (livrables UX/UI pour les maquettes)
- Scripts SQL de migration (5 scripts : tables, indexes, RLS, seed, migration type)

## Jalons de la Phase 2

| Jalon | Tâche atteinte | Critère de validation |
|---|---|---|
| J1 : Architecture validée | T-01 à T-13 terminées | ADR-001 approuvé par toutes les parties prenantes |
| J2 : Données et interfaces validées | T-14 à T-56 terminées | Schéma SQL exécutable, tous les schémas Zod produits, type ApiError défini |
| J3 : Synthèse validée | T-57 à T-91 terminées | CONTEXT.md complet, plan de 91 tâches validé, livrables UX/UI produits |

## Ordre d'exécution recommandé pour la Phase 3

### Phase 3A — Fondation (T-01 à T-13)

Infrastructure, base de données, authentification, Edge Function. Tout doit être en place avant d'écrire une seule ligne de métier.

### Phase 3B — Composants partagés + Back-office (T-14 à T-64)

Composants UI réutilisables, authentification, toutes les fonctionnalités back-office. Chaque module back-office est autonome.

### Phase 3C — Site public + Maquettes (T-65 à T-91)

Layout public, toutes les pages publiques, formulaires publics, tracking, livrables UX/UI.

## Dépendances clés

- T-01 → T-02, T-03, T-04, T-12
- T-02 → T-11
- T-05 → T-06, T-07, T-08, T-65
- T-11 → T-10, T-15, T-19, T-24, T-30, T-35, T-40, T-45, T-48, T-51, T-57, T-58, T-75, T-84, T-88
- T-12 → T-14, T-18, T-23, T-29, T-34, T-39, T-44, T-47, T-50, T-83
- T-13 → T-30, T-45
- T-03 → T-27, T-54
- T-15 → T-16, T-17
- T-19 → T-20, T-21
- T-20 → T-21
- T-24 → T-26, T-28
- T-25 → T-26, T-28, T-75
- T-27 → T-28
- T-30 → T-32
- T-31 → T-32
- T-33 → T-32
- T-35 → T-37
- T-36 → T-37
- T-38 → T-37
- T-40 → T-42
- T-41 → T-42
- T-43 → T-42
- T-45 → T-46, T-55
- T-46 → T-55
- T-48 → T-56
- T-49 → T-56
- T-51 → T-56
- T-54 → T-55
- T-55 → (aucune — page terminale du back-office)
- T-56 → (aucune — page terminale du back-office)
- T-57 → T-60, T-61
- T-58 → T-62, T-63
- T-59 → T-60, T-62
- T-61 → (aucune — page terminale)
- T-63 → (aucune — page terminale)
- T-64 → T-16, T-21, T-26, T-32, T-37, T-42, T-56, T-60, T-62
- T-65 → T-81, T-82
- T-66 à T-73 → (utilisés par les pages)
- T-74 → T-76, T-77, T-78, T-79, T-80, T-81, T-82, T-85, T-86, T-87
- T-75 → T-76, T-77, T-78, T-79, T-80, T-81, T-82
- T-76 → T-77
- T-78 → (aucune — page terminale)
- T-79 → T-80
- T-80 → (aucune — page terminale)
- T-81 → T-82
- T-82 → (aucune — page terminale)
- T-83 → T-84
- T-84 → T-85, T-86
- T-85 → (aucune — page terminale)
- T-86 → (aucune — page terminale)
- T-87 → (aucune — page terminale)
- T-88 → T-74, T-78, T-80
- T-89 → T-91
- T-90 → (aucun — livrable terminé)
- T-91 → (aucun — livrable terminé)
