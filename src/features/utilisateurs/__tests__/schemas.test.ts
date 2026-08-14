import { describe, it, expect } from 'vitest';
import { createUtilisateurSchema, updateUtilisateurSchema } from '../schemas';

describe('createUtilisateurSchema', () => {
  const validInput = {
    email: 'test@example.com',
    role: 'total' as const,
  };

  describe('cas nominaux', () => {
    it('should_accepter_email_valide_et_role_total', () => {
      const result = createUtilisateurSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should_accepter_role_lecture_seule', () => {
      const input = { ...validInput, role: 'lecture_seule' as const };
      const result = createUtilisateurSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should_trim_et_toLowercase_email', () => {
      const input = { ...validInput, email: '  Test@Example.COM  ' };
      const result = createUtilisateurSchema.safeParse(input);
      expect(result.success).toBe(true);
      expect(result.data?.email).toBe('test@example.com');
    });
  });

  describe('cas limites — email', () => {
    it('should_rejeter_email_vide', () => {
      const input = { ...validInput, email: '' };
      const result = createUtilisateurSchema.safeParse(input);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("L'email est requis.");
    });

    it('should_rejeter_email_invalide_sans_arobase', () => {
      const input = { ...validInput, email: 'testexample.com' };
      const result = createUtilisateurSchema.safeParse(input);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain('email est invalide');
    });

    it('should_rejeter_email_invalide_sans_domaine', () => {
      const input = { ...validInput, email: 'test@' };
      const result = createUtilisateurSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_email_invalide_avec_espaces', () => {
      const input = { ...validInput, email: 'test @example.com' };
      const result = createUtilisateurSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('cas limites — role', () => {
    it('should_rejeter_role_invalide_autre_que_total_ou_lecture_seule', () => {
      const input = { ...validInput, role: 'admin' };
      const result = createUtilisateurSchema.safeParse(input);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("'total' ou 'lecture_seule'");
    });

    it('should_rejeter_role_avec_typo', () => {
      const input = { ...validInput, role: 'totale' };
      const result = createUtilisateurSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_role_avec_majuscule', () => {
      const input = { ...validInput, role: 'Total' };
      const result = createUtilisateurSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('cas limites — champs manquants', () => {
    it('should_rejeter_email_manquant', () => {
      const { email, ...input } = validInput;
      const result = createUtilisateurSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should_rejeter_role_manquant', () => {
      const { role, ...input } = validInput;
      const result = createUtilisateurSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});

describe('updateUtilisateurSchema', () => {
  describe('cas nominaux', () => {
    it('should_accepter_role_total_optionnel', () => {
      const input = { role: 'total' as const };
      const result = updateUtilisateurSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should_accepter_role_lecture_seule_optionnel', () => {
      const input = { role: 'lecture_seule' as const };
      const result = updateUtilisateurSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should_accepter_objet_vide_puisque_role_optionnel', () => {
      const result = updateUtilisateurSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('cas limites — role invalide', () => {
    it('should_rejeter_role_invalide', () => {
      const input = { role: 'admin' };
      const result = updateUtilisateurSchema.safeParse(input);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("'total' ou 'lecture_seule'");
    });
  });
});