export default function SearchHUD({ state }) {
  // Determine phase from state
  const getPhase = () => {
    if (state.includes('ARP'))
      return { num: 1, name: 'ARP Resolution', color: '#f97316' };
    if (state.includes('NAT'))
      return { num: 1, name: 'NAT Translation', color: '#eab308' };
    if (state.includes('DNS'))
      return { num: 2, name: 'DNS Lookup', color: '#8b5cf6' };
    if (state.includes('TCP') || state.includes('SYN') || state.includes('ACK'))
      return { num: 3, name: 'TCP Handshake', color: '#f97316' };
    if (
      state.includes('SSL') ||
      state.includes('Hello') ||
      state.includes('Key') ||
      state.includes('🔒')
    )
      return { num: 4, name: 'SSL/TLS Handshake', color: '#ec4899' };
    if (state.includes('Load Balancer'))
      return { num: 5, name: 'Load Balancing', color: '#06b6d4' };
    if (state.includes('encrypted') || state.includes('✓'))
      return { num: 5, name: 'Secure Connection', color: '#22c55e' };
    if (
      state.includes('DOM') ||
      state.includes('CSSOM') ||
      state.includes('Render') ||
      state.includes('Paint') ||
      state.includes('GPU') ||
      state.includes('Layout')
    )
      return { num: 6, name: 'Browser Rendering', color: '#ec4899' };
    return { num: 1, name: 'Network Request', color: '#3b82f6' };
  };

  const phase = getPhase();

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        color: '#e2e8f0',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        zIndex: 1000,
        boxShadow:
          '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 40px rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        minWidth: '280px',
      }}
    >
      {/* Phase indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: phase.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          {phase.num}
        </div>
        <span
          style={{
            fontSize: '11px',
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontWeight: 500,
          }}
        >
          {phase.name}
        </span>
      </div>

      <h3
        style={{
          margin: '0 0 10px 0',
          fontSize: '16px',
          fontWeight: 600,
          color: '#f8fafc',
        }}
      >
        Network Journey
      </h3>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: phase.color,
          }}
        />
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 500,
            color: '#cbd5e1',
          }}
        >
          {state}
        </p>
      </div>

      {/* Phase progress dots */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          marginTop: '12px',
          justifyContent: 'center',
        }}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background:
                n <= phase.num ? phase.color : 'rgba(148, 163, 184, 0.3)',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
