import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getWhatsappConfig,
  updateWhatsappConfig,
  getAllSeo,
  upsertSeo,
} from '../actions';
import { createClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('getWhatsappConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should_retourner_la_config_whatsapp_avec_numero_et_message_defaut', async () => {
    const mockData = [
      { cle: 'whatsapp_numero', valeur: '+24106000000' },
      { cle: 'whatsapp_message_defaut', valeur: 'Bonjour !' },
    ];
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await getWhatsappConfig();

    expect(result.data).toEqual({
      numero: '+24106000000',
      message_defaut: 'Bonjour !',
    });
    expect(result.error).toBeUndefined();
    expect(mockSupabase.from).toHaveBeenCalledWith('parametre');
  });

  it('should_retourner_valeurs_vides_si_cles_manquantes', async () => {
    const mockData = [{ cle: 'whatsapp_numero', valeur: '+24106000000' }];
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await getWhatsappConfig();

    expect(result.data).toEqual({
      numero: '+24106000000',
      message_defaut: '',
    });
  });

  it('should_retourner_INTERNAL_ERROR_si_Supabase_echoue', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'Error' } }),
        }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await getWhatsappConfig();

    expect(result.data).toBeUndefined();
    expect(result.error?.code).toBe('INTERNAL_ERROR');
  });

  it('should_retourner_NOT_FOUND_si_PGRST116', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'Not found' } }),
        }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await getWhatsappConfig();

    expect(result.data).toBeUndefined();
    expect(result.error?.code).toBe('NOT_FOUND');
  });
});

describe('updateWhatsappConfig', () => {
  const validInput = {
    numero: '+24106000000',
    message_defaut: 'Bonjour !',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should_upsert_la_config_whatsapp_avec_onConflict_cle', async () => {
    const mockUser = { id: 'auth-123' };
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockReturnValue({
        upsert: vi.fn().mockResolvedValue({ error: null }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await updateWhatsappConfig(validInput);

    expect(result.data).toEqual({
      numero: '+24106000000',
      message_defaut: 'Bonjour !',
    });
    expect(result.error).toBeUndefined();
    expect(mockSupabase.auth.getUser).toHaveBeenCalled();
    expect(mockSupabase.from).toHaveBeenCalledWith('parametre');
    expect(mockSupabase.from().upsert).toHaveBeenCalledWith(
      [
        { cle: 'whatsapp_numero', valeur: '+24106000000' },
        { cle: 'whatsapp_message_defaut', valeur: 'Bonjour !' },
      ],
      { onConflict: 'cle' }
    );
  });

  it('should_retourner_VALIDATION_ERROR_si_Zod_echoue', async () => {
    const invalidInput = { numero: '123' };

    const result = await updateWhatsappConfig(invalidInput);

    expect(result.data).toBeUndefined();
    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });

  it('should_retourner_UNAUTHORIZED_si_aucun_utilisateur_authentifie', async () => {
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await updateWhatsappConfig(validInput);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      code: 'UNAUTHORIZED',
      message: 'Authentification requise.',
    });
  });

  it('should_proouver_l_idempotence_avec_onConflict_cle', async () => {
    const mockUser = { id: 'auth-123' };
    let upsertCallCount = 0;
    const mockUpsert = vi.fn().mockImplementation(() => {
      upsertCallCount++;
      return Promise.resolve({ error: null });
    });
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockReturnValue({
        upsert: mockUpsert,
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    // Premier appel
    await updateWhatsappConfig(validInput);
    // Second appel (idempotent)
    await updateWhatsappConfig(validInput);

    expect(mockUpsert).toHaveBeenCalledTimes(2);
    // Les deux appels utilisent onConflict: 'cle' → idempotence
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ cle: 'whatsapp_numero' }),
      ]),
      { onConflict: 'cle' }
    );
  });
});

describe('getAllSeo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should_retourner_la_liste_des_pages_seo_triees_par_chemin', async () => {
    const mockData = [
      { id: '1', chemin: '/a-propos', titre: 'À propos', meta_description: '', mots_cles: '', date_modification: '' },
      { id: '2', chemin: '/evenements', titre: 'Événements', meta_description: '', mots_cles: '', date_modification: '' },
    ];
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await getAllSeo();

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeUndefined();
    expect(mockSupabase.from).toHaveBeenCalledWith('page_seo');
    expect(mockSupabase.from().select).toHaveBeenCalledWith('*');
    expect(mockSupabase.from().select().order).toHaveBeenCalledWith('chemin', { ascending: true });
  });

  it('should_retourner_une_liste_vide_si_aucune_page_seo', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await getAllSeo();

    expect(result.data).toEqual([]);
  });

  it('should_retourner_NOT_FOUND_si_PGRST116', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'Not found' } }),
        }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await getAllSeo();

    expect(result.data).toBeUndefined();
    expect(result.error?.code).toBe('NOT_FOUND');
  });
});

