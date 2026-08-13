// src/features/rubriques/__tests__/actions.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { revalidateTag } from 'next/cache';
import { mockCreateClient } from '@/test/__mocks__/supabase';
import {
  listRubriques,
  createRubrique,
  updateRubrique,
  deleteRubrique,
} from '../actions';

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
}));

vi.mock('@/lib/supabase/server', async () => ({
  createClient: (await import('@/test/__mocks__/supabase')).mockCreateClient,
}));

const uuidValide = '7c9e6679-7425-40de-944b-e07fc1f90ae7';

const rubriqueCree = {
  id: uuidValide,
  nom: 'Test',
  ordre_affichage: 1,
  date_creation: '2024-01-01T00:00:00.000Z',
  date_modification: '2024-01-01T00:00:00.000Z',
};

const rubriqueModifiee = {
  ...rubriqueCree,
  nom: 'Modifié',
  ordre_affichage: 2,
  date_modification: '2024-01-02T00:00:00.000Z',
};

function setupSupabaseClient() {
  const chain = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    eq: vi.fn(),
    order: vi.fn(),
    returns: vi.fn(),
    single: vi.fn(),
    maybeSingle: vi.fn(),
  };

  chain.select.mockReturnValue(chain);
  chain.insert.mockReturnValue(chain);
  chain.update.mockReturnValue(chain);
  chain.delete.mockReturnValue(chain);
  chain.eq.mockReturnValue(chain);
  chain.order.mockReturnValue(chain);
  chain.returns.mockReturnValue(chain);

  const from = vi.fn().mockReturnValue(chain);

  const getUser = vi.fn().mockResolvedValue({
    data: { user: { id: 'user-id' } },
    error: null,
  });

  const client = {
    auth: { getUser },
    from,
  };

  vi.mocked(mockCreateClient).mockResolvedValue(client as any);

  return { chain, from, getUser };
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe('Rubriques Actions', () => {
  describe('listRubriques', () => {
    it('retourne les rubriques ordonnées depuis Supabase', async () => {
      const { chain, from } = setupSupabaseClient();

      vi.mocked(chain.returns).mockResolvedValue({
        data: [rubriqueCree],
        error: null,
      });

      const result = await listRubriques();

      expect(vi.mocked(from)).toHaveBeenCalledWith('rubrique');
      expect(vi.mocked(chain.select)).toHaveBeenCalledWith('*');
      expect(vi.mocked(chain.order)).toHaveBeenNthCalledWith(
        1,
        'ordre_affichage',
        { ascending: true }
      );
      expect(vi.mocked(chain.order)).toHaveBeenNthCalledWith(2, 'nom', {
        ascending: true,
      });
      expect(vi.mocked(chain.returns)).toHaveBeenCalledTimes(1);
      expect(result).toEqual([rubriqueCree]);
    });

    it("retourne un tableau vide sans lever d'exception si Supabase renvoie une erreur", async () => {
      const { chain } = setupSupabaseClient();

      vi.mocked(chain.returns).mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'erreur Supabase' },
      });

      await expect(listRubriques()).resolves.toEqual([]);
      expect(vi.mocked(chain.returns)).toHaveBeenCalledTimes(1);
      expect(vi.mocked(revalidateTag)).not.toHaveBeenCalled();
    });
  });

  describe('createRubrique', () => {
    it('crée une rubrique, revalide le cache et retourne la rubrique créée', async () => {
      const { chain, from } = setupSupabaseClient();

      vi.mocked(chain.single).mockResolvedValue({
        data: rubriqueCree,
        error: null,
      });

      const result = await createRubrique({
        nom: 'Test',
        ordre_affichage: 1,
      });

      expect(vi.mocked(from)).toHaveBeenCalledWith('rubrique');
      expect(vi.mocked(chain.insert)).toHaveBeenCalledWith({
        nom: 'Test',
        ordre_affichage: 1,
        date_creation: expect.any(String),
        date_modification: expect.any(String),
      });
      expect(vi.mocked(chain.select)).toHaveBeenCalledWith('*');
      expect(vi.mocked(chain.returns)).toHaveBeenCalledTimes(1);
      expect(vi.mocked(chain.single)).toHaveBeenCalledTimes(1);
      expect(vi.mocked(revalidateTag)).toHaveBeenCalledTimes(1);
      expect(vi.mocked(revalidateTag)).toHaveBeenCalledWith('rubriques');
      expect(result).toEqual({ data: rubriqueCree });
    });

    it('retourne une erreur de validation si le nom est vide', async () => {
      const result = await createRubrique({ nom: '' });

      expect(result).toEqual({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Le nom de la rubrique est requis.',
        },
      });
      expect(vi.mocked(mockCreateClient)).not.toHaveBeenCalled();
      expect(vi.mocked(revalidateTag)).not.toHaveBeenCalled();
    });

    it('retourne une erreur de conflit si une rubrique avec ce nom existe déjà', async () => {
      const { chain } = setupSupabaseClient();

      vi.mocked(chain.single).mockResolvedValue({
        data: null,
        error: { code: '23505', message: 'duplicate key value' },
      });

      const result = await createRubrique({
        nom: 'Test',
        ordre_affichage: 1,
      });

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
      const { chain, from } = setupSupabaseClient();

      vi.mocked(chain.single).mockResolvedValue({
        data: rubriqueModifiee,
        error: null,
      });

      const result = await updateRubrique(uuidValide, {
        nom: 'Modifié',
        ordre_affichage: 2,
      });

      expect(vi.mocked(from)).toHaveBeenCalledWith('rubrique');
      expect(vi.mocked(chain.update)).toHaveBeenCalledWith({
        nom: 'Modifié',
        ordre_affichage: 2,
        date_modification: expect.any(String),
      });
      expect(vi.mocked(chain.eq)).toHaveBeenCalledWith('id', uuidValide);
      expect(vi.mocked(chain.select)).toHaveBeenCalledWith('*');
      expect(vi.mocked(chain.returns)).toHaveBeenCalledTimes(1);
      expect(vi.mocked(chain.single)).toHaveBeenCalledTimes(1);
      expect(vi.mocked(revalidateTag)).toHaveBeenCalledTimes(1);
      expect(vi.mocked(revalidateTag)).toHaveBeenCalledWith('rubriques');
      expect(result).toEqual({ data: rubriqueModifiee });
    });

    it("retourne une erreur de validation si l'identifiant est invalide", async () => {
      const result = await updateRubrique('invalid-id', { nom: 'Test' });

      expect(result).toEqual({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Identifiant de rubrique invalide.',
        },
      });
      expect(vi.mocked(mockCreateClient)).not.toHaveBeenCalled();
      expect(vi.mocked(revalidateTag)).not.toHaveBeenCalled();
    });

    it('retourne une erreur NOT_FOUND si la rubrique demandée est introuvable (PGRST116)', async () => {
      const { chain } = setupSupabaseClient();

      vi.mocked(chain.single).mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'row not found' },
      });

      const result = await updateRubrique(uuidValide, {
        nom: 'Modifié',
        ordre_affichage: 2,
      });

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
      const { chain, from } = setupSupabaseClient();

      vi.mocked(chain.maybeSingle).mockResolvedValue({
        data: { id: uuidValide },
        error: null,
      });

      const result = await deleteRubrique(uuidValide);

      expect(vi.mocked(from)).toHaveBeenCalledWith('rubrique');
      expect(vi.mocked(chain.delete)).toHaveBeenCalledTimes(1);
      expect(vi.mocked(chain.eq)).toHaveBeenCalledWith('id', uuidValide);
      expect(vi.mocked(chain.select)).toHaveBeenCalledWith('id');
      expect(vi.mocked(chain.maybeSingle)).toHaveBeenCalledTimes(1);
      expect(vi.mocked(revalidateTag)).toHaveBeenCalledTimes(1);
      expect(vi.mocked(revalidateTag)).toHaveBeenCalledWith('rubriques');
      expect(result).toEqual({ data: null });
    });

    it("retourne une erreur de validation si l'identifiant est invalide", async () => {
      const result = await deleteRubrique('invalid-id');

      expect(result).toEqual({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Identifiant de rubrique invalide.',
        },
      });
      expect(vi.mocked(mockCreateClient)).not.toHaveBeenCalled();
      expect(vi.mocked(revalidateTag)).not.toHaveBeenCalled();
    });

    it('retourne une erreur de validation si des contenus sont associés à la rubrique (23503)', async () => {
      const { chain } = setupSupabaseClient();

      vi.mocked(chain.maybeSingle).mockResolvedValue({
        data: null,
        error: { code: '23503', message: 'foreign key violation' },
      });

      const result = await deleteRubrique(uuidValide);

      expect(result).toEqual({
        error: {
          code: 'VALIDATION_ERROR',
          message:
            'Impossible de supprimer : des contenus sont associés à cette rubrique.',
        },
      });
      expect(vi.mocked(revalidateTag)).not.toHaveBeenCalled();
    });

    // Avec maybeSingle(), l'absence de ligne supprimée est signalée par data null.
    it("retourne une erreur NOT_FOUND si aucune rubrique n'est supprimée", async () => {
      const { chain } = setupSupabaseClient();

      vi.mocked(chain.maybeSingle).mockResolvedValue({
        data: null,
        error: null,
      });

      const result = await deleteRubrique(uuidValide);

      expect(result).toEqual({
        error: {
          code: 'NOT_FOUND',
          message: 'La rubrique à supprimer est introuvable.',
        },
      });
      expect(vi.mocked(revalidateTag)).not.toHaveBeenCalled();
    });
  });

  // mapSupabaseError n'est pas exporté : la couverture white-box passe par les actions qui l'utilisent.
  describe('mapSupabaseError (couverture white-box via les actions)', () => {
    it.each([
      ['23505', 'CONFLICT', 'Une rubrique avec ce nom existe déjà.'],
      [
        '23503',
        'VALIDATION_ERROR',
        'Impossible de supprimer : des contenus sont associés à cette rubrique.',
      ],
      ['PGRST116', 'NOT_FOUND', 'La rubrique demandée est introuvable.'],
      [
        '42501',
        'FORBIDDEN',
        "Vous n'êtes pas autorisé à effectuer cette action.",
      ],
      ['CODE_INCONNU', 'INTERNAL_ERROR', 'Une erreur technique est survenue.'],
    ] as const)(
      'mappe le code Supabase %s vers une erreur %s avec le message exact',
      async (code, expectedCode, expectedMessage) => {
        const { chain } = setupSupabaseClient();

        vi.mocked(chain.single).mockResolvedValue({
          data: null,
          error: { code, message: 'Supabase error' },
        });

        const result = await updateRubrique(uuidValide, {
          nom: 'Mapping',
          ordre_affichage: 0,
        });

        expect(result).toEqual({
          error: {
            code: expectedCode,
            message: expectedMessage,
          },
        });
        expect(vi.mocked(revalidateTag)).not.toHaveBeenCalled();
      }
    );
  });
});