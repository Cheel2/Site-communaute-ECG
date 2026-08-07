import { z } from 'zod';

export const updateBanniereSchema = z.object({
  image_url: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((value) => {
      if (value === '') {
        return null;
      }

      return value ?? null;
    }),
  message: z
    .string()
    .trim()
    .min(1, 'Le message de la bannière est requis.'),
});

export type UpdateBanniereInput = z.infer<typeof updateBanniereSchema>;