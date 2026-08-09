import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { ApiResponse } from '@/types/api';

// ============================================================================
// CLIENT SERVICE_ROLE ISOLÉ (D9)
// Ce client contourne les RLS pour insérer dans la table statistique.
// Il ne doit JAMAIS être importé ou utilisé dans un composant client ('use client').
// ============================================================================
const supabaseServiceRole: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

/**
 * Valide le format d'un identifiant UUID pour prévenir les injections ou erreurs SQL.
 */
function estUuidValide(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// ============================================================================
// FONCTIONS EXISTANTES (MICRO-CYCLE 14)
// ============================================================================

/**
 * Tracke une vue sur un contenu éditorial.
 * L'anti-spam (FR-3) est géré côté client (view-tracker.tsx).
 */
export async function trackVueContenu(contenuId: string): Promise<ApiResponse<null>> {
  if (!estUuidValide(contenuId)) {
    return { 
      error: { code: 'VALIDATION_ERROR', message: 'Identifiant de contenu invalide.' } 
    };
  }

  try {
    const { error } = await supabaseServiceRole.rpc('incrementer_compteur_vues', {
      contenu_id: contenuId,
    });

    if (error) {
      console.error('Erreur RPC incrementer_compteur_vues:', error.message);
      return { 
        error: { code: 'INTERNAL_ERROR', message: "Impossible d'enregistrer la vue du contenu." } 
      };
    }

    return { data: null };
  } catch (err) {
    console.error('Exception trackVueContenu:', err);
    return { 
      error: { code: 'INTERNAL_ERROR', message: 'Une erreur inattendue est survenue lors du tracking.' } 
    };
  }
}

// ============================================================================
// NOUVELLES FONCTIONS (MICRO-CYCLE 15)
// ============================================================================

/**
 * Tracke un clic sur le lien Amazon d'un livre.
 */
export async function trackClicAmazon(livreId: string): Promise<ApiResponse<null>> {
  if (!estUuidValide(livreId)) {
    return { 
      error: { code: 'VALIDATION_ERROR', message: 'Identifiant de livre invalide.' } 
    };
  }

  try {
    const { error } = await supabaseServiceRole.rpc('incrementer_clic_amazon', {
      livre_id: livreId,
    });

    if (error) {
      console.error('Erreur RPC incrementer_clic_amazon:', error.message);
      return { 
        error: { code: 'INTERNAL_ERROR', message: "Impossible d'enregistrer le clic Amazon." } 
      };
    }

    return { data: null };
  } catch (err) {
    console.error('Exception trackClicAmazon:', err);
    return { 
      error: { code: 'INTERNAL_ERROR', message: 'Une erreur inattendue est survenue lors du tracking.' } 
    };
  }
}

/**
 * Tracke un clic sur le lien WhatsApp d'un livre.
 */
export async function trackClicWhatsappLivre(livreId: string): Promise<ApiResponse<null>> {
  if (!estUuidValide(livreId)) {
    return { 
      error: { code: 'VALIDATION_ERROR', message: 'Identifiant de livre invalide.' } 
    };
  }

  try {
    const { error } = await supabaseServiceRole.rpc('incrementer_clic_whatsapp_livre', {
      livre_id: livreId,
    });

    if (error) {
      console.error('Erreur RPC incrementer_clic_whatsapp_livre:', error.message);
      return { 
        error: { code: 'INTERNAL_ERROR', message: "Impossible d'enregistrer le clic WhatsApp." } 
      };
    }

    return { data: null };
  } catch (err) {
    console.error('Exception trackClicWhatsappLivre:', err);
    return { 
      error: { code: 'INTERNAL_ERROR', message: 'Une erreur inattendue est survenue lors du tracking.' } 
    };
  }
}