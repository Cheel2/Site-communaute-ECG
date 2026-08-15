import { describe, it, expect } from 'vitest';
import { partenaireSchema } from '../schemas';

describe('partenaireSchema', () => {
  const validInput = {
    nom: 'Jean Dupont',
    email: 'jean@example.com',
    pays: 'France',
  };

  describe('cas nominaux', () => {
    it('should_accepter_donnees_valides', () => {
      const result = partenaireSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should_accepter_email_avec_domaine_complexe', () => {
      const input = { ...validInput, email: 'jean@sub.domain.co.uk' };
      const result = partenaireSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should_accepter_email_avec_plus', () => {
      const input = { ...validInput, email: 'jean+test@example.com' };
      const result = partenaireSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe('cas limites — email (FR-8.2)', () => {
    // [FR-8.2] Validation email — au moins 3 cas invalides
    it('should_rejeter_email_sans_arobase', () => {
      const input = { ...validInput, email: 'jeanexample.com' };
      const result = partenaireSchema.safeParse(input);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('Email invalide');
    });

    it('should_rejeter_email_sans_domaine', () => {
      const input = { ...validInput, email: 'jean@' };
      const result = partenaireSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_email_avec_espaces', () => {
      const input = { ...validInput, email: 'jean @example.com' };
      const result = partenaireSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_email_vide', () => {
      const input = { ...validInput, email: '' };
      const result = partenaireSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_email_trop_long_256_caracteres', () => {
      const longEmail = 'a'.repeat(245) + '@example.com'; // > 255
      const input = { ...validInput, email: longEmail };
      const result = partenaireSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('cas limites — champs obligatoires', () => {
    it('should_rejeter_nom_vide', () => {
      const input = { ...validInput, nom: '' };
      const result = partenaireSchema.safeParse(input);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('requis');
    });

    it('should_rejeter_pays_vide', () => {
      const input = { ...validInput, pays: '' };
      const result = partenaireSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_nom_manquant', () => {
      const { nom, ...input } = validInput;
      const result = partenaireSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_email_manquant', () => {
      const { email, ...input } = validInput;
      const result = partenaireSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_pays_manquant', () => {
      const { pays, ...input } = validInput;
      const result = partenaireSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('cas limites — longueur', () => {
    it('should_rejeter_nom_trop_long_256_caracteres', () => {
      const input = { ...validInput, nom: 'a'.repeat(256) };
      const result = partenaireSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_pays_trop_long_256_caracteres', () => {
      const input = { ...validInput, pays: 'a'.repeat(256) };
      const result = partenaireSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});