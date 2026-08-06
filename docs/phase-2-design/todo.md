T-01 : Initialiser le projet Next.js 15 avec App Router, TypeScript et Tailwind CSS
Desc : Créer le projet Next.js 15 via create-next-app avec l'App Router, TypeScript et Tailwind CSS activés.
AC :
  - `npm run build` réussit sans erreur
  - La page d'accueil par défaut s'affiche sur localhost:3000
  - Les classes Tailwind CSS sont actives sur la page par défaut
Deps : Aucune
Files : package.json, next.config.ts, tailwind.config.ts, tsconfig.json

T-02 : Configurer les variables d'environnement Supabase
Desc : Créer le fichier .env.local avec les clés URL et anon key du projet Supabase et son template .env.local.example.
AC :
  - Le fichier .env.local existe à la racine with NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY
  - Le fichier .env.local.example existe sans les valeurs sensibles
  - Les variables sont accessibles dans le code Next.js
Deps : T-01
Files : .env.local, .env.local.example

T-03 : Installer les dépendances du projet
Desc : Installer zod, les packages TipTap et recharts via npm dans le projet Next.js.
AC :
  - zod, @tiptap/react, @tiptap/starter-kit, @tiptap/extension-link, @tiptap/extension-placeholder et recharts sont listés dans package.json
  - `npm run build` réussit après installation des nouvelles dépendances
  - Aucun conflit de version n'est signalé par npm
Deps : T-01
Files : package.json, package-lock.json

T-04 : Créer le fichier CONTEXT.md à la racine du projet
Desc : Rédiger le fichier CONTEXT.md complet avec toutes les sections du contexte architectural du projet.
AC :
  - Le fichier CONTEXT.md existe à la racine du projet
  - Il contient les sections Stack, Commandes, Structure, Conventions, Frontières, Patterns, Erreurs, Décisions, Compromis, Checklist et Pièges
  - Le fichier est versionné dans Git
Deps : T-01
Files : CONTEXT.md

T-05 : Créer le script SQL de création des 12 tables
Desc : Rédiger le script SQL CREATE TABLE pour les 12 tables avec contraintes, DEFAULT, NOT NULL, CHECK et foreign keys.
AC :
  - Le script contient 12 CREATE TABLE sans erreur de syntaxe
  - Toutes les contraintes (PK, FK, CHECK, UNIQUE, DEFAULT) sont présentes
  - Le script s'exécute sans erreur dans l'éditeur SQL Supabase
Deps : Aucune
Files : supabase/migrations/001_create_tables.sql

T-06 : Créer le script SQL des 13 indexes
Desc : Rédiger le script SQL CREATE INDEX pour les 11 indexes explicites et les 2 indexes manquants identifiés en Phase 2.
AC :
  - Le script contient 13 CREATE INDEX
  - Les 2 indexes manquants (idx_contenu_statut_date_publication, idx_statistique_date) sont inclus
  - Le script s'exécute sans erreur dans l'éditeur SQL Supabase
Deps : T-05
Files : supabase/migrations/002_create_indexes.sql

T-07 : Créer le script SQL des RLS policies
Desc : Rédiger le script SQL des politiques Row Level Security pour les 4 profils (anonyme, total, lecture_seule, service_role).
AC :
  - Le script contient ALTER TABLE ... ENABLE ROW LEVEL SECURITY pour chaque table concernée
  - Les policies pour chaque profil sont définies avec USING et WITH CHECK
  - Le profil service_role a BYPASS RLS sur la table statistique
Deps : T-05
Files : supabase/migrations/003_create_rls_policies.sql

T-08 : Créer le script SQL des données initiales
Desc : Rédiger le script SQL INSERT pour la bannière par défaut, les paramètres WhatsApp, et les 8 lignes page_seo pour les pages statiques.
AC :
  - Le script insère 1 ligne dans banniere avec un message par défaut
  - Le script insère le paramètre WhatsApp et les 8 lignes page_seo
  - Les données sont visibles dans le Table Editor Supabase après exécution
Deps : T-05
Files : supabase/migrations/004_seed_data.sql

T-09 : Configurer Supabase Auth et documenter la configuration
Desc : Activer l'authentification par email/password dans l'interface Supabase, régler la durée de session à 30 minutes et documenter les étapes.
AC :
  - L'authentification par email/password est activée dans Supabase Auth
  - La durée de session JWT est réglée à 1800 secondes (30 minutes)
  - La confirmation d'email est désactivée
Deps : Aucune
Files : docs/supabase-auth-setup.md

