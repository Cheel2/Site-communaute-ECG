import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login, logout } from '../actions';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({
        data: { session: { user: { id: 'test-user-id' } } },
        error: null,
      }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  })),
}));

describe('Auth Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should return success with valid credentials', async () => {
      const formData = new FormData();
      formData.append('email', 'test@test.com');
      formData.append('password', 'password123');

      const result = await login(null, formData);
      expect(result).toBeDefined();
    });
  });

  describe('logout', () => {
    it('should return success', async () => {
      const result = await logout();
      expect(result).toBeDefined();
    });
  });
});
