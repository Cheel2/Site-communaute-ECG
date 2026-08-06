-- Index explicites sur la table contenu
CREATE INDEX idx_contenu_rubrique_id ON contenu(rubrique_id);
CREATE INDEX idx_contenu_statut ON contenu(statut);
CREATE INDEX idx_contenu_mis_en_avant ON contenu(mis_en_avant) WHERE mis_en_avant = TRUE;
CREATE INDEX idx_contenu_date_publication ON contenu(date_publication DESC);
CREATE INDEX idx_contenu_statut_date_publication ON contenu(statut, date_publication DESC);

-- Index sur la table evenement
CREATE INDEX idx_evenement_date ON evenement(date DESC);

-- Index sur la table partenaire
CREATE INDEX idx_partenaire_date_soumission ON partenaire(date_soumission DESC);

-- Index sur la table contact
CREATE INDEX idx_contact_date_soumission ON contact(date_soumission DESC);

-- Index sur la table statistique
CREATE INDEX idx_statistique_type_date ON statistique(type, date DESC);
CREATE INDEX idx_statistique_date ON statistique(date DESC);

-- Index sur la table brouillon
CREATE INDEX idx_brouillon_contenu_id ON brouillon(contenu_id);
