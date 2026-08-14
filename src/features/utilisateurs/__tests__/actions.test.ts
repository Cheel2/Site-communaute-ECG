import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  listUtilisateurs,
  createUtilisateur,
  updateUtilisateur,
  desactiverUtilisateur,
  reactiverUtilisateur,
} from '../actions';
import { createClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('listUtilisateurs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should_retourner_la_liste_des_utilisateurs_en_cas_de_succes', async () => {
    const mockData = [
      { id: '1', email: 'user1@test.com', role: 'total', statut: 'actif', date_creation: '', date_modification: '' },
    ];
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await listUtilisateurs();

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeUndefined();
    expect(mockSupabase.from).toHaveBeenCalledWith('utilisateur');
    expect(mockSupabase.from().select).toHaveBeenCalledWith('*');
    expect(mockSupabase.from().select().order).toHaveBeenCalledWith('date_creation', { ascending: false });
  });

  it('should_retourner_INTERNAL_ERROR_si_Supabase_echoue', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'DB error' } }),
        }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await listUtilisateurs();

    expect(result.data).toBeUndefined();
    expect(result.error?.code).toBe('INTERNAL_ERROR');
  });

  it('should_retourner_une_liste_vide_si_aucun_utilisateur', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await listUtilisateurs();

    expect(result.data).toEqual([]);
  });
});

describe('createUtilisateur', () => {
  const validInput = {
    email: 'newuser@test.com',
    role: 'total' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should_creer_un_utilisateur_avec_donnees_valides', async () => {
    const mockUser = { id: 'auth-123' };
    const mockData = { id: '123', email: validInput.email, role: validInput.role, statut: 'actif', date_creation: '', date_modification: '' };
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockImplementation(() => ({
          select: vi.fn().mockImplementation(() => ({
            single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          })),
        })),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await createUtilisateur(validInput);

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeUndefined();
    expect(mockSupabase.auth.getUser).toHaveBeenCalled();
    expect(mockSupabase.from).toHaveBeenCalledWith('utilisateur');
    expect(mockSupabase.from().insert).toHaveBeenCalledWith({
      email: validInput.email,
      role: validInput.role,
      statut: 'actif',
    });
  });

  it('should_retourner_VALIDATION_ERROR_si_Zod_echoue', async () => {
    const invalidInput = { ...validInput, email: '' };

    const result = await createUtilisateur(invalidInput);

    expect(result.data).toBeUndefined();
    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toContain("L'email est requis.");
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });

  it('should_retourner_UNAUTHORIZED_si_aucun_utilisateur_authentifie', async () => {
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await createUtilisateur(validInput);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      code: 'UNAUTHORIZED',
      message: 'Authentification requise.',
    });
    expect(mockSupabase.auth.getUser).toHaveBeenCalled();
  });

  it('should_retourner_CONFLICT_si_email_deja_utilise_23505', async () => {
    const mockUser = { id: 'auth-123' };
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockImplementation(() => ({
          select: vi.fn().mockImplementation(() => ({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: '23505', message: 'Duplicate key' } }),
          })),
        })),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await createUtilisateur(validInput);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      code: 'CONFLICT',
      message: 'Un utilisateur avec cet email existe déjà.',
    });
  });

  it('should_retourner_INTERNAL_ERROR_si_Supabase_echoue_autre_erreur', async () => {
    const mockUser = { id: 'auth-123' };
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockImplementation(() => ({
          select: vi.fn().mockImplementation(() => ({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'Unknown' } }),
          })),
        })),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await createUtilisateur(validInput);

    expect(result.data).toBeUndefined();
    expect(result.error?.code).toBe('INTERNAL_ERROR');
  });
});

