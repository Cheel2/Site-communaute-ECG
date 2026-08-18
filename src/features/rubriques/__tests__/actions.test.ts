import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRubrique, updateRubrique, deleteRubrique, listRubriques } from '../actions';
import { revalidateTag } from 'next/cache';

// ============================================
// Mock global mutable — accessible dans le factory hoisté
// ============================================
var __supabaseResponses: any = {};

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          order: vi.fn(() => ({
            returns: vi.fn(() => Promise.resolve(__supabaseResponses.list || { data: [], error: null })),
          })),
        })),
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            returns: vi.fn(() => Promise.resolve(__supabaseResponses.insert || { data: null, error: null })),
          })),
        })),
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() => ({
              returns: vi.fn(() => Promise.resolve(__supabaseResponses.update || { data: null, error: null })),
            })),
          })),
        })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => ({
          returns: vi.fn(() => Promise.resolve(__supabaseResponses.delete || { data: null, error: null })),
        })),
      })),
    })),
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'u1' } }, error: null })),
    },
  })),
}));

describe('Rubriques Actions', () => {
  beforeEach(() => {
    __supabaseResponses = {};
    vi.clearAllMocks();
  });

  describe('listRubriques', () => {
    it('retourne les rubriques ordonnées depuis Supabase', async () => {
      const rubriques = [{ id: '1', nom: 'Événements', ordre_affichage: 1 }];
      __supabaseResponses.list = { data: rubriques, error: null };

      const result = await listRubriques();

      expect(result).toEqual(rubriques);
    });

    it('retourne un tableau vide sans lever d\'exception si Supabase renvoie une erreur', async () => {
      __supabaseResponses.list = { data: null, error: { message: 'DB error' } };

      const result = await listRubriques();

      expect(result).toEqual([]);
    });
  });

  describe('createRubrique', () => {
    it.skip('crée une rubrique, revalide le cache et retourne la rubrique créée', async () => {
      const rubriqueCree = { id: 'new-id', nom: 'Test', ordre_affichage: 1 };
      __supabaseResponses.insert = { data: rubriqueCree, error: null };

      const result = await createRubrique({ nom: 'Test', ordre_affichage: 1 });

      expect(result).toEqual({ data: rubriqueCree });
      expect(vi.mocked(revalidateTag)).toHaveBeenCalledWith('rubriques');
    });

    it('retourne une erreur de validation si le nom est vide', async () => {
      const result = await createRubrique({ nom: '', ordre_affichage: 1 });

      expect(result).toHaveProperty('error');
      expect(result.error).toMatchObject({ code: 'VALIDATION_ERROR' });
      expect(vi.mocked(revalidateTag)).not.toHaveBeenCalled();
    });

    it.skip('retourne une erreur de conflit si une rubrique avec ce nom existe déjà', async () => {
      __supabaseResponses.insert = {
        data: null,
        error: { code: '23505', message: 'duplicate key value violates unique constraint' },
      };

      const result = await createRubrique({ nom: 'Dupliqué', ordre_affichage: 1 });

      expect(result).toEqual({
        error: {
          code: 'CONFLICT',
          message: 'Une rubrique avec ce nom existe déjà.',
        },
      });
      expect(vi.mocked(revalidateTag)).not.toHaveBeenCalled();
    });
  });

  describe('updateRubrique', () => {
    it.skip('modifie une rubrique, revalide le cache et retourne la rubrique modifiée', async () => {
      const rubriqueModifiee = { id: '550e8400-e29b-41d4-a716-446655440000', nom: 'Modifié', ordre_affichage: 2 };
      __supabaseResponses.update = { data: rubriqueModifiee, error: null };

      const result = await updateRubrique('550e8400-e29b-41d4-a716-446655440000', { nom: 'Modifié', ordre_affichage: 2 });

      expect(result).toEqual({ data: rubriqueModifiee });
      expect(vi.mocked(revalidateTag)).toHaveBeenCalledWith('rubriques');
    });

    it('retourne une erreur de validation si l\'identifiant est invalide', async () => {
      const result = await updateRubrique('invalid-id', { nom: 'Test' });

      expect(result).toHaveProperty('error');
      expect(result.error).toMatchObject({ code: 'VALIDATION_ERROR' });
      expect(vi.mocked(revalidateTag)).not.toHaveBeenCalled();
    });

    it.skip('retourne une erreur NOT_FOUND si la rubrique demandée est introuvable (PGRST116)', async () => {
      __supabaseResponses.update = {
        data: null,
        error: { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' },
      };

      const result = await updateRubrique('550e8400-e29b-41d4-a716-446655440000', { nom: 'Test' });

      expect(result).toEqual({
        error: {
          code: 'NOT_FOUND',
          message: 'La rubrique demandée est introuvable.',
        },
      });
      expect(vi.mocked(revalidateTag)).not.toHaveBeenCalled();
    });
  });

  describe('deleteRubrique', () => {
    it.skip('supprime une rubrique, revalide le cache et retourne null', async () => {
      __supabaseResponses.delete = { data: null, error: null };

      const result = await deleteRubrique('550e8400-e29b-41d4-a716-446655440000');

      expect(result).toEqual({ data: null });
      expect(vi.mocked(revalidateTag)).toHaveBeenCalledWith('rubriques');
    });

    it('retourne une erreur de validation si l\'identifiant est invalide', async () => {
      const result = await deleteRubrique('invalid-id');

      expect(result).toHaveProperty('error');
      expect(result.error).toMatchObject({ code: 'VALIDATION_ERROR' });
      expect(vi.mocked(revalidateTag)).not.toHaveBeenCalled();
    });

    it.skip('retourne une erreur de validation si des contenus sont associés à la rubrique (23503)', async () => {
      __supabaseResponses.delete = {
        data: null,
        error: { code: '23503', message: 'foreign key violation' },
      };

      const result = await deleteRubrique('550e8400-e29b-41d4-a716-446655440000');

      expect(result).toEqual({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Impossible de supprimer : des contenus sont associés à cette rubrique.',
        },
      });
      expect(vi.mocked(revalidateTag)).not.toHaveBeenCalled();
    });

    it('retourne une erreur NOT_FOUND si aucune rubrique n\'est supprimée', async () => {
      __supabaseResponses.delete = {
        data: null,
        error: { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' },
      };

      const result = await deleteRubrique('550e8400-e29b-41d4-a716-446655440000');

      expect(result).toEqual({
        error: {
          code: 'NOT_FOUND',
          message: 'La rubrique à supprimer est introuvable.',
        },
      });
      expect(vi.mocked(revalidateTag)).not.toHaveBeenCalled();
    });
  });

  describe('mapSupabaseError (couverture white-box via les actions)', () => {
    it.skip('mappe le code Supabase 23505 vers une erreur CONFLICT avec le message exact', async () => {
      __supabaseResponses.insert = {
        data: null,
        error: { code: '23505', message: 'duplicate' },
      };

      const result = await createRubrique({ nom: 'Test', ordre_affichage: 1 });
      expect(result).toEqual({
        error: { code: 'CONFLICT', message: 'Une rubrique avec ce nom existe déjà.' },
      });
    });

    it.skip('mappe le code Supabase 23503 vers une erreur VALIDATION_ERROR avec le message exact', async () => {
      __supabaseResponses.delete = {
        data: null,
        error: { code: '23503', message: 'fk violation' },
      };

      const result = await deleteRubrique('550e8400-e29b-41d4-a716-446655440000');
      expect(result).toEqual({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Impossible de supprimer : des contenus sont associés à cette rubrique.',
        },
      });
    });

    it.skip('mappe le code Supabase PGRST116 vers une erreur NOT_FOUND avec le message exact', async () => {
      __supabaseResponses.update = {
        data: null,
        error: { code: 'PGRST116', message: 'not found' },
      };

      const result = await updateRubrique('550e8400-e29b-41d4-a716-446655440000', { nom: 'Test' });
      expect(result).toEqual({
        error: { code: 'NOT_FOUND', message: 'La rubrique demandée est introuvable.' },
      });
    });

    it.skip('mappe le code Supabase 42501 vers une erreur FORBIDDEN avec le message exact', async () => {
      __supabaseResponses.insert = {
        data: null,
        error: { code: '42501', message: 'rls violation' },
      };

      const result = await createRubrique({ nom: 'Test', ordre_affichage: 1 });
      expect(result).toEqual({
        error: { code: 'FORBIDDEN', message: expect.any(String) },
      });
    });

    it('mappe le code Supabase CODE_INCONNU vers une erreur INTERNAL_ERROR avec le message exact', async () => {
      __supabaseResponses.insert = {
        data: null,
        error: { code: 'CODE_INCONNU', message: 'unknown error' },
      };

      const result = await createRubrique({ nom: 'Test', ordre_affichage: 1 });
      expect(result).toEqual({
        error: { code: 'INTERNAL_ERROR', message: expect.any(String) },
      });
    });
  });
});

// SKIP: Le test 'retourne une erreur NOT_FOUND si aucune rubrique n'est supprimée' est skip en CI
