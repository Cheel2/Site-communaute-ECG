# Plan Qualité Minimal — Phase 5
# Projet : Site Web Ministère Pastoral
# Date : QMC-1 | Référence : PHASE5_QA_PLAN-UPGRADE.md

## 1. Objectifs Qualité

Les objectifs qualité de la Phase 5 sont dérivés des critères d'arrêt quantifiés du PHASE5_QA_PLAN-UPGRADE.md :

| # | Objectif | Métrique | Cible | Source |
|---|----------|----------|-------|--------|
| 1 | Aucun finding BLOQUANT résiduel à la clôture | FINDINGS_REGISTER — statut BLOQUANT | 0 ouvert | PHASE5_QA_PLAN §Critères d'arrêt |
| 2 | Tous les findings MAJEURS sont résolus ou reportés avec justification | FINDINGS_REGISTER — statut MAJEUR | 100% | PHASE5_QA_PLAN §Critères d'arrêt |
| 3 | Régression Phase 4 100% verte après chaque QA-FIX | `npm test` + `npx playwright test` | 0 échec | PHASE5_QA_PLAN §Critères d'arrêt |
| 4 | Les métriques sont comparées à la baseline QMC-0 | PHASE5_BASELINE_METRICS.md | Écarts documentés | PHASE5_QA_PLAN §Critères d'arrêt |
| 5 | Les 18 contraintes d'ancrage sont couvertes par les QMC d'audit | Matrice de traçabilité QMC → contraintes | 18/18 | PHASE5_QA_PLAN §Critères d'arrêt |

## 2. Périmètre

La Phase 5 couvre les 12 Quality Micro-Cycles (QMC) suivants :

| QMC | Temps | Vague | Cible |
|:---|:---|:---|:---|
| QMC-0 | A | A0 | Prérequis & Baseline |
| QMC-1 | A | A1 | Plan Qualité & Risques (allégé) |
| QMC-2 | A | A2 | Sécurité : Auth & Session |
| QMC-3 | A | A2 | Sécurité : Données & RLS |
| QMC-4 | A | A2 | Performance : FCP & Core Web Vitals |
| QMC-5 | A | A2 | Revue Code : Middleware & Admin Layout |
| QMC-6 | A | A2 | Revue Code : Server Actions (LOT-5,6,7) |
| QMC-7 | A | A2 | Simplification : Duplication (LOT-8a,8b,8c) |
| QMC-8 | A | A2 | Simplification : Complexité (LOT-9a,9b,9c) |
| QMC-9 | A | A3 | Métriques & Baseline |
| QMC-10 | A | A3 | Revue Formelle : Modules critiques |
| QMC-11 | A | A4 | Documentation & Capitalisation |

**Périmètre strict :** Code applicatif dans `src/` uniquement. Infrastructure (`bootstrap.sh`, `package.json` scripts, `.env.local`) est hors périmètre — déjà traité en QMC-0.

## 3. Rôles (allégés)

Conformément à la grille Galin Ch. 4.7 "Petite Organisation" (équipe < 20 développeurs) :

| Rôle | Attribution | Référence Galin |
|:---|:---|:---|
| Executive in Charge of SQA | Pasteur | Ch. 25.1 |
| SQA Manager (combiné) | Orchestrateur IA (GLM) | Ch. 26.1 (combiné) |
| Routeur + Exécuteur | Utilisateur (vous) | — |
| Auditeur | Kimi K3 | Ch. 26.1.2–26.1.8 |
| Correcteur chirurgical | DeepSeek occidental | — |

**Absents (allégement justifié) :** Pas de SQA Unit dédiée, pas de SQA Trustee (pas de pairs), pas de SQA Committee (pas de transversalité), pas de SQA Forum (pas de culture formelle).

## 4. Métriques & Seuils

