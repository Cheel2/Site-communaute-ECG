import { z } from 'zod';

// Le '+' doit être échappé : un quantifieur '+' sans atome précédent est une SyntaxError en JS.
const WHATSAPP_NUMERO_REGEX = /^\+?[1-9]\d{7,14}$/;

export const updateWhatsappSchema = z.object({
  numero: z
    .string()
    .trim()
    .regex(WHATSAPP_NUMERO_REGEX, 'Format international invalide (ex: +24106000000)'),
  message_defaut: z.string().trim().optional(),
});

export const updateSeoSchema = z.object({
  chemin: z.string().trim().min(1, { message: 'Le chemin est requis.' }),
  titre: z.string().trim().optional(),
  meta_description: z.string().trim().optional(),
  mots_cles: z.string().trim().optional(),
});

export type UpdateWhatsappInput = z.infer<typeof updateWhatsappSchema>;
export type UpdateSeoInput = z.infer<typeof updateSeoSchema>;