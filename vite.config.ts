/// <reference types="vitest/config" />
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Politique de sécurité du contenu, ajoutée au build seulement (le serveur de développement a besoin de scripts
 * en ligne). Le site ne charge que ses propres fichiers et ne joint que lui-même et le point d'envoi du
 * formulaire (VITE_ENQUIRY_ENDPOINT). GitHub Pages ne permet pas d'en-têtes : la politique est posée en <meta>.
 */
export function contentSecurityPolicy(endpoint?: string): string {
  let connect = "'self'";
  try {
    if (endpoint) connect += ` ${new URL(endpoint).origin}`;
  } catch {
    /* adresse invalide : le formulaire la refusera aussi */
  }
  return [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src ${connect}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
    'upgrade-insecure-requests',
  ].join('; ');
}

function securityMeta(endpoint?: string): Plugin {
  return {
    name: 'epoque-security-meta',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '<meta charset="UTF-8" />',
        `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy(endpoint)}" />\n    <meta name="referrer" content="strict-origin-when-cross-origin" />`,
      );
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    // Relative base: works at the domain root, under a GitHub Pages
    // project path (/vintage-cars/) or on a future custom domain.
    base: './',
    plugins: [react(), securityMeta(env.VITE_ENQUIRY_ENDPOINT)],
    build: {
      // The parking chunk is three.js (about 140 kB gzipped), loaded on demand
      // after the first paint. The initial bundle stays well under this limit.
      chunkSizeWarningLimit: 600,
    },
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['src/**/*.test.{ts,tsx}'],
      testTimeout: 20000,
      setupFiles: ['src/test/setup.ts'],
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/main.tsx', 'src/vite-env.d.ts'],
        reporter: ['text-summary', 'text'],
        /* la suite échoue si la couverture baisse */
        thresholds: { lines: 95, statements: 95, functions: 92, branches: 80 },
      },
    },
  };
});
