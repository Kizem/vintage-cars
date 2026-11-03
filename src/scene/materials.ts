/* Bibliothèque de matériaux commune : la même peinture vernie, les mêmes chromes, verres, caoutchoucs et feux
   pour les trois voitures ; seules les teintes viennent de la fiche de chaque modèle (carspecs.ts). */
import { DoubleSide, MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial, Vector3, type Texture } from 'three';
import type { CarSpec } from './carspecs';
import { canvasTex } from './geometry';

export type CarMaterials = ReturnType<typeof createMaterials>;

function hubTexture(style: CarSpec['hub'], tint: string) {
  return canvasTex(256, 256, (g, w) => {
    const c = w / 2;
    g.fillStyle = tint; g.beginPath(); g.arc(c, c, c, 0, 7); g.fill();
    if (style === 'mercedes') {
      /* enjoliveur ivoire cerclé de chrome, étoile à trois branches au centre */
      g.fillStyle = '#d9dcdc'; g.beginPath(); g.arc(c, c, c, 0, 7); g.fill();
      g.fillStyle = tint; g.beginPath(); g.arc(c, c, c * .8, 0, 7); g.fill();
      g.strokeStyle = 'rgba(40,40,40,.45)'; g.lineWidth = 3; g.beginPath(); g.arc(c, c, c * .8, 0, 7); g.stroke();
      g.strokeStyle = 'rgba(60,60,60,.85)'; g.lineWidth = 4; g.beginPath(); g.arc(c, c, c * .3, 0, 7); g.stroke();
      g.fillStyle = 'rgba(60,60,60,.9)'; for (let i = 0; i < 3; i++) { const a = i / 3 * 6.283 - 1.571; g.beginPath(); g.moveTo(c + Math.cos(a) * c * .29, c + Math.sin(a) * c * .29); g.lineTo(c + Math.cos(a + 1.5) * c * .045, c + Math.sin(a + 1.5) * c * .045); g.lineTo(c + Math.cos(a - 1.5) * c * .045, c + Math.sin(a - 1.5) * c * .045); g.fill(); }
    } else if (style === 'peugeot') {
      g.fillStyle = '#1c1c1b'; for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; g.beginPath(); g.ellipse(c + Math.cos(a) * c * .74, c + Math.sin(a) * c * .74, c * .11, c * .055, a, 0, 7); g.fill(); }
      g.strokeStyle = 'rgba(30,30,30,.5)'; g.lineWidth = 3; g.beginPath(); g.arc(c, c, c * .42, 0, 7); g.stroke();
    } else {
      /* DS : jante en tôle peinte, un seul gros enjoliveur central (modélisé à part) */
      g.strokeStyle = 'rgba(25,25,25,.55)'; g.lineWidth = 5; g.beginPath(); g.arc(c, c, c * .8, 0, 7); g.stroke();
      g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 3; g.beginPath(); g.arc(c, c, c * .72, 0, 7); g.stroke();
    }
  });
}

/**
 * `be` : ligne de ceinture, pour dessiner les joints de portes dans la peinture.
 * La peinture découpe les passages de roues (shader), le reste est standard.
 */
