import { useState, useEffect } from 'react';

const timings = [
  { phase: 'network', label: 'Network Hop', time: 50, unit: 'ms' },
  { phase: 'arp', label: 'ARP Resolution', time: 2, unit: 'ms' },
  { phase: 'nat', label: 'NAT Translation', time: 1, unit: 'μs' },
  { phase: 'dns', label: 'DNS Lookup', time: 35, unit: 'ms' },
  { phase: 'tcp', label: 'TCP Handshake', time: 45, unit: 'ms' },
  { phase: 'ssl', label: 'SSL/TLS', time: 100, unit: 'ms' },
  { phase: 'http', label: 'HTTP Request', time: 200, unit: 'ms' },
  { phase: 'render', label: 'Page Render', time: 75, unit: 'ms' },
];

export default function TimingDisplay() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getPhaseInfo = () => {
    if (scrollProgress < 0.08)
      return { index: 0, progress: scrollProgress / 0.08 };
    if (scrollProgress < 0.12)
      return { index: 1, progress: (scrollProgress - 0.08) / 0.04 };
    if (scrollProgress < 0.18)
      return { index: 2, progress: (scrollProgress - 0.12) / 0.06 };
    if (scrollProgress < 0.28)
      return { index: 3, progress: (scrollProgress - 0.18) / 0.1 };
    if (scrollProgress < 0.42)
      return { index: 4, progress: (scrollProgress - 0.28) / 0.14 };
    if (scrollProgress < 0.56)
      return { index: 5, progress: (scrollProgress - 0.42) / 0.14 };
    if (scrollProgress < 0.72)
      return { index: 6, progress: (scrollProgress - 0.56) / 0.16 };
    return { index: 7, progress: (scrollProgress - 0.72) / 0.28 };
  };

  const { index, progress } = getPhaseInfo();
  const currentTiming = timings[index];

  // Calculate total elapsed time
  const getElapsedTime = () => {
    let total = 0;
    for (let i = 0; i < index; i++) {
      total += timings[i].time;
    }
    total += Math.floor(progress * currentTiming.time);
    return total;
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(15, 23, 42, 0.95)',
        padding: '16px 20px',
        borderRadius: '12px',
        border: '1px solid #334155',
        fontFamily: 'monospace',
        zIndex: 100,
        minWidth: '180px',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Current phase */}
      <div
        style={{
          color: '#64748b',
          fontSize: '10px',
          marginBottom: '4px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      >
        Current Phase
      </div>
      <div
        style={{
          color: '#e2e8f0',
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '12px',
        }}
      >
        {currentTiming.label}
      </div>

      {/* Phase timing */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '8px',
          padding: '8px 0',
          borderTop: '1px solid #334155',
          borderBottom: '1px solid #334155',
        }}
      >
        <span style={{ color: '#64748b', fontSize: '10px' }}>PHASE TIME</span>
        <span
          style={{ color: '#06b6d4', fontSize: '18px', fontWeight: 'bold' }}
        >
          {Math.floor(progress * currentTiming.time)}
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {' '}
            / {currentTiming.time}
            {currentTiming.unit}
          </span>
        </span>
      </div>

      {/* Total elapsed */}
      <div style={{ color: '#64748b', fontSize: '10px', marginBottom: '4px' }}>
        TOTAL ELAPSED
      </div>
      <div
        style={{
          color: '#22c55e',
          fontSize: '28px',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(34, 197, 94, 0.3)',
        }}
      >
        {getElapsedTime()}
        <span style={{ fontSize: '14px', color: '#64748b' }}>ms</span>
      </div>

      {/* Progress bar for current phase */}
      <div
        style={{
          marginTop: '12px',
          height: '4px',
          backgroundColor: '#1e293b',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            backgroundColor: '#22c55e',
            transition: 'width 0.1s ease-out',
          }}
        />
      </div>
    </div>
  );
}
