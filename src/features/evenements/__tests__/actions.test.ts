import { describe, it, expect, beforeEach, vi } from 'vitest';
import { listEvenements, createEvenement, updateEvenement, deleteEvenement } from '../actions';
import { createClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('listEvenements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should_retourner_la_liste_des_evenements_en_cas_de_succes', async () => {
    const mockData = [
      { id: '1', titre: 'Messe', description: '', date_debut: '2026-08-15', date_fin: null, lieu: null, type: 'recurrent', statut: 'planifie', inscription_requise: false, date_creation: '', date_modification: '', image_url: null },
    ];
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await listEvenements();

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeUndefined();
    expect(mockSupabase.from).toHaveBeenCalledWith('evenement');
    expect(mockSupabase.from().select).toHaveBeenCalledWith('*');
    expect(mockSupabase.from().select().order).toHaveBeenCalledWith('date_debut', { ascending: false });
  });

  it('should_retourner_INTERNAL_ERROR_si_Supabase_echoue', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
        }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await listEvenements();

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      code: 'INTERNAL_ERROR',
      message: 'Erreur lors de la récupération des événements.',
    });
  });

  it('should_retourner_une_liste_vide_si_aucun_evenement', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await listEvenements();

    expect(result.data).toEqual([]);
  });
});

describe('createEvenement', () => {
  const validInput = {
    titre: 'Messe dominicale',
    description: 'Messe en français',
    date_debut: '2026-08-15',
    date_fin: null,
    lieu: 'Église Saint-Pierre',
    type: 'recurrent' as const,
    image_url: null,
    statut: 'planifie',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should_creer_un_evenement_avec_donnees_valides', async () => {
    const mockData = { id: '123', ...validInput, date_creation: '', date_modification: '', inscription_requise: false };
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockImplementation(() => ({
          select: vi.fn().mockImplementation(() => ({
            single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          })),
        })),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await createEvenement(validInput);

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeUndefined();
    expect(mockSupabase.from).toHaveBeenCalledWith('evenement');
    expect(mockSupabase.from().insert).toHaveBeenCalledWith({
      titre: validInput.titre,
      description: validInput.description,
      date_debut: validInput.date_debut,
      date_fin: null,
      lieu: validInput.lieu,
      type: validInput.type,
      image_url: null,
      statut: 'planifie',
    });
  });

  it('should_retourner_VALIDATION_ERROR_si_Zod_echoue', async () => {
    const invalidInput = { ...validInput, type: 'invalide' } as any;

    const result = await createEvenement(invalidInput);

    expect(result.data).toBeUndefined();
    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe("Données de l'événement invalides.");
    expect(result.error?.details).toBeDefined();
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });

  it('should_retourner_INTERNAL_ERROR_si_Supabase_echoue', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockImplementation(() => ({
          select: vi.fn().mockImplementation(() => ({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
          })),
        })),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await createEvenement(validInput);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      code: 'INTERNAL_ERROR',
      message: 'Erreur lors de la création de l\'événement.',
    });
  });

  it('should_convertir_date_fin_empty_string_en_null', async () => {
    const input = { ...validInput, date_fin: '' };
    const mockData = { id: '123', ...input, date_fin: null, date_creation: '', date_modification: '', inscription_requise: false };
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockImplementation(() => ({
          select: vi.fn().mockImplementation(() => ({
            single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          })),
        })),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    await createEvenement(input);

    expect(mockSupabase.from().insert).toHaveBeenCalledWith(
      expect.objectContaining({ date_fin: null })
    );
  });

  it('should_utiliser_statut_planifie_par_defaut_si_non_fourni', async () => {
    const { statut, ...input } = validInput;
    const mockData = { id: '123', ...input, statut: 'planifie', date_creation: '', date_modification: '', inscription_requise: false };
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockImplementation(() => ({
          select: vi.fn().mockImplementation(() => ({
            single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          })),
        })),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    await createEvenement(input);

    expect(mockSupabase.from().insert).toHaveBeenCalledWith(
      expect.objectContaining({ statut: 'planifie' })
    );
  });
});

