import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  listRubriques,
  createRubrique,
  updateRubrique,
  deleteRubrique,
} from '../actions';
import type { Rubrique } from '@/types/database';

// Mock du module supabase
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

// Mock de revalidateTag
vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';
import { revalidateTag } from 'next/cache';

describe('listRubriques', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return list of rubriques when data exists', async () => {
    const mockRubriques: Rubrique[] = [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        nom: 'Actualités',
        ordre_affichage: 1,
        date_creation: '2025-01-01T00:00:00Z',
        date_modification: '2025-01-01T00:00:00Z',
      },
      {
        id: '223e4567-e89b-12d3-a456-426614174001',
        nom: 'Événements',
        ordre_affichage: 2,
        date_creation: '2025-01-02T00:00:00Z',
        date_modification: '2025-01-02T00:00:00Z',
      },
    ];

    const mockSelectChain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({ data: mockRubriques, error: null }),
    };

    const mockSupabase = {
      from: vi.fn().mockReturnValue(mockSelectChain),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await listRubriques();

    expect(result).toEqual(mockRubriques);
    expect(mockSupabase.from).toHaveBeenCalledWith('rubrique');
    expect(mockSelectChain.select).toHaveBeenCalledWith('*');
    expect(mockSelectChain.order).toHaveBeenCalledWith('ordre_affichage', {
      ascending: true,
    });
    expect(mockSelectChain.order).toHaveBeenCalledWith('nom', {
      ascending: true,
    });
  });

  it('should return empty array when no rubriques exist', async () => {
    const mockSelectChain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({ data: [], error: null }),
    };

    const mockSupabase = {
      from: vi.fn().mockReturnValue(mockSelectChain),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await listRubriques();

    expect(result).toEqual([]);
  });

  it('should return empty array on Supabase error (silent fallback)', async () => {
    const mockSelectChain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'Not found' },
      }),
    };

    const mockSupabase = {
      from: vi.fn().mockReturnValue(mockSelectChain),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await listRubriques();

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      'listRubriques: Supabase error',
      expect.any(Object)
    );

    consoleSpy.mockRestore();
  });

  it('should return empty array on unexpected error', async () => {
    vi.mocked(createClient).mockRejectedValue(new Error('Network error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await listRubriques();

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      'listRubriques: Unexpected error',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('should order by ordre_affichage first, then nom', async () => {
    const mockSelectChain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      returns: vi.fn().mockResolvedValue({ data: [], error: null }),
    };

    const mockSupabase = {
      from: vi.fn().mockReturnValue(mockSelectChain),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    await listRubriques();

    // Verify order calls in sequence
    const orderCalls = mockSelectChain.order.mock.calls;
    expect(orderCalls[0]).toEqual(['ordre_affichage', { ascending: true }]);
    expect(orderCalls[1]).toEqual(['nom', { ascending: true }]);
  });
});

describe('createRubrique', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validInput = {
    nom: 'Nouvelle Rubrique',
    ordre_affichage: 3,
  };

  const mockRubrique: Rubrique = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    nom: 'Nouvelle Rubrique',
    ordre_affichage: 3,
    date_creation: '2025-01-01T00:00:00Z',
    date_modification: '2025-01-01T00:00:00Z',
  };

  function setupAuthenticatedSuccess(mockData: any = mockRubrique) {
    const mockSingleChain = {
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    };

    const mockSelectChain = {
      select: vi.fn().mockReturnValue(mockSingleChain),
    };

    const mockInsertChain = {
      insert: vi.fn().mockReturnValue(mockSelectChain),
    };

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-123' } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue(mockInsertChain),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);
    return { mockSupabase, mockInsertChain, mockSelectChain, mockSingleChain };
  }

  function setupAuthError(errorCode = 'UNAUTHORIZED') {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'Invalid token' },
        }),
      },
      from: vi.fn(),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);
    return mockSupabase;
  }

  function setupSupabaseError(errorCode: string) {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-123' } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: errorCode, message: 'DB error' },
            }),
          }),
        }),
      }),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);
    return mockSupabase;
  }

  it('should create rubrique with valid input and return ApiResponse with data', async () => {
    setupAuthenticatedSuccess();

    const result = await createRubrique(validInput);

    expect(result).toEqual({ data: mockRubrique });
    expect(revalidateTag).toHaveBeenCalledWith('rubriques');
  });

  it('should return VALIDATION_ERROR when nom is empty', async () => {
    const invalidInput = {
      nom: '',
      ordre_affichage: 3,
    };

    const result = await createRubrique(invalidInput);

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe('Le nom de la rubrique est requis.');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return VALIDATION_ERROR when nom is only whitespace', async () => {
    const invalidInput = {
      nom: '   ',
      ordre_affichage: 3,
    };

    const result = await createRubrique(invalidInput);

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe('Le nom de la rubrique est requis.');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return UNAUTHORIZED when user is not authenticated', async () => {
    setupAuthError();

    const result = await createRubrique(validInput);

    expect(result.error?.code).toBe('UNAUTHORIZED');
    expect(result.error?.message).toBe('Authentification requise.');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return CONFLICT when nom already exists (23505)', async () => {
    setupSupabaseError('23505');

    const result = await createRubrique(validInput);

    expect(result.error?.code).toBe('CONFLICT');
    expect(result.error?.message).toBe(
      'Une rubrique avec ce nom existe déjà.'
    );
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return FORBIDDEN on RLS violation (42501)', async () => {
    setupSupabaseError('42501');

    const result = await createRubrique(validInput);

    expect(result.error?.code).toBe('FORBIDDEN');
    expect(result.error?.message).toBe(
      "Vous n'êtes pas autorisé à effectuer cette action."
    );
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return INTERNAL_ERROR on unexpected error', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockRejectedValue(new Error('Network error')),
      },
      from: vi.fn(),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await createRubrique(validInput);

    expect(result.error?.code).toBe('INTERNAL_ERROR');
    expect(result.error?.message).toBe(
      'Une erreur technique est survenue.'
    );
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return INTERNAL_ERROR when data is null after successful insert', async () => {
    const mockSingleChain = {
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    };

    const mockSelectChain = {
      select: vi.fn().mockReturnValue(mockSingleChain),
    };

    const mockInsertChain = {
      insert: vi.fn().mockReturnValue(mockSelectChain),
    };

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-123' } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue(mockInsertChain),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await createRubrique(validInput);

    expect(result.error?.code).toBe('INTERNAL_ERROR');
    expect(result.error?.message).toBe(
      'La création de la rubrique a échoué.'
    );
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should call revalidateTag after successful creation', async () => {
    setupAuthenticatedSuccess();

    await createRubrique(validInput);

    expect(revalidateTag).toHaveBeenCalledWith('rubriques');
  });
});

