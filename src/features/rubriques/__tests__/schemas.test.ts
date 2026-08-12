import { describe, it, expect } from 'vitest';
import { 
  createRubriqueSchema, 
  updateRubriqueSchema
} from '../schemas';

describe('createRubriqueSchema', () => {
  it('should accept complete valid data with nom and ordre_affichage', () => {
    const result = createRubriqueSchema.safeParse({
      nom: 'Catégorie Test',
      ordre_affichage: 1,
    });
    expect(result.success).toBe(true);
  });

  it('should accept nom with exactly 1 character (boundary low)', () => {
    const result = createRubriqueSchema.safeParse({
      nom: 'A',
      ordre_affichage: 0,
    });
    expect(result.success).toBe(true);
  });

  it('should reject when nom is empty string', () => {
    const result = createRubriqueSchema.safeParse({
      nom: '',
      ordre_affichage: 0,
    });
    expect(result.success).toBe(false);
  });

  it('should reject when nom is missing (undefined)', () => {
    const result = createRubriqueSchema.safeParse({
      ordre_affichage: 0,
    });
    expect(result.success).toBe(false);
  });

  it('should reject when ordre_affichage is a string instead of number', () => {
    const result = createRubriqueSchema.safeParse({
      nom: 'Test',
      ordre_affichage: 'abc',
    });
    expect(result.success).toBe(false);
  });

  it('should accept negative ordre_affichage when schema has no min constraint', () => {
    const result = createRubriqueSchema.safeParse({
      nom: 'Test',
      ordre_affichage: -1,
    });
    expect(result.success).toBe(true);
  });
});

describe('updateRubriqueSchema', () => {
  it('should accept partial valid data with id and nom', () => {
    const result = updateRubriqueSchema.safeParse({
      id: '123e4567-e89b-12d3-a456-426614174000',
      nom: 'Nouveau Nom',
    });
    expect(result.success).toBe(true);
  });

  it('should reject empty object without id', () => {
    const result = updateRubriqueSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

// EXPORT MANQUANT : deleteRubriqueSchema n'est pas exporté séparément depuis schemas.ts