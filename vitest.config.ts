import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['node_modules', '.next', 'e2e', 'playwright-report'],
    coverage: {
      provider: 'v8',
      include: [
        'src/features/**/actions.ts',
        'src/features/**/schemas.ts',
        'src/lib/**/*.ts',
      ],
      exclude: [
        'src/lib/supabase/*.ts',
        'src/types/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});