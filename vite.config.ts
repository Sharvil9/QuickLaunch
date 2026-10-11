import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: 'index.html',
        timer: 'timer.html'
      },
      output: {
        manualChunks: undefined
      }
    },
    // Copy icons to dist folder during build
    assetsDir: 'assets',
    copyPublicDir: true
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  publicDir: 'public'
});
