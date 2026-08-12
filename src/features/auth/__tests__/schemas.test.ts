import { describe, it, expect } from 'vitest';
import { loginSchema } from '../schemas';

describe('Auth Schemas', () => {
  describe('loginSchema', () => {
    it('should validate valid email and password', () => {
      const result = loginSchema.safeParse({
        email: 'test@test.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject empty email', () => {
      const result = loginSchema.safeParse({
        email: '',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject email without @', () => {
      const result = loginSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject empty password', () => {
      const result = loginSchema.safeParse({
        email: 'test@test.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing fields', () => {
      const result = loginSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it('should reject password too short', () => {
      const result = loginSchema.safeParse({
        email: 'test@test.com',
        password: 'short',
      });
      expect(result.success).toBe(false);
    });
  });
});