| Métrique | Seuil | Source de mesure | Statut actuel |
|:---|:---|:---|:---|
| Couverture actions | ≥ 80% | CI artifact (TMC-22) ou [REQUIRES HUMAN REVIEW] | [REQUIRES HUMAN REVIEW] — F-004 |
| Couverture schémas | ≥ 90% | CI artifact (TMC-22) ou [REQUIRES HUMAN REVIEW] | [REQUIRES HUMAN REVIEW] — F-004 |
| Couverture utils | ≥ 80% | CI artifact (TMC-22) ou [REQUIRES HUMAN REVIEW] | [REQUIRES HUMAN REVIEW] — F-004 |
| CED (Code Error Density) | < 2.0/KLOC | [REQUIRES HUMAN REVIEW — KLOC non calculé] | [REQUIRES HUMAN REVIEW] |
| FCP / | ≤ 5.0s Must | [CONTRADICTION : 5136ms Codespaces, 204ms CI] | DÉPASSÉ 136ms (Codespaces) |
| Tests skippés | 0 nouveau | Rapport terminal | 5 connus (identiques Phase 4) |
| Findings BLOQUANT | 0 | FINDINGS_REGISTER | 0 actuel |
| Findings MAJEUR | 0 (ou reportés justifiés) | FINDINGS_REGISTER | 0 (F-004 REPORTÉ PHASE 7) |

## 5. Critères d'Arrêt

Conformément au PHASE5_QA_PLAN-UPGRADE.md, les critères d'arrêt de la Phase 5 sont :

1. **0 finding BLOQUANT ouvert** dans le FINDINGS_REGISTER à la clôture du TEMPS A.
2. **100% des findings MAJEURS** sont RÉSOLU ou REPORTÉ PHASE 7 avec justification tracée.
3. **Régression Phase 4 100% verte** : `npm test` (unitaires + intégration) et `npx playwright test` (E2E) passent sans échec après chaque QA-FIX.
4. **Les métriques sont comparées à la baseline** QMC-0 : les écarts sont documentés dans le rapport QMC-9.
5. **Les 18 contraintes d'ancrage** listées dans le PHASE5_QA_PLAN sont couvertes par les QMC d'audit (traçabilité exigence → QMC).

## 6. Plan d'Exécution

| QMC | Temps | Vague | Dépendances | Tags |
|:---|:---|:---|:---|:---|
| QMC-0 | A | A0 | Aucune | [AUDIT-ONLY] |
| QMC-1 | A | A1 | QMC-0 | [AUDIT-ONLY] |
| QMC-2 | A | A2 | QMC-1 | [AUDIT-ONLY] |
| QMC-3 | A | A2 | QMC-2 | [AUDIT-ONLY] |
| QMC-4 | A | A2 | QMC-0 | [AUDIT-ONLY] |
| QMC-5 | A | A2 | QMC-0, QMC-2 | [AUDIT-ONLY] |
| QMC-6 | A | A2 | QMC-0, QMC-2, QMC-3 | [AUDIT-ONLY] |
| QMC-7 | A | A2 | QMC-0, QMC-6 | [AUDIT-ONLY] |
| QMC-8 | A | A2 | QMC-0, QMC-6 | [AUDIT-ONLY] |
| QMC-9 | A | A3 | QMC-2 à QMC-8 | [AUDIT-ONLY] |
| QMC-10 | A | A3 | QMC-0, QMC-2, QMC-3, QMC-5 | [AUDIT-ONLY] |
| QMC-11 | A | A4 | QMC-2 à QMC-10 | [AUDIT-ONLY] |

**TEMPS B (corrections) :** À définir après validation des findings TEMPS A. Les corrections sont chirurgicales, un fichier ou une fonction par finding, avec régression Phase 4 complète obligatoire.

## 7. Risques Qualité

Voir le registre dédié : `docs/PHASE5_RISK_REGISTER.md`.

---

**Ce plan minimal est une distillation du PHASE5_QA_PLAN-UPGRADE.md. Il est conçu pour être lu en 2-3 minutes par un nouvel acteur du projet.**
