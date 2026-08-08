-- MC-14 : Incrémentation atomique du compteur de vues d'un contenu.
-- Appelée via supabase.rpc('incrementer_compteur_vues', { p_contenu_id }) depuis
-- la Server Action trackVueContenu (client service_role, bypass RLS — décision D9).
-- Évite la race condition d'un SELECT + UPDATE séquentiel sous trafic concurrent.
CREATE OR REPLACE FUNCTION incrementer_compteur_vues(p_contenu_id uuid)
RETURNS integer
LANGUAGE sql
AS $$
  UPDATE contenu
  SET compteur_vues = compteur_vues + 1
  WHERE id = p_contenu_id
  RETURNING compteur_vues;
$$;