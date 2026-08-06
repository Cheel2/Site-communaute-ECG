---
# Exigences Non-Fonctionnelles — Site Web Ministère Pastoral
- **Date de création** : 2026-08-03
- **Source** : Phase 1 — nfr-engineering-v2 (Skill 5/5)
- **Version** : Finale (18 NFR, 8 trade-offs documentés)
- **Statut** : Validé par le client
---

## 1. Identification des NFR

### Externes (visibles par l'utilisateur)

**Performance — Applicable**

- PERF-LOAD : Le temps de chargement initial des pages publiques doit être optimisé pour une expérience fluide sur connexion mobile.
- PERF-IMAGE : Les images servies sur le site public doivent être optimisées pour réduire la taille de transfert.
- PERF-CRUD : Le temps de réponse des actions CRUD dans le back-office doit être perceptiblement instantané.

**Disponibilité — Applicable**

- DISP-UPTIME : Le site doit rester accessible en ligne de manière continue dans les limites des plans gratuits Vercel et Supabase.
- DISP-RECOV : Le système doit récupérer les données de formulaire en cas d'interruption réseau côté client.

**Sécurité — Applicable**

- SEC-PWD : Les mots de passe des utilisateurs back-office doivent être stockés de manière sécurisée par hachage.
- SEC-SESSION : L'accès au back-office doit être protégé par authentification et les sessions doivent expirer après une période d'inactivité.
- SEC-DATA : Les données personnelles collectées via les formulaires doivent être protégées conformément aux obligations légales.
- SEC-ATTACK : Le système doit résister aux attaques web courantes (XSS, CSRF, injection SQL).

**Usabilité — Applicable**

- USA-MOBILE : L'interface du back-office doit être utilisable sur mobile pour permettre la gestion à distance.
- USA-EDITOR : L'éditeur de contenu doit être simple et utilisable sans formation technique.
- USA-ONBOARD : Le temps nécessaire pour publier un premier contenu depuis le back-office doit être minimal.

**Interopérabilité — Applicable**

- INTER-BROWSER : Le site doit s'afficher et fonctionner correctement sur les navigateurs modernes et les appareils mobiles.
- INTER-REDIR : Les redirections externes vers WhatsApp et Amazon doivent fonctionner de manière fiable sur toutes les plateformes.

### Internes (visibles par le développeur)

**Modifiabilité — Applicable**

- MOD-RUBRIC : L'ajout d'une nouvelle rubrique de contenu doit être réalisable sans modification du code source.
- MOD-WA : La modification du numéro WhatsApp de redirection doit être configurable depuis le back-office sans redéploiement.

**Portabilité — Non applicable**

- La couverture mobile est assurée par INTER-BROWSER et USA-MOBILE.

**Testabilité — Applicable**

- TEST-COVER : Chaque exigence fonctionnelle critique doit être vérifiable par un test documenté ou automatisé.

**Réutilisabilité — Non applicable**

- Ce projet est un MVP spécifique à un client unique ; la réutilisabilité des composants n'est pas un objectif de cette release.

**NFR éliminée (contrainte de process)**

- La NFR-9 originale ("Maintenabilité — versionné sur GitHub") est éliminée car elle est identique à la contrainte C-6. C'est une obligation de process, pas une exigence de qualité mesurable du produit.

---

## 2. Scénarios de Qualité

### PERF-LOAD
- **Source** : Un visiteur clique sur un lien Instagram depuis son smartphone.
- **Stimulus** : Requête de chargement de la page d'accueil du site.
- **Artifact** : Page publique d'accueil (frontend + assets).
- **Environment** : Normal (connexion mobile 3G/4G, trafic standard).
- **Response** : La page s'affiche avec le contenu visible et interactif.
- **Measure** : Le First Contentful Paint (FCP) ne dépasse pas 3.0 secondes sur connexion 3G simulée.

### PERF-IMAGE
- **Source** : Un visiteur ouvre une fiche de livre ou un contenu avec image.
- **Stimulus** : Chargement de l'image de couverture ou illustrative.
- **Artifact** : Image servie au visiteur.
- **Environment** : Normal (connexion mobile, forfait data limité).
- **Response** : L'image se charge sans délai perceptible et s'affiche en qualité adaptée.
- **Measure** : L'image affichée ne dépasse pas 200 Ko de transfert.

