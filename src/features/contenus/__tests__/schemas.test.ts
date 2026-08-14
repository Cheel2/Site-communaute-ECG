import { describe, it, expect } from 'vitest';
import {
  createContenuSchema,
  updateContenuSchema,
  statutContenuSchema,
  type CreateContenuInput,
  type UpdateContenuInput,
} from '../schemas';

describe('statutContenuSchema', () => {
  it('should accept "publie" as valid status', () => {
    const result = statutContenuSchema.safeParse('publie');
    expect(result.success).toBe(true);
  });

  it('should accept "non_publie" as valid status', () => {
    const result = statutContenuSchema.safeParse('non_publie');
    expect(result.success).toBe(true);
  });

  it('should reject invalid status value', () => {
    const result = statutContenuSchema.safeParse('brouillon');
    expect(result.success).toBe(false);
  });
});

describe('createContenuSchema', () => {
  const validInput: CreateContenuInput = {
    titre: 'Mon article',
    texte: 'Contenu de l\'article',
    rubrique_id: '123e4567-e89b-12d3-a456-426614174000',
    statut: 'publie',
  };

  it('should accept valid input with all fields', () => {
    const result = createContenuSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.titre).toBe('Mon article');
      expect(result.data.texte).toBe('Contenu de l\'article');
      expect(result.data.rubrique_id).toBe(validInput.rubrique_id);
      expect(result.data.statut).toBe('publie');
      expect(result.data.image_url).toBeNull();
    }
  });

  it('should accept input without image_url (optional)', () => {
    const input = {
      titre: 'Sans image',
      texte: 'Texte',
      rubrique_id: '123e4567-e89b-12d3-a456-426614174000',
      statut: 'non_publie' as const,
    };
    const result = createContenuSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.image_url).toBeNull();
    }
  });

  it('should transform empty string image_url to null', () => {
    const input = {
      ...validInput,
      image_url: '',
    };
    const result = createContenuSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.image_url).toBeNull();
    }
  });

  it('should trim whitespace from titre', () => {
    const input = {
      ...validInput,
      titre: '  Article avec espaces  ',
    };
    const result = createContenuSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.titre).toBe('Article avec espaces');
    }
  });

  it('should reject empty titre', () => {
    const input = {
      ...validInput,
      titre: '',
    };
    const result = createContenuSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Le titre du contenu est requis.');
    }
  });

  it('should reject titre with only whitespace', () => {
    const input = {
      ...validInput,
      titre: '   ',
    };
    const result = createContenuSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Le titre du contenu est requis.');
    }
  });

  it('should reject invalid UUID for rubrique_id', () => {
    const input = {
      ...validInput,
      rubrique_id: 'not-a-uuid',
    };
    const result = createContenuSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('rubrique associée est invalide');
    }
  });

  it('should reject missing rubrique_id (required)', () => {
    const input = {
      titre: 'Test',
      texte: 'Texte',
      statut: 'publie' as const,
    };
    const result = createContenuSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should reject invalid statut value', () => {
    const input = {
      ...validInput,
      statut: 'brouillon',
    };
    const result = createContenuSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should accept texte as empty string (default)', () => {
    const input = {
      ...validInput,
      texte: '',
    };
    const result = createContenuSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.texte).toBe('');
    }
  });
});

describe('updateContenuSchema', () => {
  const validInput: UpdateContenuInput = {
    titre: 'Article modifié',
    texte: 'Nouveau contenu',
    rubrique_id: '123e4567-e89b-12d3-a456-426614174000',
    statut: 'non_publie',
  };

  it('should accept valid input (same structure as create)', () => {
    const result = updateContenuSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.titre).toBe('Article modifié');
      expect(result.data.statut).toBe('non_publie');
    }
  });

  it('should reject empty titre', () => {
    const input = {
      ...validInput,
      titre: '',
    };
    const result = updateContenuSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Le titre du contenu est requis.');
    }
  });

  it('should transform empty string image_url to null', () => {
    const input = {
      ...validInput,
      image_url: '',
    };
    const result = updateContenuSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.image_url).toBeNull();
    }
  });

  it('should reject invalid rubrique_id UUID', () => {
    const input = {
      ...validInput,
      rubrique_id: 'invalid',
    };
    const result = updateContenuSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe('Schema compatibility', () => {
  it('should have identical shape for create and update schemas', () => {
    const createKeys = Object.keys(createContenuSchema.shape);
    const updateKeys = Object.keys(updateContenuSchema.shape);
    expect(createKeys).toEqual(updateKeys);
    expect(createKeys).toContain('titre');
    expect(createKeys).toContain('rubrique_id');
    expect(createKeys).toContain('statut');
  });
});