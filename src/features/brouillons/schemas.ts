import { z } from "zod";

export const saveBrouillonSchema = z.object({
  contenu_id: z.string().uuid().nullable().optional(),
  titre: z.string().default(""),
  rubrique_id: z.string().uuid().nullable().optional(),
  texte: z.string().default(""),
  image_url: z.string().nullable().optional(),
});

export type SaveBrouillonInput = z.infer<typeof saveBrouillonSchema>;