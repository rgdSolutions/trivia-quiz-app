/// <reference types="vitest/config" />
import path, { dirname } from 'path';
import { defineConfig } from 'vite'
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/client/vitest.setup.ts',
    include: ['./src/client/**/*.test.ts', './src/client/**/*.test.tsx'],
  },
});
