// Design tokens: monochrome base + one RGB accent per network layer.
// Colour is reserved for things that carry meaning (packets, links, active
// states). Everything structural is black/white/grey.

import { useSyncExternalStore } from 'react';

// ── Layer accents (same in both themes) ────────────────────────────────────
export const LAYER = {
  link: '#ff3b5c', //        L2 · Ethernet / Wi-Fi / ARP
  network: '#ffb020', //     L3 · IP / NAT / BGP / ICMP
  transport: '#22e5a0', //   L4 · TCP / UDP
  security: '#3d8bff', //    TLS / SSH
  application: '#c74bff', // L7 · DNS / HTTP
  browser: '#f5f5f5', //     Client-side rendering (neutral, theme-flipped below)
};

export const LAYER_LABEL = {
  link: 'L2 · Link',
  network: 'L3 · Network',
  transport: 'L4 · Transport',
  security: 'Security',
  application: 'L7 · Application',
  browser: 'Browser',
};

// ── Monochrome palettes ────────────────────────────────────────────────────
const DARK = {
  name: 'dark',
  bg: '#0a0a0a',
  fog: '#0a0a0a',
  body: '#151515', //    device chassis / solid surfaces
  panel: '#1f1f1f', //   inset panels, screens off
  line: '#e8e8e8', //    outlines / edges
  lineMuted: '#5a5a5a', // idle connections, grid
  text: '#f2f2f2',
  textMuted: '#8a8a8a',
  screen: '#fafafa', //  lit screen content
  browser: '#f5f5f5',
};

const LIGHT = {
  name: 'light',
  bg: '#f4f4f2',
  fog: '#f4f4f2',
  body: '#e4e4e2',
  panel: '#d6d6d4',
  line: '#111111',
  lineMuted: '#a8a8a8',
  text: '#0d0d0d',
  textMuted: '#6b6b6b',
  screen: '#ffffff',
  browser: '#1a1a1a',
};

export const THEMES = { dark: DARK, light: LIGHT };

// ── Theme store ────────────────────────────────────────────────────────────
function readInitialTheme() {
  try {
    const saved = localStorage.getItem('nj-theme');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    /* storage unavailable */
  }
  return 'dark';
}

let themeName = readInitialTheme();
const listeners = new Set();

function applyToDocument() {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = themeName;
  }
}
applyToDocument();

export function getTheme() {
  return THEMES[themeName];
}

export function setTheme(name) {
  if (name === themeName || !THEMES[name]) return;
  themeName = name;
  try {
    localStorage.setItem('nj-theme', name);
  } catch {
    /* ignore */
  }
  applyToDocument();
  listeners.forEach((fn) => fn(THEMES[name]));
}

export function toggleTheme() {
  setTheme(themeName === 'dark' ? 'light' : 'dark');
}

export function subscribeTheme(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** React hook: returns the active token set, re-renders on theme change. */
export function useTheme() {
  return useSyncExternalStore(subscribeTheme, getTheme, getTheme);
}

/** Layer accent, with the neutral "browser" layer flipped per theme. */
export function layerColor(layer, theme = getTheme()) {
  if (layer === 'browser') return theme.browser;
  return LAYER[layer] ?? theme.line;
}