describe('updateRubrique', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validId = '123e4567-e89b-12d3-a456-426614174000';
  const validInput = {
    nom: 'Rubrique Mise à Jour',
    ordre_affichage: 5,
  };

  const mockUpdatedRubrique: Rubrique = {
    id: validId,
    nom: 'Rubrique Mise à Jour',
    ordre_affichage: 5,
    date_creation: '2025-01-01T00:00:00Z',
    date_modification: '2025-01-02T00:00:00Z',
  };

  function setupAuthenticatedSuccess(mockData: any = mockUpdatedRubrique) {
    const mockSingleChain = {
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    };

    const mockSelectChain = {
      select: vi.fn().mockReturnValue(mockSingleChain),
    };

    const mockEqChain = {
      eq: vi.fn().mockReturnValue(mockSelectChain),
    };

    const mockUpdateChain = {
      update: vi.fn().mockReturnValue(mockEqChain),
    };

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-123' } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue(mockUpdateChain),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);
    return { mockSupabase, mockUpdateChain, mockEqChain, mockSelectChain, mockSingleChain };
  }

  function setupSupabaseError(errorCode: string) {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-123' } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: errorCode, message: 'DB error' },
              }),
            }),
          }),
        }),
      }),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);
    return mockSupabase;
  }

  it('should update rubrique with valid input and return ApiResponse with data', async () => {
    setupAuthenticatedSuccess();

    const result = await updateRubrique(validId, validInput);

    expect(result).toEqual({ data: mockUpdatedRubrique });
    expect(revalidateTag).toHaveBeenCalledWith('rubriques');
  });

  it('should return VALIDATION_ERROR when UUID is invalid', async () => {
    const invalidId = 'not-a-uuid';

    const result = await updateRubrique(invalidId, validInput);

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe(
      'Identifiant de rubrique invalide.'
    );
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return VALIDATION_ERROR when UUID is empty', async () => {
    const result = await updateRubrique('', validInput);

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe(
      'Identifiant de rubrique invalide.'
    );
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return VALIDATION_ERROR when nom is empty', async () => {
    const invalidInput = {
      nom: '',
      ordre_affichage: 5,
    };

    const result = await updateRubrique(validId, invalidInput);

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe('Le nom de la rubrique est requis.');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return NOT_FOUND when rubrique does not exist (PGRST116)', async () => {
    setupSupabaseError('PGRST116');

    const result = await updateRubrique(validId, validInput);

    expect(result.error?.code).toBe('NOT_FOUND');
    expect(result.error?.message).toBe(
      'La rubrique demandée est introuvable.'
    );
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return CONFLICT when new nom already exists (23505)', async () => {
    setupSupabaseError('23505');

    const result = await updateRubrique(validId, validInput);

    expect(result.error?.code).toBe('CONFLICT');
    expect(result.error?.message).toBe(
      'Une rubrique avec ce nom existe déjà.'
    );
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return UNAUTHORIZED when user is not authenticated', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'Invalid token' },
        }),
      },
      from: vi.fn(),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await updateRubrique(validId, validInput);

    expect(result.error?.code).toBe('UNAUTHORIZED');
    expect(result.error?.message).toBe('Authentification requise.');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return INTERNAL_ERROR on unexpected error', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockRejectedValue(new Error('Network error')),
      },
      from: vi.fn(),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await updateRubrique(validId, validInput);

    expect(result.error?.code).toBe('INTERNAL_ERROR');
    expect(result.error?.message).toBe(
      'Une erreur technique est survenue.'
    );
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return INTERNAL_ERROR when data is null after successful update', async () => {
    const mockSingleChain = {
      select: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    };

    const mockSelectChain = {
      select: vi.fn().mockReturnValue(mockSingleChain),
    };

    const mockEqChain = {
      eq: vi.fn().mockReturnValue(mockSelectChain),
    };

    const mockUpdateChain = {
      update: vi.fn().mockReturnValue(mockEqChain),
    };

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-123' } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue(mockUpdateChain),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await updateRubrique(validId, validInput);

    expect(result.error?.code).toBe('INTERNAL_ERROR');
    expect(result.error?.message).toBe(
      'La modification de la rubrique a échoué.'
    );
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should call revalidateTag after successful update', async () => {
    setupAuthenticatedSuccess();

    await updateRubrique(validId, validInput);

    expect(revalidateTag).toHaveBeenCalledWith('rubriques');
  });
});

