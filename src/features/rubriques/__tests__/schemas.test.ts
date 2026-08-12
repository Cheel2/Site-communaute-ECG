src/features/rubriques/__tests__/schemas.test.ts
import { describe, it, expect } from 'vitest';
import { 
  createRubriqueSchema, 
  updateRubriqueSchema, 
  deleteRubriqueSchema 
} from '../schemas';

// NOTE: Les noms des schémas sont inférés selon les standards du projet (MC-5).
// Si les exports réels diffèrent (ex: rubriqueSchema, rubriqueIdSchema), ajuster les imports.

describe('createRubriqueSchema', () => {
  it('nominal: accepte des données valides complètes', () => {
    const result = createRubriqueSchema.safeParse({
      nom: 'Catégorie Test',
      ordre_affichage: 1,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.nom).toBe('Catégorie Test');
      expect(result.data.ordre_affichage).toBe(1);
    }
  });

  it('limite basse: accepte un nom de 1 caractère', () => {
    const result = createRubriqueSchema.safeParse({
      nom: 'A',
      ordre_affichage: 0,
    });
    expect(result.success).toBe(true);
  });

  it('négatif: rejette un nom vide', () => {
    const result = createRubriqueSchema.safeParse({
      nom: '',
      ordre_affichage: 0,
    });
    expect(result.success).toBe(false);
  });

  it('négatif: rejette un nom manquant (undefined)', () => {
    const result = createRubriqueSchema.safeParse({
      ordre_affichage: 0,
    });
    expect(result.success).toBe(false);
  });

  it('négatif: rejette ordre_affichage si chaîne de caractères', () => {
    const result = createRubriqueSchema.safeParse({
      nom: 'Test',
      ordre_affichage: 'abc',
    });
    expect(result.success).toBe(false);
  });

  it('négatif: rejette ordre_affichage si nombre négatif', () => {
    const result = createRubriqueSchema.safeParse({
      nom: 'Test',
      ordre_affichage: -1,
    });
    expect(result.success).toBe(false);
  });
});

describe('updateRubriqueSchema', () => {
  it('nominal: accepte des données partielles valides avec id', () => {
    const result = updateRubriqueSchema.safeParse({
      id: '123e4567-e89b-12d3-a456-426614174000',
      nom: 'Nouveau Nom',
    });
    expect(result.success).toBe(true);
  });

  it('négatif: rejette un objet vide sans id', () => {
    const result = updateRubriqueSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe('deleteRubriqueSchema', () => {
  it('nominal: accepte un id UUID valide', () => {
    const result = deleteRubriqueSchema.safeParse({
      id: '123e4567-e89b-12d3-a456-426614174000',
    });
    expect(result.success).toBe(true);
  });

  it('négatif: rejette un id vide ou invalide', () => {
    const result = deleteRubriqueSchema.safeParse({
      id: 'not-a-uuid',
    });
    expect(result.success).toBe(false);
  });
});