describe('updateUtilisateur', () => {
  const userId = '123';
  const validInput = { role: 'lecture_seule' as const };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should_mettre_a_jour_le_role_avec_donnees_valides', async () => {
    const mockUser = { id: 'auth-123' };
    const mockData = { id: userId, email: 'test@test.com', role: 'lecture_seule', statut: 'actif', date_creation: '', date_modification: expect.any(String) };
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockReturnValue({
        update: vi.fn().mockImplementation(() => ({
          eq: vi.fn().mockImplementation(() => ({
            select: vi.fn().mockImplementation(() => ({
              single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
            })),
          })),
        })),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await updateUtilisateur(userId, validInput);

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeUndefined();
    expect(mockSupabase.auth.getUser).toHaveBeenCalled();
    expect(mockSupabase.from).toHaveBeenCalledWith('utilisateur');
    expect(mockSupabase.from().update).toHaveBeenCalledWith({
      role: validInput.role,
      date_modification: expect.any(String),
    });
    expect(mockSupabase.from().update().eq).toHaveBeenCalledWith('id', userId);
  });

  it('should_retourner_VALIDATION_ERROR_si_id_manquant', async () => {
    const result = await updateUtilisateur('', validInput);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      code: 'VALIDATION_ERROR',
      message: 'Identifiant utilisateur manquant.',
    });
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });

  it('should_retourner_VALIDATION_ERROR_si_aucune_donnee_a_mettre_a_jour', async () => {
    const result = await updateUtilisateur(userId, {});

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      code: 'VALIDATION_ERROR',
      message: 'Aucune donnée à mettre à jour.',
    });
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });

  it('should_retourner_VALIDATION_ERROR_si_Zod_echoue', async () => {
    const invalidInput = { role: 'admin' };

    const result = await updateUtilisateur(userId, invalidInput);

    expect(result.data).toBeUndefined();
    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });

  it('should_retourner_UNAUTHORIZED_si_aucun_utilisateur_authentifie', async () => {
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await updateUtilisateur(userId, validInput);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      code: 'UNAUTHORIZED',
      message: 'Authentification requise.',
    });
  });

  it('should_retourner_NOT_FOUND_si_utilisateur_introuvable_PGRST116', async () => {
    const mockUser = { id: 'auth-123' };
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockReturnValue({
        update: vi.fn().mockImplementation(() => ({
          eq: vi.fn().mockImplementation(() => ({
            select: vi.fn().mockImplementation(() => ({
              single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'Row not found' } }),
            })),
          })),
        })),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await updateUtilisateur('999', validInput);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      code: 'NOT_FOUND',
      message: 'Utilisateur introuvable.',
    });
  });
});

describe('desactiverUtilisateur — SOFT-DELETE CRITIQUE [D11]', () => {
  const userId = '123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ✅ TEST CRITIQUE — Preuve du soft-delete
  it('should_desactiver_un_utilisateur_avec_update_statut_desactive_et_JAMAIS_delete', async () => {
    const mockUser = { id: 'auth-123' };
    const mockData = { id: userId, email: 'test@test.com', role: 'total', statut: 'desactive', date_creation: '', date_modification: expect.any(String) };

    // Exposer À LA FOIS update() ET delete() sur le mock from()
    const mockUpdate = vi.fn().mockImplementation(() => ({
      eq: vi.fn().mockImplementation(() => ({
        select: vi.fn().mockImplementation(() => ({
          single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        })),
      })),
    }));

    const mockDelete = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    const mockFrom = vi.fn().mockReturnValue({
      update: mockUpdate,
      delete: mockDelete,
    });

    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: mockFrom,
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await desactiverUtilisateur(userId);

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeUndefined();

    // [D11] Soft-delete : update() appelé avec statut: 'desactive'
    expect(mockFrom).toHaveBeenCalledWith('utilisateur');
    expect(mockUpdate).toHaveBeenCalledWith({
      statut: 'desactive',
      date_modification: expect.any(String),
    });
    expect(mockUpdate().eq).toHaveBeenCalledWith('id', userId);

    // [D11] SOFT-DELETE UNIQUEMENT : delete() JAMAIS appelé
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('should_retourner_VALIDATION_ERROR_si_id_manquant', async () => {
    const result = await desactiverUtilisateur('');

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      code: 'VALIDATION_ERROR',
      message: 'Identifiant utilisateur manquant.',
    });
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });

  it('should_retourner_UNAUTHORIZED_si_aucun_utilisateur_authentifie', async () => {
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await desactiverUtilisateur(userId);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      code: 'UNAUTHORIZED',
      message: 'Authentification requise.',
    });
  });

  it('should_retourner_NOT_FOUND_si_utilisateur_introuvable_PGRST116', async () => {
    const mockUser = { id: 'auth-123' };
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockReturnValue({
        update: vi.fn().mockImplementation(() => ({
          eq: vi.fn().mockImplementation(() => ({
            select: vi.fn().mockImplementation(() => ({
              single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'Row not found' } }),
            })),
          })),
        })),
        delete: vi.fn(),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await desactiverUtilisateur('999');

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      code: 'NOT_FOUND',
      message: 'Utilisateur introuvable.',
    });
  });
});

