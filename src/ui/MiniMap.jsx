import { useScrollProgress } from '../stores/scrollStore';

const nodes = [
  { x: 10, y: 10, label: '💻', name: 'Laptop', progress: 0 },
  { x: 18, y: 12, label: '📡', name: 'Router', progress: 0.08 },
  { x: 26, y: 14, label: '🔄', name: 'NAT', progress: 0.13 },
  { x: 38, y: 18, label: '🏢', name: 'ISP', progress: 0.16 },
  { x: 52, y: 28, label: '🌊', name: 'Cable', progress: 0.20 },
  { x: 66, y: 34, label: '🔍', name: 'DNS', progress: 0.25 },
  { x: 75, y: 40, label: '🌐', name: 'CDN', progress: 0.30 },
  { x: 82, y: 48, label: '🤝', name: 'TCP', progress: 0.36 },
  { x: 88, y: 56, label: '🔒', name: 'SSL', progress: 0.46 },
  { x: 82, y: 64, label: '📄', name: 'HTTP', progress: 0.58 },
  { x: 55, y: 72, label: '🎨', name: 'Render', progress: 0.72 },
  { x: 30, y: 80, label: '🎮', name: 'GPU', progress: 0.88 },
  { x: 10, y: 88, label: '✅', name: 'Done', progress: 0.95 },
];

export default function MiniMap() {
  const progress = useScrollProgress();

  const getActiveNodeIndex = () => {
    for (let i = nodes.length - 1; i >= 0; i--) {
      if (progress >= nodes[i].progress) return i;
    }
    return 0;
  };

  const activeIndex = getActiveNodeIndex();

  const pathD = nodes
    .map((node, i) => `${i === 0 ? 'M' : 'L'} ${node.x} ${node.y}`)
    .join(' ');

  const getPathProgress = () => {
    if (activeIndex === 0) return 0;
    const prevNode = nodes[activeIndex];
    const nextNode = nodes[activeIndex + 1];
    if (!nextNode) return 1;
    const segmentProgress =
      (progress - prevNode.progress) / (nextNode.progress - prevNode.progress);
    return (activeIndex + segmentProgress) / (nodes.length - 1);
  };

  const handleNodeClick = (nodeProgress) => {
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: nodeProgress * docHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        width: '200px',
        height: '150px',
        /* Glassmorphism */
        background: 'rgba(6, 10, 20, 0.38)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.05)',
        padding: '12px',
        zIndex: 100,
        boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
      }}
    >
      {/* Inner glass sheen */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
        background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, transparent 60%)',
        borderRadius: '14px 14px 0 0',
        pointerEvents: 'none',
      }} />

      <div
        style={{
          fontSize: '9px',
          color: '#475569',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          fontFamily: '"SF Mono", ui-monospace, monospace',
        }}
      >
        Journey Map
      </div>

      <svg width="176" height="110" viewBox="0 0 100 100">
        <path
          d={pathD}
          fill="none"
          stroke="#334155"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d={pathD}
          fill="none"
          stroke="url(#minimap-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="300"
          strokeDashoffset={300 - getPathProgress() * 300}
          style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
        />

        <defs>
          <linearGradient
            id="minimap-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="33%" stopColor="#8b5cf6" />
            <stop offset="66%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>

        {nodes.map((node, i) => {
          const isActive = i <= activeIndex;
          const isCurrent = i === activeIndex;

          return (
            <g
              key={i}
              style={{ cursor: 'pointer' }}
              onClick={() => handleNodeClick(node.progress)}
            >
              {isCurrent && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={8}
                  fill="#3b82f6"
                  opacity={0.3}
                >
                  <animate
                    attributeName="r"
                    values="6;10;6"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.3;0.1;0.3"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              <circle
                cx={node.x}
                cy={node.y}
                r={isCurrent ? 5 : 4}
                fill={isActive ? '#22c55e' : '#475569'}
                stroke={isCurrent ? '#fff' : 'none'}
                strokeWidth={1}
                style={{ transition: 'all 0.3s' }}
              />

              <text
                x={node.x}
                y={node.y + 3}
                textAnchor="middle"
                fontSize="6"
                style={{ pointerEvents: 'none' }}
              >
                {node.label}
              </text>
            </g>
          );
        })}

        <circle
          cx={nodes[activeIndex].x}
          cy={nodes[activeIndex].y}
          r={2}
          fill="#fff"
        >
          <animate
            attributeName="opacity"
            values="1;0.5;1"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}
