import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveBrouillon, getBrouillon } from '../actions';
import type { Brouillon } from '@/types/database';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';

// ============================================
// HELPERS DE MOCK
// ============================================

function createSelectMock(result: any) {
  return {
    select: vi.fn().mockImplementation(() => ({
      eq: vi.fn().mockImplementation(() => ({
        maybeSingle: vi.fn().mockResolvedValue(result),
      })),
    })),
  };
}

function createSelectAllMock(result: any) {
  return {
    select: vi.fn().mockImplementation(() => ({
      eq: vi.fn().mockImplementation(() => ({
        maybeSingle: vi.fn().mockResolvedValue(result),
      })),
    })),
  };
}

function createUpdateMock(result: any) {
  return {
    update: vi.fn().mockImplementation(() => ({
      eq: vi.fn().mockImplementation(() => ({
        select: vi.fn().mockImplementation(() => ({
          single: vi.fn().mockResolvedValue(result),
        })),
      })),
    })),
  };
}

function createInsertMock(result: any) {
  return {
    insert: vi.fn().mockImplementation(() => ({
      select: vi.fn().mockImplementation(() => ({
        single: vi.fn().mockResolvedValue(result),
      })),
    })),
  };
}

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

// ============================================
// SAVE BROUILLON
// ============================================

