import { Text, RoundedBox, Line } from '@react-three/drei';
import { forwardRef } from 'react';
import * as THREE from 'three';

/**
 * DOM Tree visualization - shows HTML being parsed into DOM nodes
 */
export const DOMTree = forwardRef(({ position = [0, 0, 0] }, ref) => {
  const nodePositions = [
    { pos: [0, 1.5, 0], label: 'document', color: '#f97316' },
    { pos: [0, 0.8, 0], label: 'html', color: '#ea580c' },
    { pos: [-1, 0, 0], label: 'head', color: '#fb923c' },
    { pos: [1, 0, 0], label: 'body', color: '#fb923c' },
    { pos: [-1.5, -0.8, 0], label: 'title', color: '#fdba74' },
    { pos: [-0.5, -0.8, 0], label: 'link', color: '#fdba74' },
    { pos: [0.5, -0.8, 0], label: 'div', color: '#fdba74' },
    { pos: [1.5, -0.8, 0], label: 'script', color: '#fdba74' },
  ];

  const connections = [
    [
      [0, 1.5, 0],
      [0, 0.8, 0],
    ],
    [
      [0, 0.8, 0],
      [-1, 0, 0],
    ],
    [
      [0, 0.8, 0],
      [1, 0, 0],
    ],
    [
      [-1, 0, 0],
      [-1.5, -0.8, 0],
    ],
    [
      [-1, 0, 0],
      [-0.5, -0.8, 0],
    ],
    [
      [1, 0, 0],
      [0.5, -0.8, 0],
    ],
    [
      [1, 0, 0],
      [1.5, -0.8, 0],
    ],
  ];

  return (
    <group position={position} ref={ref}>
      {/* Background panel */}
      <mesh position={[0, 0.3, -0.2]}>
        <planeGeometry args={[5, 4]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.9} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.25}
        color="#c2410c"
        anchorX="center"
      >
        DOM Tree
      </Text>

      {/* Tree connections */}
      {connections.map((conn, i) => (
        <Line
          key={i}
          points={[
            new THREE.Vector3(...conn[0]),
            new THREE.Vector3(...conn[1]),
          ]}
          color="#fdba74"
          lineWidth={2}
        />
      ))}

      {/* Tree nodes */}
      {nodePositions.map((node, i) => (
        <group key={i} position={node.pos}>
          <mesh>
            <boxGeometry args={[0.6, 0.35, 0.1]} />
            <meshStandardMaterial color={node.color} />
          </mesh>
          <Text
            position={[0, 0, 0.06]}
            fontSize={0.12}
            color="#ffffff"
            anchorX="center"
          >
            {node.label}
          </Text>
        </group>
      ))}
    </group>
  );
});

/**
 * CSSOM Tree visualization
 */
export const CSSOMTree = forwardRef(({ position = [0, 0, 0] }, ref) => {
  const nodePositions = [
    { pos: [0, 1.2, 0], label: 'stylesheet', color: '#3b82f6' },
    { pos: [-1, 0.4, 0], label: 'body', color: '#60a5fa' },
    { pos: [1, 0.4, 0], label: '.container', color: '#60a5fa' },
    { pos: [-1.3, -0.4, 0], label: 'color', color: '#93c5fd' },
    { pos: [-0.7, -0.4, 0], label: 'font', color: '#93c5fd' },
    { pos: [0.7, -0.4, 0], label: 'display', color: '#93c5fd' },
    { pos: [1.3, -0.4, 0], label: 'padding', color: '#93c5fd' },
  ];

  const connections = [
    [
      [0, 1.2, 0],
      [-1, 0.4, 0],
    ],
    [
      [0, 1.2, 0],
      [1, 0.4, 0],
    ],
    [
      [-1, 0.4, 0],
      [-1.3, -0.4, 0],
    ],
    [
      [-1, 0.4, 0],
      [-0.7, -0.4, 0],
    ],
    [
      [1, 0.4, 0],
      [0.7, -0.4, 0],
    ],
    [
      [1, 0.4, 0],
      [1.3, -0.4, 0],
    ],
  ];

  return (
    <group position={position} ref={ref}>
      {/* Background panel */}
      <mesh position={[0, 0.4, -0.2]}>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color="#eff6ff" transparent opacity={0.9} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 1.8, 0]}
        fontSize={0.25}
        color="#1d4ed8"
        anchorX="center"
        style={{ marginTop: '10px' }}
      >
        CSSOM
      </Text>

      {/* Tree connections */}
      {connections.map((conn, i) => (
        <Line
          key={i}
          points={[
            new THREE.Vector3(...conn[0]),
            new THREE.Vector3(...conn[1]),
          ]}
          color="#93c5fd"
          lineWidth={2}
        />
      ))}

      {/* Tree nodes */}
      {nodePositions.map((node, i) => (
        <group key={i} position={node.pos}>
          <mesh>
            <boxGeometry args={[0.55, 0.3, 0.1]} />
            <meshStandardMaterial color={node.color} />
          </mesh>
          <Text
            position={[0, 0, 0.06]}
            fontSize={0.1}
            color="#ffffff"
            anchorX="center"
          >
            {node.label}
          </Text>
        </group>
      ))}
    </group>
  );
});

