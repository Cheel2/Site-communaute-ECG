import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getDashboardStats, getTopContenus, getTopLivres } from '../actions';
import { createClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

// Date fixe pour tests déterministes
const FIXED_DATE = new Date('2026-08-15T12:00:00.000Z');
const THIRTY_DAYS_AGO = new Date(FIXED_DATE);
THIRTY_DAYS_AGO.setDate(THIRTY_DAYS_AGO.getDate() - 30);

describe('getDashboardStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock Date.now pour tests déterministes
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_DATE);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mockUser = { id: 'auth-123' };

  it('should_retourner_les_9_metriques_avec_donnees_nominales', async () => {
    const mockStatsData = [
      { type: 'vue_contenu', valeur: 100 },
      { type: 'clic_amazon', valeur: 50 },
      { type: 'clic_whatsapp_livre', valeur: 25 },
    ];
    const mockContenusData = [
      { compteur_vues: 500 },
      { compteur_vues: 300 },
    ];
    const mockLivresData = [
      { compteur_clics_amazon: 100, compteur_clics_whatsapp: 50 },
      { compteur_clics_amazon: 80, compteur_clics_whatsapp: 60 },
    ];

    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockImplementation((table) => {
        if (table === 'statistique') {
          return {
            select: vi.fn().mockReturnValue({
              gte: vi.fn().mockResolvedValue({ data: mockStatsData, error: null }),
            }),
          };
        }
        if (table === 'contenu') {
          return {
            select: vi.fn().mockResolvedValue({ data: mockContenusData, error: null }),
          };
        }
        if (table === 'livre') {
          return {
            select: vi.fn().mockResolvedValue({ data: mockLivresData, error: null }),
          };
        }
        if (table === 'contact') {
          return {
            select: vi.fn().mockReturnValue({
              gte: vi.fn().mockResolvedValue({ data: [{ id: '1' }, { id: '2' }], count: 2, error: null }),
            }),
          };
        }
        if (table === 'partenaire') {
          return {
            select: vi.fn().mockReturnValue({
              gte: vi.fn().mockResolvedValue({ data: [{ id: '1' }], count: 1, error: null }),
            }),
          };
        }
        return { select: vi.fn().mockResolvedValue({ data: [], error: null }) };
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await getDashboardStats();

    expect(result.data).toEqual({
      visites30j: 0,
      vuesContenus30j: 100,
      clicsAmazon30j: 50,
      clicsWhatsapp30j: 25,
      formulairesPartenariat30j: 1,
      formulairesContact30j: 2,
      totalVuesContenus: 800,
      totalClicsAmazon: 180,
      totalClicsWhatsapp: 110,
    });
    expect(result.error).toBeUndefined();
  });

  it('should_retourner_0_pour_toutes_les_metriques_si_aucune_donnee', async () => {
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockImplementation((table) => ({
        select: vi.fn().mockReturnValue({
          gte: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      })),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await getDashboardStats();

    expect(result.data).toEqual({
      visites30j: 0,
      vuesContenus30j: 0,
      clicsAmazon30j: 0,
      clicsWhatsapp30j: 0,
      formulairesPartenariat30j: 0,
      formulairesContact30j: 0,
      totalVuesContenus: 0,
      totalClicsAmazon: 0,
      totalClicsWhatsapp: 0,
    });
    expect(result.error).toBeUndefined();
  });

  it('should_appliquer_le_filtre_date_30_jours_pour_la_table_statistique', async () => {
    let capturedDate: string | null = null;
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockImplementation((table) => {
        if (table === 'statistique') {
          return {
            select: vi.fn().mockReturnValue({
              gte: vi.fn().mockImplementation((field, date) => {
                capturedDate = date;
                return { data: [], error: null };
              }),
            }),
          };
        }
        return {
          select: vi.fn().mockReturnValue({
            gte: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        };
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    await getDashboardStats();

    expect(capturedDate).toBe(THIRTY_DAYS_AGO.toISOString());
  });

  it('should_appliquer_le_filtre_date_30_jours_pour_contact_et_partenaire', async () => {
    const capturedDates: string[] = [];
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockImplementation((table) => {
        if (table === 'statistique') {
          return {
            select: vi.fn().mockReturnValue({
              gte: vi.fn().mockResolvedValue({ data: [], error: null }),
            }),
          };
        }
        return {
          select: vi.fn().mockReturnValue({
            gte: vi.fn().mockImplementation((field, date) => {
              capturedDates.push(date);
              return { data: [], count: 0, error: null };
            }),
          }),
        };
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    await getDashboardStats();

    expect(capturedDates.length).toBe(2); // contact + partenaire
    expect(capturedDates[0]).toBe(THIRTY_DAYS_AGO.toISOString());
    expect(capturedDates[1]).toBe(THIRTY_DAYS_AGO.toISOString());
  });

  it('should_retourner_INTERNAL_ERROR_si_Supabase_echoue_sur_statistique', async () => {
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockImplementation((table) => {
        if (table === 'statistique') {
          return {
            select: vi.fn().mockReturnValue({
              gte: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'Error' } }),
            }),
          };
        }
        return {
          select: vi.fn().mockReturnValue({
            gte: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        };
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await getDashboardStats();

    expect(result.data).toBeUndefined();
    expect(result.error?.code).toBe('INTERNAL_ERROR');
  });

  it('should_retourner_UNAUTHORIZED_si_aucun_utilisateur_authentifie', async () => {
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await getDashboardStats();

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      code: 'UNAUTHORIZED',
      message: 'Session expirée. Veuillez vous reconnecter.',
    });
  });
});

describe('getTopContenus', () => {
  const mockUser = { id: 'auth-123' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should_retourner_top_5_contenus_tries_par_compteur_vues_desc', async () => {
    const mockData = [
      { id: '1', titre: 'Article A', compteur_vues: 100 },
      { id: '2', titre: 'Article B', compteur_vues: 80 },
      { id: '3', titre: 'Article C', compteur_vues: 60 },
      { id: '4', titre: 'Article D', compteur_vues: 40 },
      { id: '5', titre: 'Article E', compteur_vues: 20 },
    ];
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({ data: mockData, error: null }),
            }),
          }),
        }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await getTopContenus(5);

    expect(result.data).toEqual(mockData);
    expect(result.error).toBeUndefined();
    expect(mockSupabase.from).toHaveBeenCalledWith('contenu');
    expect(mockSupabase.from().select).toHaveBeenCalledWith('id, titre, compteur_vues');
    expect(mockSupabase.from().select().eq).toHaveBeenCalledWith('statut', 'publie');
    expect(mockSupabase.from().select().eq().order).toHaveBeenCalledWith('compteur_vues', { ascending: false });
    expect(mockSupabase.from().select().eq().order().limit).toHaveBeenCalledWith(5);
  });

  it('should_retourner_liste_vide_si_aucun_contenu', async () => {
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({ data: [], error: null }),
            }),
          }),
        }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await getTopContenus(5);

    expect(result.data).toEqual([]);
    expect(result.error).toBeUndefined();
  });

  it('should_utiliser_limite_5_par_defaut', async () => {
    let capturedLimit = 0;
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockImplementation((limit) => {
                capturedLimit = limit;
                return { data: [], error: null };
              }),
            }),
          }),
        }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    await getTopContenus();

    expect(capturedLimit).toBe(5);
  });

  it('should_retourner_INTERNAL_ERROR_si_Supabase_echoue', async () => {
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'Error' } }),
            }),
          }),
        }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await getTopContenus(5);

    expect(result.data).toBeUndefined();
    expect(result.error?.code).toBe('INTERNAL_ERROR');
  });

  it('should_retourner_UNAUTHORIZED_si_aucun_utilisateur_authentifie', async () => {
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await getTopContenus(5);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      code: 'UNAUTHORIZED',
      message: 'Session expirée. Veuillez vous reconnecter.',
    });
  });
});