describe('deleteRubrique', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validId = '123e4567-e89b-12d3-a456-426614174000';

  function setupAuthenticatedSuccess(deletedData: any = { id: validId }) {
    const mockMaybeSingleChain = {
      select: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: deletedData, error: null }),
    };

    const mockSelectChain = {
      select: vi.fn().mockReturnValue(mockMaybeSingleChain),
    };

    const mockEqChain = {
      eq: vi.fn().mockReturnValue(mockSelectChain),
    };

    const mockDeleteChain = {
      delete: vi.fn().mockReturnValue(mockEqChain),
    };

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-123' } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue(mockDeleteChain),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);
    return { mockSupabase, mockDeleteChain, mockEqChain, mockSelectChain, mockMaybeSingleChain };
  }

  function setupSupabaseError(errorCode: string) {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-123' } },
          error: null,
        }),
      },
      from: vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: null,
                error: { code: errorCode, message: 'DB error' },
              }),
            }),
          }),
        }),
      }),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);
    return mockSupabase;
  }

  it('should delete rubrique with valid UUID and return { data: null }', async () => {
    setupAuthenticatedSuccess();

    const result = await deleteRubrique(validId);

    expect(result).toEqual({ data: null });
    expect(revalidateTag).toHaveBeenCalledWith('rubriques');
  });

  it('should return VALIDATION_ERROR when UUID is invalid', async () => {
    const invalidId = 'not-a-uuid';

    const result = await deleteRubrique(invalidId);

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe(
      'Identifiant de rubrique invalide.'
    );
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return VALIDATION_ERROR when UUID is empty', async () => {
    const result = await deleteRubrique('');

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe(
      'Identifiant de rubrique invalide.'
    );
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return NOT_FOUND when rubrique does not exist', async () => {
    setupAuthenticatedSuccess(null);

    const result = await deleteRubrique(validId);

    expect(result.error?.code).toBe('NOT_FOUND');
    expect(result.error?.message).toBe(
      'La rubrique à supprimer est introuvable.'
    );
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return VALIDATION_ERROR when FK constraint blocks deletion (23503)', async () => {
    setupSupabaseError('23503');

    const result = await deleteRubrique(validId);

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe(
      'Impossible de supprimer : des contenus sont associés à cette rubrique.'
    );
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return UNAUTHORIZED when user is not authenticated', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'Invalid token' },
        }),
      },
      from: vi.fn(),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await deleteRubrique(validId);

    expect(result.error?.code).toBe('UNAUTHORIZED');
    expect(result.error?.message).toBe('Authentification requise.');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return FORBIDDEN on RLS violation (42501)', async () => {
    setupSupabaseError('42501');

    const result = await deleteRubrique(validId);

    expect(result.error?.code).toBe('FORBIDDEN');
    expect(result.error?.message).toBe(
      "Vous n'êtes pas autorisé à effectuer cette action."
    );
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return INTERNAL_ERROR on unexpected error', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockRejectedValue(new Error('Network error')),
      },
      from: vi.fn(),
    };

    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await deleteRubrique(validId);

    expect(result.error?.code).toBe('INTERNAL_ERROR');
    expect(result.error?.message).toBe(
      'Une erreur technique est survenue.'
    );
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should call revalidateTag after successful deletion', async () => {
    setupAuthenticatedSuccess();

    await deleteRubrique(validId);

    expect(revalidateTag).toHaveBeenCalledWith('rubriques');
  });

  it('should use delete() and never update() — hard-delete proof', async () => {
    const { mockSupabase } = setupAuthenticatedSuccess();

    await deleteRubrique(validId);

    // Verify delete() is called, not update()
    expect(mockSupabase.from).toHaveBeenCalledWith('rubrique');
    expect(mockSupabase.from().delete).toHaveBeenCalled();
    expect(mockSupabase.from().update).toBeUndefined();
  });
});