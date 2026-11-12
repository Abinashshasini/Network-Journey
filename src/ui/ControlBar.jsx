import { useEffect, useRef, useState } from 'react';
import {
  usePlayer,
  subscribe,
  togglePlay,
  nextStep,
  prevStep,
  restart,
  cycleSpeed,
  goToChapter,
  seek,
  pause,
  play,
  getPlayerState,
  progressToTime,
  timeToProgress,
  TOTAL_SECONDS,
} from '../stores/player';
import { CHAPTERS } from '../journey/steps';
import { layerColor, useTheme } from '../theme/tokens';

const fmt = (sec) => {
  const s = Math.max(0, Math.round(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

// Chapter segments laid out by *time*, so the track matches playback pace
const SEGMENTS = CHAPTERS.map((ch, i) => {
  const t0 = progressToTime(ch.start);
  const t1 = i < CHAPTERS.length - 1 ? progressToTime(CHAPTERS[i + 1].start) : TOTAL_SECONDS;
  return { ...ch, left: t0 / TOTAL_SECONDS, width: (t1 - t0) / TOTAL_SECONDS };
});

function Icon({ name }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'currentColor', 'aria-hidden': true };
  switch (name) {
    case 'play':
      return <svg {...common}><path d="M7 4.5v15l13-7.5z" /></svg>;
    case 'pause':
      return <svg {...common}><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>;
    case 'prev':
      return <svg {...common}><path d="M6 5h2v14H6zM20 5v14L9 12z" /></svg>;
    case 'next':
      return <svg {...common}><path d="M16 5h2v14h-2zM4 5v14l11-7z" /></svg>;
    case 'replay':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <path d="M3 4v5h5" />
        </svg>
      );
    default:
      return null;
  }
}

export default function ControlBar() {
  const playing = usePlayer((s) => s.playing);
  const speed = usePlayer((s) => s.speed);
  const chapterIndex = usePlayer((s) => s.chapterIndex);
  const ended = usePlayer((s) => s.ended);
  const theme = useTheme();

  const fillRef = useRef(null);
  const headRef = useRef(null);
  const timeRef = useRef(null);
  const trackRef = useRef(null);
  const [hover, setHover] = useState(null);

  // Per-frame progress → DOM directly (no React re-render)
  useEffect(
    () =>
      subscribe((p) => {
        const t = progressToTime(p);
        const f = (t / TOTAL_SECONDS) * 100;
        if (fillRef.current) fillRef.current.style.width = `${f}%`;
        if (headRef.current) headRef.current.style.left = `${f}%`;
        if (timeRef.current) timeRef.current.textContent = fmt(t);
      }),
    [],
  );

  // Scrubbing: drag along the track
  const dragging = useRef(false);
  const resumeAfter = useRef(false);
  const fracAt = (e) => {
    const r = trackRef.current.getBoundingClientRect();
    return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
  };
  const onDown = (e) => {
    dragging.current = true;
    resumeAfter.current = getPlayerState().playing;
    pause();
    trackRef.current.setPointerCapture(e.pointerId);
    seek(timeToProgress(fracAt(e) * TOTAL_SECONDS), { duration: 0.35 });
  };
  const onMove = (e) => {
    const f = fracAt(e);
    const idx = SEGMENTS.findIndex((s) => f >= s.left && f < s.left + s.width);
    setHover({ x: f, chapter: SEGMENTS[idx === -1 ? SEGMENTS.length - 1 : idx] });
    if (dragging.current) seek(timeToProgress(f * TOTAL_SECONDS), { animate: false });
  };
  const onUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (resumeAfter.current) play();
  };

  return (
    <div className="control-bar" role="toolbar" aria-label="Playback">
      <div className="control-bar__buttons">
        <button className="icon-btn" onClick={restart} title="Replay (R)" aria-label="Replay">
          <Icon name="replay" />
        </button>
        <button className="icon-btn" onClick={prevStep} title="Previous step (←)" aria-label="Previous step">
          <Icon name="prev" />
        </button>
        <button
          className="icon-btn icon-btn--primary"
          onClick={ended ? restart : togglePlay}
          title={playing ? 'Pause (Space)' : 'Play (Space)'}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          <Icon name={playing ? 'pause' : ended ? 'replay' : 'play'} />
        </button>
        <button className="icon-btn" onClick={nextStep} title="Next step (→)" aria-label="Next step">
          <Icon name="next" />
        </button>
        <button
          className="speed-btn"
          onClick={() => cycleSpeed(1)}
          title="Playback speed (+/-)"
          aria-label={`Playback speed ${speed}x`}
        >
          {speed}×
        </button>
      </div>

      <div className="control-bar__timeline">
        <div
          ref={trackRef}
          className="track"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onPointerLeave={() => setHover(null)}
        >
          <div className="track__rail" />
          <div ref={fillRef} className="track__fill" />
          {SEGMENTS.map((s, i) => (
            <div
              key={s.id}
              className={`track__seg ${i === chapterIndex ? 'is-current' : ''} ${i < chapterIndex ? 'is-done' : ''}`}
              style={{ left: `${s.left * 100}%`, width: `${s.width * 100}%`, '--seg': layerColor(s.layer, theme) }}
            />
          ))}
          <div ref={headRef} className="track__head" />
          {hover && (
            <div className="track__tip" style={{ left: `${hover.x * 100}%` }}>
              {hover.chapter.name}
            </div>
          )}
        </div>

        <div className="chapters">
          {SEGMENTS.map((s, i) => (
            <button
              key={s.id}
              className={`chapter ${i === chapterIndex ? 'is-current' : ''}`}
              style={{ left: `${s.left * 100}%`, '--seg': layerColor(s.layer, theme) }}
              onClick={() => goToChapter(i)}
              title={`${s.name} (${i + 1})`}
            >
              {s.short}
            </button>
          ))}
        </div>
      </div>

      <div className="control-bar__time">
        <span ref={timeRef}>0:00</span>
        <span className="muted"> / {fmt(TOTAL_SECONDS)}</span>
      </div>
    </div>
  );
}
