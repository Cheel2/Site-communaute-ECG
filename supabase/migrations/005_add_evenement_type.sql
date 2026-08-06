-- Migration 005 : Ajout du champ type à la table evenement
-- Cette migration est séparée car le champ type a été ajouté après le script
-- 001_create_tables.sql initial. L'instruction IF NOT EXISTS garantit que
-- la migration ne provoque pas d'erreur si la colonne existe déjà
-- (cas où le champ a été inclus directement dans le CREATE TABLE initial).

ALTER TABLE evenement
ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'special'
CHECK (type IN ('recurrent', 'special'));
