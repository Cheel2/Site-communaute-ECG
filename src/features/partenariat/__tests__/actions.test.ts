import { describe, it, expect, beforeEach, vi } from 'vitest';
import { submitPartenariat } from '../actions';
import { createAnonClient } from '@/lib/supabase/anon';

vi.mock('@/lib/supabase/anon', () => ({
  createAnonClient: vi.fn(),
}));

describe('submitPartenariat', () => {
  const validInput = {
    nom: 'Jean Dupont',
    email: 'jean@example.com',
    pays: 'France',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should_inserer_un_partenariat_avec_donnees_valides', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: null }),
      }),
    };
    vi.mocked(createAnonClient).mockReturnValue(mockSupabase as any);

    const result = await submitPartenariat(validInput);

    expect(result.data).toBeNull();
    expect(result.error).toBeUndefined();
    expect(mockSupabase.from).toHaveBeenCalledWith('partenaire');
    expect(mockSupabase.from().insert).toHaveBeenCalledWith({
      nom: validInput.nom,
      email: validInput.email,
      pays: validInput.pays,
    });
  });

  it('should_retourner_VALIDATION_ERROR_si_Zod_echoue', async () => {
    const invalidInput = { ...validInput, email: 'invalide' };

    const result = await submitPartenariat(invalidInput);

    expect(result.data).toBeUndefined();
    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toContain('Email invalide');
    expect(vi.mocked(createAnonClient)).not.toHaveBeenCalled();
  });

  it('should_retourner_INTERNAL_ERROR_si_Supabase_echoue', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: { code: '23505', message: 'Duplicate' } }),
      }),
    };
    vi.mocked(createAnonClient).mockReturnValue(mockSupabase as any);

    const result = await submitPartenariat(validInput);

    expect(result.data).toBeUndefined();
    expect(result.error?.code).toBe('INTERNAL_ERROR');
    expect(result.error?.message).toBe("Une erreur inattendue s'est produite. Veuillez réessayer.");
  });

  it('should_retourner_INTERNAL_ERROR_si_exception_inattendue', async () => {
    vi.mocked(createAnonClient).mockImplementation(() => {
      throw new Error('Network error');
    });

    const result = await submitPartenariat(validInput);

    expect(result.data).toBeUndefined();
    expect(result.error?.code).toBe('INTERNAL_ERROR');
  });

  it('should_PROUVER_absence_d_auth_pour_formulaire_public', async () => {
    // Les formulaires publics utilisent createAnonClient, PAS createClient
    // Aucun appel à supabase.auth.getUser()
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: null }),
      }),
    };
    vi.mocked(createAnonClient).mockReturnValue(mockSupabase as any);

    await submitPartenariat(validInput);

    // Vérifie que createAnonClient a été appelé (pas createClient)
    expect(vi.mocked(createAnonClient)).toHaveBeenCalled();
    // Vérifie qu'aucune méthode auth n'est appelée sur le mock
    expect((mockSupabase as any).auth).toBeUndefined();
  });
});