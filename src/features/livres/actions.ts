"use server";

import { createClient } from "@/lib/supabase/server";
import {
  createLivreSchema,
  updateLivreSchema,
  type CreateLivreInput,
  type UpdateLivreInput,
} from "./schemas";
import type { ApiResponse } from "@/types/api";
import type { Livre } from "@/types/database";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 Mo (fichier brut avant compression Edge Function)
const BUCKET_NAME = "couvertures";

interface UploadCouvertureResult {
  url: string;
  path: string;
}

export async function listLivres(): Promise<ApiResponse<Livre[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("livre")
    .select("*")
    .order("date_creation", { ascending: false });

  if (error) {
    return {
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de la récupération des livres.",
      },
    };
  }

  return { data: (data ?? []) as Livre[] };
}

export async function createLivre(
  data: CreateLivreInput
): Promise<ApiResponse<Livre>> {
  const parsed = createLivreSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error: {
        code: "VALIDATION_ERROR",
        message: "Données du livre invalides.",
        details: parsed.error.flatten().fieldErrors,
      },
    };
  }

  const supabase = await createClient();

  const payload = {
    titre: parsed.data.titre,
    description: parsed.data.description,
    prix: parsed.data.prix,
    image_couverture_url: parsed.data.image_couverture_url ?? null,
    lien_amazon: parsed.data.lien_amazon ?? null,
    lien_whatsapp: parsed.data.lien_whatsapp ?? null,
  };

  const { data: livre, error } = await supabase
    .from("livre")
    .insert(payload)
    .select()
    .single();

  if (error) {
    return {
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de la création du livre.",
      },
    };
  }

  return { data: livre as Livre };
}

export async function updateLivre(
  id: string,
  data: UpdateLivreInput
): Promise<ApiResponse<Livre>> {
  const parsed = updateLivreSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error: {
        code: "VALIDATION_ERROR",
        message: "Données du livre invalides.",
        details: parsed.error.flatten().fieldErrors,
      },
    };
  }

  const supabase = await createClient();

  const payload = {
    titre: parsed.data.titre,
    description: parsed.data.description,
    prix: parsed.data.prix,
    image_couverture_url: parsed.data.image_couverture_url ?? null,
    lien_amazon: parsed.data.lien_amazon ?? null,
    lien_whatsapp: parsed.data.lien_whatsapp ?? null,
    date_modification: new Date().toISOString(),
  };

  const { data: livre, error } = await supabase
    .from("livre")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de la mise à jour du livre.",
      },
    };
  }

  return { data: livre as Livre };
}

export async function deleteLivre(id: string): Promise<ApiResponse<null>> {
  const supabase = await createClient();

  const { error } = await supabase.from("livre").delete().eq("id", id);

  if (error) {
    return {
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur lors de la suppression du livre.",
      },
    };
  }

  return { data: null };
}

export async function uploadCouverture(
  formData: FormData
): Promise<ApiResponse<UploadCouvertureResult>> {
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return {
      error: {
        code: "VALIDATION_ERROR",
        message: "Aucun fichier image fourni.",
      },
    };
  }

  if (!file.type.startsWith("image/")) {
    return {
      error: {
        code: "VALIDATION_ERROR",
        message: "Le fichier doit être une image (JPEG, PNG, WebP ou GIF).",
      },
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      error: {
        code: "VALIDATION_ERROR",
        message: "Fichier trop lourd. Taille maximale autorisée : 5 Mo.",
      },
    };
  }

  const supabase = await createClient();

  const extension = resolveExtension(file);
  const fileName = `${globalThis.crypto.randomUUID()}.${extension}`;
  const filePath = `couvertures/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return {
      error: {
        code: "INTERNAL_ERROR",
        message:
          "Échec de l'upload de l'image. Vérifiez votre connexion ou réessayez.",
      },
    };
  }

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return {
    data: {
      url: publicUrlData.publicUrl,
      path: filePath,
    },
  };
}

function resolveExtension(file: File): string {
  const fromName = file.name.includes(".")
    ? file.name.split(".").pop()?.toLowerCase()
    : undefined;

  if (fromName && fromName.length <= 5) {
    return fromName;
  }

  switch (file.type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
}