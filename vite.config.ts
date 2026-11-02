import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative base: works at the domain root, under a GitHub Pages
  // project path (/vintage-cars/) or on a future custom domain.
  base: './',
  plugins: [react()],
  build: {
    // The parking chunk is three.js (about 140 kB gzipped), loaded on demand
    // after the first paint. The initial bundle stays well under this limit.
    chunkSizeWarningLimit: 600,
  },
});
