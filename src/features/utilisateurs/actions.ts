'use server';

import type { ZodError } from 'zod';
import { createClient } from '@/lib/supabase/server';
import type { ApiError, ApiResponse } from '@/types/api';
import type { Utilisateur } from '@/types/database';
import {
  createUtilisateurSchema,
  updateUtilisateurSchema,
  type CreateUtilisateurInput,
  type UpdateUtilisateurInput,
} from './schemas';

type StatutUtilisateur = Utilisateur['statut'];

export async function listUtilisateurs(): Promise<ApiResponse<Utilisateur[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('utilisateur')
      .select('*')
      .order('date_creation', { ascending: false });

    if (error) {
      return { error: mapSupabaseError(error) };
    }

    return { data: (data ?? []) as Utilisateur[] };
  } catch {
    return { error: erreurInterne() };
  }
}

export async function createUtilisateur(
  input: CreateUtilisateurInput
): Promise<ApiResponse<Utilisateur>> {
  const parsed = createUtilisateurSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: {
        code: 'VALIDATION_ERROR',
        message: premiereErreurValidation(parsed.error),
      },
    };
  }

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { error: { code: 'UNAUTHORIZED', message: 'Authentification requise.' } };
    }

    const { data, error } = await supabase
      .from('utilisateur')
      .insert({
        email: parsed.data.email,
        role: parsed.data.role,
        statut: 'actif',
      })
      .select()
      .single();

    if (error) {
      return { error: mapSupabaseError(error) };
    }

    return { data: data as Utilisateur };
  } catch {
    return { error: erreurInterne() };
  }
}

export async function updateUtilisateur(
  id: string,
  input: UpdateUtilisateurInput
): Promise<ApiResponse<Utilisateur>> {
  if (!id) {
    return {
      error: { code: 'VALIDATION_ERROR', message: 'Identifiant utilisateur manquant.' },
    };
  }

  const parsed = updateUtilisateurSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: {
        code: 'VALIDATION_ERROR',
        message: premiereErreurValidation(parsed.error),
      },
    };
  }

  if (!parsed.data.role) {
    return {
      error: { code: 'VALIDATION_ERROR', message: 'Aucune donnée à mettre à jour.' },
    };
  }

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { error: { code: 'UNAUTHORIZED', message: 'Authentification requise.' } };
    }

    const { data, error } = await supabase
      .from('utilisateur')
      .update({
        role: parsed.data.role,
        date_modification: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { error: mapSupabaseError(error) };
    }

    return { data: data as Utilisateur };
  } catch {
    return { error: erreurInterne() };
  }
}

export async function desactiverUtilisateur(
  id: string
): Promise<ApiResponse<Utilisateur>> {
  return changerStatutUtilisateur(id, 'desactive');
}

export async function reactiverUtilisateur(
  id: string
): Promise<ApiResponse<Utilisateur>> {
  return changerStatutUtilisateur(id, 'actif');
}

async function changerStatutUtilisateur(
  id: string,
  statut: StatutUtilisateur
): Promise<ApiResponse<Utilisateur>> {
  if (!id) {
    return {
      error: { code: 'VALIDATION_ERROR', message: 'Identifiant utilisateur manquant.' },
    };
  }

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { error: { code: 'UNAUTHORIZED', message: 'Authentification requise.' } };
    }

    const { data, error } = await supabase
      .from('utilisateur')
      .update({
        statut,
        date_modification: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { error: mapSupabaseError(error) };
    }

    return { data: data as Utilisateur };
  } catch {
    return { error: erreurInterne() };
  }
}

function mapSupabaseError(error: { code: string; message: string }): ApiError {
  switch (error.code) {
    case '23505':
      return {
        code: 'CONFLICT',
        message: 'Un utilisateur avec cet email existe déjà.',
      };
    case '23503':
      return {
        code: 'VALIDATION_ERROR',
        message: "Cet utilisateur n'est associé à aucun compte d'authentification.",
      };
    case '42501':
      return {
        code: 'FORBIDDEN',
        message: "Vous n'avez pas les droits nécessaires pour cette action.",
      };
    case 'PGRST116':
      return {
        code: 'NOT_FOUND',
        message: 'Utilisateur introuvable.',
      };
    default:
      return erreurInterne();
  }
}

function premiereErreurValidation(error: ZodError): string {
  return error.errors[0]?.message ?? 'Données invalides.';
}

function erreurInterne(): ApiError {
  return {
    code: 'INTERNAL_ERROR',
    message: 'Une erreur inattendue est survenue. Veuillez réessayer.',
  };
}