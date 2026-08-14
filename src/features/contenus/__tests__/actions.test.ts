import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  listContenus,
  createContenu,
  updateContenu,
  deleteContenu,
  type ContenuAvecRubrique,
} from '../actions';
import type { Contenu, Rubrique } from '@/types/database';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';
import { revalidateTag } from 'next/cache';

// ============================================
// HELPERS DE MOCK — Patterns de TMC-2
// ============================================

function createAuthMock() {
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      }),
    },
  };
}

function createSelectJoinMock(result: any) {
  return {
    select: vi.fn().mockImplementation(() => ({
      order: vi.fn().mockImplementation(() => ({
        returns: vi.fn().mockResolvedValue(result),
      })),
    })),
  };
}

function createInsertMock(result: any) {
  return {
    insert: vi.fn().mockImplementation(() => ({
      select: vi.fn().mockImplementation(() => ({
        returns: vi.fn().mockImplementation(() => ({
          single: vi.fn().mockResolvedValue(result),
        })),
      })),
    })),
  };
}

function createUpdateMock(result: any) {
  return {
    update: vi.fn().mockImplementation(() => ({
      eq: vi.fn().mockImplementation(() => ({
        select: vi.fn().mockImplementation(() => ({
          returns: vi.fn().mockImplementation(() => ({
            single: vi.fn().mockResolvedValue(result),
          })),
        })),
      })),
    })),
  };
}

// delete : delete().eq().select().maybeSingle() ← PAS de .returns()
function createDeleteMock(result: any) {
  return {
    delete: vi.fn().mockImplementation(() => ({
      eq: vi.fn().mockImplementation(() => ({
        select: vi.fn().mockImplementation(() => ({
          maybeSingle: vi.fn().mockResolvedValue(result),
        })),
      })),
    })),
  };
}

// ============================================
// LISTE CONTENUS
// ============================================

