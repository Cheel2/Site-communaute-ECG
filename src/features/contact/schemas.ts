// src/features/contact/schemas.ts
import { z } from 'zod';

export const contactSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis').max(255),
  email: z.string().email('Email invalide').max(255),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères').max(5000),
});

export type ContactFormData = z.infer<typeof contactSchema>;