### SEC-PWD
- **Source** : Un administrateur crée un nouveau compte back-office.
- **Stimulus** : Soumission du formulaire de création avec mot de passe.
- **Artifact** : Base de données des utilisateurs (table `Utilisateur`).
- **Environment** : Normal.
- **Response** : Le mot de passe est immédiatement haché et stocké sans jamais transiter en clair.
- **Measure** : L'audit de sécurité confirme l'absence de stockage en clair et l'utilisation d'un algorithme de hachage adapté (bcrypt/argon2).

### SEC-SESSION
- **Source** : Un administrateur laisse son navigateur ouvert sans activité.
- **Stimulus** : Période d'inactivité prolongée.
- **Artifact** : Session d'authentification back-office.
- **Environment** : Normal.
- **Response** : La session est automatiquement invalidée et l'utilisateur est déconnecté.
- **Measure** : La session expire après 30 minutes d'inactivité ; toute requête post-expiration retourne 401.

### SEC-DATA
- **Source** : Un visiteur soumet le formulaire de partenariat.
- **Stimulus** : Transmission des données personnelles (nom, email, pays).
- **Artifact** : Données du formulaire en transit et au repos.
- **Environment** : Normal.
- **Response** : Les données sont transmises via HTTPS chiffré et stockées sans partage avec des tiers.
- **Measure** : Inspection des headers confirme HTTPS + HSTS ; aucune donnée n'est transmise à un domaine externe autre que Supabase.

### SEC-ATTACK
- **Source** : Un attaquant tente d'injecter du code malveillant.
- **Stimulus** : Injection de script XSS dans un champ de formulaire ou paramètre d'URL.
- **Artifact** : Formulaire de contact ou champ de recherche.
- **Environment** : Normal (attaque active).
- **Response** : Le système neutralise l'entrée malveillante et n'exécute pas le code injecté.
- **Measure** : L'audit de sécurité confirme que le code injecté est échappé/sanitisé et que l'attaque XSS ne se propage pas.

### DISP-UPTIME
- **Source** : Un visiteur ou un administrateur accède au site.
- **Stimulus** : Requête HTTP vers le site ou le back-office.
- **Artifact** : Ensemble de l'application déployée.
- **Environment** : Normal (pas de maintenance planifiée).
- **Response** : Le site répond et affiche le contenu demandé.
- **Measure** : Le taux de disponibilité est ≥ 99.5% sur une fenêtre de 30 jours.

### USA-MOBILE
- **Source** : Le pasteur ou son assistante, connectés depuis leur smartphone.
- **Stimulus** : Nécessité de publier un contenu ou de modifier un livre en déplacement.
- **Artifact** : Interface du back-office.
- **Environment** : Normal (écran tactile, connexion mobile).
- **Response** : L'interface s'adapte à l'écran, les boutons sont cliquables, les formulaires sont saisissables.
- **Measure** : 100% des tâches CRUD sont réalisables sur un smartphone de 375px de large sans zoom manuel.

### DISP-RECOV
- **Source** : Un visiteur remplit le formulaire de contact sur mobile.
- **Stimulus** : Coupure réseau (passage en mode avion, perte de signal) avant la soumission.
- **Artifact** : Données saisies dans le formulaire de contact.
- **Environment** : Défaillance (réseau indisponible).
- **Response** : Les données saisies sont conservées localement et restituées à la reconnexion.
- **Measure** : 100% des champs saisis sont récupérables après rétablissement de la connexion, sans perte de données.

---

## 3. Quantification Planguage

### PERF-LOAD
- **Tag** : PERF-LOAD
- **Scale** : Secondes (First Contentful Paint)
- **Meter** : Lighthouse Performance audit, mesure sur connexion 3G simulée (Chrome DevTools)
- **Must** : ≤ 5.0s
- **Plan** : ≤ 3.0s
- **Stretch** : ≤ 1.5s
- **Wish** : ≤ 1.0s sur 4G

