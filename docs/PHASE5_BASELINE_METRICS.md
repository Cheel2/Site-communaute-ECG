# Baseline Métriques — Phase 5
# Collecté : QMC-0 | Projet : site-pasteur-TEST
# Date : 2026-08-20
# Méthode : Analyse documentaire (Chronicle Phase 3 + Phase 4 + Master Document)
# Statut : INCOMPLET — rapports de couverture manquants

## Métriques de test
| Métrique | Valeur | Seuil Phase 4 | Statut | Source |
|----------|--------|---------------|--------|--------|
| Tests unitaires+intégration passés | 357/357 | 100% | [OK] | Chronicle 4 — TMC-22 run #8 |
| Tests E2E passés | 37/38 | 100% | [OK] (1 skippé) | Chronicle 4 — TMC-23 run #7 |
| Tests skippés (total) | 20 | N/A | Documenté | Chronicle 4 — Résumé §2 |
| Durée CI unit+integ | 1m8s | — | Mesuré | Chronicle 4 — TMC-22 |
| Durée CI E2E | 4m8s | — | Mesuré | Chronicle 4 — TMC-23 |

## Tests skippés détaillés
| # | Test / Module | Raison | Source |
|---|---------------|--------|--------|
| 1-3 | Rubriques erreurs | Mocks incomplets (codes erreur) | TMC-22 |
| 4 | Middleware `redirectedFrom` | Paramètre non testé | TMC-22 |
| 5 | Tracking `createClient` | Mock non espionné | TMC-22 |
| 6-19 | **14 tests non itemisés** | [INCOHÉRENCE — Résumé §2 annonce 19, TMC-22 documente 5] | [REQUIRES HUMAN REVIEW] |
| 20 | Création contenu TipTap (E2E) | Formulaire complexe en CI | TMC-23 |

## Métriques de couverture
| Module | Seuil | Valeur | Statut | Source |
|--------|-------|--------|--------|--------|
| Server Actions (≥80%) | ≥ 80% | [REQUIRES HUMAN REVIEW — exécuter `npm test -- --coverage`] | Inconnu | — |
| Schémas Zod (≥90%) | ≥ 90% | [REQUIRES HUMAN REVIEW — exécuter `npm test -- --coverage`] | Inconnu | — |
| Utilitaires (≥80%) | ≥ 80% | [REQUIRES HUMAN REVIEW — exécuter `npm test -- --coverage`] | Inconnu | — |

## Métriques de performance
| Métrique | Valeur | Seuil | Statut | Source |
|----------|--------|-------|--------|--------|
| FCP `/` (Codespaces) | 5136 ms | ≤ 5000 ms (Must) | **DÉPASSÉ 136 ms** | Chronicle 4 — TMC-21 |
| FCP `/` (CI) | 204 ms | ≤ 5000 ms (Must) | [OK] | Chronicle 4 — TMC-23 |
| FCP `/livres` (Codespaces) | 1684 ms | ≤ 5000 ms (Must) | [OK] | Chronicle 4 — TMC-21 |
| FCP `/livres` (CI) | 884 ms | ≤ 5000 ms (Must) | [OK] | Chronicle 4 — TMC-23 |
| Contradiction FCP | 5136 vs 204 ms | — | **[REQUIRES HUMAN DECISION]** | TMC-21 + TMC-23 |
| Taille max image | Aucune image en test | ≤ 200 Ko (Must) | [OK] (vacuement) | Chronicle 4 — TMC-21 |

## Métriques de qualité processus (Galin Ch. 21)
| Métrique | Valeur | Seuil | Statut | Source |
|----------|--------|-------|--------|--------|
| CED (defects/KLOC) | [REQUIRES HUMAN REVIEW — KLOC non calculé] | < 2.0 | Inconnu | — |
| Defects Phase 3 (code) | 6 / 19 MC | — | Traçable | Chronicle 3 |
| Defects Phase 4 (code) | ~10 / 24 TMC | — | Traçable | Chronicle 4 |
| Defects Phase 4 (test) | ~40 corrigés | — | Traçable | Chronicle 4 |

## Actions requises pour compléter la baseline
1. [ ] Exécuter `npm test -- --coverage` dans Codespaces → copier le tableau récapitulatif
2. [ ] Identifier les 14 tests skippés non itemisés (comparer sortie `npm test` avec la liste ci-dessus)
3. [ ] Décision humaine sur la contradiction FCP (Codespaces 5136ms vs CI 204ms)
