# Décisions d'Allègement — Phase 5
# Projet : Site Web Ministère Pastoral
# Date : 2026-08-20
# Référence : Galin Ch. 4.7, PHASE5_QA_PLAN.md, Master Document §2

## Contexte
- Taille équipe : 1-2 personnes (pasteur + assistante) + IA orchestrateur
- Développeurs : < 20 (Galin 4.7 : "Petite Organisation")
- Budget : zéro (Vercel free + Supabase free)
- Certification exigée : aucune
- Client externe : aucun (projet interne)
- Maturité qualité actuelle : définie (processus documentés, tests automatisés)

## Décisions par skill processus

### quality-roles (Doc-1 → quality-roles)
- **Décision :** ALLÉGÉ
- **Justification :** Équipe < 20 développeurs. Pasteur = Executive in Charge of SQA (Galin 25.1, combinaison de rôles acceptable). Orchestrateur IA (GLM) = SQA Manager combiné (planning + coordination). Pas de SQA Unit dédiée (1 personne à temps partiel max). Pas de SQA Trustee (pas de pairs à nommer). Pas de SQA Committee ni Forum (pas de transversalité inter-département). Conforme à la grille Galin 4.7 "Petite Organisation".
- **Responsable qualité :** GLM (orchestrateur) + Kimi K3 (auditeur) + DeepSeek (correcteur)

### quality-standards (Doc-1 → quality-standards)
- **Décision :** EXCLU
- **Justification :** ISO 9000-3 certification hors périmètre. Budget zéro ne permet pas d'audit externe. Aucune exigence contractuelle client ne demande de certification. Les standards OWASP (sécurité) et les seuils NFR du Master Document sont appliqués directement via les QMC de sécurité et performance, sans référentiel formel.
- **Standards appliqués directement :** OWASP Top 10 (via QMC-2/3), IEEE 1028 (via revue formelle QMC-10), NFR Planguage (via QMC-4/9)

### quality-planning (Doc-1 → quality-planning)
- **Décision :** APPLICABLE (allégé)
- **Justification :** Le PHASE5_QA_PLAN.md constitue le plan qualité minimal. Il définit les objectifs (critères d'arrêt quantifiés), le périmètre (12 QMC), la logistique et les dépendances. Allégements : pas de procédures formelles, pas de revues de management programmées, pas de budget qualité chiffré, pas de planning Gantt SQA.
- **Livrable plan qualité :** PHASE5_QA_PLAN.md (ce document)

### risk-management-quality (Doc-1 → risk-management-quality)
- **Décision :** ALLÉGÉ
- **Justification :** Pas de processus formel d'identification/évaluation/atténuation quantifiée (pas de matrice probabilité/impact, pas de RMAs planifiées). Le registre des risques = les 7 zones fragiles identifiées dans le Master Document (Section 7) + les findings sécurité/performance des QMC. Pas de Risk Manager dédié.
- **Registre risques :** Master Document §7 (middleware/auth, tracking, CI skippés, RLS, FR-16, performance mobile, cohérence compteurs)

### quality-documentation (Doc-4 → quality-documentation)
- **Décision :** ALLÉGÉ
- **Justification :** Pas de documentation contrôlée ISO (numérotation, approbation formelle, rétention). Le FINDINGS_REGISTER et les rapports de QMC constituent la documentation qualité suffisante. Pas de templates formels, pas d'audit documentaire, pas de journal qualité séparé.
- **Documents qualité :** FINDINGS_REGISTER.md, PHASE5_BASELINE_METRICS.md, rapports par QMC

### quality-improvement (Doc-4 → quality-improvement)
- **Décision :** ALLÉGÉ
- **Justification :** Pas de CAB (Corrective Action Board). Pas de budget qualité à calculer (Galin Ch. 22). Pas de ROI qualité mesuré. Les leçons apprises sont documentées dans le FINDINGS_REGISTER et dans `docs/PHASE5_LECONS_APPRISES.md` (QMC-11). Les actions correctives = les QMC-B du TEMPS B. Pas de processus CAPA formel.
- **Amélioration continue :** PDCA implicite (Plan=PHASE5_QA_PLAN, Do=QMC-B, Check=contre-review Kimi, Act=Chronicle)

## Validation
- [x] Cohérente avec la taille de l'organisation (< 20 devs)
- [x] Cohérente avec le budget zéro
- [x] Cohérente avec l'absence de certification requise
- [x] Conforme à Galin Ch. 4.7 (Petite Organisation = combinaison de rôles obligatoire)
