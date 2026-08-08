-- supabase/migrations/007_evolution_evenement.sql
-- Évolution schéma evenement : MC-9
-- ⚠️ inscription_requise PRÉSERVÉ (dépendance US-7)

ALTER TABLE evenement RENAME COLUMN date TO date_debut;

ALTER TABLE evenement ADD COLUMN IF NOT EXISTS date_fin date;
ALTER TABLE evenement ADD COLUMN IF NOT EXISTS lieu text DEFAULT '';
ALTER TABLE evenement ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE evenement ADD COLUMN IF NOT EXISTS statut text DEFAULT 'planifie';

-- Reconstruction index (ancien idx_evenement_date → date_debut)
DROP INDEX IF EXISTS idx_evenement_date;
CREATE INDEX IF NOT EXISTS idx_evenement_date_debut ON evenement(date_debut DESC);