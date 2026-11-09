import { describe, expect, it } from 'vitest';
import { contentSecurityPolicy } from '../../vite.config';

describe('politique de sécurité du contenu', () => {
  it('ne permet que le site lui-même, plus l’origine du point d’envoi', () => {
    const p = contentSecurityPolicy();
    expect(p).toContain("default-src 'self'");
    expect(p).toContain("script-src 'self'");
    expect(p).toContain("object-src 'none'");
    expect(p).toContain("connect-src 'self';");
    expect(contentSecurityPolicy('https://forms.example/path?q=1')).toContain("connect-src 'self' https://forms.example;");
    expect(contentSecurityPolicy('pas une url')).toContain("connect-src 'self';");
  });
});
