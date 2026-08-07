'use server';

import { revalidateTag } from 'next/cache';
import type { ZodError } from 'zod';
import { createClient } from '@/lib/supabase/server';
import type { Contenu, Rubrique } from '@/types/database';
import type { ApiError, ApiResponse } from '@/types/api';
import {
  createContenuSchema,
  updateContenuSchema,
  type CreateContenuInput,
  type UpdateContenuInput,
} from './schemas';

export type ContenuAvecRubrique = Contenu & {
  rubrique: Pick<Rubrique, 'nom'> | null;
};

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

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
        message: 'Le contenu demandé est introuvable.',
      };
    case '23505':
      return {
        code: 'CONFLICT',
        message: 'Un contenu avec cet identifiant existe déjà.',
      };
    case '23503':
      return {
        code: 'VALIDATION_ERROR',
        message: 'Action impossible : des données associées existent.',
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

export async function listContenus(): Promise<ContenuAvecRubrique[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('contenu')
      .select('*, rubrique(nom)')
      .order('date_creation', { ascending: false });

    if (error) {
      console.error('listContenus: Supabase error', error);
      return [];
    }

    return (data ?? []) as ContenuAvecRubrique[];
  } catch (error) {
    console.error('listContenus: Unexpected error', error);
    return [];
  }
}

export async function createContenu(
  input: CreateContenuInput
): Promise<ApiResponse<ContenuAvecRubrique>> {
  const parsed = createContenuSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: {
        code: 'VALIDATION_ERROR',
        message: firstValidationMessage(parsed.error),
      },
    };
  }

  try {
    const supabase = await createClient();

    const authError = await requireAuthenticatedUser(supabase);
    if (authError) {
      return { error: authError };
    }

    const now = new Date().toISOString();

    const payload = {
      titre: parsed.data.titre,
      texte: parsed.data.texte,
      rubrique_id: parsed.data.rubrique_id,
      statut: parsed.data.statut,
      image_url: parsed.data.image_url ?? null,
      date_creation: now,
      date_modification: now,
      date_publication: parsed.data.statut === 'publie' ? now : null,
    };

    const { data, error } = await supabase
      .from('contenu')
      .insert(payload)
      .select('*, rubrique(nom)')
      .single();

    if (error) {
      return { error: mapSupabaseError(error) };
    }

    if (!data) {
      return {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'La création du contenu a échoué.',
        },
      };
    }

    revalidateTag('contenus');

    return { data: data as ContenuAvecRubrique };
  } catch {
    return {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Une erreur technique est survenue.',
      },
    };
  }
}

export async function updateContenu(
  id: string,
  input: UpdateContenuInput
): Promise<ApiResponse<ContenuAvecRubrique>> {
  if (!id || !UUID_PATTERN.test(id)) {
    return {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Identifiant de contenu invalide.',
      },
    };
  }

  const parsed = updateContenuSchema.safeParse(input);

  if (!parsed.success) {
    return {
      error: {
        code: 'VALIDATION_ERROR',
        message: firstValidationMessage(parsed.error),
      },
    };
  }

  try {
    const supabase = await createClient();

    const authError = await requireAuthenticatedUser(supabase);
    if (authError) {
      return { error: authError };
    }

    const { data: current, error: currentError } = await supabase
      .from('contenu')
      .select('statut, date_publication')
      .eq('id', id)
      .maybeSingle();

    if (currentError) {
      return { error: mapSupabaseError(currentError) };
    }

    if (!current) {
      return {
        error: {
          code: 'NOT_FOUND',
          message: 'Le contenu à modifier est introuvable.',
        },
      };
    }

    const currentData = current as { statut: string; date_publication: string | null } | null;
    const now = new Date().toISOString();

    let date_publication: string | null = currentData?.date_publication ?? null;

    if (
      parsed.data.statut === 'publie' &&
      (currentData?.statut !== 'publie' || !date_publication)
    ) {
      date_publication = now;
    }

    if (parsed.data.statut === 'non_publie') {
      date_publication = null;
    }

    const payload = {
      titre: parsed.data.titre,
      texte: parsed.data.texte,
      rubrique_id: parsed.data.rubrique_id,
      statut: parsed.data.statut,
      image_url: parsed.data.image_url ?? null,
      date_modification: now,
      date_publication,
    };

    const { data, error } = await supabase
      .from('contenu')
      .update(payload)
      .eq('id', id)
      .select('*, rubrique(nom)')
      .single();

    if (error) {
      return { error: mapSupabaseError(error) };
    }

    if (!data) {
      return {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'La modification du contenu a échoué.',
        },
      };
    }

    revalidateTag('contenus');

    return { data: data as ContenuAvecRubrique };
  } catch {
    return {
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Une erreur technique est survenue.',
      },
    };
  }
}

export async function deleteContenu(
  id: string
): Promise<ApiResponse<null>> {
  if (!id || !UUID_PATTERN.test(id)) {
    return {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Identifiant de contenu invalide.',
      },
    };
  }

  try {
    const supabase = await createClient();

    const authError = await requireAuthenticatedUser(supabase);
    if (authError) {
      return { error: authError };
    }

    const { data: deleted, error } = await supabase
      .from('contenu')
      .delete()
      .eq('id', id)
      .select('id')
      .maybeSingle();

    if (error) {
      return { error: mapSupabaseError(error) };
    }

    if (!deleted) {
      return {
        error: {
          code: 'NOT_FOUND',
          message: 'Le contenu à supprimer est introuvable.',
        },
      };
    }

    revalidateTag('contenus');

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