/**
 * Render Tree - combination of DOM + CSSOM
 */
export const RenderTree = forwardRef(({ position = [0, 0, 0] }, ref) => {
  return (
    <group position={position} ref={ref}>
      {/* Background panel */}
      <mesh position={[0, 0, -0.2]}>
        <planeGeometry args={[4, 3.5]} />
        <meshStandardMaterial color="#f0fdf4" transparent opacity={0.9} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 1.4, 0]}
        fontSize={0.25}
        color="#15803d"
        anchorX="center"
      >
        Render Tree
      </Text>

      {/* Combined visual */}
      <group position={[0, 0.3, 0]}>
        {/* Root */}
        <RoundedBox args={[1.2, 0.4, 0.1]} position={[0, 0.6, 0]} radius={0.05}>
          <meshStandardMaterial color="#22c55e" />
        </RoundedBox>
        <Text
          position={[0, 0.6, 0.06]}
          fontSize={0.12}
          color="#fff"
          anchorX="center"
        >
          RenderView
        </Text>

        {/* Children */}
        <RoundedBox
          args={[1, 0.35, 0.1]}
          position={[-0.8, -0.1, 0]}
          radius={0.05}
        >
          <meshStandardMaterial color="#4ade80" />
        </RoundedBox>
        <Text
          position={[-0.8, -0.1, 0.06]}
          fontSize={0.1}
          color="#fff"
          anchorX="center"
        >
          RenderBlock
        </Text>

        <RoundedBox
          args={[1, 0.35, 0.1]}
          position={[0.8, -0.1, 0]}
          radius={0.05}
        >
          <meshStandardMaterial color="#4ade80" />
        </RoundedBox>
        <Text
          position={[0.8, -0.1, 0.06]}
          fontSize={0.1}
          color="#fff"
          anchorX="center"
        >
          RenderBlock
        </Text>

        {/* Leaf nodes */}
        <RoundedBox
          args={[0.7, 0.3, 0.1]}
          position={[-1.2, -0.7, 0]}
          radius={0.05}
        >
          <meshStandardMaterial color="#86efac" />
        </RoundedBox>
        <Text
          position={[-1.2, -0.7, 0.06]}
          fontSize={0.08}
          color="#166534"
          anchorX="center"
        >
          RenderText
        </Text>

        <RoundedBox
          args={[0.7, 0.3, 0.1]}
          position={[0, -0.7, 0]}
          radius={0.05}
        >
          <meshStandardMaterial color="#86efac" />
        </RoundedBox>
        <Text
          position={[0, -0.7, 0.06]}
          fontSize={0.08}
          color="#166534"
          anchorX="center"
        >
          RenderImage
        </Text>

        <RoundedBox
          args={[0.7, 0.3, 0.1]}
          position={[1.2, -0.7, 0]}
          radius={0.05}
        >
          <meshStandardMaterial color="#86efac" />
        </RoundedBox>
        <Text
          position={[1.2, -0.7, 0.06]}
          fontSize={0.08}
          color="#166534"
          anchorX="center"
        >
          RenderText
        </Text>
      </group>
    </group>
  );
});

/**
 * JavaScript Engine visualization
 */
