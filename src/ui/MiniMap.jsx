import { useState, useEffect } from 'react';

const nodes = [
  { x: 10, y: 15, label: '💻', name: 'Laptop', progress: 0 },
  { x: 20, y: 15, label: '📡', name: 'Router', progress: 0.08 },
  { x: 30, y: 15, label: '🔄', name: 'NAT', progress: 0.12 },
  { x: 45, y: 20, label: '🏢', name: 'ISP', progress: 0.18 },
  { x: 60, y: 30, label: '🌊', name: 'Cable', progress: 0.22 },
  { x: 75, y: 35, label: '🔍', name: 'DNS', progress: 0.28 },
  { x: 90, y: 45, label: '⚖️', name: 'LB', progress: 0.35 },
  { x: 90, y: 60, label: '🖥️', name: 'Server', progress: 0.45 },
  { x: 75, y: 70, label: '🔒', name: 'SSL', progress: 0.56 },
  { x: 55, y: 75, label: '📄', name: 'HTTP', progress: 0.65 },
  { x: 30, y: 80, label: '🎨', name: 'Render', progress: 0.8 },
  { x: 10, y: 85, label: '✅', name: 'Done', progress: 0.95 },
];

export default function MiniMap() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getActiveNodeIndex = () => {
    for (let i = nodes.length - 1; i >= 0; i--) {
      if (progress >= nodes[i].progress) return i;
    }
    return 0;
  };

  const activeIndex = getActiveNodeIndex();

  // Generate SVG path through all nodes
  const pathD = nodes
    .map((node, i) => `${i === 0 ? 'M' : 'L'} ${node.x} ${node.y}`)
    .join(' ');

  // Calculate path length for animation
  const getPathProgress = () => {
    if (activeIndex === 0)
      return (progress / nodes[0].progress) * (1 / nodes.length);

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
        height: '140px',
        background: 'rgba(15, 23, 42, 0.95)',
        borderRadius: '12px',
        border: '1px solid #334155',
        padding: '12px',
        zIndex: 100,
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          fontSize: '10px',
          color: '#64748b',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}
      >
        Journey Map
      </div>

      <svg width="176" height="100" viewBox="0 0 100 100">
        {/* Background path */}
        <path
          d={pathD}
          fill="none"
          stroke="#334155"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Animated progress path */}
        <path
          d={pathD}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="300"
          strokeDashoffset={300 - getPathProgress() * 300}
          style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>

        {/* Nodes */}
        {nodes.map((node, i) => {
          const isActive = i <= activeIndex;
          const isCurrent = i === activeIndex;

          return (
            <g
              key={i}
              style={{ cursor: 'pointer' }}
              onClick={() => handleNodeClick(node.progress)}
            >
              {/* Glow effect for current node */}
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

              {/* Node circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isCurrent ? 5 : 4}
                fill={isActive ? '#22c55e' : '#475569'}
                stroke={isCurrent ? '#fff' : 'none'}
                strokeWidth={1}
                style={{ transition: 'all 0.3s' }}
              />

              {/* Node emoji */}
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

        {/* Current position indicator - moving dot */}
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
