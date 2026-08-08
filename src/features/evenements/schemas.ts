import { z } from "zod";

const isoDateString = z
  .string()
  .refine((val) => !Number.isNaN(Date.parse(val)), {
    message: "La date doit être au format ISO valide (AAAA-MM-JJ).",
  });

export const createEvenementSchema = z.object({
  titre: z.string().min(1, "Le titre est requis."),
  description: z.string().default(""),
  date_debut: isoDateString,
  date_fin: isoDateString.optional().nullable().or(z.literal("")),
  lieu: z.string().optional().nullable(),
  type: z.enum(["recurrent", "special"], {
    errorMap: () => ({ message: "Le type doit être 'recurrent' ou 'special'." }),
  }),
  image_url: z.string().nullable().optional(),
  statut: z.string().optional(),
});

export const updateEvenementSchema = createEvenementSchema;

export type CreateEvenementInput = z.infer<typeof createEvenementSchema>;
export type UpdateEvenementInput = z.infer<typeof updateEvenementSchema>;