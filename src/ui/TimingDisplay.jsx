import { useScrollProgress } from '../stores/scrollStore';

const timings = [
  { label: 'DNS Lookup',       time: 35,  unit: 'ms' },
  { label: 'TCP Handshake',    time: 45,  unit: 'ms' },
  { label: 'SSL/TLS',         time: 100, unit: 'ms' },
  { label: 'HTTP Request',    time: 200, unit: 'ms' },
  { label: 'Page Render',     time: 75,  unit: 'ms' },
];

// Scroll progress at which each phase becomes "done"
const PHASE_DONE_AT = [0.32, 0.42, 0.54, 0.66, 0.94];
// Scroll progress at which each phase is "in progress" (started but not done)
const PHASE_START_AT = [0.22, 0.32, 0.42, 0.54, 0.66];

function getPhaseProgress(scrollProgress, phaseIndex) {
  const start = PHASE_START_AT[phaseIndex];
  const done  = PHASE_DONE_AT[phaseIndex];
  if (scrollProgress < start) return { status: 'pending', fraction: 0 };
  if (scrollProgress >= done) return { status: 'done',    fraction: 1 };
  return {
    status: 'active',
    fraction: (scrollProgress - start) / (done - start),
  };
}

const STATUS_ICON  = { done: '✓', active: '●', pending: '○' };
const STATUS_COLOR = { done: '#22c55e', active: '#06b6d4', pending: '#334155' };

export default function TimingDisplay() {
  const scrollProgress = useScrollProgress();

  // Total elapsed = sum of all completed phases' full times + in-progress fraction
  let totalMs = 0;
  timings.forEach((t, i) => {
    const { status, fraction } = getPhaseProgress(scrollProgress, i);
    if (status === 'done')   totalMs += t.time;
    if (status === 'active') totalMs += Math.floor(fraction * t.time);
  });

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: 'rgba(6, 10, 20, 0.5)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        padding: '16px 20px',
        borderRadius: '14px',
        border: '1px solid rgba(255,255,255,0.07)',
        fontFamily: '"SF Mono", ui-monospace, monospace',
        zIndex: 100,
        minWidth: '220px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Total */}
      <div style={{ marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ fontSize: '9px', color: '#475569', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '3px' }}>
          ⏱ Total Latency
        </div>
        <div style={{ fontSize: '26px', fontWeight: 700, color: '#f1f5f9', lineHeight: 1 }}>
          {totalMs}
          <span style={{ fontSize: '13px', color: '#475569', fontWeight: 400 }}>ms</span>
        </div>
      </div>

      {/* Checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {timings.map((phase, i) => {
          const { status, fraction } = getPhaseProgress(scrollProgress, i);
          const icon  = STATUS_ICON[status];
          const color = STATUS_COLOR[status];

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: status === 'pending' ? 0.4 : 1,
                transition: 'opacity 0.4s ease',
              }}
            >
              {/* Status icon */}
              <span style={{ color, fontSize: '12px', width: '12px', flexShrink: 0, textShadow: status === 'done' ? '0 0 8px #22c55e60' : 'none' }}>
                {icon}
              </span>

              {/* Phase name */}
              <span style={{ color: status === 'pending' ? '#475569' : '#94a3b8', fontSize: '11px', flex: 1 }}>
                {phase.label}
              </span>

              {/* Time value */}
              <span style={{ color, fontSize: '11px', fontWeight: 600, minWidth: '52px', textAlign: 'right' }}>
                {status === 'pending'
                  ? '---'
                  : status === 'done'
                    ? `${phase.time}${phase.unit}`
                    : `${Math.floor(fraction * phase.time)}/${phase.time}${phase.unit}`
                }
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