describe('listContenus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockRubrique: Pick<Rubrique, 'nom'> = { nom: 'Actualités' };
  const mockContenu: ContenuAvecRubrique = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    titre: 'Mon article',
    texte: 'Contenu',
    rubrique_id: '223e4567-e89b-12d3-a456-426614174001',
    rubrique: mockRubrique,
    statut: 'publie',
    image_url: null,
    mis_en_avant: false,
    date_creation: '2025-01-01T00:00:00Z',
    date_modification: '2025-01-01T00:00:00Z',
    date_publication: '2025-01-01T00:00:00Z',
  };

  it('should return list of contenus with rubrique data', async () => {
    const mockFrom = vi.fn().mockImplementation(() => ({
      select: vi.fn().mockImplementation(() => ({
        order: vi.fn().mockResolvedValue({ data: [mockContenu], error: null }),
      })),
    }));

    vi.mocked(createClient).mockResolvedValue({ from: mockFrom } as never);

    const result = await listContenus();

    expect(result).toEqual([mockContenu]);
    expect(mockFrom).toHaveBeenCalledWith('contenu');
  });

  it('should return empty array when no contenus exist', async () => {
    const mockFrom = vi.fn().mockImplementation(() => ({
      select: vi.fn().mockImplementation(() => ({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
    }));

    vi.mocked(createClient).mockResolvedValue({ from: mockFrom } as never);

    const result = await listContenus();

    expect(result).toEqual([]);
  });

  it('should return empty array on Supabase error', async () => {
    const mockFrom = vi.fn().mockImplementation(() => ({
      select: vi.fn().mockImplementation(() => ({
        order: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
      })),
    }));

    vi.mocked(createClient).mockResolvedValue({ from: mockFrom } as never);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = await listContenus();

    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith('listContenus: Supabase error', expect.any(Object));
    consoleSpy.mockRestore();
  });

  it('should order by date_creation descending', async () => {
    const mockFrom = vi.fn().mockImplementation(() => ({
      select: vi.fn().mockImplementation(() => ({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
    }));

    vi.mocked(createClient).mockResolvedValue({ from: mockFrom } as never);

    await listContenus();

    const orderCall = (mockFrom().select().order as any).mock.calls[0];
    expect(orderCall).toEqual(['date_creation', { ascending: false }]);
  });
});

// ============================================
// CREATE CONTENU
// ============================================

describe('createContenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validInput = {
    titre: 'Nouvel article',
    texte: 'Contenu de l\'article',
    rubrique_id: '123e4567-e89b-12d3-a456-426614174000',
    statut: 'publie' as const,
  };

  const mockContenu: ContenuAvecRubrique = {
    id: 'new-id',
    titre: 'Nouvel article',
    texte: 'Contenu de l\'article',
    rubrique_id: '123e4567-e89b-12d3-a456-426614174000',
    rubrique: { nom: 'Actualités' },
    statut: 'publie',
    image_url: null,
    mis_en_avant: false,
    date_creation: '2025-01-01T00:00:00Z',
    date_modification: '2025-01-01T00:00:00Z',
    date_publication: '2025-01-01T00:00:00Z',
  };

  it('should create contenu with valid input and return ApiResponse', async () => {
    const mockSupabase = {
      ...createAuthMock(),
      from: vi.fn().mockImplementation(() => createInsertMock({ data: mockContenu, error: null })),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await createContenu(validInput);

    expect(result).toEqual({ data: mockContenu });
    expect(revalidateTag).toHaveBeenCalledWith('contenus');
  });

  it('should return VALIDATION_ERROR when titre is empty', async () => {
    const invalidInput = { ...validInput, titre: '' };

    const result = await createContenu(invalidInput);

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe('Le titre du contenu est requis.');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return VALIDATION_ERROR when rubrique_id is invalid', async () => {
    const invalidInput = { ...validInput, rubrique_id: 'not-a-uuid' };

    const result = await createContenu(invalidInput);

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return VALIDATION_ERROR when statut is invalid', async () => {
    const invalidInput = { ...validInput, statut: 'brouillon' as any };

    const result = await createContenu(invalidInput);

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return UNAUTHORIZED when user is not authenticated', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: { message: 'Invalid token' } }),
      },
      from: vi.fn(),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await createContenu(validInput);

    expect(result.error?.code).toBe('UNAUTHORIZED');
    expect(result.error?.message).toBe('Authentification requise.');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return CONFLICT on 23505 error', async () => {
    const mockSupabase = {
      ...createAuthMock(),
      from: vi.fn().mockImplementation(() => createInsertMock({ data: null, error: { code: '23505', message: 'duplicate' } })),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await createContenu(validInput);

    expect(result.error?.code).toBe('CONFLICT');
    expect(result.error?.message).toBe('Un contenu avec cet identifiant existe déjà.');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return FORBIDDEN on 42501 error', async () => {
    const mockSupabase = {
      ...createAuthMock(),
      from: vi.fn().mockImplementation(() => createInsertMock({ data: null, error: { code: '42501', message: 'permission denied' } })),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await createContenu(validInput);

    expect(result.error?.code).toBe('FORBIDDEN');
    expect(result.error?.message).toBe("Vous n'êtes pas autorisé à effectuer cette action.");
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

    const result = await createContenu(validInput);

    expect(result.error?.code).toBe('INTERNAL_ERROR');
    expect(result.error?.message).toBe('Une erreur technique est survenue.');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return INTERNAL_ERROR when data is null after insert', async () => {
    const mockSupabase = {
      ...createAuthMock(),
      from: vi.fn().mockImplementation(() => createInsertMock({ data: null, error: null })),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await createContenu(validInput);

    expect(result.error?.code).toBe('INTERNAL_ERROR');
    expect(result.error?.message).toBe('La création du contenu a échoué.');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should call revalidateTag after successful creation', async () => {
    const mockSupabase = {
      ...createAuthMock(),
      from: vi.fn().mockImplementation(() => createInsertMock({ data: mockContenu, error: null })),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    await createContenu(validInput);

    expect(revalidateTag).toHaveBeenCalledWith('contenus');
  });
});

// ============================================
// UPDATE CONTENU
// ============================================

describe('updateContenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validId = '123e4567-e89b-12d3-a456-426614174000';
  const validInput = {
    titre: 'Article modifié',
    texte: 'Nouveau contenu',
    rubrique_id: '123e4567-e89b-12d3-a456-426614174000',
    statut: 'publie' as const,
  };

  const mockCurrent = { statut: 'non_publie', date_publication: null };
  const mockUpdated: ContenuAvecRubrique = {
    id: validId,
    titre: 'Article modifié',
    texte: 'Nouveau contenu',
    rubrique_id: '123e4567-e89b-12d3-a456-426614174000',
    rubrique: { nom: 'Actualités' },
    statut: 'publie',
    image_url: null,
    mis_en_avant: false,
    date_creation: '2025-01-01T00:00:00Z',
    date_modification: '2025-01-02T00:00:00Z',
    date_publication: '2025-01-02T00:00:00Z',
  };

  function createUpdateWithSelectMock(selectResult: any, updateResult: any) {
    const single = vi.fn().mockResolvedValue(updateResult);
    const updateSelect = vi.fn().mockImplementation(() => ({
      returns: vi.fn().mockImplementation(() => ({
        single,
      })),
    }));

    const maybeSingle = vi.fn().mockResolvedValue(selectResult);
    const currentSelect = vi.fn().mockImplementation(() => ({
      maybeSingle,
    }));

    const eqForSelect = vi.fn().mockImplementation(() => ({
      select: currentSelect,
    }));

    const update = vi.fn().mockImplementation(() => ({
      eq: vi.fn().mockImplementation(() => ({
        select: updateSelect,
      })),
    }));

    const from = vi.fn().mockImplementation(() => {
      // First call: select current
      // Second call: update
      // We need to distinguish calls
      return {
        select: vi.fn().mockImplementation(() => ({
          eq: eqForSelect,
        })),
        update: update,
      };
    });

    return {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-123' } },
          error: null,
        }),
      },
      from: from,
    };
  }

  function createUpdateMock(result: any) {
    return {
      update: vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockImplementation(() => ({
          select: vi.fn().mockImplementation(() => ({
            returns: vi.fn().mockImplementation(() => ({
              single: vi.fn().mockResolvedValue(result),
            })),
          })),
        })),
      })),
    };
  }

  function createSelectMock(result: any) {
    return {
      select: vi.fn().mockImplementation(() => ({
        eq: vi.fn().mockImplementation(() => ({
          maybeSingle: vi.fn().mockResolvedValue(result),
        })),
      })),
    };
  }

  it('should update contenu and return ApiResponse', async () => {
    const mockSelect = createSelectMock({ data: mockCurrent, error: null });
    const mockUpdate = createUpdateMock({ data: mockUpdated, error: null });

    const mockSupabase = {
      ...createAuthMock(),
      from: vi.fn().mockImplementation(() => {
        // First call returns select, second returns update
        const from = vi.fn();
        from.mockReturnValueOnce(mockSelect);
        from.mockReturnValueOnce(mockUpdate);
        return from();
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await updateContenu(validId, validInput);

    expect(result).toEqual({ data: mockUpdated });
    expect(revalidateTag).toHaveBeenCalledWith('contenus');
  });

  it('should return VALIDATION_ERROR when UUID is invalid', async () => {
    const result = await updateContenu('not-a-uuid', validInput);

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe('Identifiant de contenu invalide.');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return VALIDATION_ERROR when titre is empty', async () => {
    const invalidInput = { ...validInput, titre: '' };

    const result = await updateContenu(validId, invalidInput);

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe('Le titre du contenu est requis.');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return NOT_FOUND when contenu does not exist (PGRST116)', async () => {
    const mockSelect = createSelectMock({ data: null, error: { code: 'PGRST116', message: 'not found' } });
    const mockSupabase = {
      ...createAuthMock(),
      from: vi.fn().mockImplementation(() => mockSelect),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await updateContenu(validId, validInput);

    expect(result.error?.code).toBe('NOT_FOUND');
    expect(result.error?.message).toBe('Le contenu à modifier est introuvable.');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return CONFLICT on 23505 error', async () => {
    const mockSelect = createSelectMock({ data: mockCurrent, error: null });
    const mockUpdate = createUpdateMock({ data: null, error: { code: '23505', message: 'duplicate' } });

    const mockSupabase = {
      ...createAuthMock(),
      from: vi.fn().mockImplementation(() => {
        const from = vi.fn();
        from.mockReturnValueOnce(mockSelect);
        from.mockReturnValueOnce(mockUpdate);
        return from();
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await updateContenu(validId, validInput);

    expect(result.error?.code).toBe('CONFLICT');
    expect(result.error?.message).toBe('Un contenu avec cet identifiant existe déjà.');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return VALIDATION_ERROR on 23503 (FK violation)', async () => {
    const mockSelect = createSelectMock({ data: mockCurrent, error: null });
    const mockUpdate = createUpdateMock({ data: null, error: { code: '23503', message: 'fk violation' } });

    const mockSupabase = {
      ...createAuthMock(),
      from: vi.fn().mockImplementation(() => {
        const from = vi.fn();
        from.mockReturnValueOnce(mockSelect);
        from.mockReturnValueOnce(mockUpdate);
        return from();
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await updateContenu(validId, validInput);

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe('Action impossible : des données associées existent.');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return FORBIDDEN on 42501 error', async () => {
    const mockSelect = createSelectMock({ data: mockCurrent, error: null });
    const mockUpdate = createUpdateMock({ data: null, error: { code: '42501', message: 'permission denied' } });

    const mockSupabase = {
      ...createAuthMock(),
      from: vi.fn().mockImplementation(() => {
        const from = vi.fn();
        from.mockReturnValueOnce(mockSelect);
        from.mockReturnValueOnce(mockUpdate);
        return from();
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await updateContenu(validId, validInput);

    expect(result.error?.code).toBe('FORBIDDEN');
    expect(result.error?.message).toBe("Vous n'êtes pas autorisé à effectuer cette action.");
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should set date_publication automatically when status changes to "publie"', async () => {
    const currentWithNullDate = { statut: 'non_publie', date_publication: null };
    const mockSelect = createSelectMock({ data: currentWithNullDate, error: null });

    // We'll capture the payload sent to update
    let updatePayload: any = null;
    const updateFn = vi.fn().mockImplementation((payload) => {
      updatePayload = payload;
      return {
        eq: vi.fn().mockImplementation(() => ({
          select: vi.fn().mockImplementation(() => ({
            returns: vi.fn().mockImplementation(() => ({
              single: vi.fn().mockResolvedValue({ data: { ...mockUpdated, ...payload }, error: null }),
            })),
          })),
        })),
      };
    });

    const mockSupabase = {
      ...createAuthMock(),
      from: vi.fn().mockImplementation(() => {
        const from = vi.fn();
        from.mockReturnValueOnce(mockSelect);
        from.mockReturnValueOnce({ update: updateFn });
        return from();
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    await updateContenu(validId, { ...validInput, statut: 'publie' });

    expect(updatePayload.date_publication).toBeDefined();
    expect(updatePayload.date_publication).not.toBeNull();
  });

  it('should set date_publication to null when status changes to "non_publie"', async () => {
    const currentWithDate = { statut: 'publie', date_publication: '2025-01-01T00:00:00Z' };
    const mockSelect = createSelectMock({ data: currentWithDate, error: null });

    let updatePayload: any = null;
    const updateFn = vi.fn().mockImplementation((payload) => {
      updatePayload = payload;
      return {
        eq: vi.fn().mockImplementation(() => ({
          select: vi.fn().mockImplementation(() => ({
            returns: vi.fn().mockImplementation(() => ({
              single: vi.fn().mockResolvedValue({ data: { ...mockUpdated, ...payload }, error: null }),
            })),
          })),
        })),
      };
    });

    const mockSupabase = {
      ...createAuthMock(),
      from: vi.fn().mockImplementation(() => {
        const from = vi.fn();
        from.mockReturnValueOnce(mockSelect);
        from.mockReturnValueOnce({ update: updateFn });
        return from();
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    await updateContenu(validId, { ...validInput, statut: 'non_publie' });

    expect(updatePayload.date_publication).toBeNull();
  });

  it('should not change date_publication when status unchanged and already published', async () => {
    const currentWithDate = { statut: 'publie', date_publication: '2025-01-01T00:00:00Z' };
    const mockSelect = createSelectMock({ data: currentWithDate, error: null });

    let updatePayload: any = null;
    const updateFn = vi.fn().mockImplementation((payload) => {
      updatePayload = payload;
      return {
        eq: vi.fn().mockImplementation(() => ({
          select: vi.fn().mockImplementation(() => ({
            returns: vi.fn().mockImplementation(() => ({
              single: vi.fn().mockResolvedValue({ data: { ...mockUpdated, ...payload }, error: null }),
            })),
          })),
        })),
      };
    });

    const mockSupabase = {
      ...createAuthMock(),
      from: vi.fn().mockImplementation(() => {
        const from = vi.fn();
        from.mockReturnValueOnce(mockSelect);
        from.mockReturnValueOnce({ update: updateFn });
        return from();
      }),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    await updateContenu(validId, { ...validInput, statut: 'publie' });

    // date_publication should remain as '2025-01-01T00:00:00Z'
    expect(updatePayload.date_publication).toBe('2025-01-01T00:00:00Z');
  });
});

// ============================================
// DELETE CONTENU
// ============================================

describe('deleteContenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validId = '123e4567-e89b-12d3-a456-426614174000';

  it('should delete contenu and return { data: null }', async () => {
    const mockSupabase = {
      ...createAuthMock(),
      from: vi.fn().mockImplementation(() => createDeleteMock({ data: { id: validId }, error: null })),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await deleteContenu(validId);

    expect(result).toEqual({ data: null });
    expect(revalidateTag).toHaveBeenCalledWith('contenus');
  });

  it('should return VALIDATION_ERROR when UUID is invalid', async () => {
    const result = await deleteContenu('not-a-uuid');

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe('Identifiant de contenu invalide.');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return NOT_FOUND when contenu does not exist', async () => {
    const mockSupabase = {
      ...createAuthMock(),
      from: vi.fn().mockImplementation(() => createDeleteMock({ data: null, error: null })),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await deleteContenu(validId);

    expect(result.error?.code).toBe('NOT_FOUND');
    expect(result.error?.message).toBe('Le contenu à supprimer est introuvable.');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return VALIDATION_ERROR on 23503 (FK violation)', async () => {
    const mockSupabase = {
      ...createAuthMock(),
      from: vi.fn().mockImplementation(() => createDeleteMock({ data: null, error: { code: '23503', message: 'fk violation' } })),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await deleteContenu(validId);

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe('Action impossible : des données associées existent.');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return FORBIDDEN on 42501 error', async () => {
    const mockSupabase = {
      ...createAuthMock(),
      from: vi.fn().mockImplementation(() => createDeleteMock({ data: null, error: { code: '42501', message: 'permission denied' } })),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await deleteContenu(validId);

    expect(result.error?.code).toBe('FORBIDDEN');
    expect(result.error?.message).toBe("Vous n'êtes pas autorisé à effectuer cette action.");
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should return UNAUTHORIZED when user is not authenticated', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: { message: 'Invalid token' } }),
      },
      from: vi.fn(),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await deleteContenu(validId);

    expect(result.error?.code).toBe('UNAUTHORIZED');
    expect(result.error?.message).toBe('Authentification requise.');
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it('should use delete() and never update() — hard-delete proof', async () => {
    let deleteCalled = false;
    let updateCalled = false;

    const mockSupabase = {
      ...createAuthMock(),
      from: vi.fn().mockImplementation(() => ({
        delete: vi.fn().mockImplementation(() => {
          deleteCalled = true;
          return {
            eq: vi.fn().mockImplementation(() => ({
              select: vi.fn().mockImplementation(() => ({
                maybeSingle: vi.fn().mockResolvedValue({ data: { id: validId }, error: null }),
              })),
            })),
          };
        }),
        update: vi.fn().mockImplementation(() => {
          updateCalled = true;
          return {};
        }),
      })),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    await deleteContenu(validId);

    expect(deleteCalled).toBe(true);
    expect(updateCalled).toBe(false);
  });
});