# Registre des Risques Qualité — Phase 5
# Projet : Site Web Ministère Pastoral
# Créé : QMC-1 | Dernière MAJ : QMC-11

## Méthodologie

Risques extraits de :
- `MASTER-PHASE-3-4.md` Section 7 (Risques résiduels & zones fragiles)
- `MASTER-PHASE-1-2 enrichi (1).md` Section 8 (Performance Budgets) et Section 9 (Threat Model STRIDE)
- `FINDINGS_REGISTER.md` (F-001 à F-005)
- Analyse transversale des 12 QMC

Probabilité/Impact adaptés au contexte : équipe 1-2 personnes, budget zéro, trafic modéré, public francophone 3G/4G, infrastructure gratuite.

## Risques identifiés

| ID | Risque | Source | Probabilité | Impact | Mitigation existante | Statut | QMC de suivi |
|:---|:---|:---|:---|:---|:---|:---|:---|
| R-001 | Boucle de redirection / régression de la protection admin — zone la plus itérée du projet | Master Phase 3-4 §7 — "~50 cycles de debug, 12+ fichiers modifiés en TMC-18" | H | H | ~50 itérations déjà résolues en Phase 4. La zone est documentée comme fragile. QMC-5 audite spécifiquement. | OUVERT | QMC-5, QMC-10 |
| R-002 | Compteurs de tracking gonflables (vues/clics) — anti-spam client-side par design | Master Phase 3-4 §7 — "VIGILANCE MC-14 et MC-15 ; validation UUID absente sur tracking livres (B-52)" | M | M | B-52 documenté (validation UUID à ajouter). QMC-3 audite le service_role et les RPC. | OUVERT | QMC-3 |
| R-003 | Régression silencieuse dans les zones non couvertes par les tests CI (19 tests skippés unit/integ + 1 E2E) | Master Phase 3-4 §7 — "TMC-22 (5 skippés documentés) + Résumé §2 (19+1 dénombrés)" | M | M | Tests skippés répertoriés (B-80 à B-84). QMC-9 mesurera l'impact sur la couverture. | OUVERT | QMC-9, QMC-11 |
| R-004 | Politiques RLS récursives ou manquantes — historique de récursion infinie sur utilisateur/contenu | Master Phase 3-4 §7 — "TMC-18 (récursion résolue en SQL Editor) ; [NON VÉRIFIÉ] MC-10/11" | M | H | Politiques recréées à la main hors Git en TMC-18. QMC-3 audite toutes les politiques RLS. | OUVERT | QMC-3 |
| R-005 | [FR-16] Max 3 mis_en_avant jamais prouvé en unitaire ; création contenu non couverte en CI E2E | Master Phase 3-4 §7 — "TMC-3 (⚠️ à couvrir en E2E) ; TMC-23 (skip TipTap)" | M | M | B-86 documenté. QMC-6 audite les actions contenus ; QMC-10 audite la conformité architecturale. | OUVERT | QMC-6, QMC-10 |
| R-006 | Performance perçue mobile — FCP accueil 5136ms > seuil Must 5.0s ; jamais mesuré sur appareil réel | Master Phase 3-4 §7 — "TMC-21 + CONTRADICTION Section 5" | M | M | Contradiction FCP documentée. QMC-4 produira des mesures et une recommandation humaine. | OUVERT | QMC-4 |
| R-007 | Cohérence compteurs/statistiques — RPC peut échouer après insert, divergence non transactionnelle | Master Phase 3-4 §7 — "Backlog MC-14 #4 (B-46)" | L | M | B-46 documenté. QMC-3 audite la transactionnalité des RPC de tracking. | OUVERT | QMC-3 |
| R-008 | Dates événements — `Date.parse()` permissif, validation croisée `date_fin >= date_debut` absente de Zod | Master Phase 3-4 §7 — "Écarts documentés TMC-5" | L | M | Écart documenté TMC-5. QMC-6 audite les schémas événements. | OUVERT | QMC-6 |
| R-009 | XSS via injection dans formulaires publics ou éditeur TipTap | Master Phase 1-2 §9 — Threat Model : XSS | L | H | React escaping natif, sanitisation TipTap, validation Zod. QMC-3 audite les entrées. | ATTÉNUÉ | QMC-3 |
| R-010 | CSRF sur Server Actions | Master Phase 1-2 §9 — Threat Model : CSRF | L | M | SameSite cookies, origin validation Next.js. QMC-3 audite. | ATTÉNUÉ | QMC-3 |
| R-011 | SQL Injection via requêtes Supabase mal formées | Master Phase 1-2 §9 — Threat Model : SQL Injection | L | H | Requêtes paramétrées Supabase SDK (jamais de string concat). QMC-3 audite. | ATTÉNUÉ | QMC-3 |
| R-012 | Brute force sur `/admin/login` | Master Phase 1-2 §9 — Threat Model : Brute force auth | L | H | Rate limiting applicatif (pas de rate limiting agressif — plan free). QMC-2 audite. | ATTÉNUÉ | QMC-2 |
| R-013 | Exposition de la clé service_role côté client | Master Phase 1-2 §9 — Threat Model : Exposition service_role | L | H | Server Actions uniquement, jamais import côté client. QMC-3 audite. | ATTÉNUÉ | QMC-3 |
| R-014 | Session hijacking via vol du cookie JWT | Master Phase 1-2 §9 — Threat Model : Session hijacking | L | H | Session 30 min, HTTPS obligatoire, HttpOnly. QMC-2 audite. | ATTÉNUÉ | QMC-2 |
| R-015 | RLS bypass par oubli de policy sur nouvelle table | Master Phase 1-2 §9 — Threat Model : RLS bypass | M | H | Checklist pré-tâche CONTEXT.md. QMC-3 audite toutes les politiques RLS. | OUVERT | QMC-3 |
| R-016 | Dépassement du budget bande passante Vercel (100 Go/mois) | Master Phase 1-2 §8 — "Vercel free 100 Go/mois" | L | M | Images ≤ 200 Ko, SSG cache. QMC-4 audite les images et le bundle. | OUVERT | QMC-4 |
| R-017 | Dépassement du stockage Supabase (500 Mo) | Master Phase 1-2 §8 — "Supabase free 500 Mo" | L | M | Compression images, pas de vidéo. QMC-4 audite les images. | OUVERT | QMC-4 |
| R-018 | Dépassement des 500K lignes DB (statistiques) | Master Phase 1-2 §8 — "Supabase free 500K lignes" | L | M | Archivage stats à 400K lignes planifié. QMC-3 audite les politiques RLS et les tables. | OUVERT | QMC-3 |
| R-019 | Dépassement des 60 connexions simultanées Supabase | Master Phase 1-2 §8 — "Supabase free 60 connexions" | L | L | Connection pooling natif, trafic modéré. QMC-9 mesurera. | ATTÉNUÉ | QMC-9 |
| R-020 | Non-conformité RGPD (pas de région UE, pas de portabilité automatisée) | Master Phase 1-2 §9 — Limites de la conformité RGPD | L | M | Consentement explicite, anonymisation des analytics, politique de confidentialité. QMC-3 audite les PII. | ATTÉNUÉ | QMC-3 |
| R-021 | FINDINGS F-001 à F-003 : environnement de développement fragile (bootstrap corrompu, scripts test manquants, .env.local absent) | FINDINGS_REGISTER F-001 à F-003 | L | M | F-001 à F-003 sont RÉSOLUS en QMC-0. Le risque est ATTÉNUÉ. | ATTÉNUÉ | QMC-0 |
| R-022 | F-004 : rapport de couverture reporté Phase 7 → découverte tardive d'un seuil non respecté | FINDINGS_REGISTER F-004 | M | M | F-004 REPORTÉ PHASE 7. Le rapport sera produit par CI (TMC-22). QMC-9 l'analysera. | OUVERT | QMC-9, QMC-11 |
| R-023 | F-005 : environnement local diffère de CI → 4 tests E2E skippés en local vs 1 en CI | FINDINGS_REGISTER F-005 | M | L | F-005 est RÉSOLU. Les tests skippés sont les mêmes qu'en Phase 4. Risque ATTÉNUÉ. | ATTÉNUÉ | QMC-0 |
| R-024 | F-004 prolongé : les métriques de couverture ne seront disponibles qu'en fin de TEMPS A → risque de découvrir un seuil non respecté trop tard | Analyse transversale des 12 QMC | M | H | Aucune mitigation spécifique. QMC-9 doit produire le rapport avant le verdict final. Le seuil est connu ; si non respecté, les corrections seront massives. | OUVERT | QMC-9 |
| R-025 | QMC-5 (zone la plus itérée) → risque de findings massifs et de régressions chaînées | Analyse transversale des 12 QMC | H | H | QMC-5 est placé en début de VAGUE A2 pour identifier les problèmes tôt. ~50 itérations historiques. Risque critique. | OUVERT | QMC-5 |
| R-026 | Scope creep des corrections TEMPS B — les findings MINEURS pourraient dériver vers des refactorings | Analyse transversale des 12 QMC | M | M | Règle du périmètre chirurgical : un fichier ou une fonction par QA-FIX. GLM valide chaque finding avant correction. | OUVERT | QMC-11 |
| R-027 | Fiabilité des mesures locales (Codespaces) vs CI (GitHub Actions) — contradiction FCP 5136ms vs 204ms | Analyse transversale des 12 QMC | M | M | La contradiction est documentée. QMC-4 recommande une décision humaine sur le seuil à retenir. | OUVERT | QMC-4 |
| R-028 | Dépassement du budget performance bundle (≤ 200KB gzip) | Master Phase 1-2 §8 — Performance Budgets | M | M | QMC-4 analyse le bundle. 6 chunks JS estimés ~300 Ko — dépassement potentiel à confirmer. | OUVERT | QMC-4 |

## Synthèse par statut

| Statut | Nombre | ID |
|:---|:---|:---|
| OUVERT | 16 | R-001, R-002, R-003, R-004, R-005, R-006, R-007, R-008, R-015, R-016, R-017, R-018, R-022, R-024, R-025, R-026, R-027, R-028 |
| ATTÉNUÉ | 10 | R-009, R-010, R-011, R-012, R-013, R-014, R-019, R-020, R-021, R-023 |

## Risques critiques (H/H)

| ID | Risque | QMC de suivi |
|:---|:---|:---|
| R-001 | Boucle de redirection / régression admin | QMC-5, QMC-10 |
| R-025 | QMC-5 findings massifs et régressions chaînées | QMC-5 |

---

**Ce registre sera mis à jour après chaque QMC. Les risques marqués OUVERT sont suivis dans les QMC indiqués.**
