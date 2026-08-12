src/features/rubriques/__tests__/actions.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockCreateServerClient } from '@/test/__mocks__/supabase';
import { 
  listRubriques, 
  createRubrique, 
  updateRubrique, 
  deleteRubrique 
} from '../actions';

// NOTE: Les noms des actions sont inférés selon les standards du projet.
// Si les exports réels diffèrent, ajuster les imports en conséquence.

vi.mock('@/lib/supabase/server', () => ({
  createServerClient: mockCreateServerClient,
}));

// Helper pour mocker la chaîne de requêtes Supabase (from().select().eq().single(), etc.)
const createSupabaseMock = (resolvedValue: { data: any; error: any }) => {
  const mockPromise = Promise.resolve(resolvedValue);
  const chainable: any = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    eq: vi.fn(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
    then: mockPromise.then.bind(mockPromise),
    catch: mockPromise.catch.bind(mockPromise),
    finally: mockPromise.finally.bind(mockPromise),
  };
  Object.keys(chainable).forEach(key => {
    if (typeof chainable[key] === 'function' && !['then', 'catch', 'finally'].includes(key)) {
      chainable[key].mockReturnValue(chainable);
    }
  });
  return chainable;
};

describe('listRubriques', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('nominal: retourne la liste des rubriques depuis Supabase', async () => {
    const mockData = [{ id: '1', nom: 'Rubrique 1', ordre_affichage: 0 }];
    mockCreateServerClient.mockReturnValue({
      from: vi.fn().mockReturnValue(createSupabaseMock({ data: mockData, error: null })),
    });

    const result = await listRubriques();
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeUndefined();
  });

  it('négatif: retourne INTERNAL_ERROR si Supabase retourne une erreur', async () => {
    mockCreateServerClient.mockReturnValue({
      from: vi.fn().mockReturnValue(
        createSupabaseMock({ 
          data: null, 
          error: { message: 'DB connection failed', code: '500' } 
        })
      ),
    });

    const result = await listRubriques();
    expect(result.data).toBeUndefined();
    expect(result.error?.code).toBe('INTERNAL_ERROR');
  });
});

describe('createRubrique', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('nominal: insère et retourne les données créées', async () => {
    const mockData = { id: '1', nom: 'Nouvelle', ordre_affichage: 1 };
    mockCreateServerClient.mockReturnValue({
      from: vi.fn().mockReturnValue(createSupabaseMock({ data: mockData, error: null })),
    });

    // NOTE: Testé avec objet JS direct. Si l'action exige FormData, adapter le payload.
    const result = await createRubrique({ nom: 'Nouvelle', ordre_affichage: 1 });
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeUndefined();
  });

  it('négatif: retourne CONFLICT si le nom est dupliqué (23505)', async () => {
    mockCreateServerClient.mockReturnValue({
      from: vi.fn().mockReturnValue(
        createSupabaseMock({ 
          data: null, 
          error: { message: 'duplicate key value violates unique constraint', code: '23505' } 
        })
      ),
    });

    const result = await createRubrique({ nom: 'Existant', ordre_affichage: 1 });
    expect(result.data).toBeUndefined();
    expect(result.error?.code).toBe('CONFLICT');
  });
});

describe('updateRubrique', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('nominal: met à jour et retourne les données', async () => {
    const mockData = { id: '1', nom: 'Modifiée', ordre_affichage: 2 };
    mockCreateServerClient.mockReturnValue({
      from: vi.fn().mockReturnValue(createSupabaseMock({ data: mockData, error: null })),
    });

    const result = await updateRubrique({ id: '1', nom: 'Modifiée', ordre_affichage: 2 });
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeUndefined();
  });

  it('négatif: retourne NOT_FOUND si l\'id est inexistant (PGRST116)', async () => {
    mockCreateServerClient.mockReturnValue({
      from: vi.fn().mockReturnValue(
        createSupabaseMock({ 
          data: null, 
          error: { message: 'Row not found', code: 'PGRST116' } 
        })
      ),
    });

    const result = await updateRubrique({ id: '999', nom: 'Test' });
    expect(result.data).toBeUndefined();
    expect(result.error?.code).toBe('NOT_FOUND');
  });
});

describe('deleteRubrique', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('nominal: supprime la rubrique sans contenus associés', async () => {
    mockCreateServerClient.mockReturnValue({
      from: vi.fn().mockReturnValue(createSupabaseMock({ data: { id: '1' }, error: null })),
    });

    const result = await deleteRubrique({ id: '1' });
    expect(result.error).toBeUndefined();
  });

  it('négatif CRITIQUE: retourne VALIDATION_ERROR si contenus associés (23503)', async () => {
    mockCreateServerClient.mockReturnValue({
      from: vi.fn().mockReturnValue(
        createSupabaseMock({ 
          data: null, 
          error: { 
            message: 'update or delete on table "rubrique" violates foreign key constraint on table "contenu"', 
            code: '23503' 
          } 
        })
      ),
    });

    const result = await deleteRubrique({ id: '1' });
    expect(result.data).toBeUndefined();
    expect(result.error?.code).toBe('VALIDATION_ERROR');
    // Vérifie que le message mentionne le blocage ou les contenus associés (FR-14.4)
    expect(result.error?.message.toLowerCase()).toMatch(/contenu|associé|bloqué|impossible|supprimée/);
  });
});