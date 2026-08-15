import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock de @/lib/supabase/server
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

// Mock des schemas pour éviter les erreurs d'import
vi.mock('@/features/livres/schemas', () => ({}));
vi.mock('@/types/api', () => ({}));
vi.mock('@/types/database', () => ({}));

describe('Image Upload Storage — D10 + D8', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe('uploadCouverture (livres)', () => {
    const BUCKET_NAME = 'couvertures';

    // Helper pour créer un fichier de taille exacte
    function createMockFile(content: ArrayBuffer, name: string, type: string): File {
      return new File([content], name, { type });
    }

    function createStorageMock(uploadResult: { error: any } = { error: null }) {
      const mockUpload = vi.fn().mockResolvedValue(uploadResult);
      const mockGetPublicUrl = vi.fn().mockReturnValue({
        data: { publicUrl: 'https://storage.supabase.co/couvertures/test-image.jpg' },
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

    it('should_upload_to_correct_bucket_when_valid_image', async () => {
      // Arrange
      const mockSupabase = createStorageMock();
      const { createClient } = await import('@/lib/supabase/server');
      (createClient as any).mockResolvedValue(mockSupabase);

      const { uploadCouverture } = await import('@/features/livres/actions');

      const content = new ArrayBuffer(1024 * 1024); // 1 Mo
      const file = createMockFile(content, 'test-image.jpg', 'image/jpeg');

      const formData = new FormData();
      formData.append('file', file);

      // Act
      const result = await uploadCouverture(formData);

      // Assert
      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(result.data?.path).toContain('couvertures/');
      expect(result.data?.path).toMatch(/\.jpg$/);
      expect(result.data?.url).toBe('https://storage.supabase.co/couvertures/test-image.jpg');

      // Vérifie que le bon bucket est utilisé
      const storageFrom = mockSupabase.storage.from;
      expect(storageFrom).toHaveBeenCalledWith(BUCKET_NAME);

      // Vérifie que upload a été appelé avec les bons paramètres
      const uploadMock = storageFrom().upload;
      expect(uploadMock).toHaveBeenCalled();
      const uploadCall = uploadMock.mock.calls[0];
      expect(uploadCall[0]).toMatch(/couvertures\/[a-f0-9-]+\.jpg$/);
      expect(uploadCall[1]).toBe(file);
      expect(uploadCall[2]).toEqual({
        cacheControl: '3600',
        upsert: false,
      });

      // Vérifie que getPublicUrl a été appelé
      const getPublicUrlMock = storageFrom().getPublicUrl;
      expect(getPublicUrlMock).toHaveBeenCalled();
    });

    it('should_return_public_url_on_success', async () => {
      const mockSupabase = createStorageMock();
      const { createClient } = await import('@/lib/supabase/server');
      (createClient as any).mockResolvedValue(mockSupabase);

      const { uploadCouverture } = await import('@/features/livres/actions');

      const content = new ArrayBuffer(1024 * 1024);
      const file = createMockFile(content, 'test.png', 'image/png');

      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadCouverture(formData);

      expect(result.data?.url).toBe('https://storage.supabase.co/couvertures/test-image.jpg');
      expect(result.data?.path).toBeDefined();
    });

    it('should_reject_file_over_5MB', async () => {
      const mockSupabase = createStorageMock();
      const { createClient } = await import('@/lib/supabase/server');
      (createClient as any).mockResolvedValue(mockSupabase);

      const { uploadCouverture } = await import('@/features/livres/actions');

      // 6 Mo
      const content = new ArrayBuffer(6 * 1024 * 1024);
      const file = createMockFile(content, 'large.jpg', 'image/jpeg');

      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadCouverture(formData);

      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe('VALIDATION_ERROR');
      expect(result.error?.message).toContain('5 Mo');
    });

    it('should_reject_non_image_file', async () => {
      const mockSupabase = createStorageMock();
      const { createClient } = await import('@/lib/supabase/server');
      (createClient as any).mockResolvedValue(mockSupabase);

      const { uploadCouverture } = await import('@/features/livres/actions');

      const content = new ArrayBuffer(1024);
      const file = createMockFile(content, 'document.txt', 'text/plain');

      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadCouverture(formData);

      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe('VALIDATION_ERROR');
      expect(result.error?.message).toContain('image');
    });

    it('should_reject_empty_file', async () => {
      const mockSupabase = createStorageMock();
      const { createClient } = await import('@/lib/supabase/server');
      (createClient as any).mockResolvedValue(mockSupabase);

      const { uploadCouverture } = await import('@/features/livres/actions');

      const formData = new FormData();
      // Pas de fichier ajouté

      const result = await uploadCouverture(formData);

      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe('VALIDATION_ERROR');
      expect(result.error?.message).toContain('fichier image');
    });

    it('should_handle_upload_error_gracefully', async () => {
      const mockSupabase = createStorageMock({
        error: { message: 'Bucket not found' },
      });
      const { createClient } = await import('@/lib/supabase/server');
      (createClient as any).mockResolvedValue(mockSupabase);

      const { uploadCouverture } = await import('@/features/livres/actions');

      const content = new ArrayBuffer(1024 * 1024);
      const file = createMockFile(content, 'test.jpg', 'image/jpeg');

      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadCouverture(formData);

      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe('INTERNAL_ERROR');
      expect(result.error?.message).toContain('Échec de l\'upload');
    });

    it('should_detect_extension_from_filename', async () => {
      const mockSupabase = createStorageMock();
      const { createClient } = await import('@/lib/supabase/server');
      (createClient as any).mockResolvedValue(mockSupabase);

      const { uploadCouverture } = await import('@/features/livres/actions');

      const content = new ArrayBuffer(1024);
      const file = createMockFile(content, 'photo.HEIC', 'image/heic');

      const formData = new FormData();
      formData.append('file', file);

      await uploadCouverture(formData);

      const storageFrom = mockSupabase.storage.from;
      const uploadMock = storageFrom().upload;
      const uploadCall = uploadMock.mock.calls[0];
      expect(uploadCall[0]).toMatch(/\.heic$/); // Extension du nom
    });

    it('should_fallback_to_jpg_when_no_extension_and_mime_unknown', async () => {
      const mockSupabase = createStorageMock();
      const { createClient } = await import('@/lib/supabase/server');
      (createClient as any).mockResolvedValue(mockSupabase);

      const { uploadCouverture } = await import('@/features/livres/actions');

      const content = new ArrayBuffer(1024);
      const file = createMockFile(content, 'photo', 'image/unknown');

      const formData = new FormData();
      formData.append('file', file);

      await uploadCouverture(formData);

      const storageFrom = mockSupabase.storage.from;
      const uploadMock = storageFrom().upload;
      const uploadCall = uploadMock.mock.calls[0];
      expect(uploadCall[0]).toMatch(/\.jpg$/);
    });
  });

  describe('upload contenu — EXPORT MANQUANT', () => {
    it('should_NOT_have_upload_function_for_contenus', async () => {
      // Les actions contenus n'ont PAS de fonction d'upload d'image séparée.
      // L'image_url est gérée via createContenu/updateContenu (URL externe ou base64).
      // Ceci est documenté comme un écart de conception.
      const { createContenu, updateContenu } = await import('@/features/contenus/actions');
      expect(createContenu).toBeDefined();
      expect(updateContenu).toBeDefined();

      // Vérification qu'il n'y a PAS de fonction uploadContenuImage
      const actions = await import('@/features/contenus/actions');
      expect((actions as any).uploadContenuImage).toBeUndefined();
      expect((actions as any).uploadImage).toBeUndefined();

      // Écart documenté : les images de contenu sont gérées par URL
      // (pas par upload direct vers Storage)
    });
  });
});
