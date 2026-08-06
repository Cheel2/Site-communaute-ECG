---
# Spécification Fonctionnelle — Site Web Ministère Pastoral
- **Date de création** : 2026-08-03
- **Source** : Phase 1 — spec-driven-development-v2 (Skill 3/5)
- **Version** : Corrigée (D-1 à D-11 appliquées)
- **Statut** : Validée par le client
---

## 1. User Stories

### Groupe A — Visiteurs du site public

| ID | User Story | Priorité |
|---|---|---|
| US-1 | En tant que visiteur, je veux consulter la page d'accueil avec la bannière modifiable et les contenus mis en avant afin de découvrir le ministère et ses actualités. | Haute |
| US-1b | En tant que visiteur, je veux accéder à un menu de navigation visible sur toutes les pages afin de naviguer facilement entre les sections du site. | Haute |
| US-2 | En tant que visiteur, je veux parcourir les rubriques de contenu (prédications, pensées du jour, encouragements, versets bibliques, articles, messages d'édification) afin de trouver les contenus qui m'intéressent. | Haute |
| US-3 | En tant que visiteur, je veux lire un contenu éditorial complet avec son titre, sa rubrique, son texte, son image et son compteur de vues afin de m'édifier. | Haute |
| US-4 | En tant que visiteur, je veux consulter la liste des livres du pasteur avec leur couverture, description et prix afin de découvrir ses ouvrages. | Haute |
| US-5 | En tant que visiteur, je veux être redirigé vers Amazon ou WhatsApp depuis la fiche d'un livre afin d'acheter l'ouvrage. | Haute |
| US-6 | En tant que visiteur, je veux consulter la liste des événements (récurrents hebdomadaires et spéciaux) afin de connaître les prochaines rencontres. | Haute |
| US-7 | En tant que visiteur, je veux m'inscrire à un événement via WhatsApp avec un message pré-rempli lorsque l'inscription est requise afin de réserver ma place. | Haute |
| US-8 | En tant que visiteur, je veux remplir un formulaire de partenariat financier (nom, email, pays) afin de devenir partenaire du ministère. | Haute |
| US-9 | En tant que visiteur, je veux être redirigé vers WhatsApp après avoir soumis le formulaire de partenariat afin de finaliser mon engagement. | Haute |
| US-10 | En tant que visiteur, je veux remplir un formulaire de contact général afin d'envoyer un message au ministère. | Haute |
| US-11 | En tant que visiteur, je veux consulter les mentions légales et la politique de confidentialité afin de connaître les conditions d'utilisation du site. | Haute |
| US-32 | En tant que visiteur, je veux être informé de l'utilisation des cookies techniques essentiels afin de respecter les obligations légales. | Moyenne |

### Groupe B — Administrateurs du back-office

| ID | User Story | Priorité |
|---|---|---|
| US-12 | En tant qu'administrateur, je veux m'authentifier avec mon email et mon mot de passe afin d'accéder au back-office. | Haute |
| US-13 | En tant qu'administrateur, je veux réinitialiser mon mot de passe via un lien envoyé par email afin de retrouver l'accès en cas d'oubli. | Haute |
| US-14 | En tant qu'administrateur avec accès total, je veux créer, lire, modifier et supprimer des rubriques de contenu afin d'organiser les publications. | Haute |
| US-15 | En tant qu'administrateur avec accès total, je veux créer, lire, modifier et supprimer des contenus éditoriaux (titre, rubrique, texte basique, image) afin de publier des messages d'édification. | Haute |
| US-16 | En tant qu'administrateur avec accès total, je veux mettre en avant un contenu sur la page d'accueil afin de le rendre visible en priorité. | Haute |
| US-17 | En tant qu'administrateur avec accès total, je veux définir le statut d'un contenu (publié / non publié) afin de contrôler sa visibilité publique. | Haute |
| US-18 | En tant qu'administrateur avec accès total, je veux bénéficier d'une sauvegarde automatique en brouillon toutes les 30 secondes lors de la rédaction d'un contenu afin d'éviter la perte de données. | Haute |
| US-19 | En tant qu'administrateur avec accès total, je veux créer, lire, modifier et supprimer des livres (titre, description, prix, image, liens Amazon et WhatsApp) afin de gérer le catalogue. | Haute |
| US-20 | En tant qu'administrateur avec accès total, je veux créer, lire, modifier et supprimer des événements (titre, description, date, champ inscription requise) afin de gérer le calendrier. | Haute |
| US-21 | En tant qu'administrateur avec accès total, je veux modifier la bannière / hero section (grande image et message) afin de personnaliser l'accueil du site. | Haute |
| US-22 | En tant qu'administrateur avec accès total, je veux consulter la liste des partenaires financiers soumis via le formulaire afin de suivre les adhésions. | Haute |
| US-23 | En tant qu'administrateur avec accès total, je veux exporter la liste des partenaires au format CSV afin de l'exploiter hors du système. | Haute |
| US-24 | En tant qu'administrateur avec accès total, je veux consulter la liste des contacts soumis via le formulaire de contact afin de traiter les demandes. | Haute |
| US-25 | En tant qu'administrateur avec accès total, je veux exporter la liste des contacts au format CSV afin de l'exploiter hors du système. | Haute |
| US-26 | En tant qu'administrateur avec accès total, je veux consulter un tableau de bord statistique (visites site, vues contenus, clics WhatsApp, clics Amazon, formulaires partenariat, formulaires contact, top 5 contenus, top 5 livres, historique 30 jours) afin d'évaluer l'activité du site. | Haute |
| US-27 | En tant qu'administrateur avec accès total, je veux créer, lire, modifier et désactiver (soft-delete) des comptes utilisateurs back-office afin de gérer les accès. | Moyenne |
| US-28 | En tant qu'administrateur avec accès total, je veux configurer le numéro WhatsApp utilisé pour les redirections publiques afin de le modifier sans intervention technique. | Moyenne |
| US-29 | En tant qu'administrateur avec accès limité, je veux consulter en lecture seule l'ensemble des modules du back-office (contenus, livres, événements, bannière, partenaires, contacts, statistiques, utilisateurs, paramètres) afin d'accéder aux informations sans pouvoir les modifier. | Moyenne |
| US-30 | En tant qu'administrateur avec accès total, je veux déconnecter mon compte afin de sécuriser ma session. | Haute |
| US-31 | En tant qu'administrateur avec accès total, je veux définir le titre, la description et les mots-clés de chaque page publique afin d'optimiser le référencement naturel de base. | Moyenne |

## 2. Exigences Fonctionnelles

### Groupe A — Visiteurs du site public

| ID | Exigence | Vérification | Trace |
|---|---|---|---|
| FR-1.1 | Le système shall afficher la bannière / hero section avec une grande image et un message changeant en haut de la page d'accueil. | Visiter la page d'accueil et vérifier la présence de l'image et du texte. | US-1 |
| FR-1.2 | Le système shall afficher les contenus épinglés / mis en avant en dessous de la bannière sur la page d'accueil. | Vérifier que les contenus marqués "mis en avant" apparaissent sur l'accueil. | US-1 |
| FR-1.3 | Le système shall afficher un menu de navigation persistant sur toutes les pages publiques avec des liens vers l'accueil, les contenus, les livres, les événements, le partenariat et le contact. | Naviguer sur chaque page et vérifier la présence du menu. | US-1b |
| FR-2.1 | Le système shall afficher la liste des rubriques de contenu disponibles. | Naviguer vers la section contenus et vérifier la liste des rubriques. | US-2 |
| FR-2.2 | Le système shall permettre de filtrer les contenus par rubrique. | Sélectionner une rubrique et vérifier que seuls les contenus de cette rubrique s'affichent. | US-2 |
| FR-3.1 | Le système shall afficher le titre, la rubrique, le texte complet, l'image associée et le compteur de vues pour chaque contenu publié. | Ouvrir un contenu et vérifier l'affichage de tous ces éléments. | US-3 |
| FR-3.2 | Le système shall incrémenter le compteur de vues d'un contenu à chaque nouvelle session de visite, une session étant définie comme une fenêtre de 5 minutes d'inactivité sur le contenu. | Consulter un contenu et vérifier que le compteur augmente selon la règle de session. | US-3 |
| FR-4.1 | Le système shall afficher la liste des livres avec leur couverture, leur description et leur prix. | Consulter la page livres et vérifier la présence de ces éléments. | US-4 |
| FR-5.1 | Le système shall fournir un lien traçé vers la page Amazon de chaque livre. | Cliquer sur le lien Amazon et vérifier la redirection ainsi que l'enregistrement du clic. | US-5 |
| FR-5.2 | Le système shall fournir un lien traçé vers WhatsApp pour l'achat de chaque livre. | Cliquer sur le lien WhatsApp et vérifier la redirection ainsi que l'enregistrement du clic. | US-5 |
| FR-6.1 | Le système shall afficher la liste des événements avec leur titre, description et date. | Consulter la page événements et vérifier la liste. | US-6 |
| FR-6.2 | Le système shall distinguer visuellement les événements récurrents hebdomadaires des événements spéciaux. | Vérifier l'affichage différencié sur la page événements. | US-6 |
| FR-7.1 | Le système shall afficher un bouton "S'inscrire" sur les événements marqués "inscription requise". | Ouvrir un événement avec inscription requise et vérifier la présence du bouton. | US-7 |
| FR-7.2 | Le système shall rediriger vers WhatsApp avec un message pré-rempli lors du clic sur le bouton "S'inscrire". Le message pré-rempli doit contenir le template : "Bonjour, je souhaite m'inscrire à l'événement [TITRE] du [DATE]. Merci." | Cliquer sur le bouton et vérifier l'ouverture de WhatsApp avec le message pré-rempli. | US-7 |
| FR-8.1 | Le système shall afficher un formulaire de partenariat financier demandant le nom, l'email et le pays du visiteur. | Consulter le formulaire et vérifier la présence des 3 champs. | US-8 |
| FR-8.2 | Le système shall valider que l'email fourni dans le formulaire de partenariat est au format valide. | Soumettre un email invalide et vérifier le message d'erreur. | US-8 |
| FR-8.3 | Le système shall enregistrer les données du formulaire de partenariat en base de données. Le système shall accepter les soumissions multiples avec le même email sans rejeter les doublons. | Soumettre le formulaire et vérifier l'enregistrement dans le back-office. | US-8 |
| FR-9.1 | Le système shall rediriger le visiteur vers WhatsApp après la soumission réussie du formulaire de partenariat. | Soumettre le formulaire et vérifier la redirection. | US-9 |
| FR-10.1 | Le système shall afficher un formulaire de contact général avec les champs nom, email et message. | Consulter le formulaire et vérifier la présence des champs nom, email et message. | US-10 |
| FR-10.2 | Le système shall enregistrer les données du formulaire de contact en base de données. Le système shall accepter les soumissions multiples avec le même email sans rejeter les doublons. | Soumettre le formulaire et vérifier l'enregistrement dans le back-office. | US-10 |
| FR-11.1 | Le système shall afficher une page de mentions légales accessible depuis le pied de page. | Cliquer sur le lien mentions légales et vérifier l'affichage de la page. | US-11 |
| FR-11.2 | Le système shall afficher une page de politique de confidentialité accessible depuis le pied de page. | Cliquer sur le lien politique de confidentialité et vérifier l'affichage de la page. | US-11 |
| FR-32.1 | Le système shall afficher un bandeau d'information sur l'utilisation des cookies techniques essentiels lors de la première visite. | Ouvrir le site en navigation privée et vérifier l'affichage du bandeau. | US-32 |
| FR-32.2 | Le système shall permettre au visiteur de fermer le bandeau d'information cookies. | Cliquer sur le bouton de fermeture et vérifier la disparition du bandeau. | US-32 |

### Groupe B — Administrateurs du back-office

| ID | Exigence | Vérification | Trace |
|---|---|---|---|
| FR-12.1 | Le système shall permettre à un utilisateur de s'authentifier avec son email et son mot de passe. | Saisir des identifiants valides et vérifier l'accès au back-office. | US-12 |
| FR-12.2 | Le système shall refuser l'accès au back-office si les identifiants sont invalides. | Saisir des identifiants invalides et vérifier le refus d'accès. | US-12 |
| FR-12.3 | Le système shall restreindre l'accès au back-office aux utilisateurs authentifiés uniquement. | Tenter d'accéder au back-office sans authentification et vérifier la redirection vers la page de connexion. | US-12 |
| FR-13.1 | Le système shall permettre à un utilisateur de demander la réinitialisation de son mot de passe via son email. | Cliquer sur "mot de passe oublié", saisir un email valide et vérifier l'envoi d'un lien. | US-13 |
| FR-13.2 | Le système shall permettre à un utilisateur de définir un nouveau mot de passe via le lien de réinitialisation reçu par email. | Cliquer sur le lien reçu, saisir un nouveau mot de passe et vérifier la connexion avec celui-ci. | US-13 |
| FR-14.1 | Le système shall permettre à un administrateur avec accès total de créer une rubrique de contenu avec un nom unique. | Créer une rubrique et vérifier son apparition dans la liste. | US-14 |
| FR-14.2 | Le système shall permettre à un administrateur avec accès total de modifier le nom d'une rubrique existante. | Modifier une rubrique et vérifier la mise à jour. | US-14 |
| FR-14.3 | Le système shall permettre à un administrateur avec accès total de supprimer une rubrique existante. | Supprimer une rubrique et vérifier sa disparition. | US-14 |
| FR-14.4 | Le système shall empêcher la suppression d'une rubrique si des contenus y sont encore associés. Le système shall afficher un message d'erreur explicite indiquant que des contenus sont encore associés à cette rubrique et empêcher la suppression sans affecter les contenus existants. | Tenter de supprimer une rubrique liée à un contenu et vérifier le refus avec message explicite. | US-14 |
| FR-15.1 | Le système shall permettre à un administrateur avec accès total de créer un contenu éditorial avec un titre, une rubrique, un texte basique et une image optionnelle. | Créer un contenu et vérifier son enregistrement. | US-15 |
| FR-15.2 | Le système shall permettre à un administrateur avec accès total de modifier un contenu existant. | Modifier un contenu et vérifier la mise à jour. | US-15 |
| FR-15.3 | Le système shall permettre à un administrateur avec accès total de supprimer un contenu existant. | Supprimer un contenu et vérifier sa disparition. | US-15 |
| FR-15.4 | Le système shall fournir un éditeur de texte basique compatible mobile offrant les fonctionnalités suivantes : gras, italique, listes à puces, liens hypertextes, titres de niveau 2 et 3, et retours à la ligne. | Ouvrir l'éditeur sur mobile et vérifier la saisie de texte avec les fonctionnalités listées. | US-15 |
| FR-16.1 | Le système shall permettre à un administrateur avec accès total de marquer un contenu comme "mis en avant". | Cocher l'option "mettre en avant" et vérifier l'affichage sur l'accueil. | US-16 |
| FR-16.2 | Le système shall limiter le nombre de contenus mis en avant simultanément à un maximum de 3, par date de mise en avant (le contenu dont la date de mise en avant est la plus ancienne est automatiquement retiré de la mise en avant). | Tenter de mettre en avant un 4ème contenu et vérifier que le contenu le plus anciennement mis en avant est retiré de la mise en avant. | US-16 |
| FR-17.1 | Le système shall permettre à un administrateur avec accès total de définir le statut d'un contenu comme "publié" ou "non publié". | Changer le statut et vérifier la visibilité publique correspondante. | US-17 |
| FR-17.2 | Le système shall afficher uniquement les contenus au statut "publié" sur le site public. | Consulter le site public et vérifier l'absence des contenus "non publiés". | US-17 |
| FR-18.1 | Le système shall sauvegarder automatiquement le contenu en cours de rédaction toutes les 30 secondes en tant que brouillon. Le système shall restaurer automatiquement le dernier brouillon sauvegardé à l'ouverture de l'éditeur pour un contenu en cours de rédaction. | Rédiger un contenu, attendre 30 secondes sans sauvegarder, recharger la page et vérifier la restauration du brouillon. | US-18 |
| FR-19.1 | Le système shall permettre à un administrateur avec accès total de créer un livre avec un titre, une description, un prix, une image de couverture, un lien Amazon et un lien WhatsApp. | Créer un livre et vérifier son enregistrement. | US-19 |
| FR-19.2 | Le système shall permettre à un administrateur avec accès total de modifier un livre existant. | Modifier un livre et vérifier la mise à jour. | US-19 |
| FR-19.3 | Le système shall permettre à un administrateur avec accès total de supprimer un livre existant. | Supprimer un livre et vérifier sa disparition. | US-19 |
| FR-19.4 | Le système shall compresser et redimensionner automatiquement les images de couverture uploadées. Les images doivent être redimensionnées à une largeur maximale de 1200 pixels (ratio conservé), converties en format WebP ou JPG optimisé, et ne pas dépasser 500 Ko après traitement. | Uploader une image de grande taille et vérifier sa compression et son redimensionnement. | US-19 |
| FR-20.1 | Le système shall permettre à un administrateur avec accès total de créer un événement avec un titre, une description, une date et un champ "inscription requise" (booléen). | Créer un événement et vérifier son enregistrement. | US-20 |
| FR-20.2 | Le système shall permettre à un administrateur avec accès total de modifier un événement existant. | Modifier un événement et vérifier la mise à jour. | US-20 |
| FR-20.3 | Le système shall permettre à un administrateur avec accès total de supprimer un événement existant. | Supprimer un événement et vérifier sa disparition. | US-20 |
| FR-21.1 | Le système shall permettre à un administrateur avec accès total de modifier l'image et le message de la bannière / hero section. | Changer l'image et le message et vérifier la mise à jour sur le site public. | US-21 |
| FR-22.1 | Le système shall afficher la liste des partenaires financiers avec leur nom, email, pays et date de soumission. | Consulter la section partenaires et vérifier la liste. | US-22 |
| FR-22.2 | Le système shall permettre à un administrateur avec accès total de consulter le détail d'un partenaire. | Cliquer sur un partenaire et vérifier l'affichage du détail. | US-22 |
| FR-23.1 | Le système shall permettre à un administrateur avec accès total d'exporter la liste des partenaires au format CSV. | Cliquer sur "Exporter CSV" et vérifier le téléchargement du fichier. | US-23 |
| FR-23.2 | Le système shall générer les fichiers CSV d'export au format point-virgule avec encodage UTF-8 BOM pour compatibilité avec les logiciels de tableur francophones. | Ouvrir le fichier CSV dans Excel et vérifier l'affichage correct des caractères et la séparation des colonnes. | US-23 |
| FR-24.1 | Le système shall afficher la liste des contacts avec leurs informations et leur date de soumission. | Consulter la section contacts et vérifier la liste. | US-24 |
| FR-24.2 | Le système shall permettre à un administrateur avec accès total de consulter le détail d'un contact. | Cliquer sur un contact et vérifier l'affichage du détail. | US-24 |
| FR-25.1 | Le système shall permettre à un administrateur avec accès total d'exporter la liste des contacts au format CSV. | Cliquer sur "Exporter CSV" et vérifier le téléchargement du fichier. | US-25 |
| FR-25.2 | Le système shall générer les fichiers CSV d'export au format point-virgule avec encodage UTF-8 BOM pour compatibilité avec les logiciels de tableur francophones. | Ouvrir le fichier CSV dans Excel et vérifier l'affichage correct des caractères et la séparation des colonnes. | US-25 |
| FR-26.1 | Le système shall afficher un tableau de bord avec les statistiques suivantes : nombre de visites du site, nombre de vues des contenus, nombre de clics sur les liens WhatsApp, nombre de clics sur les liens Amazon, nombre de formulaires de partenariat soumis, nombre de formulaires de contact soumis, top 5 des contenus les plus vus, top 5 des livres les plus cliqués, historique sur 30 jours. Le nombre de visites du site est défini comme une session unique, une session expirant après 30 minutes d'inactivité. | Consulter le tableau de bord et vérifier la présence de toutes ces métriques. | US-26 |
| FR-26.2 | Le système shall agréger et conserver les statistiques au-delà de 30 jours sans purge. | Vérifier que les données historiques restent accessibles. | US-26 |
| FR-27.1 | Le système shall permettre à un administrateur avec accès total de créer un compte utilisateur back-office avec un email et un mot de passe. | Créer un compte et vérifier que l'utilisateur peut se connecter. | US-27 |
| FR-27.2 | Le système shall permettre à un administrateur avec accès total de désactiver (soft-delete) un compte utilisateur sans le supprimer définitivement. Les contenus et actions créés par l'utilisateur désactivé restent attribués à son identité dans l'historique du back-office. | Désactiver un compte et vérifier que l'utilisateur ne peut plus se connecter tout en conservant les données. | US-27 |
| FR-27.3 | Le système shall permettre à un administrateur avec accès total de réactiver un compte désactivé. | Réactiver un compte et vérifier que l'utilisateur peut à nouveau se connecter. | US-27 |
| FR-28.1 | Le système shall permettre à un administrateur avec accès total de configurer le numéro WhatsApp utilisé pour les redirections publiques. | Modifier le numéro dans les paramètres et vérifier la mise à jour des liens publics. | US-28 |
| FR-29.1 | Le système shall permettre à un administrateur avec accès limité de consulter en lecture seule l'ensemble des modules du back-office (contenus, livres, événements, bannière, partenaires, contacts, statistiques, utilisateurs, paramètres). | Se connecter avec un compte "lecture seule" et vérifier l'accès sans possibilité de modification. | US-29 |
| FR-29.2 | Le système shall empêcher un administrateur avec accès limité de créer, modifier ou supprimer des données dans le back-office. | Tenter une action de modification avec un compte "lecture seule" et vérifier le refus. | US-29 |
| FR-30.1 | Le système shall permettre à tout utilisateur authentifié de se déconnecter du back-office. | Cliquer sur "Déconnexion" et vérifier la fin de session. | US-30 |
| FR-31.1 | Le système shall permettre à un administrateur avec accès total de définir un titre, une meta description et des mots-clés pour les pages statiques suivantes : accueil, liste des contenus, liste des livres, liste des événements, partenariat financier, contact, mentions légales, politique de confidentialité. Les pages dynamiques (fiche contenu, fiche livre, fiche événement) héritent de métadonnées par défaut générées à partir du titre et du texte du contenu. | Modifier ces champs et vérifier leur présence dans le code source de la page. | US-31 |

## 3. Exigences Non-Fonctionnelles (basiques)

| ID | NFR |
|---|---|
| NFR-1 | Performance — Le temps de chargement initial des pages publiques doit être optimisé pour une expérience fluide sur connexion mobile. |
| NFR-2 | Performance — Les images servies sur le site public doivent être optimisées pour réduire la taille de transfert. |
| NFR-3 | Sécurité — Les mots de passe des utilisateurs back-office doivent être stockés de manière sécurisée par hachage. |
| NFR-4 | Sécurité — L'accès au back-office doit être protégé par authentification et les sessions doivent expirer après une période d'inactivité. |
| NFR-5 | Sécurité — Les données personnelles collectées via les formulaires doivent être protégées conformément aux obligations légales. |
| NFR-6 | Disponibilité — Le site doit rester accessible en ligne de manière continue dans les limites des plans gratuits Vercel et Supabase. |
| NFR-7 | Usabilité — L'interface du back-office doit être utilisable sur mobile pour permettre la gestion à distance. |
| NFR-8 | Usabilité — L'éditeur de contenu doit être simple et utilisable sans formation technique. |
| NFR-9 | Maintenabilité — Le code source doit être versionné sur GitHub avec un historique clair des modifications. |
| NFR-10 | Compatibilité — Le site doit s'afficher correctement sur les navigateurs modernes et les appareils mobiles. |
| NFR-11 | Accessibilité — Le site public doit respecter les standards d'accessibilité de base pour permettre l'accès aux personnes en situation de handicap. |
| NFR-12 | Fiabilité — Les données soumises via les formulaires ne doivent pas être perdues en cas d'erreur réseau côté client. |

## 4. Data Requirements

- Rubrique : id, nom, ordre d'affichage, date de création, date de modification
- Contenu : id, titre, rubrique_id, texte, image_url, statut (publié / non publié), mis_en_avant (booléen), compteur_vues, date de création, date de modification, date de publication
- Livre : id, titre, description, prix, image_couverture_url, lien_amazon, lien_whatsapp, compteur_clics_amazon, compteur_clics_whatsapp, date de création, date de modification
- Événement : id, titre, description, date, inscription_requise (booléen), date de création, date de modification
- Bannière : id, image_url, message, date de modification
- Partenaire : id, nom, email, pays, date_soumission, statut
- Contact : id, nom, email, message, date_soumission
- Utilisateur : id, email, mot_de_passe_hash, rôle (total / lecture_seule), statut (actif / désactivé), date de création, date de modification
- Paramètre : id, clé, valeur (ex: numero_whatsapp)
- Statistique : id, type (visite, vue_contenu, clic_whatsapp, clic_amazon, formulaire_partenariat, formulaire_contact), valeur, date
- Brouillon : id, contenu_id (nullable), titre, rubrique_id, texte, image_url, date de dernière sauvegarde
- Page_SEO : id, chemin, titre, meta_description, mots_cles, date de modification

## 5. Contraintes

- C-1 : Aucun système de paiement, de panier ou d'e-commerce ne doit être intégré au site.
- C-2 : Aucune vidéo ni audio ne doit être hébergée sur la plateforme ; seules les images sont autorisées.
- C-3 : L'authentification back-office est exclusivement par email et mot de passe ; aucune inscription publique n'est permise.
- C-4 : Les comptes utilisateurs back-office sont créés manuellement par un administrateur avec accès total.
- C-5 : Le site est hébergé sur Vercel (plan gratuit) et les données sur Supabase (plan gratuit).
- C-6 : Le code source est versionné intégralement sur GitHub.
- C-7 : Aucun SEO payant ni publicité n'est prévu ; la source de trafic principale est les réseaux sociaux.
- C-8 : Les redirections de paiement et de partenariat se font exclusivement vers des plateformes externes (Amazon, WhatsApp).
- C-9 : Le site est développé en français pour un public francophone (Gabon et France).
- C-10 : Les exports CSV doivent être compatibles avec les logiciels de tableur francophones.
- C-11 : Le back-office est accessible via une route dédiée protégée par authentification.
- C-12 : Les contenus sont publiés immédiatement sans workflow de validation intermédiaire.
- C-13 : Les statistiques sont conservées indéfiniment sans purge.
- C-14 : Le bandeau cookies ne concerne que les cookies techniques essentiels ; aucun cookie de tracking tiers n'est autorisé.

## 6. Critères de Succès

- SC-1 : Le site public est accessible et fonctionnel sur mobile, tablette et desktop.
- SC-2 : Le pasteur et son assistante peuvent créer, modifier, publier et dépublier des contenus éditoriaux via le back-office.
- SC-3 : Les visiteurs peuvent consulter les contenus publiés, les livres, les événements, et accéder aux formulaires de partenariat et de contact.
- SC-4 : Les formulaires de partenariat et de contact sont soumis et enregistrés correctement avec tracking.
- SC-5 : Les liens de redirection vers Amazon et WhatsApp fonctionnent et sont tracés.
- SC-6 : Le tableau de bord statistique affiche les métriques clés demandées (visites, vues, clics, formulaires, top 5, historique 30 jours).
- SC-7 : Les exports CSV des partenaires et des contacts sont générés au format point-virgule UTF-8 BOM et téléchargeables.
- SC-8 : Le back-office permet la gestion des rôles (total vs lecture seule) et le soft-delete des comptes.
- SC-9 : Le numéro WhatsApp de redirection est configurable sans modification du code source.
- SC-10 : Les mentions légales et la politique de confidentialité sont accessibles depuis le site public.
- SC-11 : Le bandeau d'information cookies s'affiche lors de la première visite et peut être fermé.
- SC-12 : Les images uploadées sont automatiquement compressées et redimensionnées.
