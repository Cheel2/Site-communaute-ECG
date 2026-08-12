
import { describe, it, expect } from 'vitest';
import { loginSchema, resetPasswordSchema, newPasswordSchema } from '../schemas';

describe('Auth Schemas', () => {
  describe('loginSchema', () => {
    it('should_validate_valid_email_and_password', () => {
      const result = loginSchema.safeParse({
        email: 'test@test.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should_reject_empty_email', () => {
      const result = loginSchema.safeParse({
        email: '',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should_reject_email_without_at', () => {
      const result = loginSchema.safeParse({
        email: 'testtest.com',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should_reject_empty_password', () => {
      const result = loginSchema.safeParse({
        email: 'test@test.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });

    it('should_reject_missing_fields', () => {
      const result = loginSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('resetPasswordSchema', () => {
    it('should_validate_valid_email', () => {
      const result = resetPasswordSchema.safeParse({ email: 'test@test.com' });
      expect(result.success).toBe(true);
    });

    it('should_reject_invalid_email', () => {
      const result = resetPasswordSchema.safeParse({ email: 'invalid-email' });
      expect(result.success).toBe(false);
    });
  });

  describe('newPasswordSchema', () => {
    it('should_validate_matching_passwords', () => {
      const result = newPasswordSchema.safeParse({
        password: 'Pass123!',
        confirmPassword: 'Pass123!',
      });
      expect(result.success).toBe(true);
    });

    it('should_reject_mismatching_passwords', () => {
      const result = newPasswordSchema.safeParse({
        password: 'Pass123!',
        confirmPassword: 'Pass123',
      });
      expect(result.success).toBe(false);
    });

    it('should_reject_too_short_password', () => {
      const result = newPasswordSchema.safeParse({
        password: 'short',
        confirmPassword: 'short',
      });
      expect(result.success).toBe(false);
    });
  });
});
