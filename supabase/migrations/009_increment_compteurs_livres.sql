-- supabase/migrations/009_increment_compteurs_livres.sql

-- Note technique : Les fonctions PL/pgSQL sont implicitement transactionnelles. 
-- Le bloc BEGIN ... END; garantit l'atomicité stricte (ROLLBACK automatique si l'INSERT ou l'UPDATE échoue).
-- Un COMMIT explicite n'est pas autorisé/syntaxique dans une FUNCTION PostgreSQL.

CREATE OR REPLACE FUNCTION incrementer_clic_amazon(livre_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.livre
  SET compteur_clics_amazon = compteur_clics_amazon + 1,
      date_modification = now()
  WHERE id = livre_id;

  INSERT INTO public.statistique (type, valeur, date)
  VALUES ('clic_amazon', 1, now());
END;
$$;

CREATE OR REPLACE FUNCTION incrementer_clic_whatsapp_livre(livre_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.livre
  SET compteur_clics_whatsapp = compteur_clics_whatsapp + 1,
      date_modification = now()
  WHERE id = livre_id;

  INSERT INTO public.statistique (type, valeur, date)
  VALUES ('clic_whatsapp_livre', 1, now());
END;
$$;

-- Les permissions d'exécution sont héritées de SECURITY DEFINER (service_role)