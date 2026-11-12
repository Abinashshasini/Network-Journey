// Loading stages shown on the intro screen.
//   engine    → downloading the 3D bundle (three, r3f, scene code)
//   scene     → building the scene graph, loading the label font
//   compiling → pre-compiling every shader so playback never hitches
//   ready     → safe to start
//   failed    → WebGL unavailable / scene crashed (terminal)
import { useSyncExternalStore } from 'react';

export const STAGES = ['engine', 'scene', 'compiling', 'ready'];

let stage = 'engine';
const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn());

export function setLoadingStage(next) {
  if (stage === 'failed') return;
  if (STAGES.indexOf(next) <= STAGES.indexOf(stage)) return; // only forward
  stage = next;
  emit();
}

export function setLoadingFailed() {
  if (stage === 'failed') return;
  stage = 'failed';
  emit();
}

function sub(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useLoadingStage() {
  return useSyncExternalStore(sub, () => stage, () => stage);
}

/** True if this browser can create a WebGL context right now. */
export function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}
