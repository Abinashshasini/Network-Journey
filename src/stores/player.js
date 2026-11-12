// Player — the single clock that drives the whole journey.
//
// Replaces the old scroll store. A "progress" value (0–1) is advanced by the
// GSAP ticker while playing; every registered GSAP timeline (camera, packets)
// is scrubbed to that progress, and per-frame listeners (lights, effects,
// nodes) read it via getProgress()/subscribe().
//
// Playback is time-mapped per step: every step gets a base dwell plus time
// proportional to its length, so short steps are still readable.
//
// Two kinds of subscriptions:
//   subscribe(fn)        hot  — called on every progress change (per frame)
//   usePlayer(selector)  cold — React state (playing, speed, stepIndex…)

import { useSyncExternalStore, useCallback } from 'react';
import gsap from 'gsap';
import { STEPS, CHAPTERS } from '../journey/steps';

// ── Time map ───────────────────────────────────────────────────────────────
const STEP_BASE_SEC = 2.2; //   minimum dwell for any step
const SEC_PER_PROGRESS = 90; // + this many seconds per 1.0 of progress

const SEGMENTS = (() => {
  let t = 0;
  return STEPS.map((s) => {
    const dur = STEP_BASE_SEC + (s.end - s.start) * SEC_PER_PROGRESS;
    const seg = { p0: s.start, p1: s.end, t0: t, t1: t + dur };
    t += dur;
    return seg;
  });
})();

export const TOTAL_SECONDS = SEGMENTS[SEGMENTS.length - 1].t1;

function segIndexForProgress(p) {
  for (let i = 0; i < SEGMENTS.length; i++) if (p < SEGMENTS[i].p1) return i;
  return SEGMENTS.length - 1;
}
function segIndexForTime(t) {
  for (let i = 0; i < SEGMENTS.length; i++) if (t < SEGMENTS[i].t1) return i;
  return SEGMENTS.length - 1;
}
export function progressToTime(p) {
  const s = SEGMENTS[segIndexForProgress(p)];
  const k = (p - s.p0) / (s.p1 - s.p0);
  return s.t0 + Math.min(1, Math.max(0, k)) * (s.t1 - s.t0);
}
export function timeToProgress(t) {
  const s = SEGMENTS[segIndexForTime(t)];
  const k = (t - s.t0) / (s.t1 - s.t0);
  return s.p0 + Math.min(1, Math.max(0, k)) * (s.p1 - s.p0);
}

export function stepIndexAt(p) {
  for (let i = STEPS.length - 1; i >= 0; i--) if (p >= STEPS[i].start) return i;
  return 0;
}
export function chapterIndexAt(p) {
  for (let i = CHAPTERS.length - 1; i >= 0; i--) if (p >= CHAPTERS[i].start) return i;
  return 0;
}

// ── Hot state ──────────────────────────────────────────────────────────────
let progress = 0;
let time = 0;
const hot = new Set();
const timelines = new Set();

export function getProgress() {
  return progress;
}
export function getProgressPercent() {
  return progress * 100;
}
export function getElapsedSeconds() {
  return time;
}

/** Per-frame progress listener. Called immediately with the current value. */
export function subscribe(fn) {
  hot.add(fn);
  fn(progress, progress * 100);
  return () => hot.delete(fn);
}

/**
 * Scrub a paused GSAP timeline with the player. Timelines are authored on an
 * absolute 0–1 scale (position 0.34 = 34% of the journey, matching STEPS), so
 * we pad them to exactly 1.0 — otherwise a timeline whose last tween ends at
 * 0.9 would be stretched and drift out of sync with the step text.
 * Returns an unregister fn.
 */
export function registerTimeline(tl) {
  tl.pause();
  if (tl.duration() < 1) tl.set({}, {}, 1);
  timelines.add(tl);
  tl.progress(progress);
  return () => timelines.delete(tl);
}

// ── Cold (React) state ─────────────────────────────────────────────────────
let state = {
  playing: false,
  speed: 1,
  stepIndex: 0,
  chapterIndex: 0,
  ended: false,
  started: false,
};
const cold = new Set();

function setState(patch) {
  let changed = false;
  for (const k in patch) if (state[k] !== patch[k]) changed = true;
  if (!changed) return;
  state = { ...state, ...patch };
  cold.forEach((fn) => fn());
}

export function getPlayerState() {
  return state;
}

function subscribeCold(fn) {
  cold.add(fn);
  return () => cold.delete(fn);
}

/** React hook. `selector` keeps re-renders to the slice you need. */
export function usePlayer(selector = (s) => s) {
  return useSyncExternalStore(
    subscribeCold,
    () => selector(state),
    () => selector(state),
  );
}

