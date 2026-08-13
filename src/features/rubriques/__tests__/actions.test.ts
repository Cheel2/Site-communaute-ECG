import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRubrique, updateRubrique, deleteRubrique, listRubriques } from '../actions';
import { revalidateTag } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('Rubriques Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listRubriques', () => {
    it('retourne les rubriques ordonnées depuis Supabase', async () => {
      const rubriques = [{ id: '1', nom: 'Événements', ordre_affichage: 1 }];
      const orderMock = vi.fn().mockResolvedValue({ data: rubriques, error: null });
      const selectMock = vi.fn().mockReturnValue({ order: orderMock });
      const fromMock = vi.fn().mockReturnValue({ select: selectMock });

      vi.mocked(createClient).mockReturnValue({
        from: fromMock,
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }) },
      } as any);

      const result = await listRubriques();

      expect(result).toEqual({ data: rubriques });
      expect(fromMock).toHaveBeenCalledWith('rubrique');
      expect(selectMock).toHaveBeenCalledWith('*');
      expect(orderMock).toHaveBeenCalledWith('ordre_affichage', { ascending: true });
    });

    it('retourne un tableau vide sans lever d\'exception si Supabase renvoie une erreur', async () => {
      const orderMock = vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } });
      const selectMock = vi.fn().mockReturnValue({ order: orderMock });
      const fromMock = vi.fn().mockReturnValue({ select: selectMock });

      vi.mocked(createClient).mockReturnValue({
        from: fromMock,
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }) },
      } as any);

      const result = await listRubriques();

      expect(result).toEqual({ data: [] });
    });
  });

  describe('createRubrique', () => {
    it('crée une rubrique, revalide le cache et retourne la rubrique créée', async () => {
      const rubriqueCree = { id: 'new-id', nom: 'Test', ordre_affichage: 1 };
      const singleMock = vi.fn().mockResolvedValue({ data: rubriqueCree, error: null });
      const selectMock = vi.fn().mockReturnValue({ single: singleMock });
      const insertMock = vi.fn().mockReturnValue({ select: selectMock });
      const fromMock = vi.fn().mockReturnValue({ insert: insertMock });

      vi.mocked(createClient).mockReturnValue({
        from: fromMock,
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }) },
      } as any);

      const result = await createRubrique({ nom: 'Test', ordre_affichage: 1 });

      expect(result).toEqual({ data: rubriqueCree });
      expect(vi.mocked(revalidateTag)).toHaveBeenCalledWith('rubriques');
    });

    it('retourne une erreur de validation si le nom est vide', async () => {
      const result = await createRubrique({ nom: '', ordre_affichage: 1 });

      expect(result).toHaveProperty('error');
      expect(result.error).toMatchObject({ code: 'VALIDATION_ERROR' });
      expect(vi.mocked(createClient)).not.toHaveBeenCalled();
      expect(vi.mocked(revalidateTag)).not.toHaveBeenCalled();
    });

    it('retourne une erreur de conflit si une rubrique avec ce nom existe déjà', async () => {
      const singleMock = vi.fn().mockResolvedValue({
        data: null,
        error: { code: '23505', message: 'duplicate key value violates unique constraint' },
      });
      const selectMock = vi.fn().mockReturnValue({ single: singleMock });
      const insertMock = vi.fn().mockReturnValue({ select: selectMock });
      const fromMock = vi.fn().mockReturnValue({ insert: insertMock });

      vi.mocked(createClient).mockReturnValue({
        from: fromMock,
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }) },
      } as any);

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
    it('modifie une rubrique, revalide le cache et retourne la rubrique modifiée', async () => {
      const rubriqueModifiee = { id: 'uuid-valid', nom: 'Modifié', ordre_affichage: 2 };
      const singleMock = vi.fn().mockResolvedValue({ data: rubriqueModifiee, error: null });
      const selectMock = vi.fn().mockReturnValue({ single: singleMock });
      const eqMock = vi.fn().mockReturnValue({ select: selectMock });
      const updateMock = vi.fn().mockReturnValue({ eq: eqMock });
      const fromMock = vi.fn().mockReturnValue({ update: updateMock });

      vi.mocked(createClient).mockReturnValue({
        from: fromMock,
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }) },
      } as any);

      const result = await updateRubrique('uuid-valid', { nom: 'Modifié', ordre_affichage: 2 });

      expect(result).toEqual({ data: rubriqueModifiee });
      expect(vi.mocked(revalidateTag)).toHaveBeenCalledWith('rubriques');
    });

    it('retourne une erreur de validation si l\'identifiant est invalide', async () => {
      const result = await updateRubrique('invalid-id', { nom: 'Test' });

      expect(result).toHaveProperty('error');
      expect(result.error).toMatchObject({ code: 'VALIDATION_ERROR' });
      expect(vi.mocked(createClient)).not.toHaveBeenCalled();
      expect(vi.mocked(revalidateTag)).not.toHaveBeenCalled();
    });

    it('retourne une erreur NOT_FOUND si la rubrique demandée est introuvable (PGRST116)', async () => {
      const singleMock = vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' },
      });
      const selectMock = vi.fn().mockReturnValue({ single: singleMock });
      const eqMock = vi.fn().mockReturnValue({ select: selectMock });
      const updateMock = vi.fn().mockReturnValue({ eq: eqMock });
      const fromMock = vi.fn().mockReturnValue({ update: updateMock });

      vi.mocked(createClient).mockReturnValue({
        from: fromMock,
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }) },
      } as any);

      const result = await updateRubrique('uuid-valid', { nom: 'Test' });

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
    it('supprime une rubrique, revalide le cache et retourne null', async () => {
      const eqMock = vi.fn().mockResolvedValue({ data: null, error: null });
      const deleteMock = vi.fn().mockReturnValue({ eq: eqMock });
      const fromMock = vi.fn().mockReturnValue({ delete: deleteMock });

      vi.mocked(createClient).mockReturnValue({
        from: fromMock,
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }) },
      } as any);

      const result = await deleteRubrique('uuid-valid');

      expect(result).toEqual({ data: null });
      expect(vi.mocked(revalidateTag)).toHaveBeenCalledWith('rubriques');
    });

    it('retourne une erreur de validation si l\'identifiant est invalide', async () => {
      const result = await deleteRubrique('invalid-id');

      expect(result).toHaveProperty('error');
      expect(result.error).toMatchObject({ code: 'VALIDATION_ERROR' });
      expect(vi.mocked(createClient)).not.toHaveBeenCalled();
      expect(vi.mocked(revalidateTag)).not.toHaveBeenCalled();
    });

    it('retourne une erreur de validation si des contenus sont associés à la rubrique (23503)', async () => {
      const eqMock = vi.fn().mockResolvedValue({
        data: null,
        error: { code: '23503', message: 'foreign key violation' },
      });
      const deleteMock = vi.fn().mockReturnValue({ eq: eqMock });
      const fromMock = vi.fn().mockReturnValue({ delete: deleteMock });

      vi.mocked(createClient).mockReturnValue({
        from: fromMock,
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }) },
      } as any);

      const result = await deleteRubrique('uuid-valid');

      expect(result).toEqual({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Impossible de supprimer : des contenus sont associés à cette rubrique.',
        },
      });
      expect(vi.mocked(revalidateTag)).not.toHaveBeenCalled();
    });

    it('retourne une erreur NOT_FOUND si aucune rubrique n\'est supprimée', async () => {
      const eqMock = vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' },
      });
      const deleteMock = vi.fn().mockReturnValue({ eq: eqMock });
      const fromMock = vi.fn().mockReturnValue({ delete: deleteMock });

      vi.mocked(createClient).mockReturnValue({
        from: fromMock,
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }) },
      } as any);

      const result = await deleteRubrique('uuid-valid');

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
    it('mappe le code Supabase 23505 vers une erreur CONFLICT avec le message exact', async () => {
      const singleMock = vi.fn().mockResolvedValue({
        data: null,
        error: { code: '23505', message: 'duplicate' },
      });
      const selectMock = vi.fn().mockReturnValue({ single: singleMock });
      const insertMock = vi.fn().mockReturnValue({ select: selectMock });
      const fromMock = vi.fn().mockReturnValue({ insert: insertMock });

      vi.mocked(createClient).mockReturnValue({
        from: fromMock,
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }) },
      } as any);

      const result = await createRubrique({ nom: 'Test', ordre_affichage: 1 });
      expect(result).toEqual({
        error: { code: 'CONFLICT', message: 'Une rubrique avec ce nom existe déjà.' },
      });
    });

    it('mappe le code Supabase 23503 vers une erreur VALIDATION_ERROR avec le message exact', async () => {
      const eqMock = vi.fn().mockResolvedValue({
        data: null,
        error: { code: '23503', message: 'fk violation' },
      });
      const deleteMock = vi.fn().mockReturnValue({ eq: eqMock });
      const fromMock = vi.fn().mockReturnValue({ delete: deleteMock });

      vi.mocked(createClient).mockReturnValue({
        from: fromMock,
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }) },
      } as any);

      const result = await deleteRubrique('uuid-valid');
      expect(result).toEqual({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Impossible de supprimer : des contenus sont associés à cette rubrique.',
        },
      });
    });

    it('mappe le code Supabase PGRST116 vers une erreur NOT_FOUND avec le message exact', async () => {
      const singleMock = vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'not found' },
      });
      const selectMock = vi.fn().mockReturnValue({ single: singleMock });
      const eqMock = vi.fn().mockReturnValue({ select: selectMock });
      const updateMock = vi.fn().mockReturnValue({ eq: eqMock });
      const fromMock = vi.fn().mockReturnValue({ update: updateMock });

      vi.mocked(createClient).mockReturnValue({
        from: fromMock,
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }) },
      } as any);

      const result = await updateRubrique('uuid-valid', { nom: 'Test' });
      expect(result).toEqual({
        error: { code: 'NOT_FOUND', message: 'La rubrique demandée est introuvable.' },
      });
    });

    it('mappe le code Supabase 42501 vers une erreur FORBIDDEN avec le message exact', async () => {
      const singleMock = vi.fn().mockResolvedValue({
        data: null,
        error: { code: '42501', message: 'rls violation' },
      });
      const selectMock = vi.fn().mockReturnValue({ single: singleMock });
      const insertMock = vi.fn().mockReturnValue({ select: selectMock });
      const fromMock = vi.fn().mockReturnValue({ insert: insertMock });

      vi.mocked(createClient).mockReturnValue({
        from: fromMock,
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }) },
      } as any);

      const result = await createRubrique({ nom: 'Test', ordre_affichage: 1 });
      expect(result).toEqual({
        error: { code: 'FORBIDDEN', message: expect.any(String) },
      });
    });

    it('mappe le code Supabase CODE_INCONNU vers une erreur INTERNAL_ERROR avec le message exact', async () => {
      const singleMock = vi.fn().mockResolvedValue({
        data: null,
        error: { code: 'CODE_INCONNU', message: 'unknown error' },
      });
      const selectMock = vi.fn().mockReturnValue({ single: singleMock });
      const insertMock = vi.fn().mockReturnValue({ select: selectMock });
      const fromMock = vi.fn().mockReturnValue({ insert: insertMock });

      vi.mocked(createClient).mockReturnValue({
        from: fromMock,
        auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }) },
      } as any);

      const result = await createRubrique({ nom: 'Test', ordre_affichage: 1 });
      expect(result).toEqual({
        error: { code: 'INTERNAL_ERROR', message: expect.any(String) },
      });
    });
  });
});