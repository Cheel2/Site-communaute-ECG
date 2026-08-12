import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockCreateServerClient } from '../../../test/mocks/supabase';
import { login, logout, resetPassword, newPassword } from '../actions';

vi.mock('@/lib/supabase/server', () => ({
  createServerClient: mockCreateServerClient,
}));

const mockSignInWithPassword = vi.fn();
const mockSignOut = vi.fn();
const mockResetPasswordForEmail = vi.fn();
const mockUpdateUser = vi.fn();

describe('Auth Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateServerClient.mockReturnValue({
      auth: {
        signInWithPassword: mockSignInWithPassword,
        signOut: mockSignOut,
        resetPasswordForEmail: mockResetPasswordForEmail,
        updateUser: mockUpdateUser,
      },
    } as any);
  });

  describe('login', () => {
    it('should_return_session_when_credentials_are_valid', async () => {
      const mockSession = { user: { id: '123' }, access_token: 'token' };
      mockSignInWithPassword.mockResolvedValue({ data: { session: mockSession }, error: null });

      const result = await login({ email: 'test@test.com', password: 'password123' });

      expect(result.data).toEqual(mockSession);
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password123',
      });
    });

    it('should_return_INVALID_CREDENTIALS_when_credentials_are_invalid', async () => {
      mockSignInWithPassword.mockResolvedValue({
        data: { session: null },
        error: { message: 'Invalid login credentials', status: 400, name: 'AuthApiError' },
      });

      const result = await login({ email: 'test@test.com', password: 'wrong' });

      expect(result.error?.code).toBe('INVALID_CREDENTIALS');
    });

    it('should_return_INTERNAL_ERROR_on_network_error', async () => {
      mockSignInWithPassword.mockRejectedValue(new Error('Network Error'));

      const result = await login({ email: 'test@test.com', password: 'password123' });

      expect(result.error?.code).toBe('INTERNAL_ERROR');
    });
  });

  describe('logout', () => {
    it('should_call_signOut', async () => {
      mockSignOut.mockResolvedValue({ error: null });

      await logout();

      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should_call_resetPasswordForEmail_with_valid_email', async () => {
      mockResetPasswordForEmail.mockResolvedValue({ data: {}, error: null });

      await resetPassword({ email: 'test@test.com' });

      expect(mockResetPasswordForEmail).toHaveBeenCalledWith('test@test.com', expect.any(Object));
    });
  });

  describe('newPassword', () => {
    it('should_call_updateUser_with_valid_password', async () => {
      mockUpdateUser.mockResolvedValue({ data: { user: {} }, error: null });

      await newPassword({ password: 'Pass123!', confirmPassword: 'Pass123!' });

      expect(mockUpdateUser).toHaveBeenCalledWith({ password: 'Pass123!' });
    });
  });
});