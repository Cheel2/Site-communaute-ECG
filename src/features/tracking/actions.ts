'use server';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { ApiError, ApiResponse } from '@/types/api';

// [D9] Client service_role : bypass RLS pour l'insertion dans statistique
// et l'incrémentation atomique de contenu.compteur_vues.
// SÉCURITÉ : ce fichier est un module serveur ('use server'). La clé
// SUPABASE_SERVICE_ROLE_KEY ne doit JAMAIS atteindre le navigateur :
// aucun composant client n'importe ce module autrement que pour appeler
// la Server Action trackVueContenu.
let clientServiceRole: SupabaseClient | null = null;

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function createServiceRoleClient(): SupabaseClient {
  if (clientServiceRole) {
    return clientServiceRole;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Variables service_role manquantes : NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.'
    );
  }

  clientServiceRole = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return clientServiceRole;
}

export async function trackVueContenu(contenuId: string): Promise<ApiResponse<null>> {
  if (!UUID_REGEX.test(contenuId)) {
    return {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Identifiant de contenu invalide.',
      },
    };
  }

  try {
    const supabase = createServiceRoleClient();

    const { error: erreurStatistique } = await supabase
      .from('statistique')
      .insert({
        type: 'vue_contenu',
        valeur: 1,
        date: new Date().toISOString(),
      });

    if (erreurStatistique) {
      return { error: mapErreurSupabase(erreurStatistique) };
    }

    const { error: erreurCompteur } = await supabase.rpc('incrementer_compteur_vues', {
      p_contenu_id: contenuId,
    });

    if (erreurCompteur) {
      return { error: mapErreurSupabase(erreurCompteur) };
    }

    return { data: null };
  } catch {
    return {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Le suivi de consultation est indisponible.',
      },
    };
  }
}

function mapErreurSupabase(error: { code: string; message: string }): ApiError {
  if (error.code === '42501') {
    return {
      code: 'FORBIDDEN',
      message: 'Le suivi de consultation est refusé.',
    };
  }

  return {
    code: 'INTERNAL_ERROR',
    message: 'Le suivi de consultation est indisponible.',
  };
}