import { vi } from 'vitest';

const createQueryMock = () => ({
  select: vi.fn().mockResolvedValue({ data: [], error: null }),
  insert: vi.fn().mockResolvedValue({ data: [], error: null }),
  update: vi.fn().mockResolvedValue({ data: [], error: null }),
  delete: vi.fn().mockResolvedValue({ data: [], error: null }),
  rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  single: vi.fn().mockResolvedValue({ data: null, error: null }),
  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
});

const createClientMock = () => ({
  from: vi.fn().mockReturnValue(createQueryMock()),
});

export const mockCreateServerClient = vi.fn().mockReturnValue(createClientMock());
export const mockCreateBrowserClient = vi.fn().mockReturnValue(createClientMock());
export const mockCreateAnonClient = vi.fn().mockReturnValue(createClientMock());