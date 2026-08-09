// src/lib/api-errors.ts
// Centralisation des fabriques ApiError — résorption du backlog MC-4 → MC-17.
// Contrat : Master Document §6.4 (codes VALIDATION_ERROR | INTERNAL_ERROR | UNAUTHORIZED).

import type { ApiError } from "@/types/api";

/**
 * Erreur de validation (schéma Zod, entrée invalide).
 * Code : VALIDATION_ERROR
 */
export function erreurValidation(message: string): { error: ApiError } {
  return {
    error: {
      code: "VALIDATION_ERROR",
      message,
    },
  };
}

/**
 * Erreur interne inattendue (exception Supabase, réseau, etc.).
 * Code : INTERNAL_ERROR
 * Log serveur pour traçabilité — jamais d'exposition de détails techniques au client.
 */
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

/**
 * Session absente ou expirée.
 * Code : UNAUTHORIZED
 */
export function erreurNonAutorise(): { error: ApiError } {
  return {
    error: {
      code: "UNAUTHORIZED",
      message: "Session expirée. Veuillez vous reconnecter.",
    },
  };
}