import { z } from "zod";

const urlOrEmpty = z
  .string()
  .url("L'URL fournie est invalide.")
  .optional()
  .or(z.literal(""));

export const createLivreSchema = z.object({
  titre: z.string().min(1, "Le titre est requis."),
  description: z.string().default(""),
  prix: z.number().positive("Le prix doit être un nombre positif."),
  image_couverture_url: z.string().nullable().optional(),
  lien_amazon: urlOrEmpty,
  lien_whatsapp: urlOrEmpty,
});

export const updateLivreSchema = createLivreSchema;

export type CreateLivreInput = z.infer<typeof createLivreSchema>;
export type UpdateLivreInput = z.infer<typeof updateLivreSchema>;