export const JSEngine = forwardRef(({ position = [0, 0, 0] }, ref) => {
  return (
    <group position={position} ref={ref}>
      {/* Background panel */}
      <mesh position={[0, 0, -0.2]}>
        <planeGeometry args={[4, 2.5]} />
        <meshStandardMaterial color="#fefce8" transparent opacity={0.9} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 1, 0]}
        fontSize={0.2}
        color="#a16207"
        anchorX="center"
      >
        JavaScript Engine
      </Text>

      {/* Pipeline stages */}
      {[
        { x: -1.3, label: 'Parse', color: '#eab308' },
        { x: -0.4, label: 'Compile', color: '#ca8a04' },
        { x: 0.5, label: 'Execute', color: '#a16207' },
        { x: 1.4, label: 'Hydrate', color: '#854d0e' },
      ].map((stage, i) => (
        <group key={i} position={[stage.x, 0.2, 0]}>
          <RoundedBox args={[0.7, 0.5, 0.1]} radius={0.05}>
            <meshStandardMaterial color={stage.color} />
          </RoundedBox>
          <Text
            position={[0, 0, 0.06]}
            fontSize={0.1}
            color="#fff"
            anchorX="center"
          >
            {stage.label}
          </Text>
        </group>
      ))}

      {/* Arrows between stages */}
      {[-0.85, 0.05, 0.95].map((x, i) => (
        <Text
          key={i}
          position={[x, 0.2, 0.1]}
          fontSize={0.2}
          color="#ca8a04"
          anchorX="center"
        >
          →
        </Text>
      ))}

      {/* Memory/Call Stack indicator */}
      <group position={[0, -0.5, 0]}>
        <mesh>
          <boxGeometry args={[2, 0.4, 0.1]} />
          <meshStandardMaterial color="#fde047" />
        </mesh>
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.1}
          color="#713f12"
          anchorX="center"
        >
          Call Stack & Memory
        </Text>
      </group>
    </group>
  );
});

/**
 * Layout calculation visualization
 */
export const LayoutStage = forwardRef(({ position = [0, 0, 0] }, ref) => {
  return (
    <group position={position} ref={ref}>
      {/* Background */}
      <mesh position={[0, 0, -0.2]}>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color="#fdf4ff" transparent opacity={0.9} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.2}
        color="#a21caf"
        anchorX="center"
      >
        Layout (Reflow)
      </Text>

      {/* Boxes with dimensions */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2.5, 1.5, 0.05]} />
        <meshStandardMaterial
          color="#e879f9"
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>

      <mesh position={[-0.5, 0.5, 0]}>
        <boxGeometry args={[1, 0.6, 0.05]} />
        <meshStandardMaterial color="#d946ef" transparent opacity={0.5} />
      </mesh>
      <Text
        position={[-0.5, 0.5, 0.05]}
        fontSize={0.08}
        color="#701a75"
        anchorX="center"
      >
        200x100px
      </Text>

      <mesh position={[0.6, 0.1, 0]}>
        <boxGeometry args={[1.2, 0.8, 0.05]} />
        <meshStandardMaterial color="#c026d3" transparent opacity={0.5} />
      </mesh>
      <Text
        position={[0.6, 0.1, 0.05]}
        fontSize={0.08}
        color="#701a75"
        anchorX="center"
      >
        300x150px
      </Text>

      {/* Coordinates */}
      <Text
        position={[-1.4, 0.9, 0]}
        fontSize={0.08}
        color="#86198f"
        anchorX="left"
      >
        x: 0, y: 0
      </Text>
    </group>
  );
});

/**
 * Paint stage visualization
 */
