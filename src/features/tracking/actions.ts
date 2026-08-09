// ============================================================================
// EXTENSION DU FICHIER EXISTANT : src/features/tracking/actions.ts
// AJOUTER ces fonctions à la suite du code existant.
// PRÉREQUIS : Le client service_role (ex: supabaseServiceRole) et le type ApiResponse 
// doivent déjà être importés/définis en haut de ce fichier.
// ============================================================================

import type { ApiResponse } from '@/types/api';
// import { supabaseServiceRole } from './client'; // Déjà présent dans le fichier

/**
 * Tracke un clic sur le lien Amazon d'un livre.
 * Utilise le client service_role pour bypasser les RLS sur la table statistique.
 */
export async function trackClicAmazon(livreId: string): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabaseServiceRole.rpc('incrementer_clic_amazon', {
      livre_id: livreId,
    });

    if (error) {
      console.error('Erreur RPC incrementer_clic_amazon:', error.message);
      return { 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Impossible d\'enregistrer le clic Amazon.' 
        } 
      };
    }

    return { data: null };
  } catch (err) {
    console.error('Exception trackClicAmazon:', err);
    return { 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: 'Une erreur inattendue s\'est produite lors du tracking.' 
      } 
    };
  }
}

/**
 * Tracke un clic sur le lien WhatsApp d'un livre.
 * Utilise le client service_role pour bypasser les RLS sur la table statistique.
 */
export async function trackClicWhatsappLivre(livreId: string): Promise<ApiResponse<null>> {
  try {
    const { error } = await supabaseServiceRole.rpc('incrementer_clic_whatsapp_livre', {
      livre_id: livreId,
    });

    if (error) {
      console.error('Erreur RPC incrementer_clic_whatsapp_livre:', error.message);
      return { 
        error: { 
          code: 'INTERNAL_ERROR', 
          message: 'Impossible d\'enregistrer le clic WhatsApp.' 
        } 
      };
    }

    return { data: null };
  } catch (err) {
    console.error('Exception trackClicWhatsappLivre:', err);
    return { 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: 'Une erreur inattendue s\'est produite lors du tracking.' 
      } 
    };
  }
}