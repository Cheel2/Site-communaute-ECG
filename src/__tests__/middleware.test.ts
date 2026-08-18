import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { middleware } from '@/middleware';

// Mock du module @supabase/ssr — utilisé par le middleware
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}));

// Mock des variables d'environnement (valeurs par défaut)
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-project.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

describe('Middleware Admin — Protection routes /admin/*', () => {
  let mockGetUser: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Réinitialiser les mocks pour chaque test
    const { createServerClient } = await import('@supabase/ssr');
    mockGetUser = vi.fn();
    (createServerClient as ReturnType<typeof vi.fn>).mockReturnValue({
      auth: { getUser: mockGetUser },
    });
  });

  afterEach(() => {
    vi.resetModules();
  });

  describe('Cas nominaux — Routes admin', () => {
    it('should_redirect_to_login_when_no_session_on_admin_route', async () => {
      // Arrange : pas de session
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const request = new NextRequest('http://localhost:3000/admin/tableau-de-bord');

      // Act
      const response = await middleware(request);

      // Assert
      expect(response.status).toBe(307); // NextResponse.redirect
      expect(response.headers.get('location')).toContain('/admin/login');
      expect(mockGetUser).toHaveBeenCalled();
    });

    it.skip('should_redirect_to_login_with_redirectedFrom_param', async () => {
      // Arrange : pas de session, URL avec query params
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const request = new NextRequest('http://localhost:3000/admin/tableau-de-bord?tab=stats');

      // Act
      const response = await middleware(request);

      // Assert
      const location = response.headers.get('location');
      expect(location).toContain('/admin/login');
      expect(location).toContain('redirectedFrom=%2Fadmin%2Ftableau-de-bord%3Ftab%3Dstats');
    });

    it('should_allow_admin_route_with_valid_session', async () => {
      // Arrange : session valide
      mockGetUser.mockResolvedValue({
        data: { user: { id: '123', email: 'admin@test.com' } },
      });

      const request = new NextRequest('http://localhost:3000/admin/tableau-de-bord');

      // Act
      const response = await middleware(request);

      // Assert
      expect(response.status).toBe(200); // NextResponse.next()
      expect(response.headers.get('location')).toBeNull();
      expect(mockGetUser).toHaveBeenCalled();
    });

    it('should_not_redirect_on_admin_login_route', async () => {
      // Arrange : pas de session (mais sur /admin/login)
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const request = new NextRequest('http://localhost:3000/admin/login');

      // Act
      const response = await middleware(request);

      // Assert
      expect(response.status).toBe(200); // Pas de redirection
      expect(response.headers.get('location')).toBeNull();
      // Le middleware ne doit PAS rediriger en boucle
    });
  });

  describe('Matcher configuration', () => {
    it('should_only_match_admin_routes_via_config_matcher', async () => {
      // Vérification statique du matcher
      const { config } = await import('@/middleware');
      expect(config.matcher).toEqual(['/admin/:path*']);
      // Ce matcher exclut automatiquement "/" et les autres routes publiques
    });
  });

  describe('Cas limites — Variables d environnement', () => {
    it('should_use_next_response_next_when_env_missing', async () => {
      // Arrange : variables d'env manquantes
      const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      process.env.NEXT_PUBLIC_SUPABASE_URL = '';
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = '';

      const request = new NextRequest('http://localhost:3000/admin/tableau-de-bord');

      // Act
      const response = await middleware(request);

      // Assert
      expect(response.status).toBe(200);
      expect(response.headers.get('location')).toBeNull();

      // Restore
      process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl;
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey;
    });
  });
});