export function createMaterials(s: CarSpec, env: Texture, be: (x: number) => number) {
  /* Lignes de carrosserie dessinées comme sur un plan */
  const seamTex = canvasTex(2048, 512, (g, w, h) => {
    g.fillStyle = '#fff'; g.fillRect(0, 0, w, h);
    const X = (x: number) => (x / 6 + .5) * w; const Y = (y: number) => h - (y / 1.6) * h;
    g.strokeStyle = 'rgba(10,12,12,.72)'; g.lineWidth = 2.6;
    s.seams.forEach((x) => { g.beginPath(); g.moveTo(X(x), Y(.33)); g.lineTo(X(x + .02), Y(be(x) - .015)); g.stroke(); });
    g.fillStyle = 'rgba(10,12,12,.85)';
    [s.seams[0] + .78, s.seams[1] + .72].forEach((x) => { g.fillRect(X(x), Y(be(x) - .1), 26, 4); });
    if (s.flap) { const [fx, fy, fr] = s.flap; g.beginPath(); g.ellipse(X(fx), Y(fy), fr / 6 * w, fr / 1.6 * h, 0, 0, 7); g.stroke(); }
    /* bas de caisse */
    g.fillStyle = 'rgba(6,8,8,.88)'; g.fillRect(0, Y(.325), w, h);
  });
  const paint = new MeshPhysicalMaterial({ ...s.paint, map: seamTex, clearcoat: 1, clearcoatRoughness: .07, envMap: env, envMapIntensity: .95, side: DoubleSide });
  const archU = { value: s.axles.map((x, i) => new Vector3(x, s.wheelR, s.arch[i][0])) };
  const archC = { value: s.arch.map((a) => a[1]) };
  paint.onBeforeCompile = (sh) => {
    sh.uniforms.uArch = archU; sh.uniforms.uClip = archC;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vL;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvL = position;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vL; uniform vec3 uArch[2]; uniform float uClip[2];')
      .replace('#include <map_fragment>', `
        if (abs(vL.z) > .25) { for (int i = 0; i < 2; i++) { if (length(vL.xy - uArch[i].xy) < uArch[i].z && vL.y < uClip[i]) discard; } }
        #include <map_fragment>`);
  };
  const roof = s.roof ? new MeshPhysicalMaterial({ ...s.roof, clearcoat: .6, clearcoatRoughness: .2, envMap: env, envMapIntensity: .9, side: DoubleSide }) : new MeshPhysicalMaterial({ ...s.paint, clearcoat: 1, clearcoatRoughness: .07, envMap: env, envMapIntensity: 1.15, side: DoubleSide });
  const chrome = new MeshStandardMaterial({ color: 0xf2f3f4, metalness: 1, roughness: .18, envMap: env, envMapIntensity: 1.5 });
  return {
    paint, roof, chrome,
    /** montants inox, ou couleur caisse */
    pillar: s.roof || s.pillarChrome ? new MeshStandardMaterial({ color: 0xcfd2d2, metalness: .95, roughness: .2, envMap: env }) : roof,
    dark: new MeshStandardMaterial({ color: 0x0b0d0c, roughness: .7, envMap: env, envMapIntensity: .3 }),
    black: new MeshBasicMaterial({ color: 0x050605 }),
    rubber: new MeshStandardMaterial({ color: 0x111111, roughness: .55, envMap: env, envMapIntensity: .35 }),
    gold: new MeshStandardMaterial({ color: 0xc8a24c, metalness: 1, roughness: .26, envMap: env, envMapIntensity: 1.3 }),
    crease: new MeshBasicMaterial({ color: 0x2b2e2e }),
    /** Feux avant : partagé, pour pouvoir les allumer au survol */
    lens: new MeshStandardMaterial({ color: s.lensColor || 0xf0e8d0, emissive: 0xf2b632, emissiveIntensity: 0, metalness: .85, roughness: .12, envMap: env, envMapIntensity: 1.5 }),
    /** verre d'optique, transparent */
    lampGlass: new MeshPhysicalMaterial({ color: 0xffffff, roughness: .03, transparent: true, opacity: .28, clearcoat: 1, envMap: env, envMapIntensity: 1.6, depthWrite: false }),
    amber: new MeshStandardMaterial({ color: 0xc97d1c, roughness: .22, metalness: .3, envMap: env, emissive: 0x7a3d05, emissiveIntensity: .15 }),
    red: new MeshStandardMaterial({ color: 0x8c1414, roughness: .25, emissive: 0x500707, emissiveIntensity: .5 }),
    /** vitrage : teinté et transparent quand l'habitacle est modélisé, sinon sombre et réfléchissant */
    glass: s.cabin
      ? new MeshPhysicalMaterial({ side: DoubleSide, color: s.cabin.glass, roughness: .04, clearcoat: 1, clearcoatRoughness: .03, transparent: true, opacity: s.cabin.opacity, depthWrite: false, envMap: env, envMapIntensity: 1.1 })
      : new MeshPhysicalMaterial({ side: DoubleSide, color: 0x0d1513, metalness: .2, roughness: .08, clearcoat: 1, clearcoatRoughness: .05, envMap: env, envMapIntensity: .8 }),
    tire: new MeshStandardMaterial({ color: 0x0c0c0c, roughness: .82 }),
    /** enjoliveur dessiné : métal poli, sauf l'enjoliveur ivoire de la Mercedes, peint comme la caisse */
    hub: s.hub === 'mercedes'
      ? new MeshStandardMaterial({ map: hubTexture(s.hub, s.hubTint), metalness: .25, roughness: .28, envMap: env, envMapIntensity: 1.1 })
      : new MeshStandardMaterial({ map: hubTexture(s.hub, s.hubTint), metalness: .85, roughness: .32, envMap: env, envMapIntensity: 1.1 }),
    env,
  };
}
