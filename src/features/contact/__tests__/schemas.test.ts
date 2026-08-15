import { describe, it, expect } from 'vitest';
import { contactSchema } from '../schemas';

describe('contactSchema', () => {
  const validInput = {
    nom: 'Jean Dupont',
    email: 'jean@example.com',
    message: 'Message de contact avec au moins 10 caractères.',
  };

  describe('cas nominaux', () => {
    it('should_accepter_donnees_valides', () => {
      const result = contactSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should_accepter_message_long_de_10_caracteres_exactement', () => {
      const input = { ...validInput, message: '1234567890' };
      const result = contactSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should_accepter_message_de_5000_caracteres', () => {
      const input = { ...validInput, message: 'a'.repeat(5000) };
      const result = contactSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe('cas limites — email (FR-10.2)', () => {
    // [FR-10.2] Validation email — au moins 3 cas invalides
    it('should_rejeter_email_sans_arobase', () => {
      const input = { ...validInput, email: 'jeanexample.com' };
      const result = contactSchema.safeParse(input);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('Email invalide');
    });

    it('should_rejeter_email_sans_domaine', () => {
      const input = { ...validInput, email: 'jean@' };
      const result = contactSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_email_avec_espaces', () => {
      const input = { ...validInput, email: 'jean @example.com' };
      const result = contactSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_email_vide', () => {
      const input = { ...validInput, email: '' };
      const result = contactSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('cas limites — message (FR-10.2)', () => {
    it('should_rejeter_message_vide', () => {
      const input = { ...validInput, message: '' };
      const result = contactSchema.safeParse(input);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('10 caractères');
    });

    it('should_rejeter_message_moins_de_10_caracteres', () => {
      const input = { ...validInput, message: '123456789' };
      const result = contactSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_message_manquant', () => {
      const { message, ...input } = validInput;
      const result = contactSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_message_de_5001_caracteres', () => {
      const input = { ...validInput, message: 'a'.repeat(5001) };
      const result = contactSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('cas limites — champs obligatoires', () => {
    it('should_rejeter_nom_vide', () => {
      const input = { ...validInput, nom: '' };
      const result = contactSchema.safeParse(input);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('requis');
    });

    it('should_rejeter_nom_manquant', () => {
      const { nom, ...input } = validInput;
      const result = contactSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_email_manquant', () => {
      const { email, ...input } = validInput;
      const result = contactSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_nom_trop_long_256_caracteres', () => {
      const input = { ...validInput, nom: 'a'.repeat(256) };
      const result = contactSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});