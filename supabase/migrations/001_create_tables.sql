-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table rubrique
CREATE TABLE rubrique (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL UNIQUE,
    ordre_affichage INT NOT NULL DEFAULT 0,
    date_creation TIMESTAMPTZ DEFAULT NOW(),
    date_modification TIMESTAMPTZ DEFAULT NOW()
);

-- Table contenu
CREATE TABLE contenu (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titre TEXT NOT NULL,
    rubrique_id UUID NOT NULL REFERENCES rubrique(id) ON DELETE RESTRICT,
    texte TEXT DEFAULT '',
    image_url TEXT,
    statut TEXT NOT NULL DEFAULT 'non_publie' CHECK (statut IN ('publie', 'non_publie')),
    mis_en_avant BOOLEAN DEFAULT FALSE,
    compteur_vues INT DEFAULT 0,
    date_creation TIMESTAMPTZ DEFAULT NOW(),
    date_modification TIMESTAMPTZ DEFAULT NOW(),
    date_publication TIMESTAMPTZ
);

-- Table livre
CREATE TABLE livre (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titre TEXT NOT NULL,
    description TEXT DEFAULT '',
    prix DECIMAL(10,2) DEFAULT 0,
    image_couverture_url TEXT,
    lien_amazon TEXT,
    lien_whatsapp TEXT,
    compteur_clics_amazon INT DEFAULT 0,
    compteur_clics_whatsapp INT DEFAULT 0,
    date_creation TIMESTAMPTZ DEFAULT NOW(),
    date_modification TIMESTAMPTZ DEFAULT NOW()
);

-- Table evenement (avec champ type inclus pour éviter conflit avec migration 005)
CREATE TABLE evenement (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titre TEXT NOT NULL,
    description TEXT DEFAULT '',
    date DATE NOT NULL,
    inscription_requise BOOLEAN DEFAULT FALSE,
    type TEXT NOT NULL DEFAULT 'special' CHECK (type IN ('recurrent', 'special')),
    date_creation TIMESTAMPTZ DEFAULT NOW(),
    date_modification TIMESTAMPTZ DEFAULT NOW()
);

-- Table banniere
CREATE TABLE banniere (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT,
    message TEXT DEFAULT '',
    date_modification TIMESTAMPTZ DEFAULT NOW()
);

-- Table partenaire
CREATE TABLE partenaire (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,
    email TEXT NOT NULL,
    pays TEXT NOT NULL,
    date_soumission TIMESTAMPTZ DEFAULT NOW(),
    statut TEXT DEFAULT 'soumis'
);

-- Table contact
CREATE TABLE contact (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    date_soumission TIMESTAMPTZ DEFAULT NOW()
);

-- Table parametre
CREATE TABLE parametre (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cle TEXT NOT NULL UNIQUE,
    valeur TEXT DEFAULT ''
);

-- Table statistique
CREATE TABLE statistique (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('visite', 'vue_contenu', 'clic_whatsapp', 'clic_amazon', 'formulaire_partenariat', 'formulaire_contact')),
    valeur INT DEFAULT 1,
    date TIMESTAMPTZ DEFAULT NOW()
);

-- Table brouillon
CREATE TABLE brouillon (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contenu_id UUID REFERENCES contenu(id) ON DELETE SET NULL,
    titre TEXT DEFAULT '',
    rubrique_id UUID REFERENCES rubrique(id) ON DELETE SET NULL,
    texte TEXT DEFAULT '',
    image_url TEXT,
    date_derniere_sauvegarde TIMESTAMPTZ DEFAULT NOW()
);

-- Table page_seo
CREATE TABLE page_seo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chemin TEXT NOT NULL UNIQUE,
    titre TEXT DEFAULT '',
    meta_description TEXT DEFAULT '',
    mots_cles TEXT DEFAULT '',
    date_modification TIMESTAMPTZ DEFAULT NOW()
);

-- Table utilisateur (en dernier car FK vers auth.users)
CREATE TABLE utilisateur (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'lecture_seule' CHECK (role IN ('total', 'lecture_seule')),
    statut TEXT NOT NULL DEFAULT 'actif' CHECK (statut IN ('actif', 'desactive')),
    date_creation TIMESTAMPTZ DEFAULT NOW(),
    date_modification TIMESTAMPTZ DEFAULT NOW()
);