/**
 * React hook for a value derived from progress (e.g. "is this node active?").
 * Re-renders only when the derived (primitive) value changes — never per
 * frame. Pass a stable selector (module-level function).
 */
export function useProgressSelector(selector) {
  const sub = useCallback(
    (notify) => {
      let last = selector(progress);
      return subscribe((p) => {
        const next = selector(p);
        if (next !== last) {
          last = next;
          notify();
        }
      });
    },
    [selector],
  );
  const get = () => selector(progress);
  return useSyncExternalStore(sub, get, get);
}

// ── Core ───────────────────────────────────────────────────────────────────
function apply(p) {
  progress = Math.min(1, Math.max(0, p));
  timelines.forEach((tl) => tl.progress(progress));
  hot.forEach((fn) => fn(progress, progress * 100));
  setState({
    stepIndex: stepIndexAt(progress),
    chapterIndex: chapterIndexAt(progress),
    ended: progress >= 1,
  });
}

let seekTween = null;
let stopAt = null; // progress at which to auto-pause (step-by-step mode)

gsap.ticker.add((_t, deltaMs) => {
  if (!state.playing || seekTween) return;
  const dt = Math.min(deltaMs, 100) / 1000; // clamp after tab switches
  time = Math.min(TOTAL_SECONDS, time + dt * state.speed);
  let p = timeToProgress(time);
  if (stopAt !== null && p >= stopAt) {
    p = stopAt;
    time = progressToTime(p);
    stopAt = null;
    apply(p);
    setState({ playing: false });
    return;
  }
  apply(p);
  if (time >= TOTAL_SECONDS) setState({ playing: false });
});

/**
 * Jump to a progress value. Animated seeks fly the camera/packets there
 * (duration scales with distance); non-animated seeks are instant (scrubbing).
 */
export function seek(p, { animate = true, duration, onDone } = {}) {
  p = Math.min(1, Math.max(0, p));
  stopAt = null; // any explicit seek cancels a pending step-through stop
  if (seekTween) seekTween.kill();
  seekTween = null;
  if (!animate) {
    time = progressToTime(p);
    apply(p);
    onDone?.();
    return;
  }
  const proxy = { p: progress };
  const dist = Math.abs(p - progress);
  seekTween = gsap.to(proxy, {
    p,
    duration: duration ?? Math.min(1.6, 0.45 + dist * 3),
    ease: 'power2.inOut',
    onUpdate: () => apply(proxy.p),
    onComplete: () => {
      seekTween = null;
      time = progressToTime(p);
      apply(p);
      onDone?.();
    },
  });
}

export function play() {
  if (progress >= 1) {
    restart();
    return;
  }
  stopAt = null;
  setState({ playing: true, started: true });
}

export function pause() {
  stopAt = null;
  setState({ playing: false });
}

export function togglePlay() {
  if (state.playing) pause();
  else play();
}

export function setSpeed(speed) {
  setState({ speed });
}

const SPEEDS = [0.5, 1, 1.5, 2];
export { SPEEDS };
export function cycleSpeed(dir = 1) {
  const i = SPEEDS.indexOf(state.speed);
  const next = SPEEDS[(i + dir + SPEEDS.length) % SPEEDS.length];
  setSpeed(next);
}

/**
 * Go to a step. While paused, the step's animation plays once and stops at
 * the end of the step (step-through mode). While playing, playback continues.
 */
export function goToStep(i) {
  i = Math.min(STEPS.length - 1, Math.max(0, i));
  const step = STEPS[i];
  const wasPlaying = state.playing;
  setState({ started: true });
  seek(step.start, {
    onDone: () => {
      if (wasPlaying) return;
      stopAt = Math.max(step.start, step.end - 1e-4);
      setState({ playing: true });
    },
  });
}

export function nextStep() {
  goToStep(state.stepIndex + 1);
}

export function prevStep() {
  const cur = STEPS[state.stepIndex];
  // Like a media player: "previous" restarts the current step unless we're
  // right at its beginning.
  const intoStep = (progressToTime(progress) - progressToTime(cur.start)) > 1.2;
  goToStep(intoStep ? state.stepIndex : state.stepIndex - 1);
}

export function goToChapter(i) {
  const ch = CHAPTERS[Math.min(CHAPTERS.length - 1, Math.max(0, i))];
  setState({ started: true });
  seek(ch.start);
}

export function restart() {
  stopAt = null;
  seek(0, {
    duration: 1.4,
    onDone: () => setState({ playing: true, started: true }),
  });
}

// Dev-only handle for debugging / automated checks
if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.__player = { seek, play, pause, goToStep, getProgress, getPlayerState };
}
