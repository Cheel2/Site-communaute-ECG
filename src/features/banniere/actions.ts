'use server';

import { revalidateTag } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { Banniere } from '@/types/database';
import type { ApiError, ApiResponse } from '@/types/api';
import { updateBanniereSchema, type UpdateBanniereInput } from './schemas';

type SupabaseError = {
  code?: string;
  message?: string;
  details?: unknown;
  hint?: unknown;
};

function mapSupabaseError(error: SupabaseError): ApiError {
  switch (error.code) {
    case 'PGRST116':
      return {
        code: 'NOT_FOUND',
        message: "La bannière demandée n'existe pas.",
      };
    case '23505':
      return {
        code: 'CONFLICT',
        message: 'Une bannière avec cet identifiant existe déjà.',
      };
    case '23503':
      return {
        code: 'VALIDATION_ERROR',
        message: 'Les données soumises sont invalides.',
      };
    case '42501':
      return {
        code: 'FORBIDDEN',
        message: "Vous n'êtes pas autorisé à modifier la bannière.",
      };
    default:
      return {
        code: 'INTERNAL_ERROR',
        message: 'Une erreur technique est survenue.',
      };
  }
}

export async function getBanniere(): Promise<Banniere | null> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('banniere')
      .select('*')
      .returns<Banniere>()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }

      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export async function updateBanniere(
  input: UpdateBanniereInput
): Promise<ApiResponse<Banniere>> {
  const parsed = updateBanniereSchema.safeParse(input);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];

    return {
      error: {
        code: 'VALIDATION_ERROR',
        message: firstIssue?.message ?? 'Les données soumises sont invalides.',
      },
    };
  }

  try {
    const supabase = await createClient();

    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError || !userData.user) {
      return {
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentification requise.',
        },
      };
    }

    const { data: existing, error: existingError } = await supabase
      .from('banniere')
      .select('id')
      .returns<Pick<Banniere, 'id'>>()
      .limit(1)
      .maybeSingle();

    if (existingError) {
      return { error: mapSupabaseError(existingError) };
    }

    const payload = {
      id: existing?.id ?? globalThis.crypto.randomUUID(),
      image_url: parsed.data.image_url,
      message: parsed.data.message,
      date_modification: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('banniere')
      .upsert(payload, { onConflict: 'id' })
      .select('*')
      .returns<Banniere>()
      .single();

    if (error) {
      return { error: mapSupabaseError(error) };
    }

    if (!data) {
      return {
        error: {
          code: 'INTERNAL_ERROR',
          message: "L'enregistrement de la bannière a échoué.",
        },
      };
    }

    revalidateTag('banniere');

    return { data };
  } catch {
    return {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Une erreur technique est survenue.',
      },
    };
  }
}