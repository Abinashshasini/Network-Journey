import { useState, useEffect } from 'react';

const phases = [
  { name: 'Network', start: 0, end: 8, color: '#3b82f6' },
  { name: 'ARP', start: 8, end: 12, color: '#f97316' },
  { name: 'NAT', start: 12, end: 18, color: '#eab308' },
  { name: 'DNS', start: 18, end: 28, color: '#8b5cf6' },
  { name: 'TCP', start: 28, end: 42, color: '#06b6d4' },
  { name: 'SSL', start: 42, end: 56, color: '#22c55e' },
  { name: 'HTTP', start: 56, end: 72, color: '#ef4444' },
  { name: 'Render', start: 72, end: 100, color: '#ec4899' },
];

export default function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getCurrentPhase = () => {
    return (
      phases.find((p) => progress >= p.start && progress < p.end) ||
      phases[phases.length - 1]
    );
  };

  const currentPhase = getCurrentPhase();

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
      {/* Progress bar background */}
      <div
        style={{
          height: '4px',
          backgroundColor: '#1e293b',
        }}
      >
        {/* Progress fill with gradient */}
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: `linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4, #22c55e, #ef4444, #ec4899)`,
            transition: 'width 0.1s ease-out',
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
          }}
        />
      </div>

      {/* Phase indicators */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '8px 20px',
          background:
            'linear-gradient(to bottom, rgba(15, 23, 42, 0.9), transparent)',
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
                opacity: isActive ? 1 : 0.4,
                transition: 'all 0.3s',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? phase.color : '#475569',
                  boxShadow: isCurrent ? `0 0 8px ${phase.color}` : 'none',
                  transition: 'all 0.3s',
                }}
              />
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'monospace',
                  color: isActive ? '#e2e8f0' : '#64748b',
                  fontWeight: isCurrent ? 'bold' : 'normal',
                  transition: 'all 0.3s',
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
