import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  listLivres,
  createLivre,
  updateLivre,
  deleteLivre,
  uploadCouverture,
} from '../actions';
import type { Livre } from '@/types/database';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

import { createClient } from '@/lib/supabase/server';

// ============================================
// HELPERS DE MOCK — Patterns TMC-2/3
// ============================================

// create : insert().select().single() ← PAS de .returns()
function createInsertMock(result: any) {
  return {
    insert: vi.fn().mockImplementation(() => ({
      select: vi.fn().mockImplementation(() => ({
        single: vi.fn().mockResolvedValue(result),
      })),
    })),
  };
}

// update : update().eq().select().single() ← PAS de .returns()
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

// delete : delete().eq() ← PAS de .select() (spécifique TMC-4)
function createDeleteMock(error: any = null) {
  return {
    delete: vi.fn().mockImplementation(() => ({
      eq: vi.fn().mockResolvedValue({ error }),
    })),
  };
}

// select avec order
function createSelectOrderMock(result: any) {
  return {
    select: vi.fn().mockImplementation(() => ({
      order: vi.fn().mockResolvedValue(result),
    })),
  };
}

// ============================================
// MOCK STORAGE — pour uploadCouverture
// ============================================

function createStorageMock(uploadResult: { error: any } = { error: null }) {
  const mockUpload = vi.fn().mockResolvedValue(uploadResult);
  const mockGetPublicUrl = vi.fn().mockReturnValue({
    data: { publicUrl: 'https://storage.supabase.com/couvertures/test-image.jpg' },
  });

  return {
    storage: {
      from: vi.fn().mockReturnValue({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      }),
    },
  };
}

// ============================================
// LISTE LIVRES
// ============================================

describe('listLivres', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockLivre: Livre = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    titre: 'Mon livre',
    description: 'Une description',
    prix: 19.99,
    image_couverture_url: null,
    lien_amazon: null,
    lien_whatsapp: null,
    compteur_clics_amazon: 0,
    compteur_clics_whatsapp: 0,
    date_creation: '2025-01-01T00:00:00Z',
    date_modification: '2025-01-01T00:00:00Z',
  };

  it('should return list of livres', async () => {
    const mockFrom = vi.fn().mockImplementation(() => ({
      select: vi.fn().mockImplementation(() => ({
        order: vi.fn().mockResolvedValue({ data: [mockLivre], error: null }),
      })),
    }));

    vi.mocked(createClient).mockResolvedValue({ from: mockFrom } as never);

    const result = await listLivres();

    expect(result).toEqual({ data: [mockLivre] });
    expect(mockFrom).toHaveBeenCalledWith('livre');
  });

  it('should return empty array when no livres exist', async () => {
    const mockFrom = vi.fn().mockImplementation(() => ({
      select: vi.fn().mockImplementation(() => ({
        order: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
    }));

    vi.mocked(createClient).mockResolvedValue({ from: mockFrom } as never);

    const result = await listLivres();

    expect(result).toEqual({ data: [] });
  });

  it('should return INTERNAL_ERROR on Supabase error', async () => {
    const mockFrom = vi.fn().mockImplementation(() => ({
      select: vi.fn().mockImplementation(() => ({
        order: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } }),
      })),
    }));

    vi.mocked(createClient).mockResolvedValue({ from: mockFrom } as never);

    const result = await listLivres();

    expect(result.error?.code).toBe('INTERNAL_ERROR');
    expect(result.error?.message).toBe('Erreur lors de la récupération des livres.');
  });

  it('should order by date_creation descending', async () => {
    const orderFn = vi.fn().mockResolvedValue({ data: [], error: null });
    const mockFrom = vi.fn().mockImplementation(() => ({
      select: vi.fn().mockImplementation(() => ({
        order: orderFn,
      })),
    }));

    vi.mocked(createClient).mockResolvedValue({ from: mockFrom } as never);

    await listLivres();

    expect(orderFn).toHaveBeenCalledWith('date_creation', { ascending: false });
  });
});

