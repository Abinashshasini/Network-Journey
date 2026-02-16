import { useEffect, useCallback } from 'react';

const phases = [
  { key: '1', scroll: 0, name: 'Start - Laptop' },
  { key: '2', scroll: 0.08, name: 'ARP Resolution' },
  { key: '3', scroll: 0.15, name: 'NAT Translation' },
  { key: '4', scroll: 0.22, name: 'ISP & Submarine Cable' },
  { key: '5', scroll: 0.3, name: 'DNS Lookup' },
  { key: '6', scroll: 0.4, name: 'TCP Handshake' },
  { key: '7', scroll: 0.52, name: 'SSL/TLS Handshake' },
  { key: '8', scroll: 0.65, name: 'HTTP Request/Response' },
  { key: '9', scroll: 0.8, name: 'Browser Rendering' },
  { key: '0', scroll: 1, name: 'Complete' },
];

export default function useKeyboardNav() {
  const scrollToPhase = useCallback((phaseScroll) => {
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: phaseScroll * docHeight,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't capture if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')
        return;

      // Number keys for phase navigation
      const phase = phases.find((p) => p.key === e.key);
      if (phase) {
        scrollToPhase(phase.scroll);
        return;
      }

      // Arrow keys for fine navigation
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        window.scrollBy({ top: 300, behavior: 'smooth' });
      }
      if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        window.scrollBy({ top: -300, behavior: 'smooth' });
      }

      // Page up/down for larger jumps
      if (e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
      }
      if (e.key === 'PageUp') {
        e.preventDefault();
        window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
      }

      // Home/End for start/finish
      if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (e.key === 'End') {
        e.preventDefault();
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollToPhase]);

  return { phases, scrollToPhase };
}
