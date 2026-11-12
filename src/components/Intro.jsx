import { useEffect, useState } from 'react';
import { useLoadingStage } from '../stores/loading';
import { LAYER } from '../theme/tokens';

/**
 * Intro — doubles as the loading screen. Pure DOM/CSS so it paints instantly
 * while the 3D chunk downloads and compiles behind it.
 *
 * A browser bar types "google.com"; underneath, the real loading stages
 * advance. When the scene is warm, Start (or Enter) begins playback.
 */
const URL_TEXT = 'google.com';

const STAGE_INFO = {
  engine: { pct: 35, label: 'Loading the 3D engine' },
  scene: { pct: 70, label: 'Building the network' },
  compiling: { pct: 90, label: 'Warming up the GPU' },
  ready: { pct: 100, label: 'Ready' },
};

const LAYERS = [
  ['link', 'Wi-Fi · ARP'],
  ['network', 'IP · NAT · BGP'],
  ['application', 'DNS'],
  ['transport', 'TCP'],
  ['security', 'TLS'],
  ['application', 'HTTP'],
];

export default function Intro({ onStart, leaving }) {
  const stage = useLoadingStage();
  const ready = stage === 'ready';
  const failed = stage === 'failed';
  const [typed, setTyped] = useState(0);

  // Typewriter
  useEffect(() => {
    if (typed >= URL_TEXT.length) return;
    const id = setTimeout(() => setTyped((n) => n + 1), typed === 0 ? 500 : 85 + Math.random() * 70);
    return () => clearTimeout(id);
  }, [typed]);

  // Enter / Space to start. Listens from first paint (not just when ready) so
  // an early press is queued and fires as soon as the scene is warm. Capture
  // phase + stopPropagation keeps the player's keyboard shortcuts from
  // acting behind the intro.
  const [queued, setQueued] = useState(false);
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      e.stopPropagation();
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (ready) onStart();
        else if (!failed) setQueued(true);
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [ready, failed, onStart]);

  useEffect(() => {
    if (ready && queued) onStart();
  }, [ready, queued, onStart]);

  const info = STAGE_INFO[stage];

  return (
    <div className={`intro ${leaving ? 'is-leaving' : ''}`}>
      <div className="intro__grid" aria-hidden />

      <main className="intro__content">
        <p className="intro__eyebrow">What happens when you press Enter?</p>
        <h1 className="intro__title">
          Network<span className="muted">/</span>Journey
        </h1>

        <div className="urlbar" aria-label="Browser address bar">
          <span className="urlbar__lock" aria-hidden>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
          </span>
          <span className="urlbar__text">
            {URL_TEXT.slice(0, typed)}
            <span className="urlbar__caret" />
          </span>
          <span className={`urlbar__enter ${typed >= URL_TEXT.length ? 'is-on' : ''}`}>↵</span>
        </div>

        <ul className="intro__layers" aria-label="What you will see">
          {LAYERS.map(([layer, label], i) => (
            <li key={i} style={{ '--accent': LAYER[layer], animationDelay: `${0.9 + i * 0.08}s` }}>
              <i />
              {label}
            </li>
          ))}
        </ul>

        <div className="intro__cta">
          {failed ? (
            <div className="intro__error" role="alert">
              <strong>3D graphics are unavailable in this browser.</strong>
              <span>
                WebGL could not start — usually because hardware acceleration is off.
                Enable it in your browser settings (Chrome: Settings → System → “Use
                graphics acceleration”), relaunch, and reload this page.
              </span>
            </div>
          ) : ready ? (
            <button className="start-btn" onClick={onStart} autoFocus>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M7 4.5v15l13-7.5z" />
              </svg>
              Start the journey
            </button>
          ) : (
            <div className="loader" role="status" aria-live="polite">
              <div className="loader__bar">
                <span style={{ transform: `scaleX(${info.pct / 100})` }} />
              </div>
              <span className="loader__label">{info.label}…</span>
            </div>
          )}
          <p className="intro__hint">
            {failed ? null : ready ? (
              <>
                press <kbd>Enter</kbd> · <kbd>Space</kbd> pauses · <kbd>←</kbd> <kbd>→</kbd> step
              </>
            ) : (
              queued
                ? 'Starting as soon as it’s ready…'
                : 'About 3 minutes · play, pause or step through at your own pace'
            )}
          </p>
        </div>
      </main>
    </div>
  );
}
