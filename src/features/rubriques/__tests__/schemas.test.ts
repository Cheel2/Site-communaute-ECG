import { describe, it, expect } from 'vitest';
import {
  createRubriqueSchema,
  updateRubriqueSchema,
  type CreateRubriqueInput,
  type UpdateRubriqueInput,
} from '../schemas';

describe('createRubriqueSchema', () => {
  it('should accept valid input with nom and ordre_affichage', () => {
    const input: CreateRubriqueInput = {
      nom: 'Actualités',
      ordre_affichage: 5,
    };

    const result = createRubriqueSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        nom: 'Actualités',
        ordre_affichage: 5,
      });
    }
  });

  it('should default ordre_affichage to 0 when omitted', () => {
    const input: CreateRubriqueInput = {
      nom: 'Événements',
    };

    const result = createRubriqueSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        nom: 'Événements',
        ordre_affichage: 0,
      });
    }
  });

  it('should trim whitespace from nom', () => {
    const input: CreateRubriqueInput = {
      nom: '  Espace Presse  ',
      ordre_affichage: 3,
    };

    const result = createRubriqueSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.nom).toBe('Espace Presse');
    }
  });

  it('should reject empty nom', () => {
    const input: CreateRubriqueInput = {
      nom: '',
      ordre_affichage: 1,
    };

    const result = createRubriqueSchema.safeParse(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Le nom de la rubrique est requis.'
      );
    }
  });

  it('should reject nom with only whitespace', () => {
    const input: CreateRubriqueInput = {
      nom: '   ',
      ordre_affichage: 1,
    };

    const result = createRubriqueSchema.safeParse(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Le nom de la rubrique est requis.'
      );
    }
  });

  it('should reject ordre_affichage when not an integer', () => {
    const input = {
      nom: 'Test',
      ordre_affichage: 3.14,
    };

    const result = createRubriqueSchema.safeParse(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Expected integer');
    }
  });

  it('should accept ordre_affichage as 0 (valid boundary)', () => {
    const input: CreateRubriqueInput = {
      nom: 'Archive',
      ordre_affichage: 0,
    };

    const result = createRubriqueSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ordre_affichage).toBe(0);
    }
  });

  it('should accept ordre_affichage as negative (valid integer)', () => {
    const input: CreateRubriqueInput = {
      nom: 'Divers',
      ordre_affichage: -5,
    };

    const result = createRubriqueSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ordre_affichage).toBe(-5);
    }
  });

  it('should accept long nom (no max constraint)', () => {
    const longNom = 'A'.repeat(500);
    const input: CreateRubriqueInput = {
      nom: longNom,
      ordre_affichage: 1,
    };

    const result = createRubriqueSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.nom).toBe(longNom);
    }
  });
});

describe('updateRubriqueSchema', () => {
  it('should accept valid input with nom and ordre_affichage', () => {
    const input: UpdateRubriqueInput = {
      nom: 'Mise à jour Rubrique',
      ordre_affichage: 10,
    };

    const result = updateRubriqueSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        nom: 'Mise à jour Rubrique',
        ordre_affichage: 10,
      });
    }
  });

  it('should default ordre_affichage to 0 when omitted', () => {
    const input: UpdateRubriqueInput = {
      nom: 'Rubrique sans ordre',
    };

    const result = updateRubriqueSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ordre_affichage).toBe(0);
    }
  });

  it('should trim whitespace from nom', () => {
    const input: UpdateRubriqueInput = {
      nom: '  Mise à jour  ',
      ordre_affichage: 7,
    };

    const result = updateRubriqueSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.nom).toBe('Mise à jour');
    }
  });

  it('should reject empty nom', () => {
    const input: UpdateRubriqueInput = {
      nom: '',
      ordre_affichage: 1,
    };

    const result = updateRubriqueSchema.safeParse(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Le nom de la rubrique est requis.'
      );
    }
  });

  it('should reject nom with only whitespace', () => {
    const input: UpdateRubriqueInput = {
      nom: '   ',
      ordre_affichage: 1,
    };

    const result = updateRubriqueSchema.safeParse(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe(
        'Le nom de la rubrique est requis.'
      );
    }
  });

  it('should reject ordre_affichage when not an integer', () => {
    const input = {
      nom: 'Test Update',
      ordre_affichage: 2.718,
    };

    const result = updateRubriqueSchema.safeParse(input);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('Expected integer');
    }
  });

  it('should accept long nom (no max constraint)', () => {
    const longNom = 'B'.repeat(500);
    const input: UpdateRubriqueInput = {
      nom: longNom,
      ordre_affichage: 2,
    };

    const result = updateRubriqueSchema.safeParse(input);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.nom).toBe(longNom);
    }
  });
});

describe('Schema compatibility', () => {
  it('should have identical shape for create and update schemas', () => {
    const createKeys = Object.keys(createRubriqueSchema.shape);
    const updateKeys = Object.keys(updateRubriqueSchema.shape);

    expect(createKeys).toEqual(updateKeys);
    expect(createKeys).toContain('nom');
    expect(createKeys).toContain('ordre_affichage');
  });
});