// Shared, theme-aware materials.
//
// Every mesh that uses one of these shares a single GPU program, which keeps
// shader compilation (and first-frame stutter) to a minimum. Colours are
// updated in place when the theme flips, so nothing re-renders.
//
// Usage:
//   <mesh material={MONO.body}>…</mesh>
//   <lineSegments material={MONO.edge}>…</lineSegments>
//   <mesh material={accent('transport')}>…</mesh>      // glowing packet
//   <mesh material={accent('#22e5a0', 0.6)}>…</mesh>    // dimmer glow

import * as THREE from 'three';
import { LAYER, getTheme, subscribeTheme } from './tokens';

const theme = getTheme();

export const MONO = {
  // Matte solid surfaces (device chassis, server racks)
  body: new THREE.MeshStandardMaterial({ color: theme.body, roughness: 0.9, metalness: 0 }),
  // Slightly lighter inset panels / screens when off
  panel: new THREE.MeshStandardMaterial({ color: theme.panel, roughness: 0.8, metalness: 0 }),
  // Self-lit "paper" surface: lit screens, labels, cards. Not tone-mapped, but
  // kept <= 1.0 so the bloom threshold (1.0) never picks it up.
  screen: new THREE.MeshBasicMaterial({ color: theme.screen, toneMapped: false }),
  // Crisp outlines for <Edges> / lineSegments
  edge: new THREE.LineBasicMaterial({ color: theme.line, transparent: true, opacity: 0.9 }),
  edgeMuted: new THREE.LineBasicMaterial({ color: theme.lineMuted, transparent: true, opacity: 0.6 }),
  // Wireframe overlay for meshes (cheap "technical drawing" look)
  wire: new THREE.MeshBasicMaterial({ color: theme.line, wireframe: true, transparent: true, opacity: 0.35 }),
  wireMuted: new THREE.MeshBasicMaterial({ color: theme.lineMuted, wireframe: true, transparent: true, opacity: 0.25 }),
};

subscribeTheme((t) => {
  MONO.body.color.set(t.body);
  MONO.panel.color.set(t.panel);
  MONO.screen.color.set(t.screen);
  MONO.edge.color.set(t.line);
  MONO.edgeMuted.color.set(t.lineMuted);
  MONO.wire.color.set(t.line);
  MONO.wireMuted.color.set(t.lineMuted);
});

// ── Accent (glowing) materials, cached per colour + intensity ──────────────
// emissiveIntensity > 1 with toneMapped:false pushes luminance above the bloom
// threshold, so ONLY accent-coloured things glow.
const accentCache = new Map();

export function accent(layerOrHex, intensity = 1.6) {
  const hex = LAYER[layerOrHex] ?? layerOrHex;
  const key = `${hex}|${intensity}`;
  let m = accentCache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({
      color: hex,
      emissive: hex,
      emissiveIntensity: intensity,
      roughness: 0.4,
      metalness: 0,
      toneMapped: false,
    });
    accentCache.set(key, m);
  }
  return m;
}

/** A fresh (unshared) accent material, for meshes that animate opacity etc. */
export function accentUnique(layerOrHex, intensity = 1.6, extra = {}) {
  const hex = LAYER[layerOrHex] ?? layerOrHex;
  return new THREE.MeshStandardMaterial({
    color: hex,
    emissive: hex,
    emissiveIntensity: intensity,
    roughness: 0.4,
    metalness: 0,
    toneMapped: false,
    ...extra,
  });
}
