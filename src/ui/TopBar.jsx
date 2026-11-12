import { useState } from 'react';
import { usePlayer } from '../stores/player';
import { CHAPTERS } from '../journey/steps';
import { toggleTheme, useTheme, layerColor } from '../theme/tokens';

const SHORTCUTS = [
  ['Space', 'Play / pause'],
  ['← →', 'Previous / next step'],
  ['1 – 8', 'Jump to chapter'],
  ['+ −', 'Speed'],
  ['R', 'Replay'],
  ['T', 'Toggle theme'],
];

export default function TopBar() {
  const chapterIndex = usePlayer((s) => s.chapterIndex);
  const theme = useTheme();
  const [help, setHelp] = useState(false);
  const ch = CHAPTERS[chapterIndex];

  return (
    <header className="top-bar">
      <div className="brand">
        <span className="brand__mark" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="brand__name">network<span className="muted">/</span>journey</span>
        <span className="brand__chapter" style={{ '--accent': layerColor(ch.layer, theme) }}>
          <i />
          {ch.name}
        </span>
      </div>

      <div className="top-bar__actions">
        <button
          className="icon-btn"
          onClick={() => setHelp((h) => !h)}
          aria-expanded={help}
          title="Keyboard shortcuts"
          aria-label="Keyboard shortcuts"
        >
          ?
        </button>
        <button
          className="icon-btn"
          onClick={toggleTheme}
          title="Toggle theme (T)"
          aria-label={`Switch to ${theme.name === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme.name === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4.5" />
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
            </svg>
          )}
        </button>
      </div>

      {help && (
        <div className="shortcuts" role="dialog" aria-label="Keyboard shortcuts">
          {SHORTCUTS.map(([k, v]) => (
            <div key={k}>
              <kbd>{k}</kbd>
              <span>{v}</span>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
