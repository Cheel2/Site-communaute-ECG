import { z } from 'zod';

export const createRubriqueSchema = z.object({
  nom: z
    .string()
    .trim()
    .min(1, 'Le nom de la rubrique est requis.'),
  ordre_affichage: z
    .number()
    .int()
    .default(0),
});

export const updateRubriqueSchema = z.object({
  nom: z
    .string()
    .trim()
    .min(1, 'Le nom de la rubrique est requis.'),
  ordre_affichage: z
    .number()
    .int()
    .default(0),
});

export type CreateRubriqueInput = z.input<typeof createRubriqueSchema>;
export type UpdateRubriqueInput = z.input<typeof updateRubriqueSchema>;