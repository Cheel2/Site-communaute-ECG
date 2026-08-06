---
# Idée Affinée — Site Web Ministère Pastoral
- **Date de création** : 2026-08-03
- **Source** : Phase 1 — idea-refine-v2 (Skill 2/5)
- **Statut** : Validé par le client
---

## 1. Idée Finale

On construit un site web hub de contenu et de communication pour un ministère pastoral francophone, avec un site public servant de vitrine éditoriale (articles, pensées, livres avec redirections externes, événements, partenariat financier via formulaire) et un back-office sécurisé permettant au pasteur et à son assistante de gérer les contenus, les livres, les événements, les partenaires et les contacts, avec un tableau de bord statistique simple, le tout hébergé gratuitement sur Vercel et Supabase sans paiement intégré.

## 2. Alternatives Explorées

### Authentification
- **Éliminé** : Magic link — Raison : moins habituel pour l'utilisateur, dépend de la réception d'emails.
- **Éliminé** : Code d'accès partagé — Raison : pas sécurisé, pas de traçabilité des actions.
- **Retenu** : Email + mot de passe via Supabase — Raison : natif, sécurisé, permet la différenciation des rôles (pasteur, assistante, autres).

### Événements avec inscription
- **Éliminé** : Système d'inscription intégré — Raison : trop complexe pour un MVP.
- **Retenu** : Champ booléen "inscription requise" + redirection WhatsApp avec message pré-rempli — Raison : simple, utilise un canal existant, couvre les deux cas (inscription ou simple affichage) avec un seul champ.

### Médias
- **Éliminé** : Vidéo et audio — Raison : contrainte de stockage sur le plan gratuit de Supabase.
- **Retenu** : Images uniquement — Raison : essentiel pour les contenus et les couvertures de livres, faible volume de stockage.

### Statistiques
- **Éliminé** : Tracking des achats Amazon — Raison : la donnée n'est pas accessible depuis le site.
- **Éliminé** : Tracking des conversions partenariat sur WhatsApp — Raison : le processus se déroule entièrement sur WhatsApp, hors du site.
- **Retenu** : Vues du site, vues des contenus, clics sur les liens tracés (WhatsApp, Amazon), formulaires soumis (partenariat, contact), top 5 contenus et livres, historique 30 jours — Raison : mesurable directement depuis le site et suffisant pour évaluer l'engagement.

## 3. Trade-offs Acceptés

- **Pas de vidéo/audio** dans les contenus pour rester dans les limites du stockage gratuit Supabase, en privilégiant les images qui couvrent l'essentiel des besoins éditoriaux.
- **Pas de système d'inscription aux événements intégré**, en acceptant une redirection vers WhatsApp avec un champ booléen simple, ce qui limite l'automatisation mais réduit la complexité du MVP.
- **Pas de tracking des achats réels sur Amazon ni des conversions partenariat finalisées sur WhatsApp**, en se contentant des clics et des soumissions de formulaires comme proxy d'engagement, faute d'accès aux données externes.
- **Pas d'e-commerce intégré ni de paiement en ligne**, en redirigeant vers Amazon et WhatsApp, ce qui externalise la monétisation mais simplifie drastiquement la conformité et le développement.
- **Pas de SEO payant ni de stratégie d'acquisition organique avancée**, en s'appuyant exclusivement sur les réseaux sociaux (Instagram) comme source de trafic principale.

## 4. Séparation MVP / Reporté

### Dans le MVP
- Site public avec contenus éditoriaux (rubriques personnalisées, éditeur léger, mise en avant, compteur de vues)
- Affichage des livres avec couverture, description, prix, liens tracés vers Amazon et WhatsApp
- Formulaire de partenariat financier (nom, email, pays) avec redirection WhatsApp et tracking des soumissions
- Affichage des événements (récurrents et spéciaux) avec champ "inscription requise" et bouton WhatsApp
- Bannière hero modifiable
- Formulaire de contact général avec tracking
- SEO basique (titre, description, mots-clés par page)
- Back-office avec authentification email/mot de passe (comptes manuels, reset auto)
- Back-office : gestion CRUD des livres, événements, rubriques, contenus (avec mise en avant), bannière
- Back-office : liste et export CSV des partenaires et contacts
- Back-office : tableau de bord statistique (visites, vues, clics, formulaires, top 5, historique 30 jours)
- Mentions légales et politique de confidentialité
- Hébergement Vercel + Supabase gratuit + GitHub

### Reporté
- **Vidéos/audio** — Raison : contrainte de stockage Supabase gratuit, à réévaluer avec un plan payant ou un hébergement externe.
- **Espace membre fidèles** — Raison : non essentiel pour la vitrine initiale, complexifie l'authentification publique.
- **Newsletter** — Raison : canal de communication secondaire, peut être géré via les réseaux sociaux dans un premier temps.
- **Réservation événements en ligne** — Raison : remplacée par la redirection WhatsApp dans le MVP, un système intégré demanderait trop de développement.
- **Dons en ligne** — Raison : pas de plateforme de paiement choisie, le partenariat passe déjà par WhatsApp.
- **SEO avancé/payant** — Raison : la source de trafic principale est les réseaux sociaux, le SEO avancé n'est pas une priorité immédiate.