export const PaintStage = forwardRef(({ position = [0, 0, 0] }, ref) => {
  return (
    <group position={position} ref={ref}>
      {/* Background - canvas */}
      <mesh position={[0, 0, -0.2]}>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Paint strokes / pixels appearing */}
      <group>
        {/* Header area */}
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[3.5, 0.5, 0.02]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>

        {/* Content blocks */}
        <mesh position={[-0.8, 0, 0]}>
          <boxGeometry args={[1.5, 1, 0.02]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>

        <mesh position={[1, 0.1, 0]}>
          <boxGeometry args={[1.2, 0.8, 0.02]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>

        {/* Image placeholder */}
        <mesh position={[1, -0.5, 0]}>
          <boxGeometry args={[1, 0.6, 0.02]} />
          <meshStandardMaterial color="#94a3b8" />
        </mesh>
      </group>

      {/* Title */}
      <Text
        position={[0, 1.3, 0]}
        fontSize={0.2}
        color="#0f172a"
        anchorX="center"
      >
        Paint
      </Text>
    </group>
  );
});

/**
 * Final Composite/Display
 */
export const CompositeStage = forwardRef(({ position = [0, 0, 0] }, ref) => {
  return (
    <group position={position} ref={ref}>
      {/* Monitor frame */}
      <RoundedBox args={[4.5, 3, 0.2]} radius={0.1} position={[0, 0, -0.2]}>
        <meshStandardMaterial color="#1e293b" />
      </RoundedBox>

      {/* Screen */}
      <mesh position={[0, 0.1, 0]}>
        <planeGeometry args={[4, 2.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Google-like page */}
      <group position={[0, 0.1, 0.01]}>
        {/* Logo placeholder */}
        <Text
          position={[0, 0.6, 0]}
          fontSize={0.4}
          color="#4285f4"
          anchorX="center"
        >
          Google
        </Text>

        {/* Search bar */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[2.5, 0.35, 0.01]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
        <RoundedBox
          args={[2.5, 0.35, 0.02]}
          radius={0.1}
          position={[0, 0, 0.01]}
        >
          <meshStandardMaterial color="#e2e8f0" />
        </RoundedBox>

        {/* Buttons */}
        <mesh position={[-0.5, -0.5, 0]}>
          <boxGeometry args={[0.8, 0.25, 0.01]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
        <mesh position={[0.5, -0.5, 0]}>
          <boxGeometry args={[0.8, 0.25, 0.01]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
      </group>

      {/* Title */}
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.2}
        color="#22c55e"
        anchorX="center"
      >
        ✓ Page Rendered!
      </Text>
    </group>
  );
});

/**
 * Network Waterfall Timeline - shows timing of network requests
 */
export const NetworkWaterfall = forwardRef(({ position = [0, 0, 0] }, ref) => {
  const requests = [
    { label: 'DNS Lookup', start: 0, duration: 0.8, color: '#8b5cf6' },
    { label: 'TCP Connect', start: 0.8, duration: 0.6, color: '#f97316' },
    { label: 'SSL/TLS', start: 1.4, duration: 0.7, color: '#06b6d4' },
    { label: 'Request', start: 2.1, duration: 0.3, color: '#3b82f6' },
    { label: 'Waiting (TTFB)', start: 2.4, duration: 1.0, color: '#22c55e' },
    { label: 'Download HTML', start: 3.4, duration: 0.5, color: '#10b981' },
    { label: 'Download CSS', start: 3.6, duration: 0.4, color: '#3b82f6' },
    { label: 'Download JS', start: 3.7, duration: 0.6, color: '#eab308' },
  ];

  const totalWidth = 4.5;
  const totalTime = 4.5;
  const barHeight = 0.25;
  const rowHeight = 0.4;

  return (
    <group position={position} ref={ref}>
      {/* Background panel */}
      <mesh position={[0.5, -0.8, -0.2]}>
        <planeGeometry args={[6, 4.5]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.95} />
      </mesh>

      {/* Title */}
      <Text
        position={[0.5, 1.2, 0]}
        fontSize={0.22}
        color="#94a3b8"
        anchorX="center"
      >
        Network Waterfall
      </Text>

      {/* Time axis */}
      <Line
        points={[
          new THREE.Vector3(-1.5, 0.8, 0),
          new THREE.Vector3(3.2, 0.8, 0),
        ]}
        color="#cbd5e1"
        lineWidth={1}
      />
      {[0, 1, 2, 3, 4].map((t) => (
        <group key={t} position={[-1.5 + (t / totalTime) * totalWidth, 0.8, 0]}>
          <mesh>
            <boxGeometry args={[0.02, 0.1, 0.01]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
          <Text
            position={[0, 0.15, 0]}
            fontSize={0.1}
            color="#64748b"
            anchorX="center"
          >
            {t}s
          </Text>
        </group>
      ))}

      {/* Request bars */}
      {requests.map((req, i) => {
        const x = -1.5 + (req.start / totalTime) * totalWidth;
        const width = (req.duration / totalTime) * totalWidth;
        const y = 0.5 - i * rowHeight;

        return (
          <group key={i}>
            {/* Label */}
            <Text
              position={[-2.2, y, 0]}
              fontSize={0.1}
              color="#475569"
              anchorX="left"
            >
              {req.label}
            </Text>

            {/* Bar */}
            <mesh position={[x + width / 2, y, 0]}>
              <boxGeometry args={[width, barHeight, 0.05]} />
              <meshStandardMaterial color={req.color} />
            </mesh>

            {/* Duration label */}
            <Text
              position={[x + width + 0.1, y, 0]}
              fontSize={0.08}
              color="#64748b"
              anchorX="left"
            >
              {(req.duration * 1000).toFixed(0)}ms
            </Text>
          </group>
        );
      })}

      {/* Total time indicator */}
      <Text
        position={[0.5, -2.8, 0]}
        fontSize={0.12}
        color="#64748b"
        anchorX="center"
      >
        Total: 4.3s | DOMContentLoaded: 3.9s
      </Text>
    </group>
  );
});

/**
 * GPU Rendering Pipeline - shows GPU processing stages
 */
export const GPURenderingPipeline = forwardRef(
  ({ position = [0, 0, 0] }, ref) => {
    const stages = [
      { label: 'Layer\nComposition', color: '#8b5cf6', icon: '📦' },
      { label: 'Tile\nRasterization', color: '#3b82f6', icon: '🔲' },
      { label: 'Texture\nUpload', color: '#06b6d4', icon: '📤' },
      { label: 'Draw\nCalls', color: '#10b981', icon: '✏️' },
      { label: 'Frame\nBuffer', color: '#22c55e', icon: '🖼️' },
    ];

    const stageWidth = 0.9;
    const gap = 0.15;
    const totalWidth = stages.length * (stageWidth + gap) - gap;
    const startX = -totalWidth / 2 + stageWidth / 2;

    return (
      <group position={position} ref={ref}>
        {/* Background panel */}
        <mesh position={[0, 0, -0.2]}>
          <planeGeometry args={[6, 3]} />
          <meshStandardMaterial color="#0f172a" transparent opacity={0.95} />
        </mesh>

        {/* Title */}
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.2}
          color="#22c55e"
          anchorX="center"
        >
          GPU Rendering Pipeline
        </Text>

        {/* GPU chip visual */}
        <RoundedBox
          args={[5.5, 2, 0.1]}
          radius={0.1}
          position={[0, -0.1, -0.1]}
        >
          <meshStandardMaterial
            color="#1e293b"
            metalness={0.3}
            roughness={0.7}
          />
        </RoundedBox>

        {/* Pipeline stages */}
        {stages.map((stage, i) => {
          const x = startX + i * (stageWidth + gap);
          return (
            <group key={i} position={[x, 0, 0]}>
              {/* Stage box */}
              <RoundedBox args={[stageWidth, 1.2, 0.15]} radius={0.08}>
                <meshStandardMaterial color={stage.color} />
              </RoundedBox>

              {/* Icon */}
              <Text
                position={[0, 0.25, 0.1]}
                fontSize={0.25}
                anchorX="center"
                anchorY="middle"
              >
                {stage.icon}
              </Text>

              {/* Label */}
              <Text
                position={[0, -0.2, 0.1]}
                fontSize={0.09}
                color="#ffffff"
                anchorX="center"
                textAlign="center"
              >
                {stage.label}
              </Text>

              {/* Arrow to next stage */}
              {i < stages.length - 1 && (
                <Text
                  position={[stageWidth / 2 + gap / 2, 0, 0.1]}
                  fontSize={0.2}
                  color="#4ade80"
                  anchorX="center"
                >
                  →
                </Text>
              )}
            </group>
          );
        })}

        {/* FPS indicator */}
        <group position={[0, -1.1, 0]}>
          <RoundedBox args={[1.5, 0.35, 0.05]} radius={0.05}>
            <meshStandardMaterial color="#22c55e" />
          </RoundedBox>
          <Text
            position={[0, 0, 0.05]}
            fontSize={0.12}
            color="#ffffff"
            anchorX="center"
          >
            60 FPS ✓
          </Text>
        </group>
      </group>
    );
  },
);
