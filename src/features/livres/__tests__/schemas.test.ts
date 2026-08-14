import { describe, it, expect } from 'vitest';
import {
  createLivreSchema,
  updateLivreSchema,
  type CreateLivreInput,
  type UpdateLivreInput,
} from '../schemas';

describe('createLivreSchema', () => {
  const validInput: CreateLivreInput = {
    titre: 'Mon livre',
    description: 'Une description',
    prix: 19.99,
  };

  it('should accept valid input with all required fields', () => {
    const result = createLivreSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.titre).toBe('Mon livre');
      expect(result.data.description).toBe('Une description');
      expect(result.data.prix).toBe(19.99);
      expect(result.data.image_couverture_url).toBeUndefined();
      expect(result.data.lien_amazon).toBeUndefined();
      expect(result.data.lien_whatsapp).toBeUndefined();
    }
  });

  it('should accept input with only titre and prix (description optional)', () => {
    const input = {
      titre: 'Livre minimal',
      prix: 9.99,
    };
    const result = createLivreSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBe('');
    }
  });

  it('should accept prix as integer', () => {
    const input = {
      titre: 'Livre entier',
      prix: 15,
    };
    const result = createLivreSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.prix).toBe(15);
    }
  });

  it('should accept prix as decimal', () => {
    const input = {
      titre: 'Livre décimal',
      prix: 19.99,
    };
    const result = createLivreSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.prix).toBe(19.99);
    }
  });

  it('should accept prix as 0.01 (minimum positive)', () => {
    const input = {
      titre: 'Livre pas cher',
      prix: 0.01,
    };
    const result = createLivreSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.prix).toBe(0.01);
    }
  });

  it('should reject empty titre', () => {
    const input = {
      titre: '',
      prix: 19.99,
    };
    const result = createLivreSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Le titre est requis.');
    }
  });

  it('should reject missing titre', () => {
    const input = {
      prix: 19.99,
    };
    const result = createLivreSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should reject negative prix', () => {
    const input = {
      titre: 'Livre négatif',
      prix: -5.00,
    };
    const result = createLivreSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Le prix doit être un nombre positif.');
    }
  });

  it('should reject prix equal to 0', () => {
    const input = {
      titre: 'Livre gratuit',
      prix: 0,
    };
    const result = createLivreSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Le prix doit être un nombre positif.');
    }
  });

  it('should reject missing prix', () => {
    const input = {
      titre: 'Livre sans prix',
    };
    const result = createLivreSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should accept image_couverture_url as optional nullable string', () => {
    const input = {
      ...validInput,
      image_couverture_url: null,
    };
    const result = createLivreSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.image_couverture_url).toBeNull();
    }
  });

  it('should accept valid lien_amazon URL', () => {
    const input = {
      ...validInput,
      lien_amazon: 'https://www.amazon.fr/dp/1234567890',
    };
    const result = createLivreSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.lien_amazon).toBe('https://www.amazon.fr/dp/1234567890');
    }
  });

  it('should accept empty string for lien_amazon', () => {
    const input = {
      ...validInput,
      lien_amazon: '',
    };
    const result = createLivreSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.lien_amazon).toBe('');
    }
  });

  it('should reject invalid lien_amazon URL', () => {
    const input = {
      ...validInput,
      lien_amazon: 'not-a-url',
    };
    const result = createLivreSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("L'URL fournie est invalide.");
    }
  });

  it('should accept valid lien_whatsapp URL', () => {
    const input = {
      ...validInput,
      lien_whatsapp: 'https://wa.me/33612345678',
    };
    const result = createLivreSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.lien_whatsapp).toBe('https://wa.me/33612345678');
    }
  });

  it('should accept empty string for lien_whatsapp', () => {
    const input = {
      ...validInput,
      lien_whatsapp: '',
    };
    const result = createLivreSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.lien_whatsapp).toBe('');
    }
  });

  it('should reject invalid lien_whatsapp URL', () => {
    const input = {
      ...validInput,
      lien_whatsapp: 'not-a-url',
    };
    const result = createLivreSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("L'URL fournie est invalide.");
    }
  });

  it('should accept all optional fields together', () => {
    const input = {
      titre: 'Livre complet',
      description: 'Description',
      prix: 29.99,
      image_couverture_url: 'https://example.com/image.jpg',
      lien_amazon: 'https://www.amazon.fr/dp/1234567890',
      lien_whatsapp: 'https://wa.me/33612345678',
    };
    const result = createLivreSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.image_couverture_url).toBe('https://example.com/image.jpg');
      expect(result.data.lien_amazon).toBe('https://www.amazon.fr/dp/1234567890');
      expect(result.data.lien_whatsapp).toBe('https://wa.me/33612345678');
    }
  });
});

describe('updateLivreSchema', () => {
  const validInput: UpdateLivreInput = {
    titre: 'Livre modifié',
    description: 'Nouvelle description',
    prix: 24.99,
  };

  it('should accept valid input (same structure as create)', () => {
    const result = updateLivreSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.titre).toBe('Livre modifié');
      expect(result.data.prix).toBe(24.99);
    }
  });

  it('should reject empty titre', () => {
    const input = {
      ...validInput,
      titre: '',
    };
    const result = updateLivreSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Le titre est requis.');
    }
  });

  it('should reject negative prix', () => {
    const input = {
      ...validInput,
      prix: -10,
    };
    const result = updateLivreSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Le prix doit être un nombre positif.');
    }
  });

  it('should accept valid URL for lien_amazon', () => {
    const input = {
      ...validInput,
      lien_amazon: 'https://www.amazon.fr/dp/9876543210',
    };
    const result = updateLivreSchema.safeParse(input);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.lien_amazon).toBe('https://www.amazon.fr/dp/9876543210');
    }
  });

  it('should reject invalid URL for lien_whatsapp', () => {
    const input = {
      ...validInput,
      lien_whatsapp: 'invalid',
    };
    const result = updateLivreSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("L'URL fournie est invalide.");
    }
  });
});

describe('Schema compatibility', () => {
  it('should have identical shape for create and update schemas', () => {
    const createKeys = Object.keys(createLivreSchema.shape);
    const updateKeys = Object.keys(updateLivreSchema.shape);
    expect(createKeys).toEqual(updateKeys);
    expect(createKeys).toContain('titre');
    expect(createKeys).toContain('prix');
  });
});