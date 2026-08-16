'use server';

import { z } from 'zod';
import { createAnonClient } from '@/lib/supabase/anon';
import type { ApiResponse, ApiError } from '@/types/api';
import { partenaireSchema, type PartenaireFormData } from './schemas';

function erreurValidation(message: string): ApiResponse<null> {
  const error: ApiError = { code: 'VALIDATION_ERROR', message };
  return { error };
}

function erreurInterne(): ApiResponse<null> {
  const error: ApiError = {
    code: 'INTERNAL_ERROR',
    message: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
  };
  return { error };
}

export async function submitPartenariat(data: PartenaireFormData): Promise<ApiResponse<null>> {
  let validated: PartenaireFormData;
  try {
    validated = partenaireSchema.parse(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return erreurValidation(err.errors[0]?.message || 'Données invalides');
    }
    return erreurInterne();
  }

  try {
    const supabase = createAnonClient();
    const { error } = await supabase.from('partenaire').insert({
      nom: validated.nom,
      email: validated.email,
      pays: validated.pays,
    });

    if (error) {
      console.error('[submitPartenariat] Erreur Supabase:', error.code, error.message);
      return erreurInterne();
    }

    return { data: null };
  } catch (err) {
    console.error('[submitPartenariat] Exception inattendue:', err);
    return erreurInterne();
  }
}