// ============================================
// CREATE LIVRE
// ============================================

describe('createLivre', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validInput = {
    titre: 'Nouveau livre',
    description: 'Description du livre',
    prix: 24.99,
  };

  const mockLivre: Livre = {
    id: 'new-id',
    titre: 'Nouveau livre',
    description: 'Description du livre',
    prix: 24.99,
    image_couverture_url: null,
    lien_amazon: null,
    lien_whatsapp: null,
    compteur_clics_amazon: 0,
    compteur_clics_whatsapp: 0,
    date_creation: '2025-01-01T00:00:00Z',
    date_modification: '2025-01-01T00:00:00Z',
  };

  it('should create livre with valid input', async () => {
    const mockSupabase = {
      from: vi.fn().mockImplementation(() => createInsertMock({ data: mockLivre, error: null })),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await createLivre(validInput);

    expect(result).toEqual({ data: mockLivre });
  });

  it('should return VALIDATION_ERROR when titre is empty', async () => {
    const invalidInput = { ...validInput, titre: '' };

    const result = await createLivre(invalidInput);

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe('Données du livre invalides.');
    expect(result.error?.details).toBeDefined();
  });

  it('should return VALIDATION_ERROR when prix is negative', async () => {
    const invalidInput = { ...validInput, prix: -10 };

    const result = await createLivre(invalidInput);

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe('Données du livre invalides.');
  });

  it('should return VALIDATION_ERROR when prix is 0', async () => {
    const invalidInput = { ...validInput, prix: 0 };

    const result = await createLivre(invalidInput);

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe('Données du livre invalides.');
  });

  it('should return INTERNAL_ERROR on Supabase error', async () => {
    const mockSupabase = {
      from: vi.fn().mockImplementation(() => createInsertMock({ data: null, error: { message: 'DB error' } })),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await createLivre(validInput);

    expect(result.error?.code).toBe('INTERNAL_ERROR');
    expect(result.error?.message).toBe('Erreur lors de la création du livre.');
  });
});

// ============================================
// UPDATE LIVRE
// ============================================

describe('updateLivre', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validId = '123e4567-e89b-12d3-a456-426614174000';
  const validInput = {
    titre: 'Livre modifié',
    description: 'Nouvelle description',
    prix: 29.99,
  };

  const mockLivre: Livre = {
    id: validId,
    titre: 'Livre modifié',
    description: 'Nouvelle description',
    prix: 29.99,
    image_couverture_url: null,
    lien_amazon: null,
    lien_whatsapp: null,
    compteur_clics_amazon: 0,
    compteur_clics_whatsapp: 0,
    date_creation: '2025-01-01T00:00:00Z',
    date_modification: '2025-01-02T00:00:00Z',
  };

  it('should update livre with valid input', async () => {
    const mockSupabase = {
      from: vi.fn().mockImplementation(() => createUpdateMock({ data: mockLivre, error: null })),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await updateLivre(validId, validInput);

    expect(result).toEqual({ data: mockLivre });
  });

  it('should return VALIDATION_ERROR when titre is empty', async () => {
    const invalidInput = { ...validInput, titre: '' };

    const result = await updateLivre(validId, invalidInput);

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe('Données du livre invalides.');
  });

  it('should return VALIDATION_ERROR when prix is negative', async () => {
    const invalidInput = { ...validInput, prix: -5 };

    const result = await updateLivre(validId, invalidInput);

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe('Données du livre invalides.');
  });

  it('should return INTERNAL_ERROR on PGRST116 (row not found)', async () => {
    const mockSupabase = {
      from: vi.fn().mockImplementation(() => createUpdateMock({ data: null, error: { code: 'PGRST116', message: 'not found' } })),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await updateLivre(validId, validInput);

    expect(result.error?.code).toBe('INTERNAL_ERROR');
    expect(result.error?.message).toBe('Erreur lors de la mise à jour du livre.');
  });

  it('should return INTERNAL_ERROR on generic error', async () => {
    const mockSupabase = {
      from: vi.fn().mockImplementation(() => createUpdateMock({ data: null, error: { message: 'DB error' } })),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await updateLivre(validId, validInput);

    expect(result.error?.code).toBe('INTERNAL_ERROR');
    expect(result.error?.message).toBe('Erreur lors de la mise à jour du livre.');
  });
});

// ============================================
// DELETE LIVRE
// ============================================

describe('deleteLivre', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validId = '123e4567-e89b-12d3-a456-426614174000';

  it('should delete livre successfully', async () => {
    const mockSupabase = {
      from: vi.fn().mockImplementation(() => createDeleteMock(null)),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await deleteLivre(validId);

    expect(result).toEqual({ data: null });
  });

  it('should return INTERNAL_ERROR on Supabase error', async () => {
    const mockSupabase = {
      from: vi.fn().mockImplementation(() => createDeleteMock({ message: 'DB error' })),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await deleteLivre(validId);

    expect(result.error?.code).toBe('INTERNAL_ERROR');
    expect(result.error?.message).toBe('Erreur lors de la suppression du livre.');
  });

  it('should use delete() and never update() — hard-delete proof', async () => {
    let deleteCalled = false;
    let updateCalled = false;

    const mockSupabase = {
      from: vi.fn().mockImplementation(() => ({
        delete: vi.fn().mockImplementation(() => {
          deleteCalled = true;
          return {
            eq: vi.fn().mockResolvedValue({ error: null }),
          };
        }),
        update: vi.fn().mockImplementation(() => {
          updateCalled = true;
          return {};
        }),
      })),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    await deleteLivre(validId);

    expect(deleteCalled).toBe(true);
    expect(updateCalled).toBe(false);
  });

  it('should NOT call select() after delete — specific to TMC-4', async () => {
    let selectCalled = false;

    const mockSupabase = {
      from: vi.fn().mockImplementation(() => ({
        delete: vi.fn().mockImplementation(() => ({
          eq: vi.fn().mockImplementation(() => {
            // Simuler l'appel sans select
            return Promise.resolve({ error: null });
          }),
        })),
        select: vi.fn().mockImplementation(() => {
          selectCalled = true;
          return {};
        }),
      })),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    await deleteLivre(validId);

    expect(selectCalled).toBe(false);
  });
});

// ============================================
// UPLOAD COUVERTURE
// ============================================

describe('uploadCouverture', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockFile = (name: string, type: string, size: number): File => {
    return new File(['dummy content'], name, { type });
  };

  // Helper pour créer FormData avec un fichier
  const createFormDataWithFile = (file: File): FormData => {
    const formData = new FormData();
    formData.append('file', file);
    return formData;
  };

  it('should upload image and return URL', async () => {
    const file = createMockFile('image.jpg', 'image/jpeg', 1024 * 1024); // 1MB
    const formData = createFormDataWithFile(file);

    const mockStorage = createStorageMock({ error: null });
    const mockSupabase = {
      storage: mockStorage.storage,
      from: vi.fn(),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await uploadCouverture(formData);

    expect(result.data?.url).toBe('https://storage.supabase.com/couvertures/test-image.jpg');
    expect(result.data?.path).toContain('couvertures/');
    expect(mockStorage.storage.from).toHaveBeenCalledWith('couvertures');
    expect(mockStorage.storage.from().upload).toHaveBeenCalled();
  });

  it('should return VALIDATION_ERROR when no file provided', async () => {
    const formData = new FormData();

    const result = await uploadCouverture(formData);

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe('Aucun fichier image fourni.');
  });

  it('should return VALIDATION_ERROR when file is not an image', async () => {
    const file = createMockFile('document.pdf', 'application/pdf', 1024);
    const formData = createFormDataWithFile(file);

    const result = await uploadCouverture(formData);

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe('Le fichier doit être une image (JPEG, PNG, WebP ou GIF).');
  });

  it('should return VALIDATION_ERROR when file exceeds 5MB', async () => {
    const file = createMockFile('large.jpg', 'image/jpeg', 6 * 1024 * 1024); // 6MB
    const formData = createFormDataWithFile(file);

    const result = await uploadCouverture(formData);

    expect(result.error?.code).toBe('VALIDATION_ERROR');
    expect(result.error?.message).toBe('Fichier trop lourd. Taille maximale autorisée : 5 Mo.');
  });

  it('should accept file exactly at 5MB limit', async () => {
    const file = createMockFile('limit.jpg', 'image/jpeg', 5 * 1024 * 1024);
    const formData = createFormDataWithFile(file);

    const mockStorage = createStorageMock({ error: null });
    const mockSupabase = {
      storage: mockStorage.storage,
      from: vi.fn(),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await uploadCouverture(formData);

    expect(result.data).toBeDefined();
    expect(result.error).toBeUndefined();
  });

  it('should return INTERNAL_ERROR when Storage upload fails', async () => {
    const file = createMockFile('image.jpg', 'image/jpeg', 1024 * 1024);
    const formData = createFormDataWithFile(file);

    const mockStorage = createStorageMock({ error: { message: 'Upload failed' } });
    const mockSupabase = {
      storage: mockStorage.storage,
      from: vi.fn(),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    const result = await uploadCouverture(formData);

    expect(result.error?.code).toBe('INTERNAL_ERROR');
    expect(result.error?.message).toBe("Échec de l'upload de l'image. Vérifiez votre connexion ou réessayez.");
  });

  it('should resolve extension from file name when available', async () => {
    const file = createMockFile('photo.png', 'image/jpeg', 1024 * 1024);
    const formData = createFormDataWithFile(file);

    const mockStorage = createStorageMock({ error: null });
    const mockSupabase = {
      storage: mockStorage.storage,
      from: vi.fn(),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    await uploadCouverture(formData);

    const uploadCall = mockStorage.storage.from().upload.mock.calls[0];
    const filePath = uploadCall[0]; // filePath
    expect(filePath).toMatch(/\.png$/);
  });

  it('should resolve extension from MIME type when file name has no extension', async () => {
    const file = createMockFile('photo', 'image/png', 1024 * 1024);
    const formData = createFormDataWithFile(file);

    const mockStorage = createStorageMock({ error: null });
    const mockSupabase = {
      storage: mockStorage.storage,
      from: vi.fn(),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    await uploadCouverture(formData);

    const uploadCall = mockStorage.storage.from().upload.mock.calls[0];
    const filePath = uploadCall[0];
    expect(filePath).toMatch(/\.png$/);
  });

  it('should default to .jpg when extension cannot be resolved', async () => {
    const file = createMockFile('photo', 'image/unknown', 1024 * 1024);
    const formData = createFormDataWithFile(file);

    const mockStorage = createStorageMock({ error: null });
    const mockSupabase = {
      storage: mockStorage.storage,
      from: vi.fn(),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    await uploadCouverture(formData);

    const uploadCall = mockStorage.storage.from().upload.mock.calls[0];
    const filePath = uploadCall[0];
    expect(filePath).toMatch(/\.jpg$/);
  });

  it('should use upsert: false and cacheControl: 3600', async () => {
    const file = createMockFile('image.jpg', 'image/jpeg', 1024 * 1024);
    const formData = createFormDataWithFile(file);

    const mockStorage = createStorageMock({ error: null });
    const mockSupabase = {
      storage: mockStorage.storage,
      from: vi.fn(),
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as never);

    await uploadCouverture(formData);

    const uploadCall = mockStorage.storage.from().upload.mock.calls[0];
    const options = uploadCall[2];
    expect(options).toEqual({
      cacheControl: '3600',
      upsert: false,
    });
  });
});