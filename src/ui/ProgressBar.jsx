import { useScrollProgressPercent } from '../stores/scrollStore';

const phases = [
  { name: 'Network', start: 0, end: 10, color: '#3b82f6' },
  { name: 'ARP', start: 10, end: 14, color: '#f97316' },
  { name: 'NAT', start: 14, end: 18, color: '#eab308' },
  { name: 'Cable', start: 18, end: 22, color: '#06b6d4' },
  { name: 'DNS', start: 22, end: 32, color: '#8b5cf6' },
  { name: 'TCP', start: 32, end: 42, color: '#22c55e' },
  { name: 'SSL', start: 42, end: 54, color: '#ec4899' },
  { name: 'HTTP', start: 54, end: 66, color: '#ef4444' },
  { name: 'Render', start: 66, end: 94, color: '#a855f7' },
  { name: 'Done', start: 94, end: 100, color: '#22c55e' },
];

export default function ProgressBar() {
  const progress = useScrollProgressPercent();

  const currentPhase =
    phases.find((p) => progress >= p.start && progress < p.end) ||
    phases[phases.length - 1];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    >
      {/* Slim progress track */}
      <div style={{ height: '2px', background: 'rgba(15,23,42,0.4)' }}>
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background:
              'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #22c55e)',
            transition: 'width 0.1s linear',
            boxShadow: `0 0 6px ${currentPhase.color}80`,
          }}
        />
      </div>

      {/* Very recessive phase label strip */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '5px 20px',
          background: 'rgba(6, 10, 20, 0.35)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        {phases.map((phase, i) => {
          const isActive = progress >= phase.start;
          const isCurrent = phase.name === currentPhase.name;

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                opacity: isCurrent ? 1 : isActive ? 0.6 : 0.25,
                transition: 'opacity 0.4s ease',
              }}
            >
              <div
                style={{
                  width: isCurrent ? '8px' : '6px',
                  height: isCurrent ? '8px' : '6px',
                  borderRadius: '50%',
                  background: isActive ? phase.color : '#334155',
                  boxShadow: isCurrent ? `0 0 6px ${phase.color}` : 'none',
                  transition: 'all 0.4s ease',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  color: isCurrent ? '#e2e8f0' : '#64748b',
                  fontWeight: isCurrent ? 600 : 400,
                  transition: 'all 0.4s ease',
                }}
              >
                {phase.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