T-10 : Créer le middleware Next.js pour protection /admin
Desc : Implémenter le middleware Next.js qui redirige les non-authentifiés vers /admin/login et protège les routes /admin.
AC :
  - Un utilisateur non connecté accédant à /admin/* est redirigé vers /admin/login
  - Un utilisateur connecté avec JWT valide accède au back-office
  - Le middleware est exécuté sur toutes les routes /admin/*
Deps : T-11
Files : src/middleware.ts

T-11 : Créer les clients Supabase
Desc : Créer le fichier src/lib/supabase.ts avec les trois clients : browser, server et service_role.
AC :
  - Le fichier exporte createClientBrowser, createClientServer et createClientServiceRole
  - Chaque client utilise les bonnes clés d'environnement
  - Le client service_role n'est jamais importable côté client
Deps : T-02
Files : src/lib/supabase.ts

T-12 : Créer le type ApiError et ApiResponse
Desc : Créer le fichier src/types/api.ts avec les types TypeScript ApiError et ApiResponse.
AC :
  - Le fichier exporte ApiError et ApiResponse
  - ApiError contient code (string), message (string), details (optional unknown)
  - ApiResponse est une union discriminant sur data vs error
Deps : T-01
Files : src/types/api.ts

T-13 : Créer l'Edge Function compress-image
Desc : Créer la Edge Function Supabase qui compresse les images à max 1200px, 500 Ko, format webp/jpg.
AC :
  - La fonction est créée sous supabase/functions/compress-image/index.ts
  - Elle accepte une image multipart en entrée
  - Elle retourne une image compressée respectant les contraintes (≤ 500 Ko, ≤ 1200px)
Deps : Aucune
Files : supabase/functions/compress-image/index.ts

T-14 : Créer les schémas Zod du module auth
Desc : Définir loginSchema, resetPasswordSchema et newPasswordSchema dans features/auth/schema.ts.
AC :
  - Le fichier exporte trois schémas Zod valides
  - Chaque schéma valide les champs requis avec messages d'erreur en français
  - Les schémas sont importables depuis d'autres modules
Deps : T-12
Files : src/features/auth/schema.ts

T-15 : Créer les Server Actions du module auth
Desc : Implémenter les actions login, resetPassword, newPassword et logout dans features/auth/actions.ts.
AC :
  - L'action login retourne une session JWT valide en cas de succès
  - L'action resetPassword envoie un email via Supabase Auth
  - L'action logout supprime la session côté client et redirige vers /admin/login
  - Toutes les actions retournent ApiResponse et jamais void
Deps : T-14, T-11
Files : src/features/auth/actions.ts

T-16 : Créer la page de connexion back-office
Desc : Implémenter src/app/(admin)/login/page.tsx avec le formulaire de connexion.
AC :
  - La page affiche un formulaire avec email et mot de passe
  - La soumission appelle l'action login et redirige vers /admin/tableau-de-bord en cas de succès
  - Un lien "Mot de passe oublié" redirige vers la page de réinitialisation
Deps : T-15
Files : src/app/(admin)/login/page.tsx

T-17 : Créer la page de réinitialisation du mot de passe
Desc : Implémenter src/app/(admin)/mot-de-passe-reinitialiser/page.tsx avec le formulaire de nouveau mot de passe.
AC :
  - La page accepte un token dans l'URL et affiche le formulaire de nouveau mot de passe
  - La soumission appelle l'action newPassword et redirige vers /admin/login en cas de succès
  - Un message d'erreur s'affiche si le token est invalide ou expiré
Deps : T-15
Files : src/app/(admin)/mot-de-passe-reinitialiser/page.tsx

T-18 : Créer les schémas Zod du module rubriques
Desc : Définir createRubriqueSchema, updateRubriqueSchema et deleteRubriqueSchema dans features/rubriques/schema.ts.
AC :
  - Le fichier exporte trois schémas Zod valides
  - Le schéma de création exige un nom unique et un ordre d'affichage positif
  - Les messages d'erreur sont en français
Deps : T-12
Files : src/features/rubriques/schema.ts

T-19 : Créer les Server Actions du module rubriques
Desc : Implémenter les actions créer, modifier et supprimer une rubrique dans features/rubriques/actions.ts.
AC :
  - L'action de suppression vérifie si des contenus sont associés et retourne CONFLICT le cas échéant
  - L'action de création retourne CONFLICT si le nom existe déjà
  - Chaque action appelle revalidateTag('rubriques') et revalidateTag('contenus') après mutation
  - Toutes les actions retournent ApiResponse
Deps : T-18, T-11
Files : src/features/rubriques/actions.ts

T-20 : Créer les requêtes du module rubriques
Desc : Implémenter la requête de liste des rubriques dans features/rubriques/queries.ts.
AC :
  - La requête retourne toutes les rubriques triées par ordre_affichage
  - Le résultat est typé et filtré par RLS selon le rôle de l'utilisateur
Deps : T-11
Files : src/features/rubriques/queries.ts

T-21 : Créer la page liste des rubriques
Desc : Implémenter src/app/(admin)/rubriques/page.tsx affichant la liste et le formulaire de gestion.
AC :
  - La page affiche la liste des rubriques avec boutons modifier et supprimer
  - Le bouton supprimer est désactivé ou affiche une erreur si des contenus sont associés
  - Un bouton "Nouvelle rubrique" ouvre le formulaire de création
Deps : T-19, T-20, T-22
Files : src/app/(admin)/rubriques/page.tsx

T-22 : Créer le composant formulaire rubrique
Desc : Implémenter features/rubriques/components/RubriqueForm.tsx pour la création et la modification.
AC :
  - Le composant utilise React Hook Form avec zodResolver et le schéma Zod du module
  - Il affiche les champs nom et ordre d'affichage with validation en temps réel
  - Les messages d'erreur de validation s'affichent en français
Deps : T-18
Files : src/features/rubriques/components/RubriqueForm.tsx

T-23 : Créer les schémas Zod du module contenus
Desc : Définir les schémas de création, modification, suppression, toggle mise en avant et brouillon dans features/contenus/schema.ts.
AC :
  - Le fichier exporte six schémas Zod valides couvrant toutes les actions du module
  - Le schéma toggleMiseEnAvantSchema valide l'identifiant du contenu
  - Les messages d'erreur sont en français
Deps : T-12
Files : src/features/contenus/schema.ts

T-24 : Créer les Server Actions du module contenus
Desc : Implémenter les actions créer, modifier, supprimer, toggle mise en avant, auto-save brouillon et restore brouillon dans features/contenus/actions.ts.
AC :
  - L'action toggleMiseEnAvant limite à 3 contenus mis en avant et retire le plus ancien si nécessaire
  - L'action autoSaveBrouillon crée ou met à jour un brouillon toutes les 30 secondes
  - L'action restoreBrouillon retourne le dernier brouillon d'un contenu
  - L'action de suppression retourne { success: true } et appelle revalidateTag('contenus')
  - Toutes les actions retournent ApiResponse
Deps : T-23, T-11
Files : src/features/contenus/actions.ts

T-25 : Créer les requêtes du module contenus
Desc : Implémenter les requêtes de liste et de détail des contenus dans features/contenus/queries.ts.
AC :
  - La requête de liste retourne tous les contenus avec leur rubrique associée
  - La requête de détail retourne un contenu avec son brouillon s'il existe
Deps : T-11
Files : src/features/contenus/queries.ts

T-26 : Créer la page liste des contenus
Desc : Implémenter src/app/(admin)/contenus/page.tsx affichant la liste des contenus avec statut et mise en avant.
AC :
  - La page affiche la liste des contenus avec leur statut (publié/non publié) et indicateur mis en avant
  - Chaque ligne a des boutons modifier, supprimer et toggle mise en avant
  - Un bouton "Nouveau contenu" redirige vers la page de création
Deps : T-24, T-25
Files : src/app/(admin)/contenus/page.tsx

T-27 : Créer le composant éditeur TipTap
Desc : Implémenter features/contenus/components/RichTextEditor.tsx avec les extensions StarterKit, Link et Placeholder.
AC :
  - L'éditeur affiche une barre d'outils with gras, italique, listes, liens, titres H2/H3
  - Il fonctionne sur mobile 375px sans zoom
  - Il émet le contenu HTML ou JSON à chaque changement
Deps : T-03
Files : src/features/contenus/components/RichTextEditor.tsx

T-28 : Créer la page éditeur de contenu
Desc : Implémenter les pages src/app/(admin)/contenus/nouveau/page.tsx et [id]/modifier/page.tsx with auto-save et restore brouillon.
AC :
  - La page affiche le formulaire avec titre, rubrique, éditeur TipTap, image et statut
  - L'auto-save appelle l'action toutes les 30 secondes si le contenu a changé
  - À l'ouverture, si un brouillon existe, il est restauré dans l'éditeur
  - La soumission finale appelle l'action créer ou modifier
Deps : T-24, T-25, T-27
Files : src/app/(admin)/contenus/nouveau/page.tsx, src/app/(admin)/contenus/[id]/modifier/page.tsx

T-29 : Créer les schémas Zod du module livres
Desc : Définir createLivreSchema, updateLivreSchema et deleteLivreSchema dans features/livres/schema.ts.
AC :
  - Le fichier exporte trois schémas Zod valides
  - Le schéma de création valide le prix comme nombre positif et les liens comme URLs optionnelles
  - Les messages d'erreur sont en français
Deps : T-12
Files : src/features/livres/schema.ts

T-30 : Créer les Server Actions du module livres
Desc : Implémenter les actions créer, modifier et supprimer un livre dans features/livres/actions.ts.
AC :
  - L'action de création gère l'upload d'image via l'Edge Function compress-image avant l'insertion
  - L'action de modification gère le remplacement d'image si un nouveau fichier est fourni
  - Chaque action appelle revalidateTag('livres') après mutation
  - Toutes les actions retournent ApiResponse
Deps : T-29, T-11, T-13
Files : src/features/livres/actions.ts

T-31 : Créer les requêtes du module livres
Desc : Implémenter la requête de liste des livres dans features/livres/queries.ts.
AC :
  - La requête retourne tous les livres triés par date de création décroissante
  - Le résultat inclut les compteurs de clics Amazon et WhatsApp
Deps : T-11
Files : src/features/livres/queries.ts

T-32 : Créer la page liste des livres
Desc : Implémenter src/app/(admin)/livres/page.tsx affichant la liste des livres avec actions CRUD.
AC :
  - La page affiche la liste des livres avec couverture, titre, prix et compteurs de clics
  - Chaque ligne a des boutons modifier et supprimer
  - Un bouton "Nouveau livre" redirige vers le formulaire de création
Deps : T-30, T-31, T-33
Files : src/app/(admin)/livres/page.tsx

T-33 : Créer le composant formulaire livre
Desc : Implémenter features/livres/components/LivreForm.tsx pour la création et la modification avec upload d'image.
AC :
  - Le composant affiche les champs titre, description, prix, liens Amazon et WhatsApp
  - Il permet l'upload d'une image de couverture déclenchant l'Edge Function
  - Il utilise React Hook Form with zodResolver et affiche les erreurs en français
Deps : T-29
Files : src/features/livres/components/LivreForm.tsx

T-34 : Créer les schémas Zod du module événements
Desc : Définir createEvenementSchema, updateEvenementSchema et deleteEvenementSchema dans features/evenements/schema.ts.
AC :
  - Le fichier exporte trois schémas Zod valides
  - Le schéma valide la date au format ISO 8601 et le champ inscription_requise comme booléen
  - Les messages d'erreur sont en français
Deps : T-12
Files : src/features/evenements/schema.ts

T-35 : Créer les Server Actions du module événements
Desc : Implémenter les actions créer, modifier et supprimer un événement dans features/evenements/actions.ts.
AC :
  - L'action de création insère un événement avec titre, description, date, type et inscription_requise
  - Chaque action appelle revalidateTag('evenements') après mutation
  - Toutes les actions retournent ApiResponse
Deps : T-34, T-11
Files : src/features/evenements/actions.ts

T-36 : Créer les requêtes du module événements
Desc : Implémenter la requête de liste des événements dans features/evenements/queries.ts.
AC :
  - La requête retourne tous les événements triés par date décroissante avec le champ type
  - Le résultat inclut la distinction récurrent vs spécial
Deps : T-11
Files : src/features/evenements/queries.ts

T-37 : Créer la page liste des événements
Desc : Implémenter src/app/(admin)/evenements/page.tsx affichant la liste des événements avec actions CRUD.
AC :
  - La page affiche la liste des événements avec date, type et indicateur inscription requise
  - Chaque ligne a des boutons modifier et supprimer
  - Un bouton "Nouvel événement" redirige vers le formulaire de création
Deps : T-35, T-36, T-38
Files : src/app/(admin)/evenements/page.tsx

T-38 : Créer le composant formulaire événement
Desc : Implémenter features/evenements/components/EvenementForm.tsx pour la création et la modification.
AC :
  - Le composant affiche les champs titre, description, date, type et inscription_requise
  - Il utilise React Hook Form with zodResolver et affiche les erreurs en français
  - La date est saisie via un input date natif compatible mobile
Deps : T-34
Files : src/features/evenements/components/EvenementForm.tsx

T-39 : Créer les schémas Zod du module utilisateurs
Desc : Définir createUserSchema et updateUserSchema dans features/utilisateur/schema.ts.
AC :
  - Le fichier exporte deux schémas Zod valides
  - Le schéma de création valide l'email, le mot de passe (min 8 caractères) et le rôle
  - Les messages d'erreur sont en français
Deps : T-12
Files : src/features/utilisateur/schema.ts

T-40 : Créer les Server Actions du module utilisateurs
Desc : Implémenter les actions créer, désactiver et réactiver un utilisateur dans features/utilisateur/actions.ts.
AC :
  - L'action de création crée d'abord l'utilisateur dans Supabase Auth puis insère le profil dans la table utilisateur
  - L'action de désactivation met le statut à 'desactive' sans supprimer le compte
  - L'action de réactivation remet le statut à 'actif'
  - Toutes les actions retournent ApiResponse
Deps : T-39, T-11
Files : src/features/utilisateur/actions.ts

T-41 : Créer les requêtes du module utilisateurs
Desc : Implémenter la requête de liste des utilisateurs dans features/utilisateur/queries.ts.
AC :
  - La requête retourne tous les utilisateurs avec leur email, rôle et statut
  - Le résultat exclut les utilisateurs supprimés physiquement
Deps : T-11
Files : src/features/utilisateur/queries.ts

T-42 : Créer la page liste des utilisateurs
Desc : Implémenter src/app/(admin)/utilisateurs/page.tsx affichant la liste des comptes back-office.
AC :
  - La page affiche la liste des utilisateurs avec rôle et statut
  - Chaque ligne a des boutons désactiver et réactiver selon le statut actuel
  - Un bouton "Nouvel utilisateur" ouvre le formulaire de création
Deps : T-40, T-41, T-43
Files : src/app/(admin)/utilisateurs/page.tsx

T-43 : Créer le composant formulaire utilisateur
Desc : Implémenter features/utilisateur/components/UserForm.tsx pour la création d'un compte back-office.
AC :
  - The composant affiche les champs email, mot de passe et rôle (total ou lecture_seule)
  - Il utilise React Hook Form with zodResolver et affiche les erreurs en français
  - Le mot de passe est masqué et doit contenir au moins 8 caractères
Deps : T-39
Files : src/features/utilisateur/components/UserForm.tsx

T-44 : Créer le schéma Zod du module bannière
Desc : Définir updateBanniereSchema dans features/parametres/banniere/schema.ts.
AC :
  - Le fichier exporte un schéma Zod valide pour la mise à jour de la bannière
  - Le schéma valide le message et l'URL de l'image optionnelle
  - Les messages d'erreur sont en français
Deps : T-12
Files : src/features/parametres/banniere/schema.ts

T-45 : Créer la Server Action du module bannière
Desc : Implémenter l'action de mise à jour de la bannière dans features/parametres/banniere/actions.ts.
AC :
  - L'action gère l'upload d'image via l'Edge Function compress-image avant mise à jour
  - Elle met à jour l'enregistrement unique dans la table bannière
  - Elle appelle revalidateTag('banniere') après mutation
  - Elle retourne ApiResponse
Deps : T-44, T-11, T-13
Files : src/features/parametres/banniere/actions.ts

T-46 : Créer le composant formulaire bannière
Desc : Implémenter features/parametres/banniere/components/BanniereForm.tsx pour modifier l'image et le message.
AC :
  - Le composant affiche un champ message et un upload d'image
  - L'upload déclenche l'Edge Function de compression avant soumission
  - Il utilise React Hook Form with zodResolver et affiche les erreurs en français
Deps : T-44
Files : src/features/parametres/banniere/components/BanniereForm.tsx

T-47 : Créer le schéma Zod du module SEO
Desc : Définir updateSeoSchema in features/parametres/seo/schema.ts.
AC :
  - Le fichier exporte un schéma Zod valide pour la mise à jour des meta tags
  - Le schéma valide le chemin, le titre, la meta description et les mots-clés
  - Les messages d'erreur sont en français
Deps : T-12
Files : features/parametres/seo/schema.ts

T-48 : Créer la Server Action du module SEO
Desc : Implémenter l'action de mise à jour des meta tags dans features/parametres/seo/actions.ts.
AC :
  - L'action met à jour l'enregistrement page_seo identifié par le chemin
  - Elle appelle revalidateTag('parametres') après mutation
  - Elle retourne ApiResponse
Deps : T-47, T-11
Files : features/parametres/seo/actions.ts

T-49 : Créer le composant formulaire SEO
Desc : Implémenter features/parametres/seo/components/SeoForm.tsx pour éditer les meta tags par page.
AC :
  - Le composant affiche un sélecteur de page et les champs titre, meta description, mots-clés
  - Il utilise React Hook Form with zodResolver et affiche les erreurs en français
  - Il pré-remplit les valeurs existantes pour la page sélectionnée
Deps : T-47
Files : features/parametres/seo/components/SeoForm.tsx

T-50 : Créer le schéma Zod du module WhatsApp
Desc : Définir updateWhatsAppSchema in features/parametres/whatsapp/schema.ts.
AC :
  - Le fichier exporte un schéma Zod valide pour la mise à jour du numéro WhatsApp
  - Le schéma valide le numéro au format international
  - Les messages d'erreur sont en français
Deps : T-12
Files : features/parametres/whatsapp/schema.ts

T-51 : Créer la Server Action du module WhatsApp
Desc : Implémenter l'action de mise à jour du numéro WhatsApp dans features/parametres/whatsapp/actions.ts.
AC :
  - L'action met à jour la valeur du paramètre dont la clé est 'numero_whatsapp'
  - Elle appelle revalidateTag('parametres') après mutation
  - Elle retourne ApiResponse
Deps : T-50, T-11
Files : features/parametres/whatsapp/actions.ts

T-52 : Créer le composant formulaire WhatsApp
Desc : Implémenter features/parametres/whatsapp/components/WhatsAppForm.tsx pour modifier le numéro de redirection.
AC :
  - Le composant affiche un champ numéro with placeholder au format international
  - Il использует React Hook Form with zodResolver et affiche les erreurs en français
  - Il pré-remplit la valeur actuelle du paramètre
Deps : T-50
Files : features/parametres/whatsapp/components/WhatsAppForm.tsx

T-53 : Créer les requêtes du dashboard
Desc : Implémenter les requêtes d'agrégation statistiques dans features/parametres/dashboard/queries.ts.
AC :
  - La requête retourne les compteurs par type sur les 30 derniers jours
  - Elle retourne le top 5 des contenus par vues et le top 5 des livres par clics
  - Elle retourne l'historique quotidien sur 30 jours pour le graphique
Deps : T-11
Files : features/parametres/dashboard/queries.ts

T-54 : Créer les composants graphiques du dashboard
Desc : Implémenter features/parametres/dashboard/components/DashboardCharts.tsx with Recharts.
AC :
  - Le composant affiche un LineChart pour l'historique 30 jours
  - Il affiche deux BarChart pour le top 5 contenus et le top 5 livres
  - Il est responsive et fonctionne sur mobile 375px
Deps : T-03
Files : features/parametres/dashboard/components/DashboardCharts.tsx

T-55 : Créer la page tableau de bord
Desc : Implémenter src/app/(admin)/tableau-de-bord/page.tsx with les statistiques, le formulaire bannière et les graphiques.
AC :
  - La page affiche les compteurs globaux (visites, vues, clics, formulaires)
  - Elle affiche le formulaire de modification de la bannière
  - Elle affiche les graphiques Recharts with les données agrégées
  - Elle est accessible uniquement aux utilisateurs authentifiés
Deps : T-45, T-46, T-53, T-54
Files : src/app/(admin)/tableau-de-bord/page.tsx

T-56 : Créer la page paramètres
Desc : Implémenter src/app/(admin)/parametres/page.tsx avec les formulaires SEO et WhatsApp.
AC :
  - La page affiche le formulaire de modification des meta tags SEO par page
  - Elle affiche le formulaire de modification du numéro WhatsApp
  - Elle est accessible uniquement aux utilisateurs authentifiés
Deps : T-48, T-49, T-51, T-52
Files : src/app/(admin)/parametres/page.tsx

T-57 : Créer les requêtes du module partenaire back-office
Desc : Implémenter la liste et le détail des partenaires dans features/partenaire/queries.ts.
AC :
  - La requête de liste retourne tous les partenaires triés par date_soumission décroissante
  - La requête de détail retourne un partenaire par son id
Deps : T-11
Files : src/features/partenaire/queries.ts

T-58 : Créer les requêtes du module contact back-office
Desc : Implémenter la liste et le détail des contacts dans features/contact/queries.ts.
AC :
  - La requête de liste retourne tous les contacts triés par date_soumission décroissante
  - La requête de détail retourne un contact par son id avec le message complet
Deps : T-11
Files : src/features/contact/queries.ts

T-59 : Créer le composant d'export CSV réutilisable
Desc : Implémenter src/components/ui/CsvExport.tsx générant un fichier CSV avec séparateur point-virgule et encodage UTF-8 BOM.
AC :
  - Le composant accepte un tableau de données et un nom de fichier en props
  - Le fichier généré s'ouvre correctement dans Excel avec accents et séparateur point-virgule
  - L'encodage est UTF-8 with BOM
Deps : Aucune
Files : src/components/ui/CsvExport.tsx

T-60 : Créer la page liste des partenaires back-office
Desc : Implémenter src/app/(admin)/partenaires/page.tsx affichant la liste with export CSV.
AC :
  - La page affiche la liste des partenaires with nom, email, pays et date de soumission
  - Un bouton "Exporter CSV" génère le fichier au format point-virgule UTF-8 BOM
  - Chaque ligne a un lien vers la page détail
Deps : T-57, T-59
Files : src/app/(admin)/partenaires/page.tsx

T-61 : Créer la page détail d'un partenaire back-office
Desc : Implémenter src/app/(admin)/partenaires/[id]/page.tsx affichant toutes les informations.
AC :
  - La page affiche nom, email, pays, statut et date de soumission du partenaire
  - Un bouton "Retour à la liste" redirige vers /admin/partenaires
Deps : T-57
Files : src/app/(admin)/partenaires/[id]/page.tsx

T-62 : Créer la page liste des contacts back-office
Desc : Implémenter src/app/(admin)/contacts/page.tsx affichant la liste with export CSV.
AC :
  - La page affiche la liste des contacts with nom, email et date de soumission
  - Un bouton "Exporter CSV" génère le fichier au format point-virgule UTF-8 BOM
  - Chaque ligne a un lien vers la page détail
Deps : T-58, T-59
Files : src/app/(admin)/contacts/page.tsx

T-63 : Créer la page détail d'un contact back-office
Desc : Implémenter src/app/(admin)/contacts/[id]/page.tsx affichant le message complet.
AC :
  - La page affiche nom, email, message complet et date de soumission du contact
  - Un bouton "Retour à la liste" redirige vers /admin/contacts
Deps : T-58
Files : src/app/(admin)/contacts/[id]/page.tsx

T-64 : Créer le layout back-office avec sidebar et gestion des rôles via RoleContext
Desc : Implémenter src/app/(admin)/layout.tsx avec sidebar, header, déconnexion et masquage des boutons CRUD pour lecture_seule via un contexte React (RoleContext) exposant le rôle de l'utilisateur connecté à tous les composants enfants.
AC :
  - Le layout affiche une sidebar with les liens vers tous les modules admin
  - Le header affiche l'email de l'utilisateur connecté et un bouton de déconnexion
  - Les boutons de création, modification et suppression sont masqués si le rôle est lecture_seule
Deps : T-15, T-66
Files : src/app/(admin)/layout.tsx, src/components/RoleContext.tsx

T-65 : Créer la migration SQL pour ajouter le champ type à evenement
Desc : Rédiger le script ALTER TABLE ajoutant le champ type à la table evenement with CHECK IN ('recurrent','special').
AC :
  - Le script ajoute la colonne type with DEFAULT 'special' et CHECK IN ('recurrent','special')
  - Les événements existants reçoivent la valeur 'special' par défaut
  - Le script s'exécute sans erreur dans Supabase
Deps : T-05
Files : supabase/migrations/005_add_evenement_type.sql

T-66 : Créer les composants boutons réutilisables
Desc : Implémenter ButtonPrimary, ButtonSecondary et ButtonDanger dans src/components/ui/.
AC :
  - Chaque bouton accepte les props children, onClick, disabled et type
  - Les styles Tailwind sont cohérents avec le design system du projet
  - Les boutons sont responsive sur mobile 375px
Deps : Aucune
Files : src/components/ui/Button.tsx

T-67 : Créer les composants de formulaire réutilisables
Desc : Implémenter InputText, InputEmail, Textarea et Select dans src/components/ui/.
AC :
  - Chaque composant accepte les props label, name, value, onChange, error et required
  - Les messages d'erreur s'affichent en dessous du champ
  - Les composants sont accessibles et fonctionnent sur mobile 375px
Deps : Aucune
Files : src/components/ui/Input.tsx, src/components/ui/Textarea.tsx, src/components/ui/Select.tsx

T-68 : Créer le composant Card générique
Desc : Implémenter src/components/ui/Card.tsx pour encapsuler du contenu dans un conteneur stylisé.
AC :
  - Le composant accepte les props title, children et footer
  - Le style est cohérent avec Tailwind et responsive
Deps : Aucune
Files : src/components/ui/Card.tsx

T-69 : Créer le composant Tableau générique
Desc : Implémenter src/components/ui/DataTable.tsx avec colonnes configurables et actions par ligne.
AC :
  - Le composant accepte les props data, columns et actions (fonctions optionnelles par ligne)
  - Il affiche un message "Aucune donnée" si le tableau est vide
  - Il est responsive avec défilement horizontal sur mobile
Deps : Aucune
Files : src/components/ui/DataTable.tsx

T-70 : Créer le composant Modal de confirmation
Desc : Implémenter src/components/ui/ConfirmModal.tsx pour les suppressions.
AC :
  - Le composant affiche un titre, un message et deux boutons (Confirmer, Annuler)
  - Il s'ouvre et se ferme via un état contrôlé par le parent
  - Le bouton Confirmer déclenche la callback onConfirm
Deps : Aucune
Files : src/components/ui/ConfirmModal.tsx

T-71 : Créer les composants Badge, Alert, Toast et Loading
Desc : Implémenter Badge, Alert, ToastNotification et LoadingSpinner dans src/components/ui/.
AC :
  - Badge affiche un statut with couleur conditionnelle (publié/non publié, actif/désactivé)
  - Alert affiche un message de succès ou d'erreur avec icône
  - ToastNotification s'affiche temporairement et se ferme automatiquement
  - LoadingSpinner est centré et animé
Deps : Aucune
Files : src/components/ui/Badge.tsx, src/components/ui/Alert.tsx, src/components/ui/Toast.tsx, src/components/ui/LoadingSpinner.tsx

T-72 : Créer le composant Empty state
Desc : Implémenter src/components/ui/EmptyState.tsx affiché quand aucune donnée n'est disponible.
AC :
  - Le composant affiche un message et une icône illustrant l'absence de données
  - Il accepte une prop message personnalisable
Deps : Aucune
Files : src/components/ui/EmptyState.tsx

T-73 : Créer le composant Pagination
Desc : Implémenter src/components/ui/Pagination.tsx pour les listes publiques.
AC :
  - Le composant affiche les numéros de page et les boutons précédent/suivant
  - Il accepte les props currentPage, totalPages et onPageChange
  - Il est fonctionnel sur mobile 375px
Deps : Aucune
Files : src/components/ui/Pagination.tsx

T-74 : Créer le layout public avec navigation, footer et bandeau cookies
Desc : Implémenter src/app/(public)/layout.tsx avec navbar, footer et bandeau cookies utilisant localStorage.
AC :
  - Le layout affiche une navigation persistante avec liens vers toutes les sections publiques
  - Le footer contient les liens vers mentions légales et politique de confidentialité
  - Le bandeau cookies s'affiche à la première visite et se ferme en stockant le choix dans localStorage
  - Aucun cookie de tracking tiers n'est déployé
  - Le layout déclenche le tracking d'une visite (insert dans statistique type='visite') with une logique de session de 30 minutes (pas de double comptage si l'utilisateur navigue entre les pages publiques dans la même session)
Deps : T-88
Files : src/app/(public)/layout.tsx

T-75 : Ajouter les requêtes publiques aux fichiers queries existants et créer banniere/queries.ts
Desc : Ajouter les requêtes de lecture pour les pages publiques aux fichiers queries.ts existants (créés en T-25, T-31, T-36) et créer le fichier features/parametres/banniere/queries.ts.
AC :
  - La requête de bannière retourne l'enregistrement unique de la table bannière
  - La requête de contenus publiés filtre sur statut='publie' et trie par date_publication DESC
  - La requête de livres retourne tous les livres triés par date_creation DESC
  - La requête d'événements retourne tous les événements triés par date ASC
Deps : T-25, T-31, T-36
Files : src/features/contenus/queries.ts, src/features/livres/queries.ts, src/features/evenements/queries.ts, src/features/parametres/baiduere/queries.ts

T-76 : Créer la page d'accueil publique
Desc : Implémenter src/app/(public)/page.tsx avec bannière et contenus mis en avant.
AC :
  - La page affiche la bannière (image + message) en haut
  - Elle affiche les 3 contenus mis en avant avec titre, image et extrait
  - Elle est pré-rendue en SSG avec les tags 'banniere' et 'contenus'
Deps : T-75
Files : src/app/(public)/page.tsx

T-77 : Créer la page liste des contenus publique
Desc : Implémenter src/app/(public)/contenus/page.tsx avec liste filtrable par rubrique.
AC :
  - La page affiche la liste des contenus publiés with titre, rubrique et date
  - Un filtre par rubrique est disponible
  - Elle utilise le tag SSG 'contenus'
Deps : T-75
Files : src/app/(public)/contenus/page.tsx

T-78 : Créer la page fiche contenu publique
Desc : Implémenter src/app/(public)/contenus/[id]/page.tsx avec incrémentation du compteur de vues.
AC :
  - La page affiche le titre, la rubrique, le texte, l'image et le compteur de vues
  - Elle incrémente le compteur de vues via une Server Action avec logique de session 5 minutes
  - Elle utilise le tag SSG 'contenus'
Deps : T-75
Files : src/app/(public)/contenus/[id]/page.tsx

T-79 : Créer la page liste des livres publique
Desc : Implémenter src/app/(public)/livres/page.tsx avec grille des livres.
AC :
  - La page affiche une grille des livres with couverture, titre et prix
  - Elle utilise le tag SSG 'livres'
Deps : T-75
Files : src/app/(public)/livres/page.tsx

T-80 : Créer la page fiche livre publique
Desc : Implémenter src/app/(public)/livres/[id]/page.tsx with liens Amazon et WhatsApp traqués.
AC :
  - La page affiche le titre, la description, le prix, la couverture et les liens Amazon et WhatsApp
  - Les clics sur les liens déclenchent une Server Action de tracking et incrémentent les compteurs
  - Elle utilise le tag SSG 'livres'
Deps : T-75
Files : src/app/(public)/livres/[id]/page.tsx

T-81 : Créer la page liste des événements publique
Desc : Implémenter src/app/(public)/evenements/page.tsx avec distinction récurrent/spécial.
AC :
  - La page affiche la liste des événements triés par date avec distinction visuelle entre récurrents et spéciaux
  - Elle utilise le tag SSG 'evenements'
Deps : T-75, T-65
Files : src/app/(public)/evenements/page.tsx

T-82 : Créer la page fiche événement publique
Desc : Implémenter src/app/(public)/evenements/[id]/page.tsx avec bouton d'inscription WhatsApp.
AC :
  - La page affiche le titre, la description, la date et le type (récurrent/spécial)
  - Si inscription_requise est true, un bouton redirige vers WhatsApp avec message pré-rempli
  - La page lit le paramètre 'numero_whatsapp' depuis la table paramètre pour construire l'URL de redirection WhatsApp
  - Elle utilise le tag SSG 'evenements'
Deps : T-75, T-65
Files : src/app/(public)/evenements/[id]/page.tsx

T-83 : Créer les schémas Zod des formulaires publics
Desc : Définir submitPartenariatSchema et submitContactSchema dans features/partenaire/schema.ts et features/contact/schema.ts.
AC :
  - Le schéma partenariat valide nom, email (format) et pays
  - Le schéma contact valide nom, email (format) et message
  - Les messages d'erreur sont en français
Deps : T-12
Files : src/features/partenaire/schema.ts, src/features/contact/schema.ts

T-84 : Créer les Server Actions des formulaires publics
Desc : Implémenter submitPartenariat et submitContact dans features/partenaire/actions.ts et features/contact/actions.ts.
AC :
  - L'action partenariat enregistre les données et redirige vers WhatsApp with message pré-rempli
  - L'action partenariat lit le paramètre 'numero_whatsapp' depuis la table paramètre avant de construire l'URL de redirection WhatsApp
  - L'action contact enregistre les données et affiche un message de confirmation (pas de redirection)
  - Chaque action insère un événement dans la table statistique (formulaire_partenariat ou formulaire_contact)
  - Les actions retournent ApiResponse
Deps : T-83, T-11
Files : src/features/partenaire/actions.ts, src/features/contact/actions.ts

T-85 : Créer la page formulaire de partenariat publique
Desc : Implémenter src/app/(public)/partenariat/page.tsx avec le formulaire de partenariat.
AC :
  - La page affiche un formulaire with nom, email et pays
  - Après soumission réussie, le visiteur est redirigé vers WhatsApp with message pré-rempli
  - Les erreurs de validation s'affichent en français
Deps : T-84
Files : src/app/(public)/partenariat/page.tsx

T-86 : Créer la page formulaire de contact publique
Desc : Implémenter src/app/(public)/contact/page.tsx avec le formulaire de contact.
AC :
  - La page affiche un formulaire with nom, email et message
  - Après soumission, un message de confirmation s'affiche sur la page
  - Les erreurs de validation s'affichent en français
Deps : T-84
Files : src/app/(public)/contact/page.tsx

T-87 : Créer les pages mentions légales et politique de confidentialité
Desc : Implémenter src/app/(public)/mentions-legales/page.tsx et src/app/(public)/politique-confidentialite/page.tsx.
AC :
  - Chaque page affiche son contenu statique with titre et texte
  - Les pages sont accessibles depuis le footer de toutes les pages publiques
  - Aucun tag SSG n'est nécessaire (contenu statique)
Deps : T-74
Files : src/app/(public)/mentions-legales/page.tsx, src/app/(public)/politique-confidentialite/page.tsx

T-88 : Créer les Server Actions de tracking statistiques
Desc : Implémenter trackClicAmazon, trackClicWhatsAppLivre et trackVueContenu dans un fichier dédié.
AC :
  - Chaque action utilise le client service_role pour bypass RLS
  - trackClicAmazon incrémente compteur_clics_amazon du livre et insère type='clic_amazon'
  - trackClicWhatsAppLivre incrémente compteur_clics_whatsapp du livre et insère type='clic_whatsapp'
  - trackVueContenu incrémente compteur_vues du contenu with logique de session 5 minutes et insère type='vue_contenu'
  - Les actions retournent ApiResponse
Deps : T-11
Files : src/lib/tracking.ts

T-89 : Produire le guide de style du projet
Desc : Documenter la palette de couleurs, la typographie, les espacements et les tokens CSS dans un fichier design-system.md.
AC :
  - Le fichier contient les couleurs principales et secondaires en hexadécimal
  - Il définit les tailles de police, les graisses et les familles typographiques
  - Il liste les tokens d'espacement (padding, margin, gap) en rem
Deps : Aucune
Files : docs/phase2/ux-ui/design-system.md

T-90 : Produire l'arborescence complète du site
Desc : Documenter l'arborescence des pages publiques et back-office dans un fichier sitemap.md.
AC :
  - Le fichier liste toutes les routes publiques avec leur niveau de profondeur
  - Il liste toutes les routes back-office avec leur niveau de profondeur
  - Chaque route est associée à son tag SSG si applicable
Deps : Aucune
Files : docs/phase2/ux-ui/sitemap.md

T-91 : Produire la liste des écrans à maquetter
Desc : Documenter la description textuelle (wireframe) de chaque page publique et back-office dans un fichier wireframes.md.
AC :
  - Le fichier contient une section par page with la liste des éléments visuels attendus
  - Chaque description précise la disposition desktop et mobile
  - Les composants réutilisables utilisés sur chaque page sont identifiés
Deps : T-89
Files : docs/phase2/ux-ui/wireframes.md

FIN DU PLAN FINAL — Document tasks/todo.md complet.
