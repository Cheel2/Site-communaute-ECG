import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockCreateServerClient } from '@/test/__mocks__/supabase';
import { 
  listRubriques, 
  createRubrique, 
  updateRubrique, 
  deleteRubrique 
} from '../actions';

vi.mock('@/lib/supabase/server', () => ({
  createClient: mockCreateServerClient
}));

function createMockClient(resolvedValue: { data: unknown; error: unknown }) {
  const mockPromise = Promise.resolve(resolvedValue);
  const chainable: Record<string, unknown> = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    eq: vi.fn(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
    order: vi.fn(),
    then: mockPromise.then.bind(mockPromise),
    catch: mockPromise.catch.bind(mockPromise),
  };
  const methods = ['select', 'insert', 'update', 'delete', 'eq', 'single', 'maybeSingle', 'order'];
  methods.forEach((method) => {
    (chainable[method] as ReturnType<typeof vi.fn>).mockReturnValue(chainable);
  });
  return chainable;
}

describe('listRubriques', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return rubriques list when supabase query succeeds', async () => {
    const mockData = [{ id: '123e4567-e89b-12d3-a456-426614174000', nom: 'Rubrique 1', ordre_affichage: 0 }];
    const mockClient = createMockClient({ data: mockData, error: null });
    mockCreateServerClient.mockResolvedValue(mockClient);

    const result = await listRubriques();
    expect(result.data).toEqual(mockData);
  });

  it('should return INTERNAL_ERROR when supabase query fails', async () => {
    const mockClient = createMockClient({ 
      data: null, 
      error: { message: 'DB connection failed', code: '500' } 
    });
    mockCreateServerClient.mockResolvedValue(mockClient);

    const result = await listRubriques();
    expect(result.error?.code).toBe('INTERNAL_ERROR');
  });
});

describe('createRubrique', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should insert and return created rubrique when data is valid', async () => {
    const mockData = { id: '123e4567-e89b-12d3-a456-426614174000', nom: 'Nouvelle', ordre_affichage: 1 };
    const mockClient = createMockClient({ data: mockData, error: null });
    mockCreateServerClient.mockResolvedValue(mockClient);

    const result = await createRubrique({ nom: 'Nouvelle', ordre_affichage: 1 });
    expect(result.data).toEqual(mockData);
  });

  it('should return CONFLICT when nom is duplicated (23505)', async () => {
    const mockClient = createMockClient({ 
      data: null, 
      error: { code: '23505', message: 'duplicate key value violates unique constraint' } 
    });
    mockCreateServerClient.mockResolvedValue(mockClient);

    const result = await createRubrique({ nom: 'Existant', ordre_affichage: 1 });
    expect(result.error?.code).toBe('CONFLICT');
  });
});

describe('updateRubrique', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update and return modified rubrique when id exists', async () => {
    const mockData = { id: '123e4567-e89b-12d3-a456-426614174000', nom: 'Modifiée', ordre_affichage: 2 };
    const mockClient = createMockClient({ data: mockData, error: null });
    mockCreateServerClient.mockResolvedValue(mockClient);

    const result = await updateRubrique({ 
      id: '123e4567-e89b-12d3-a456-426614174000', 
      nom: 'Modifiée', 
      ordre_affichage: 2 
    });
    expect(result.data).toEqual(mockData);
  });

  it('should return NOT_FOUND when id does not exist (PGRST116)', async () => {
    const mockClient = createMockClient({ 
      data: null, 
      error: { code: 'PGRST116', message: 'Row not found' } 
    });
    mockCreateServerClient.mockResolvedValue(mockClient);

    const result = await updateRubrique({ 
      id: '00000000-0000-0000-0000-000000000999', 
      nom: 'Test' 
    });
    expect(result.error?.code).toBe('NOT_FOUND');
  });
});

describe('deleteRubrique', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete rubrique when no associated contents exist', async () => {
    const mockClient = createMockClient({ data: { id: '123e4567-e89b-12d3-a456-426614174000' }, error: null });
    mockCreateServerClient.mockResolvedValue(mockClient);

    const result = await deleteRubrique({ id: '123e4567-e89b-12d3-a456-426614174000' });
    expect(result.error).toBeUndefined();
  });

  it('should return VALIDATION_ERROR when contents are associated (23503 foreign key)', async () => {
    const mockClient = createMockClient({ 
      data: null, 
      error: { 
        code: '23503', 
        message: 'update or delete on table "rubrique" violates foreign key constraint on table "contenu"' 
      } 
    });
    mockCreateServerClient.mockResolvedValue(mockClient);

    const result = await deleteRubrique({ id: '123e4567-e89b-12d3-a456-426614174000' });
    expect(result.error?.code).toBe('VALIDATION_ERROR');
  });
});