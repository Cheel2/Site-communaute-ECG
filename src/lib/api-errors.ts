// src/lib/api-errors.ts
// Centralisation des fabriques ApiError
// Contrat : Master Document §6.4

import type { ApiError } from "@/types/api";

export function erreurValidation(message: string): { error: ApiError } {
  return {
    error: {
      code: "VALIDATION_ERROR",
      message,
    },
  };
}

export function erreurInterne(erreur: unknown): { error: ApiError } {
  const message =
    erreur instanceof Error ? erreur.message : "Erreur inconnue";
  console.error("[api-errors] Erreur interne :", message);
  return {
    error: {
      code: "INTERNAL_ERROR",
      message: "Une erreur interne est survenue. Veuillez réessayer.",
    },
  };
}

export function erreurNonAutorise(): { error: ApiError } {
  return {
    error: {
      code: "UNAUTHORIZED",
      message: "Session expirée. Veuillez vous reconnecter.",
    },
  };
}

/**
 * Mapping des erreurs Supabase vers ApiError
 * Master §6.4 : 23505→CONFLICT, 23503→VALIDATION_ERROR,
 * 42501→FORBIDDEN, PGRST116→NOT_FOUND
 */
export function mapSupabaseError(error: any): ApiError {
  if (error?.code === "23505") {
    return {
      code: "CONFLICT",
      message: "Un enregistrement avec ces informations existe déjà.",
    };
  }
  if (error?.code === "23503") {
    return {
      code: "VALIDATION_ERROR",
      message: "Action impossible : des données associées existent.",
    };
  }
  if (error?.code === "42501") {
    return {
      code: "FORBIDDEN",
      message: "Vous n'êtes pas autorisé à effectuer cette action.",
    };
  }
  if (error?.code === "PGRST116") {
    return {
      code: "NOT_FOUND",
      message: "L'élément demandé est introuvable.",
    };
  }
  return {
    code: "INTERNAL_ERROR",
    message: "Une erreur interne est survenue. Veuillez réessayer.",
  };
}