describe('upsertSeo — NORMALISATION DE CHEMIN CRITIQUE [MOD-WA]', () => {
  const validInput = {
    chemin: '/evenements',
    titre: 'Événements',
    meta_description: 'Liste des événements',
    mots_cles: 'evenements, agenda',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should_upsert_une_page_seo_avec_onConflict_chemin', async () => {
    const mockUser = { id: 'auth-123' };
    const mockData = { id: '1', chemin: '/evenements', titre: 'Événements', meta_description: 'Liste des événements', mots_cles: 'evenements, agenda', date_modification: expect.any(String) };
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockReturnValue({
        upsert: vi.fn().mockImplementation(() => ({
          select: vi.fn().mockImplementation(() => ({
            single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
          })),
        })),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await upsertSeo(validInput);

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeUndefined();
    expect(mockSupabase.auth.getUser).toHaveBeenCalled();
    expect(mockSupabase.from).toHaveBeenCalledWith('page_seo');
    expect(mockSupabase.from().upsert).toHaveBeenCalledWith(
      {
        chemin: '/evenements',
        titre: 'Événements',
        meta_description: 'Liste des événements',
        mots_cles: 'evenements, agenda',
        date_modification: expect.any(String),
      },
      { onConflict: 'chemin' }
    );
  });

  // ✅ TEST CRITIQUE — Normalisation chemin : CAS 1 — avec slash initial
  it('should_normaliser_chemin_avec_slash_initial_en_le_conservant', async () => {
    const mockUser = { id: 'auth-123' };
    let capturedPayload: any = null;
    const mockUpsert = vi.fn().mockImplementation((payload) => {
      capturedPayload = payload;
      return {
        select: vi.fn().mockImplementation(() => ({
          single: vi.fn().mockResolvedValue({ data: { ...payload, id: '1' }, error: null }),
        })),
      };
    });
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockReturnValue({ upsert: mockUpsert }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    await upsertSeo({ chemin: '/evenements' });

    expect(capturedPayload.chemin).toBe('/evenements');
  });

  // ✅ TEST CRITIQUE — Normalisation chemin : CAS 2 — sans slash initial → ajout du slash
  it('should_normaliser_chemin_sans_slash_initial_en_ajoutant_le_slash', async () => {
    const mockUser = { id: 'auth-123' };
    let capturedPayload: any = null;
    const mockUpsert = vi.fn().mockImplementation((payload) => {
      capturedPayload = payload;
      return {
        select: vi.fn().mockImplementation(() => ({
          single: vi.fn().mockResolvedValue({ data: { ...payload, id: '1' }, error: null }),
        })),
      };
    });
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockReturnValue({ upsert: mockUpsert }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    await upsertSeo({ chemin: 'evenements' });

    // normaliserChemin : trim + retrait slash final + ajout slash initial
    expect(capturedPayload.chemin).toBe('/evenements');
  });

  // ✅ TEST CRITIQUE — Normalisation chemin : CAS 3 — avec slash final → retrait du slash
  it('should_normaliser_chemin_avec_slash_final_en_retirant_le_slash', async () => {
    const mockUser = { id: 'auth-123' };
    let capturedPayload: any = null;
    const mockUpsert = vi.fn().mockImplementation((payload) => {
      capturedPayload = payload;
      return {
        select: vi.fn().mockImplementation(() => ({
          single: vi.fn().mockResolvedValue({ data: { ...payload, id: '1' }, error: null }),
        })),
      };
    });
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockReturnValue({ upsert: mockUpsert }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    await upsertSeo({ chemin: '/evenements/' });

    expect(capturedPayload.chemin).toBe('/evenements');
  });

  // ✅ TEST CRITIQUE — Normalisation chemin : CAS supplémentaire — chemin vide → '/'
  it('should_normaliser_chemin_vide_en_slash_seul', async () => {
    const mockUser = { id: 'auth-123' };
    let capturedPayload: any = null;
    const mockUpsert = vi.fn().mockImplementation((payload) => {
      capturedPayload = payload;
      return {
        select: vi.fn().mockImplementation(() => ({
          single: vi.fn().mockResolvedValue({ data: { ...payload, id: '1' }, error: null }),
        })),
      };
    });
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockReturnValue({ upsert: mockUpsert }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    await upsertSeo({ chemin: '' });

    expect(capturedPayload.chemin).toBe('/');
  });

  it('should_retourner_VALIDATION_ERROR_si_Zod_echoue', async () => {
    const invalidInput = { chemin: '' };

    const result = await upsertSeo(invalidInput);

    expect(result.data).toBeUndefined();
    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(vi.mocked(createClient)).not.toHaveBeenCalled();
  });

  it('should_retourner_UNAUTHORIZED_si_aucun_utilisateur_authentifie', async () => {
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await upsertSeo(validInput);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      code: 'UNAUTHORIZED',
      message: 'Authentification requise.',
    });
  });

  it('should_proouver_l_idempotence_avec_onConflict_chemin', async () => {
    const mockUser = { id: 'auth-123' };
    let upsertCallCount = 0;
    const mockUpsert = vi.fn().mockImplementation((payload) => {
      upsertCallCount++;
      return {
        select: vi.fn().mockImplementation(() => ({
          single: vi.fn().mockResolvedValue({ data: { ...payload, id: '1' }, error: null }),
        })),
      };
    });
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockReturnValue({ upsert: mockUpsert }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    // Premier appel
    await upsertSeo({ chemin: '/test' });
    // Second appel (idempotent)
    await upsertSeo({ chemin: '/test' });

    expect(mockUpsert).toHaveBeenCalledTimes(2);
    // Les deux appels utilisent onConflict: 'chemin' → idempotence
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({ chemin: '/test' }),
      { onConflict: 'chemin' }
    );
  });
});