import { useEffect } from 'react';
import {
  togglePlay,
  nextStep,
  prevStep,
  restart,
  cycleSpeed,
  goToChapter,
} from '../stores/player';
import { toggleTheme } from '../theme/tokens';

/**
 * Keyboard controls
 *   Space / K      play · pause
 *   → / L / J ←    next · previous step
 *   1 – 8          jump to chapter
 *   + / −          speed
 *   R              replay
 *   T              theme
 */
export default function useKeyboardNav() {
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      // Let focused buttons handle Space/Enter themselves
      if (tag === 'BUTTON' && (e.key === ' ' || e.key === 'Enter')) return;

      const k = e.key;
      if (k === ' ' || k === 'k' || k === 'K') {
        e.preventDefault();
        togglePlay();
      } else if (k === 'ArrowRight' || k === 'l' || k === 'L') {
        e.preventDefault();
        nextStep();
      } else if (k === 'ArrowLeft' || k === 'j' || k === 'J') {
        e.preventDefault();
        prevStep();
      } else if (k === '+' || k === '=') {
        cycleSpeed(1);
      } else if (k === '-' || k === '_') {
        cycleSpeed(-1);
      } else if (k === 'r' || k === 'R') {
        restart();
      } else if (k === 't' || k === 'T') {
        toggleTheme();
      } else if (/^[1-8]$/.test(k)) {
        goToChapter(Number(k) - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