### PERF-IMAGE
- **Tag** : PERF-IMAGE
- **Scale** : Kilooctets (Ko)
- **Meter** : Outils de développement réseau, taille de la réponse HTTP des requêtes d'image
- **Must** : ≤ 200 Ko par image affichée
- **Plan** : ≤ 100 Ko par image affichée
- **Stretch** : ≤ 50 Ko par image affichée
- **Wish** : ≤ 30 Ko avec WebP

### PERF-CRUD
- **Tag** : PERF-CRUD
- **Scale** : Secondes (temps entre action et confirmation visuelle)
- **Meter** : Chronométrage manuel sur l'interface back-office
- **Must** : ≤ 3.0s
- **Plan** : ≤ 1.5s
- **Stretch** : ≤ 0.8s
- **Wish** : ≤ 0.5s

### DISP-UPTIME
- **Tag** : DISP-UPTIME
- **Scale** : Pourcentage de temps de fonctionnement
- **Meter** : Uptime monitoring via Vercel dashboard + Supabase status page, fenêtre glissante 30 jours
- **Must** : ≥ 99.0%
- **Plan** : ≥ 99.5%
- **Stretch** : ≥ 99.9%
- **Wish** : 100%

### DISP-RECOV
- **Tag** : DISP-RECOV
- **Scale** : Taux de récupération des données (%)
- **Meter** : Simulation de coupure réseau pendant la saisie de formulaire, vérification de la restauration
- **Must** : 100% des champs saisis récupérables
- **Plan** : Sauvegarde locale automatique + restauration transparente
- **Stretch** : Synchronisation automatique à la reconnexion sans action utilisateur
- **Wish** : Mode offline complet avec file d'attente de soumission

