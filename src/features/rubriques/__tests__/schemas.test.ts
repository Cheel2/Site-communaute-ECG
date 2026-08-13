// src/features/rubriques/__tests__/schemas.test.ts
import { describe, it, expect } from 'vitest';
import { createRubriqueSchema, updateRubriqueSchema } from '../schemas';

describe('Rubrique Schemas', () => {
  describe('createRubriqueSchema', () => {
    it('valide un objet nominal avec nom et ordre_affichage', () => {
      const result = createRubriqueSchema.safeParse({
        nom: 'Événements',
        ordre_affichage: 5,
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual({
          nom: 'Événements',
          ordre_affichage: 5,
        });
      }
    });

    it('valide un ordre_affichage à 0', () => {
      const result = createRubriqueSchema.safeParse({
        nom: 'Test',
        ordre_affichage: 0,
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.ordre_affichage).toBe(0);
      }
    });

    it('retourne une erreur si le nom est vide après trim', () => {
      const result = createRubriqueSchema.safeParse({
        nom: '   ',
        ordre_affichage: 0,
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          'Le nom de la rubrique est requis.'
        );
      }
    });

    it('retourne une erreur si le nom est manquant', () => {
      const result = createRubriqueSchema.safeParse({
        ordre_affichage: 1,
      });

      expect(result.success).toBe(false);
    });
  });

  describe('updateRubriqueSchema', () => {
    it('valide un objet nominal avec nom et ordre_affichage', () => {
      const result = updateRubriqueSchema.safeParse({
        nom: 'Nouveau nom',
        ordre_affichage: 10,
      });

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual({
          nom: 'Nouveau nom',
          ordre_affichage: 10,
        });
      }
    });

    it('retourne une erreur si le nom est vide après trim', () => {
      const result = updateRubriqueSchema.safeParse({
        nom: '   ',
        ordre_affichage: 0,
      });

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          'Le nom de la rubrique est requis.'
        );
      }
    });
  });
});