describe('reactiverUtilisateur — SOFT-DELETE CRITIQUE [D11]', () => {
  const userId = '123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should_reactiver_un_utilisateur_avec_update_statut_actif_et_JAMAIS_delete', async () => {
    const mockUser = { id: 'auth-123' };
    const mockData = { id: userId, email: 'test@test.com', role: 'total', statut: 'actif', date_creation: '', date_modification: expect.any(String) };

    const mockUpdate = vi.fn().mockImplementation(() => ({
      eq: vi.fn().mockImplementation(() => ({
        select: vi.fn().mockImplementation(() => ({
          single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        })),
      })),
    }));

    const mockDelete = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });

    const mockFrom = vi.fn().mockReturnValue({
      update: mockUpdate,
      delete: mockDelete,
    });

    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: mockFrom,
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await reactiverUtilisateur(userId);

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeUndefined();

    // [D11] Soft-delete : update() appelé avec statut: 'actif'
    expect(mockFrom).toHaveBeenCalledWith('utilisateur');
    expect(mockUpdate).toHaveBeenCalledWith({
      statut: 'actif',
      date_modification: expect.any(String),
    });
    expect(mockUpdate().eq).toHaveBeenCalledWith('id', userId);

    // [D11] SOFT-DELETE UNIQUEMENT : delete() JAMAIS appelé
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it('should_retourner_VALIDATION_ERROR_si_id_manquant', async () => {
    const result = await reactiverUtilisateur('');

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      code: 'VALIDATION_ERROR',
      message: 'Identifiant utilisateur manquant.',
    });
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });

  it('should_retourner_UNAUTHORIZED_si_aucun_utilisateur_authentifie', async () => {
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await reactiverUtilisateur(userId);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      code: 'UNAUTHORIZED',
      message: 'Authentification requise.',
    });
  });
});

describe('SOFT-DELETE EXCLUSIF — [D11] — PREUVE D_ABSENCE_DE_DELETE', () => {
  it('should_PROUVER_qu_aucun_deleteUtilisateur_n_est_exporte', async () => {
    // Vérifie qu'aucune fonction deleteUtilisateur n'est exportée
    // Si elle existe, c'est une violation de D11
    const actions = await import('../actions');
    expect(actions).not.toHaveProperty('deleteUtilisateur');
  });

  it('should_PROUVER_que_desactiverUtilisateur_et_reactiverUtilisateur_utilisent_update_pas_delete', async () => {
    const mockUser = { id: 'auth-123' };
    const mockUpdate = vi.fn().mockImplementation(() => ({
      eq: vi.fn().mockImplementation(() => ({
        select: vi.fn().mockImplementation(() => ({
          single: vi.fn().mockResolvedValue({ data: { id: '1', statut: 'desactive' }, error: null }),
        })),
      })),
    }));
    const mockDelete = vi.fn();
    const mockFrom = vi.fn().mockReturnValue({ update: mockUpdate, delete: mockDelete });

    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: mockFrom,
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    await desactiverUtilisateur('123');

    // Preuve : update() appelé, delete() JAMAIS
    expect(mockUpdate).toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();

    // Second appel : réactivation
    vi.clearAllMocks();
    const mockUpdate2 = vi.fn().mockImplementation(() => ({
      eq: vi.fn().mockImplementation(() => ({
        select: vi.fn().mockImplementation(() => ({
          single: vi.fn().mockResolvedValue({ data: { id: '1', statut: 'actif' }, error: null }),
        })),
      })),
    }));
    const mockDelete2 = vi.fn();
    const mockFrom2 = vi.fn().mockReturnValue({ update: mockUpdate2, delete: mockDelete2 });
    const mockSupabase2 = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: mockFrom2,
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase2 as any);

    await reactiverUtilisateur('123');

    expect(mockUpdate2).toHaveBeenCalledWith({
      statut: 'actif',
      date_modification: expect.any(String),
    });
    expect(mockDelete2).not.toHaveBeenCalled();
  });
});