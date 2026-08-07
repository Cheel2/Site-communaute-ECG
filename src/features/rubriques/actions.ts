'use server';

import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
import type { ZodError } from 'zod';
import { createClient } from '@/lib/supabase/server';
import type { Rubrique } from '@/types/database';
import type { ApiError, ApiResponse } from '@/types/api';
import {
  createRubriqueSchema,
  updateRubriqueSchema,
  type CreateRubriqueInput,
  type UpdateRubriqueInput,
} from './schemas';

type SupabaseClient = ReturnType<typeof createClient>;

type SupabaseError = {
  code?: string;
  message?: string;
  details?: unknown;
  hint?: unknown;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function mapSupabaseError(error: SupabaseError): ApiError {
  switch (error.code) {
    case 'PGRST116':
      return {
        code: 'NOT_FOUND',
        message: 'La rubrique demandée est introuvable.',
      };
    case '23505':
      return {
        code: 'CONFLICT',
        message: 'Une rubrique avec ce nom existe déjà.',
      };
    case '23503':
      return {
        code: 'VALIDATION_ERROR',
        message:
          'Impossible de supprimer : des contenus sont associés à cette rubrique.',
      };
    case '42501':
      return {
        code: 'FORBIDDEN',
        message: "Vous n'êtes pas autorisé à effectuer cette action.",
      };
    default:
      return {
        code: 'INTERNAL_ERROR',
        message: 'Une erreur technique est survenue.',
      };
  }
}

function firstValidationMessage(error: ZodError): string {
  return error.issues[0]?.message ?? 'Les données soumises sont invalides.';
}

async function requireAuthenticatedUser(
  client: SupabaseClient
): Promise<ApiError | null> {
  const { data, error } = await client.auth.getUser();

  if (error || !data.user) {
    return {
      code: 'UNAUTHORIZED',
      message: 'Authentification requise.',
    };
  }

  return null;
}

export async function listRubriques(): Promise<Rubrique[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from('rubrique')
      .select('*')
      .order('ordre_affichage', { ascending: true })
      .order('nom', { ascending: true })
      .returns<Rubrique[]>();

    if (error) {
      return [];
    }

    return data ?? [];
  } catch {
    return [];
  }
}

export async function createRubrique(
  input: CreateRubriqueInput
): Promise<ApiResponse<Rubrique>> {
  const parsed = createRubriqueSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: {
        code: 'VALIDATION_ERROR',
        message: firstValidationMessage(parsed.error),
      },
    };
  }

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const authError = await requireAuthenticatedUser(supabase);
    if (authError) {
      return { error: authError };
    }

    const now = new Date().toISOString();

    const payload = {
      nom: parsed.data.nom,
      ordre_affichage: parsed.data.ordre_affichage,
      date_creation: now,
      date_modification: now,
    };

    const { data, error } = await supabase
      .from('rubrique')
      .insert(payload)
      .select('*')
      .returns<Rubrique>()
      .single();

    if (error) {
      return { error: mapSupabaseError(error) };
    }

    if (!data) {
      return {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'La création de la rubrique a échoué.',
        },
      };
    }

    revalidateTag('rubriques');

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

export async function updateRubrique(
  id: string,
  input: UpdateRubriqueInput
): Promise<ApiResponse<Rubrique>> {
  if (!id || !UUID_PATTERN.test(id)) {
    return {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Identifiant de rubrique invalide.',
      },
    };
  }

  const parsed = updateRubriqueSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: {
        code: 'VALIDATION_ERROR',
        message: firstValidationMessage(parsed.error),
      },
    };
  }

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const authError = await requireAuthenticatedUser(supabase);
    if (authError) {
      return { error: authError };
    }

    const payload = {
      nom: parsed.data.nom,
      ordre_affichage: parsed.data.ordre_affichage,
      date_modification: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('rubrique')
      .update(payload)
      .eq('id', id)
      .select('*')
      .returns<Rubrique>()
      .single();

    if (error) {
      return { error: mapSupabaseError(error) };
    }

    if (!data) {
      return {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'La modification de la rubrique a échoué.',
        },
      };
    }

    revalidateTag('rubriques');

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

export async function deleteRubrique(
  id: string
): Promise<ApiResponse<null>> {
  if (!id || !UUID_PATTERN.test(id)) {
    return {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Identifiant de rubrique invalide.',
      },
    };
  }

  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const authError = await requireAuthenticatedUser(supabase);
    if (authError) {
      return { error: authError };
    }

    const { data: deleted, error } = await supabase
      .from('rubrique')
      .delete()
      .eq('id', id)
      .select('id')
      .returns<Pick<Rubrique, 'id'>>()
      .maybeSingle();

    if (error) {
      return { error: mapSupabaseError(error) };
    }

    if (!deleted) {
      return {
        error: {
          code: 'NOT_FOUND',
          message: 'La rubrique à supprimer est introuvable.',
        },
      };
    }

    revalidateTag('rubriques');

    return { data: null };
  } catch {
    return {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Une erreur technique est survenue.',
      },
    };
  }
}