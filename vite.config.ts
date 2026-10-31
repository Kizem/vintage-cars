import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Relative base: works at the domain root, under a GitHub Pages
  // project path (/vintage-cars/) or on a future custom domain.
  base: './',
  plugins: [react(), tailwindcss()],
});
