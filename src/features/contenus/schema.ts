import { z } from 'zod';

export const statutContenuSchema = z.enum(['publie', 'non_publie']);

export const createContenuSchema = z.object({
  titre: z
    .string()
    .trim()
    .min(1, 'Le titre du contenu est requis.'),
  texte: z
    .string()
    .default(''),
  rubrique_id: z
    .string()
    .uuid('La rubrique associée est invalide.'),
  statut: statutContenuSchema,
  image_url: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((value) => (value === '' ? null : value ?? null)),
});

export const updateContenuSchema = z.object({
  titre: z
    .string()
    .trim()
    .min(1, 'Le titre du contenu est requis.'),
  texte: z
    .string()
    .default(''),
  rubrique_id: z
    .string()
    .uuid('La rubrique associée est invalide.'),
  statut: statutContenuSchema,
  image_url: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((value) => (value === '' ? null : value ?? null)),
});

export type StatutContenu = z.infer<typeof statutContenuSchema>;
export type CreateContenuInput = z.input<typeof createContenuSchema>;
export type UpdateContenuInput = z.input<typeof updateContenuSchema>;