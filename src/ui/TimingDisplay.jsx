import { useScrollProgress } from '../stores/scrollStore';

const timings = [
  { phase: 'network', label: 'Network Hop', time: 50, unit: 'ms' },
  { phase: 'arp', label: 'ARP Resolution', time: 2, unit: 'ms' },
  { phase: 'nat', label: 'NAT Translation', time: 1, unit: 'us' },
  { phase: 'cable', label: 'Submarine Cable', time: 30, unit: 'ms' },
  { phase: 'dns', label: 'DNS Lookup', time: 35, unit: 'ms' },
  { phase: 'tcp', label: 'TCP Handshake', time: 45, unit: 'ms' },
  { phase: 'ssl', label: 'SSL/TLS', time: 100, unit: 'ms' },
  { phase: 'http', label: 'HTTP Request', time: 200, unit: 'ms' },
  { phase: 'render', label: 'Page Render', time: 75, unit: 'ms' },
  { phase: 'complete', label: 'Complete!', time: 0, unit: 'ms' },
];

const phaseBounds = [0, 0.10, 0.14, 0.18, 0.22, 0.32, 0.42, 0.54, 0.66, 0.94];

function getPhaseInfo(scrollProgress) {
  for (let i = phaseBounds.length - 1; i >= 0; i--) {
    if (scrollProgress >= phaseBounds[i]) {
      const nextBound = phaseBounds[i + 1] || 1;
      const phaseProgress =
        (scrollProgress - phaseBounds[i]) / (nextBound - phaseBounds[i]);
      return {
        index: Math.min(i, timings.length - 1),
        progress: Math.min(phaseProgress, 1),
      };
    }
  }
  return { index: 0, progress: 0 };
}

export default function TimingDisplay() {
  const scrollProgress = useScrollProgress();
  const { index, progress } = getPhaseInfo(scrollProgress);
  const currentTiming = timings[index];

  const getElapsedTime = () => {
    let total = 0;
    for (let i = 0; i < index; i++) total += timings[i].time;
    total += Math.floor(progress * currentTiming.time);
    return total;
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(6, 10, 20, 0.4)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '14px 18px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.06)',
        fontFamily: 'monospace',
        zIndex: 100,
        minWidth: '170px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
      }}
    >
      <div style={{ color: '#475569', fontSize: '9px', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
        Current Phase
      </div>
      <div style={{ color: '#cbd5e1', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
        {currentTiming.label}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '10px',
          padding: '7px 0',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span style={{ color: '#475569', fontSize: '9px' }}>PHASE</span>
        <span style={{ color: '#06b6d4', fontSize: '16px', fontWeight: 700 }}>
          {Math.floor(progress * currentTiming.time)}
          <span style={{ fontSize: '11px', color: '#475569', fontWeight: 400 }}>
            {' '}/ {currentTiming.time}{currentTiming.unit}
          </span>
        </span>
      </div>

      <div style={{ color: '#475569', fontSize: '9px', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Total
      </div>
      <div style={{ color: '#22c55e', fontSize: '26px', fontWeight: 700 }}>
        {getElapsedTime()}
        <span style={{ fontSize: '12px', color: '#475569', fontWeight: 400 }}>ms</span>
      </div>

      <div style={{ marginTop: '10px', height: '2px', background: 'rgba(255,255,255,0.06)', borderRadius: '1px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            background: '#22c55e',
            transition: 'width 0.1s linear',
          }}
        />
      </div>
    </div>
  );
}