describe('saveBrouillon', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockBrouillon: Brouillon = {
    id: 'brouillon-id',
    contenu_id: '123e4567-e89b-12d3-a456-426614174000',
    titre: 'Mon brouillon',
    rubrique_id: '223e4567-e89b-12d3-a456-426614174001',
    texte: 'Contenu du brouillon',
    image_url: null,
    date_derniere_sauvegarde: '2025-01-01T00:00:00Z',
  };

  describe('INSERT sans contenu_id (nouveau brouillon libre)', () => {
    it('should create new brouillon without contenu_id', async () => {
      const input = {
        titre: 'Mon brouillon',
        rubrique_id: '223e4567-e89b-12d3-a456-426614174001',
        texte: 'Contenu du brouillon',
      };

      const mockSupabase = {
        from: vi.fn().mockImplementation(() => createInsertMock({ data: mockBrouillon, error: null })),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

      const result = await saveBrouillon(input);

      expect(result).toEqual({ data: mockBrouillon });
    });

    it('should return VALIDATION_ERROR when input is invalid', async () => {
      // contenu_id is optional, so valid
      const validInput = { titre: 'Test' };
      // But we can test with invalid rubrique_id
      const invalidInput = { rubrique_id: 'not-a-uuid' };

      const result = await saveBrouillon(invalidInput);

      expect(result.error?.code).toBe('VALIDATION_ERROR');
      expect(result.error?.message).toBe('Données du brouillon invalides.');
    });

    it('should return INTERNAL_ERROR when insert fails', async () => {
      const input = { titre: 'Test' };

      const mockSupabase = {
        from: vi.fn().mockImplementation(() => createInsertMock({ data: null, error: { message: 'DB error' } })),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

      const result = await saveBrouillon(input);

      expect(result.error?.code).toBe('INTERNAL_ERROR');
      expect(result.error?.message).toBe('Erreur lors de la création du brouillon.');
    });
  });

  describe('INSERT avec contenu_id (pas de brouillon existant)', () => {
    it('should insert new brouillon with contenu_id when no existing brouillon found', async () => {
      const input = {
        contenu_id: '123e4567-e89b-12d3-a456-426614174000',
        titre: 'Mon brouillon',
        rubrique_id: '223e4567-e89b-12d3-a456-426614174001',
        texte: 'Contenu du brouillon',
      };

      // No existing brouillon found
      const mockSelect = createSelectMock({ data: null, error: null });

      const mockInsert = createInsertMock({ data: mockBrouillon, error: null });

      const mockSupabase = {
        from: vi.fn().mockImplementation(() => {
          const from = vi.fn();
          from.mockReturnValueOnce(mockSelect);
          from.mockReturnValueOnce(mockInsert);
          return from();
        }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

      const result = await saveBrouillon(input);

      expect(result).toEqual({ data: mockBrouillon });
    });

    it('should return INTERNAL_ERROR when select fails', async () => {
      const input = {
        contenu_id: '123e4567-e89b-12d3-a456-426614174000',
        titre: 'Test',
      };

      const mockSelect = createSelectMock({ data: null, error: { message: 'DB error' } });

      const mockSupabase = {
        from: vi.fn().mockImplementation(() => mockSelect),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

      const result = await saveBrouillon(input);

      expect(result.error?.code).toBe('INTERNAL_ERROR');
      expect(result.error?.message).toBe('Erreur lors de la recherche du brouillon.');
    });
  });

  describe('UPDATE avec contenu_id (brouillon existant)', () => {
    it('should update existing brouillon when found', async () => {
      const input = {
        contenu_id: '123e4567-e89b-12d3-a456-426614174000',
        titre: 'Brouillon modifié',
        rubrique_id: '223e4567-e89b-12d3-a456-426614174001',
        texte: 'Contenu modifié',
      };

      const existingBrouillon = { id: 'existing-id', contenu_id: input.contenu_id };
      const updatedBrouillon: Brouillon = {
        id: 'existing-id',
        contenu_id: input.contenu_id,
        titre: 'Brouillon modifié',
        rubrique_id: input.rubrique_id,
        texte: input.texte,
        image_url: null,
        date_derniere_sauvegarde: '2025-01-01T00:00:00Z',
      };

      const mockSelect = createSelectMock({ data: existingBrouillon, error: null });
      const mockUpdate = createUpdateMock({ data: updatedBrouillon, error: null });

      const mockSupabase = {
        from: vi.fn().mockImplementation(() => {
          const from = vi.fn();
          from.mockReturnValueOnce(mockSelect);
          from.mockReturnValueOnce(mockUpdate);
          return from();
        }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

      const result = await saveBrouillon(input);

      expect(result).toEqual({ data: updatedBrouillon });
    });

    it('should return INTERNAL_ERROR when update fails', async () => {
      const input = {
        contenu_id: '123e4567-e89b-12d3-a456-426614174000',
        titre: 'Test',
      };

      const existingBrouillon = { id: 'existing-id', contenu_id: input.contenu_id };
      const mockSelect = createSelectMock({ data: existingBrouillon, error: null });
      const mockUpdate = createUpdateMock({ data: null, error: { message: 'DB error' } });

      const mockSupabase = {
        from: vi.fn().mockImplementation(() => {
          const from = vi.fn();
          from.mockReturnValueOnce(mockSelect);
          from.mockReturnValueOnce(mockUpdate);
          return from();
        }),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

      const result = await saveBrouillon(input);

      expect(result.error?.code).toBe('INTERNAL_ERROR');
      expect(result.error?.message).toBe('Erreur lors de la mise à jour du brouillon.');
    });
  });

  describe('Validation', () => {
    it('should accept all optional fields', async () => {
      const input = {
        contenu_id: null,
        titre: '',
        rubrique_id: null,
        texte: '',
        image_url: null,
      };

      const mockBrouillonEmpty: Brouillon = {
        id: 'new-id',
        contenu_id: null,
        titre: '',
        rubrique_id: null,
        texte: '',
        image_url: null,
        date_derniere_sauvegarde: '2025-01-01T00:00:00Z',
      };

      const mockSupabase = {
        from: vi.fn().mockImplementation(() => createInsertMock({ data: mockBrouillonEmpty, error: null })),
      };
      vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

      const result = await saveBrouillon(input);

      expect(result).toEqual({ data: mockBrouillonEmpty });
    });

    it('should reject invalid contenu_id format', async () => {
      const input = {
        contenu_id: 'not-a-uuid',
        titre: 'Test',
      };

      const result = await saveBrouillon(input);

      expect(result.error?.code).toBe('VALIDATION_ERROR');
      expect(result.error?.message).toBe('Données du brouillon invalides.');
    });

    it('should reject invalid rubrique_id format', async () => {
      const input = {
        rubrique_id: 'not-a-uuid',
        titre: 'Test',
      };

      const result = await saveBrouillon(input);

      expect(result.error?.code).toBe('VALIDATION_ERROR');
      expect(result.error?.message).toBe('Données du brouillon invalides.');
    });
  });
});

// ============================================
// GET BROUILLON
// ============================================

describe('getBrouillon', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const contenuId = '123e4567-e89b-12d3-a456-426614174000';
  const mockBrouillon: Brouillon = {
    id: 'brouillon-id',
    contenu_id: contenuId,
    titre: 'Mon brouillon',
    rubrique_id: '223e4567-e89b-12d3-a456-426614174001',
    texte: 'Contenu du brouillon',
    image_url: null,
    date_derniere_sauvegarde: '2025-01-01T00:00:00Z',
  };

  it('should return brouillon when found', async () => {
    const mockSelect = createSelectAllMock({ data: mockBrouillon, error: null });
    const mockSupabase = {
      from: vi.fn().mockImplementation(() => mockSelect),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await getBrouillon(contenuId);

    expect(result).toEqual({ data: mockBrouillon });
  });

  it('should return { data: null } when no brouillon found', async () => {
    const mockSelect = createSelectAllMock({ data: null, error: null });
    const mockSupabase = {
      from: vi.fn().mockImplementation(() => mockSelect),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await getBrouillon(contenuId);

    expect(result).toEqual({ data: null });
  });

  it('should return INTERNAL_ERROR on Supabase error', async () => {
    const mockSelect = createSelectAllMock({ data: null, error: { message: 'DB error' } });
    const mockSupabase = {
      from: vi.fn().mockImplementation(() => mockSelect),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await getBrouillon(contenuId);

    expect(result.error?.code).toBe('INTERNAL_ERROR');
    expect(result.error?.message).toBe('Erreur lors de la récupération du brouillon.');
  });
});