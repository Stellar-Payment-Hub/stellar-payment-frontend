import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-stellar': ['@stellar/stellar-sdk', '@stellar/freighter-api'],
          'vendor-ui': ['lucide-react', 'canvas-confetti'],
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
  // @ts-expect-error vitest configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
});
