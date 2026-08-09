// src/features/contact/actions.ts
'use server';

import { z } from 'zod';
import { createAnonClient } from '@/lib/supabase/anon';
import type { ApiResponse, ApiError } from '@/types/api';

export const contactSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis').max(255),
  email: z.string().email('Email invalide').max(255),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères').max(5000),
});

export type ContactFormData = z.infer<typeof contactSchema>;

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

export async function submitContact(data: ContactFormData): Promise<ApiResponse<null>> {
  let validated: ContactFormData;
  try {
    validated = contactSchema.parse(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return erreurValidation(err.errors[0]?.message || 'Données invalides');
    }
    return erreurInterne();
  }

  try {
    const supabase = createAnonClient();
    const { error } = await supabase.from('contact').insert({
      nom: validated.nom,
      email: validated.email,
      message: validated.message,
    });

    if (error) {
      console.error('[submitContact] Erreur Supabase:', error.code, error.message);
      return erreurInterne();
    }

    return { data: null };
  } catch (err) {
    console.error('[submitContact] Exception inattendue:', err);
    return erreurInterne();
  }
}