import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../../src/shared'),
    },
  },
  plugins: [react({ babel: { plugins: ['babel-plugin-react-compiler'] } })],
  root: './src/client',
  build: {
    outDir: '../../dist/client',
    manifest: true, // generate manifest.json in outDir
    rollupOptions: {
      input: './src/client/client.tsx',
    },
  },
});
