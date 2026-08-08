import { z } from 'zod';

export const createUtilisateurSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, { message: "L'email est requis." })
    .email({ message: "L'adresse email est invalide." }),
  role: z.enum(['total', 'lecture_seule'], {
    errorMap: () => ({ message: "Le rôle doit être 'total' ou 'lecture_seule'." }),
  }),
});

export const updateUtilisateurSchema = z.object({
  role: z
    .enum(['total', 'lecture_seule'], {
      errorMap: () => ({ message: "Le rôle doit être 'total' ou 'lecture_seule'." }),
    })
    .optional(),
});

export type CreateUtilisateurInput = z.infer<typeof createUtilisateurSchema>;
export type UpdateUtilisateurInput = z.infer<typeof updateUtilisateurSchema>;