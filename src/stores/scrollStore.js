// Centralized scroll progress store - single source of truth
// Eliminates duplicate scroll listeners across 5+ components

let progress = 0;
let progressPercent = 0;
const listeners = new Set();
let initialized = false;

function update() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progress = docHeight > 0 ? scrollTop / docHeight : 0;
  progressPercent = progress * 100;
  listeners.forEach((fn) => fn(progress, progressPercent));
}

export function initScrollStore() {
  if (initialized) return;
  initialized = true;
  window.addEventListener('scroll', update, { passive: true });
  update();
}

export function destroyScrollStore() {
  initialized = false;
  window.removeEventListener('scroll', update);
}

export function getProgress() {
  return progress;
}

export function getProgressPercent() {
  return progressPercent;
}

export function subscribe(fn) {
  listeners.add(fn);
  // Immediately call with current value
  fn(progress, progressPercent);
  return () => listeners.delete(fn);
}

// React hook for components that need reactive updates
import { useState, useEffect } from 'react';

export function useScrollProgress() {
  const [value, setValue] = useState(progress);

  useEffect(() => {
    return subscribe((p) => setValue(p));
  }, []);

  return value;
}

export function useScrollProgressPercent() {
  const [value, setValue] = useState(progressPercent);

  useEffect(() => {
    return subscribe((_, pct) => setValue(pct));
  }, []);

  return value;
}
