import { z } from 'zod';

export const partenaireSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis').max(255),
  email: z.string().email('Email invalide').max(255),
  pays: z.string().min(1, 'Le pays est requis').max(255),
});

export type PartenaireFormData = z.infer<typeof partenaireSchema>;
