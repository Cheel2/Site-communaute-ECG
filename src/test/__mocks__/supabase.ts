import { vi } from 'vitest';

const createMockClient = () => ({
  auth: {
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    resetPasswordForEmail: vi.fn(),
    updateUser: vi.fn(),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({ single: vi.fn(), maybeSingle: vi.fn() })),
    insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn() })) })),
    update: vi.fn(() => ({ eq: vi.fn(() => ({ single: vi.fn() })) })),
    delete: vi.fn(() => ({ eq: vi.fn() })),
    rpc: vi.fn(),
  })),
});

export const mockCreateServerClient = vi.fn(createMockClient);
export const mockCreateBrowserClient = vi.fn(createMockClient);
export const mockCreateAnonClient = vi.fn(createMockClient);