describe('getTopLivres', () => {
  const mockUser = { id: 'auth-123' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should_retourner_top_5_livres_tries_par_somme_des_clics_desc', async () => {
    const mockData = [
      { id: '1', titre: 'Livre A', compteur_clics_amazon: 100, compteur_clics_whatsapp: 50 }, // total 150
      { id: '2', titre: 'Livre B', compteur_clics_amazon: 80, compteur_clics_whatsapp: 60 }, // total 140
      { id: '3', titre: 'Livre C', compteur_clics_amazon: 70, compteur_clics_whatsapp: 50 }, // total 120
      { id: '4', titre: 'Livre D', compteur_clics_amazon: 90, compteur_clics_whatsapp: 10 }, // total 100
      { id: '5', titre: 'Livre E', compteur_clics_amazon: 30, compteur_clics_whatsapp: 60 }, // total 90
      { id: '6', titre: 'Livre F', compteur_clics_amazon: 20, compteur_clics_whatsapp: 40 }, // total 60 (hors top 5)
    ];
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await getTopLivres(5);

    expect(result.data).toHaveLength(5);
    expect(result.data?.[0].id).toBe('1'); // total 150
    expect(result.data?.[1].id).toBe('2'); // total 140
    expect(result.data?.[2].id).toBe('3'); // total 120
    expect(result.data?.[3].id).toBe('4'); // total 100
    expect(result.data?.[4].id).toBe('5'); // total 90
    expect(result.error).toBeUndefined();
  });

  it('should_retourner_liste_vide_si_aucun_livre', async () => {
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await getTopLivres(5);

    expect(result.data).toEqual([]);
    expect(result.error).toBeUndefined();
  });

  it('should_utiliser_limite_5_par_defaut', async () => {
    const mockData = Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      titre: `Livre ${i + 1}`,
      compteur_clics_amazon: (10 - i) * 10,
      compteur_clics_whatsapp: (10 - i) * 5,
    }));
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await getTopLivres();

    expect(result.data).toHaveLength(5);
  });

  it('should_retourner_INTERNAL_ERROR_si_Supabase_echoue', async () => {
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }) },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'Error' } }),
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await getTopLivres(5);

    expect(result.data).toBeUndefined();
    expect(result.error?.code).toBe('INTERNAL_ERROR');
  });

  it('should_retourner_UNAUTHORIZED_si_aucun_utilisateur_authentifie', async () => {
    const mockSupabase = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const result = await getTopLivres(5);

    expect(result.data).toBeUndefined();
    expect(result.error).toEqual({
      code: 'UNAUTHORIZED',
      message: 'Session expirée. Veuillez vous reconnecter.',
    });
  });
});