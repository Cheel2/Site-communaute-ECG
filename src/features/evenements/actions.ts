"use server";

import { createClient } from "@/lib/supabase/server";
import {
  createEvenementSchema,
  updateEvenementSchema,
  type CreateEvenementInput,
  type UpdateEvenementInput,
} from "./schemas";
import type { ApiResponse } from "@/types/api";
import type { Evenement } from "@/types/database";

export async function listEvenements(): Promise<ApiResponse<Evenement[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("evenement")
    .select("*")
    .order("date_debut", { ascending: false });

  if (error) {
    return {
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de la récupération des événements.",
      },
    };
  }

  return { data: (data ?? []) as Evenement[] };
}

export async function createEvenement(
  data: CreateEvenementInput
): Promise<ApiResponse<Evenement>> {
  const parsed = createEvenementSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error: {
        code: "VALIDATION_ERROR",
        message: "Données de l'événement invalides.",
        details: parsed.error.flatten().fieldErrors,
      },
    };
  }

  const supabase = await createClient();

  const payload = {
    titre: parsed.data.titre,
    description: parsed.data.description,
    date_debut: parsed.data.date_debut,
    date_fin: parsed.data.date_fin || null,
    lieu: parsed.data.lieu ?? null,
    type: parsed.data.type,
    image_url: parsed.data.image_url ?? null,
    statut: parsed.data.statut ?? "planifie",
  };

  const { data: evenement, error } = await supabase
    .from("evenement")
    .insert(payload)
    .select()
    .single();

  if (error) {
    return {
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de la création de l'événement.",
      },
    };
  }

  return { data: evenement as Evenement };
}

export async function updateEvenement(
  id: string,
  data: UpdateEvenementInput
): Promise<ApiResponse<Evenement>> {
  const parsed = updateEvenementSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error: {
        code: "VALIDATION_ERROR",
        message: "Données de l'événement invalides.",
        details: parsed.error.flatten().fieldErrors,
      },
    };
  }

  const supabase = await createClient();

  const payload = {
    titre: parsed.data.titre,
    description: parsed.data.description,
    date_debut: parsed.data.date_debut,
    date_fin: parsed.data.date_fin || null,
    lieu: parsed.data.lieu ?? null,
    type: parsed.data.type,
    image_url: parsed.data.image_url ?? null,
    statut: parsed.data.statut ?? "planifie",
    date_modification: new Date().toISOString(),
  };

  const { data: evenement, error } = await supabase
    .from("evenement")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de la mise à jour de l'événement.",
      },
    };
  }

  return { data: evenement as Evenement };
}

export async function deleteEvenement(
  id: string
): Promise<ApiResponse<null>> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("evenement")
    .delete()
    .eq("id", id);

  if (error) {
    return {
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de la suppression de l'événement.",
      },
    };
  }

  return { data: null };
}