import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    assetsDir: 'assets',
    outDir: 'dist',
  },
  server: {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
    },
  },
});
