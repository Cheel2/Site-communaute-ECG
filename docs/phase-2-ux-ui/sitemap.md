# Arborescence du site

## Site public (SSG)

```
/                               (SSG, tags: banniere, contenus)     — Accueil
├── /contenus                   (SSG, tag: contenus)                — Liste des contenus
│   └── /[id]                   (SSG, tag: contenus)                — Fiche contenu
├── /livres                     (SSG, tag: livres)                  — Liste des livres
│   └── /[id]                   (SSG, tag: livres)                  — Fiche livre
├── /evenements                 (SSG, tag: evenements)              — Liste des événements
│   └── /[id]                   (SSG, tag: evenements)              — Fiche événement
├── /partenariat                (SSG)                               — Formulaire partenariat
├── /contact                    (SSG)                               — Formulaire contact
├── /mentions-legales           (SSG, statique)                     — Mentions légales
└── /politique-confidentialite  (SSG, statique)                     — Politique de confidentialité
```

## Back-office (SSR)

```
/admin/
├── /login                              (SSR) — Connexion
├── /mot-de-passe-reinitialiser         (SSR) — Réinitialisation mot de passe
├── /tableau-de-bord                    (SSR) — Dashboard statistiques + bannière
├── /contenus
│   ├── /nouveau                        (SSR) — Création contenu
│   └── /[id]/modifier                  (SSR) — Modification contenu
├── /rubriques                          (SSR) — Gestion des rubriques
├── /livres                             (SSR) — Gestion des livres
├── /evenements                         (SSR) — Gestion des événements
├── /partenaires
│   └── /[id]                           (SSR) — Détail partenaire
├── /contacts
│   └── /[id]                           (SSR) — Détail contact
├── /utilisateurs                       (SSR) — Gestion des comptes admin
└── /parametres                         (SSR) — SEO + WhatsApp
```

## Navigation

### Menu public (ordre)

1. Accueil
2. Contenus
3. Livres
4. Événements
5. Partenariat
6. Contact

### Menu admin (ordre sidebar)

1. Tableau de bord
2. Contenus
3. Rubriques
4. Livres
5. Événements
6. Partenaires
7. Contacts
8. Utilisateurs
9. Paramètres