### SEC-PWD
- **Tag** : SEC-PWD
- **Scale** : Méthode de hachage et coût algorithmique
- **Meter** : Audit de sécurité du code, inspection de la base de données
- **Must** : Hachage bcrypt ou équivalent, jamais stocké en clair
- **Plan** : Hachage bcrypt avec coût ≥ 10
- **Stretch** : bcrypt avec coût ≥ 12 (non atteignable avec Supabase Auth free, nécessite un service d'authentification externe)
- **Wish** : Authentification multi-facteurs (reporté)

### SEC-SESSION
- **Tag** : SEC-SESSION
- **Scale** : Minutes d'inactivité
- **Meter** : Inspection des cookies, test de déconnexion automatique
- **Must** : 30 minutes d'inactivité
- **Plan** : 15 minutes d'inactivité
- **Stretch** : 10 minutes + renouvellement automatique sécurisé
- **Wish** : Session contextuelle avec détection d'anomalie

### SEC-DATA
- **Tag** : SEC-DATA
- **Scale** : Niveau de conformité et headers de sécurité
- **Meter** : Audit des formulaires, inspection des headers HTTP, vérification HTTPS
- **Must** : HTTPS obligatoire, données minimisées, pas de partage tiers
- **Plan** : HTTPS + headers HSTS, CSP basique + politique de confidentialité
- **Stretch** : non atteignable avec Supabase free, nécessite un plan payant ou un service de chiffrement applicatif externe
- **Wish** : Conformité RGPD complète avec DPO

### SEC-ATTACK
- **Tag** : SEC-ATTACK
- **Scale** : Nombre de vulnérabilités critiques
- **Meter** : Audit manuel + outils automatisés (npm audit, OWASP ZAP)
- **Must** : Aucune vulnérabilité critique ; protection XSS/CSRF/SQLi de base
- **Plan** : Headers sécurisés, validation des entrées, requêtes paramétrées
- **Stretch** : Audit de sécurité externe
- **Wish** : Certification SOC 2

### USA-MOBILE
- **Tag** : USA-MOBILE
- **Scale** : Taux de réussite des tâches (%)
- **Meter** : Test utilisateur sur smartphone (iPhone + Android), observation des erreurs
- **Must** : 100% des tâches CRUD réalisables sur mobile sans aide externe
- **Plan** : Tâches CRUD réalisables en ≤ 3 taps depuis le tableau de bord
- **Stretch** : Interface adaptative avec gestes tactiles optimisés
- **Wish** : Application native équivalente

### USA-EDITOR
- **Tag** : USA-EDITOR
- **Scale** : Temps de création sans erreur (minutes)
- **Meter** : Test avec utilisateur non technique, chronométrage et comptage d'erreurs bloquantes
- **Must** : Création d'un contenu sans erreur bloquante en ≤ 10 minutes
- **Plan** : Création en ≤ 5 minutes avec l'éditeur basique
- **Stretch** : Création en ≤ 3 minutes avec prévisualisation en direct
- **Wish** : Éditeur WYSIWYG avancé

### USA-ONBOARD
- **Tag** : USA-ONBOARD
- **Scale** : Minutes entre première connexion et première publication
- **Meter** : Chronométrage de la première publication depuis la première connexion
- **Must** : Premier contenu publié en ≤ 30 minutes
- **Plan** : Premier contenu publié en ≤ 15 minutes
- **Stretch** : Premier contenu publié en ≤ 10 minutes
- **Wish** : Publication en ≤ 5 minutes avec template prédéfini

### INTER-BROWSER
- **Tag** : INTER-BROWSER
- **Scale** : Navigateurs et versions supportés
- **Meter** : Tests manuels sur Chrome, Firefox, Safari, Edge (dernières 2 versions)
- **Must** : Fonctionnel sur Chrome, Safari, Firefox dernière version
- **Plan** : Fonctionnel sur Chrome, Safari, Firefox, Edge dernière version
- **Stretch** : Fonctionnel sur les 2 dernières versions de chaque navigateur
- **Wish** : Compatibilité totale y compris navigateurs legacy

### INTER-REDIR
- **Tag** : INTER-REDIR
- **Scale** : Taux de succès des redirections (%)
- **Meter** : Clics sur les liens tracés, vérification de l'ouverture de l'application cible
- **Must** : 100% des liens WhatsApp et Amazon fonctionnent sur mobile et desktop
- **Plan** : Liens testés sur iOS Safari, Android Chrome, desktop Chrome
- **Stretch** : Deep linking optimisé avec fallback web
- **Wish** : Intégration API native

### MOD-RUBRIC
- **Tag** : MOD-RUBRIC
- **Scale** : Temps et nécessité de modifier le code
- **Meter** : Temps de développement pour ajouter une nouvelle rubrique
- **Must** : Ajout réalisable sans modification du code source (via back-office)
- **Plan** : Création en ≤ 2 minutes via l'interface back-office
- **Stretch** : Création en ≤ 1 minute avec ordonnancement drag-and-drop
- **Wish** : Système de tags dynamique sans rubriques fixes

### MOD-WA
- **Tag** : MOD-WA
- **Scale** : Minutes pour appliquer la modification
- **Meter** : Chronométrage du changement de numéro depuis le back-office
- **Must** : Modification en ≤ 5 minutes sans redéploiement
- **Plan** : Modification en ≤ 1 minute, prise en compte immédiate
- **Stretch** : Modification avec validation de format numéro international
- **Wish** : Multi-numéros avec routage géographique

### TEST-COVER
- **Tag** : TEST-COVER
- **Scale** : Pourcentage de couverture des FR
- **Meter** : Nombre de FR couvertes par un test documenté ou automatisé / nombre total de FR
- **Must** : 100% des FR de sécurité et d'authentification testées
- **Plan** : 80% des FR couvertes par des tests automatisés ou manuels documentés
- **Stretch** : 90% de couverture avec tests automatisés
- **Wish** : 100% couverture avec TDD et tests E2E

### ACC-WCAG
- **Tag** : ACC-WCAG
- **Scale** : Niveau de conformité WCAG 2.1
- **Meter** : Audit manuel avec checklist WCAG 2.1, tests lecteur d'écran
- **Must** : Respect des critères WCAG 2.1 niveau A (contraste, alternatives textuelles, navigation clavier)
- **Plan** : Niveau A sur toutes les pages publiques
- **Stretch** : Niveau AA sur les pages publiques critiques
- **Wish** : Niveau AAA + certification accessibilité

---

## 4. Analyse des Trade-offs

| Conflit | NFR impliquées | Décision | Impact architectural |
|---|---|---|---|
| 1 | PERF-IMAGE vs Qualité visuelle | Compression intelligente WebP/JPG 80-85 | Compression côté serveur paramétrable |
| 2 | SEC-SESSION vs USA-MOBILE | Must = 30 min | Session Supabase Auth standard |
| 3 | SEC-PWD vs PERF-CRUD | Coût bcrypt par défaut Supabase | Auth native sans override |
| 4 | TEST-COVER vs Développement | 80% Plan, 100% sécurité/auth | Tests auto auth/sécurité ; manuels CRUD |
| 5 | ACC-WCAG vs PERF-LOAD | Niveau A (HTML5 natif) | Pas de widgets ARIA complexes |
| 6 | DISP-RECOV vs Complexité | localStorage simple TTL 24h | Gestion cache formulaire côté client |
| 7 | DISP-UPTIME vs SEC-ATTACK | Pas de rate limiting agressif | Protection applicative uniquement |
| 8 | INTER-REDIR vs SEC-DATA | `noopener noreferrer` systématique | Liens externes sécurisés |

---

## 5. Priorisation Kano

| NFR | Kano | Importance | Effort | Score | Priorité |
|---|---|---|---|---|---|
| DISP-UPTIME | Basique | 5 | 1 | 25 | Élevée |
| SEC-PWD | Basique | 5 | 1 | 25 | Élevée |
| SEC-SESSION | Basique | 5 | 2 | 20 | Élevée |
| SEC-DATA | Basique | 5 | 2 | 20 | Élevée |
| SEC-ATTACK | Basique | 5 | 2 | 20 | Élevée |
| PERF-IMAGE | Performant | 4 | 2 | 16 | Élevée |
| PERF-CRUD | Performant | 4 | 2 | 16 | Élevée |
| INTER-REDIR | Performant | 4 | 2 | 16 | Élevée |
| PERF-LOAD | Performant | 5 | 3 | 15 | Élevée |
| MOD-WA | Performant | 3 | 1 | 15 | Élevée |
| INTER-BROWSER | Basique | 5 | 3 | 15 | Élevée |
| USA-MOBILE | Performant | 4 | 3 | 12 | Élevée |
| USA-EDITOR | Performant | 4 | 3 | 12 | Élevée |
| USA-ONBOARD | Performant | 3 | 2 | 12 | Élevée |
| MOD-RUBRIC | Performant | 3 | 2 | 12 | Élevée |
| ACC-WCAG | Performant | 3 | 3 | 9 | Moyenne |
| TEST-COVER | Performant | 4 | 4 | 8 | Moyenne |
| DISP-RECOV | Attractif | 3 | 4 | — | Moyenne |

*Score calculé uniquement pour les catégories Basique et Performant : Importance (1-5) × (6 - Effort 1-5).*

---

## 6. Traçabilité

| NFR | Trace |
|---|---|
| PERF-LOAD | US-1, US-1b, US-2, US-3, US-4, US-6, US-10 |
| PERF-IMAGE | US-3, US-4, US-21 |
| PERF-CRUD | US-14, US-15, US-16, US-17, US-18, US-19, US-20, US-21, US-22, US-23, US-24, US-25, US-26, US-27, US-28 |
| DISP-UPTIME | Toutes les US |
| DISP-RECOV | US-8, US-10 |
| SEC-PWD | US-12, US-13, US-27 |
| SEC-SESSION | US-12, US-30 |
| SEC-DATA | US-8, US-10, US-22, US-24 |
| SEC-ATTACK | US-8, US-10, US-12 |
| USA-MOBILE | US-14, US-15, US-16, US-17, US-18, US-19, US-20, US-21, US-22, US-23, US-24, US-25, US-26, US-27, US-28 |
| USA-EDITOR | US-15 |
| USA-ONBOARD | US-12, US-14, US-15 |
| INTER-BROWSER | US-1, US-1b, US-2, US-3, US-4, US-5, US-6, US-7, US-8, US-9, US-10, US-11 |
| INTER-REDIR | US-5, US-7, US-9 |
| MOD-RUBRIC | US-14 |
| MOD-WA | US-28 |
| TEST-COVER | Toutes les US (indirectement) |
| ACC-WCAG | US-1, US-1b, US-2, US-3, US-4, US-5, US-6, US-7, US-8, US-9, US-10, US-11 |
