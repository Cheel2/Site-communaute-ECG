// src/features/partenariat/actions.ts
'use server';

import { z } from 'zod';
import { createAnonClient } from '@/lib/supabase/anon';
import { ApiResponse } from '@/types/api';

export const partenaireSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis').max(255),
  email: z.string().email('Email invalide').max(255),
  pays: z.string().min(1, 'Le pays est requis').max(255),
});

export type PartenaireFormData = z.infer<typeof partenaireSchema>;

export async function submitPartenariat(data: PartenaireFormData): Promise<ApiResponse<null>> {
  try {
    const validated = partenaireSchema.parse(data);
    const supabase = createAnonClient();

    const { error } = await supabase.from('partenaire').insert({
      nom: validated.nom,
      email: validated.email,
      pays: validated.pays,
    });

    if (error) {
      return {
        error: {
          code: 'DATABASE_ERROR',
          message: 'Erreur lors de l\'enregistrement. Veuillez réessayer.',
        },
      };
    }

    return { data: null };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        error: {
          code: 'VALIDATION_ERROR',
          message: err.errors[0]?.message || 'Données invalides',
        },
      };
    }
    return {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Une erreur inattendue s\'est produite.',
      },
    };
  }
}