describe('updateEvenement', () => {
  const validInput = {
    titre: 'Messe mise à jour',
    description: 'Nouvelle description',
    date_debut: '2026-08-16',
    date_fin: '2026-08-16',
    lieu: 'Église Saint-Jean',
    type: 'special' as const,
    image_url: 'https://example.com/new.jpg',
    statut: 'publie',
  };
  const eventId = '123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should_mettre_a_jour_un_evenement_avec_donnees_valides', async () => {
    const mockData = { id: eventId, ...validInput, date_creation: '', date_modification: expect.any(String), inscription_requise: false };
    const mockSupabase = {
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

    const result = await updateEvenement(eventId, validInput);

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeUndefined();
    expect(mockSupabase.from).toHaveBeenCalledWith('evenement');
    expect(mockSupabase.from().update).toHaveBeenCalledWith(
      expect.objectContaining({
        titre: validInput.titre,
        description: validInput.description,
        date_debut: validInput.date_debut,
        date_fin: validInput.date_fin,
        lieu: validInput.lieu,
        type: validInput.type,
        image_url: validInput.image_url,
        statut: validInput.statut,
        date_modification: expect.any(String),
      })
    );
  });

  it('should_retourner_VALIDATION_ERROR_si_Zod_echoue', async () => {
    const invalidInput = { ...validInput, type: 'invalide' } as any;

    const result = await updateEvenement(eventId, invalidInput);

    expect(result.data).toBeUndefined();
    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });

  it('should_retourner_INTERNAL_ERROR_si_Supabase_echoue_PGRST116_row_not_found', async () => {
    const mockSupabase = {
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

    const result = await updateEvenement('999', validInput);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      code: 'INTERNAL_ERROR',
      message: 'Erreur lors de la mise à jour de l\'événement.',
    });
  });
});

describe('deleteEvenement — Hard-delete [D11]', () => {
  const eventId = '123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should_supprimer_un_evenement_et_retourner_null_en_cas_de_succes', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        delete: vi.fn().mockImplementation(() => ({
          eq: vi.fn().mockResolvedValue({ error: null }),
        })),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await deleteEvenement(eventId);

    expect(result.data).toBeNull();
    expect(result.error).toBeUndefined();
    expect(mockSupabase.from).toHaveBeenCalledWith('evenement');
    const deleteChain = mockSupabase.from().delete();
    expect(deleteChain.eq).toBeDefined();
    expect(deleteChain.eq().select).toBeUndefined();
    expect(deleteChain.eq().maybeSingle).toBeUndefined();
  });

  it('should_retourner_INTERNAL_ERROR_si_Supabase_echoue', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        delete: vi.fn().mockImplementation(() => ({
          eq: vi.fn().mockResolvedValue({ error: { message: 'DB error' } }),
        })),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await deleteEvenement(eventId);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      code: 'INTERNAL_ERROR',
      message: 'Erreur lors de la suppression de l\'événement.',
    });
  });

  it('should_retourner_INTERNAL_ERROR_si_aucune_ligne_supprimee_PGRST116', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        delete: vi.fn().mockImplementation(() => ({
          eq: vi.fn().mockResolvedValue({ error: { code: 'PGRST116', message: 'Row not found' } }),
        })),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await deleteEvenement('999');

    expect(result.error).toEqual({
      code: 'INTERNAL_ERROR',
      message: 'Erreur lors de la suppression de l\'événement.',
    });
  });

  it('should_PROUVER_hard_delete_D11_en_verifiant_aucun_update_n_est_appele', async () => {
    const mockUpdate = vi.fn();
    const mockDelete = vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    });
    const mockFrom = vi.fn().mockReturnValue({
      delete: mockDelete,
      update: mockUpdate,
    });

    const mockSupabase = { from: mockFrom };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    await deleteEvenement(eventId);

    expect(mockFrom).toHaveBeenCalledWith('evenement');
    expect(mockDelete).toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
