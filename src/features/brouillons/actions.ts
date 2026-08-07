"use server";

import { createClient } from "@/lib/supabase/server";
import { saveBrouillonSchema, SaveBrouillonInput } from "./schemas";
import type { ApiResponse } from "@/types/api";
import type { Brouillon } from "@/types/database";

export async function saveBrouillon(
  data: SaveBrouillonInput
): Promise<ApiResponse<Brouillon>> {
  const parsed = saveBrouillonSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error: {
        code: "VALIDATION_ERROR",
        message: "Données du brouillon invalides.",
        details: parsed.error.flatten().fieldErrors,
      },
    };
  }

  const supabase = await createClient();
  const { contenu_id, titre, rubrique_id, texte, image_url } = parsed.data;

  const payload = {
    titre,
    rubrique_id: rubrique_id ?? null,
    texte,
    image_url: image_url ?? null,
    date_derniere_sauvegarde: new Date().toISOString(),
  };

  if (contenu_id) {
    // Upsert : chercher le brouillon existant pour ce contenu
    const { data: existing, error: findError } = await supabase
      .from("brouillon")
      .select("id")
      .eq("contenu_id", contenu_id)
      .maybeSingle();

    if (findError) {
      return {
        error: {
          code: "INTERNAL_ERROR",
          message: "Erreur lors de la recherche du brouillon.",
        },
      };
    }

    if (existing) {
      const { data: updated, error: updateError } = await supabase
        .from("brouillon")
        .update(payload)
        .eq("id", existing.id)
        .select()
        .single();

      if (updateError) {
        return {
          error: {
            code: "INTERNAL_ERROR",
            message: "Erreur lors de la mise à jour du brouillon.",
          },
        };
      }

      return { data: updated as Brouillon };
    }

    // Pas de brouillon existant → insert avec contenu_id
    const { data: inserted, error: insertError } = await supabase
      .from("brouillon")
      .insert({ ...payload, contenu_id })
      .select()
      .single();

    if (insertError) {
      return {
        error: {
          code: "INTERNAL_ERROR",
          message: "Erreur lors de la création du brouillon.",
        },
      };
    }

    return { data: inserted as Brouillon };
  }

  // Pas de contenu_id → nouveau brouillon libre
  const { data: inserted, error: insertError } = await supabase
    .from("brouillon")
    .insert(payload)
    .select()
    .single();

  if (insertError) {
    return {
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de la création du brouillon.",
      },
    };
  }

  return { data: inserted as Brouillon };
}

export async function getBrouillon(
  contenuId: string
): Promise<ApiResponse<Brouillon | null>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brouillon")
    .select("*")
    .eq("contenu_id", contenuId)
    .maybeSingle();

  if (error) {
    return {
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de la récupération du brouillon.",
      },
    };
  }

  return { data: (data as Brouillon) ?? null };
}