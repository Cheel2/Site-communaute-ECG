'use server';

import type { ZodError } from 'zod';
import { createClient } from '@/lib/supabase/server';
import type { ApiError, ApiResponse } from '@/types/api';
import type { PageSeo, Parametre } from '@/types/database';
import {
  updateSeoSchema,
  updateWhatsappSchema,
  type UpdateSeoInput,
  type UpdateWhatsappInput,
} from './schemas';

const CLE_WHATSAPP_NUMERO = 'whatsapp_numero';
const CLE_WHATSAPP_MESSAGE_DEFAUT = 'whatsapp_message_defaut';

export type WhatsappConfig = {
  numero: string;
  message_defaut: string;
};

export async function getWhatsappConfig(): Promise<ApiResponse<WhatsappConfig>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('parametre')
      .select('cle, valeur')
      .in('cle', [CLE_WHATSAPP_NUMERO, CLE_WHATSAPP_MESSAGE_DEFAUT]);

    if (error) {
      return { error: mapSupabaseError(error) };
    }

    const lignes = (data ?? []) as Array<Pick<Parametre, 'cle' | 'valeur'>>;

    return {
      data: {
        numero: lignes.find((ligne) => ligne.cle === CLE_WHATSAPP_NUMERO)?.valeur ?? '',
        message_defaut:
          lignes.find((ligne) => ligne.cle === CLE_WHATSAPP_MESSAGE_DEFAUT)?.valeur ?? '',
      },
    };
  } catch {
    return { error: erreurInterne() };
  }
}

export async function updateWhatsappConfig(
  input: UpdateWhatsappInput
): Promise<ApiResponse<WhatsappConfig>> {
  const parsed = updateWhatsappSchema.safeParse(input);
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

    const numero = parsed.data.numero;
    const messageDefaut = parsed.data.message_defaut ?? '';

    const { error } = await supabase
      .from('parametre')
      .upsert(
        [
          { cle: CLE_WHATSAPP_NUMERO, valeur: numero },
          { cle: CLE_WHATSAPP_MESSAGE_DEFAUT, valeur: messageDefaut },
        ],
        { onConflict: 'cle' }
      );

    if (error) {
      return { error: mapSupabaseError(error) };
    }

    return { data: { numero, message_defaut: messageDefaut } };
  } catch {
    return { error: erreurInterne() };
  }
}

export async function getAllSeo(): Promise<ApiResponse<PageSeo[]>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('page_seo')
      .select('*')
      .order('chemin', { ascending: true });

    if (error) {
      return { error: mapSupabaseError(error) };
    }

    return { data: (data ?? []) as PageSeo[] };
  } catch {
    return { error: erreurInterne() };
  }
}

export async function upsertSeo(input: UpdateSeoInput): Promise<ApiResponse<PageSeo>> {
  const parsed = updateSeoSchema.safeParse(input);
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
      .from('page_seo')
      .upsert(
        {
          chemin: normaliserChemin(parsed.data.chemin),
          titre: parsed.data.titre ?? '',
          meta_description: parsed.data.meta_description ?? '',
          mots_cles: parsed.data.mots_cles ?? '',
          date_modification: new Date().toISOString(),
        },
        { onConflict: 'chemin' }
      )
      .select()
      .single();

    if (error) {
      return { error: mapSupabaseError(error) };
    }

    return { data: data as PageSeo };
  } catch {
    return { error: erreurInterne() };
  }
}

function normaliserChemin(chemin: string): string {
  const nettoye = chemin.trim().replace(/\/+$/, '');
  if (nettoye === '') {
    return '/';
  }
  return nettoye.startsWith('/') ? nettoye : `/${nettoye}`;
}

function mapSupabaseError(error: { code: string; message: string }): ApiError {
  switch (error.code) {
    case '23505':
      return {
        code: 'CONFLICT',
        message: 'Cette valeur existe déjà.',
      };
    case '42501':
      return {
        code: 'FORBIDDEN',
        message: "Vous n'avez pas les droits nécessaires pour cette action.",
      };
    case 'PGRST116':
      return {
        code: 'NOT_FOUND',
        message: 'Donnée introuvable.',
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