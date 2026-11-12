import { Text, RoundedBox, Line, Edges } from '@react-three/drei';
import { forwardRef } from 'react';
import * as THREE from 'three';
import { MONO, accent } from '../theme/materials';
import { useTheme, THEMES } from '../theme/tokens';

// Browser rendering stages are monochrome: hierarchy is shown by shade and
// filled-vs-outlined, not by hue.
//   root -> filled with the line colour (inverted text)
//   mid  -> panel surface, bright outline
//   leaf -> body surface, muted outline, muted text
function tierStyle(theme, tier) {
  if (tier === 'root') {
    return { mat: null, fill: theme.line, text: theme.bg, edge: theme.line };
  }
  if (tier === 'mid') {
    return { mat: MONO.panel, fill: null, text: theme.text, edge: theme.line };
  }
  return {
    mat: MONO.body,
    fill: null,
    text: theme.textMuted,
    edge: theme.lineMuted,
  };
}

// Content drawn ON a lit "paper" surface (MONO.screen is white in both
// themes), so it always uses the light-theme ink/greys.
const PAPER = THEMES.light;

/**
 * DOM Tree visualization - shows HTML being parsed into DOM nodes
 */
export const DOMTree = forwardRef(({ position = [0, 0, 0] }, ref) => {
  const theme = useTheme();
  const nodePositions = [
    { pos: [0, 1.5, 0], label: 'document', tier: 'root' },
    { pos: [0, 0.8, 0], label: 'html', tier: 'root' },
    { pos: [-1, 0, 0], label: 'head', tier: 'mid' },
    { pos: [1, 0, 0], label: 'body', tier: 'mid' },
    { pos: [-1.5, -0.8, 0], label: 'title', tier: 'leaf' },
    { pos: [-0.5, -0.8, 0], label: 'link', tier: 'leaf' },
    { pos: [0.5, -0.8, 0], label: 'div', tier: 'leaf' },
    { pos: [1.5, -0.8, 0], label: 'script', tier: 'leaf' },
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
      <mesh position={[0, 0.3, -0.2]} material={MONO.panel}>
        <planeGeometry args={[5, 4]} />
        <Edges threshold={15} color={theme.line} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.25}
        color={theme.text}
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
          color={theme.lineMuted}
          lineWidth={2}
        />
      ))}

      {/* Tree nodes */}
      {nodePositions.map((node, i) => {
        const s = tierStyle(theme, node.tier);
        return (
          <group key={i} position={node.pos}>
            <mesh material={s.mat ?? undefined}>
              <boxGeometry args={[0.6, 0.35, 0.1]} />
              {!s.mat && (
                <meshStandardMaterial color={s.fill} roughness={0.9} />
              )}
              <Edges threshold={15} color={s.edge} />
            </mesh>
            <Text
              position={[0, 0, 0.06]}
              fontSize={0.12}
              color={s.text}
              anchorX="center"
            >
              {node.label}
            </Text>
          </group>
        );
      })}
    </group>
  );
});

/**
 * CSSOM Tree visualization
 */
export const CSSOMTree = forwardRef(({ position = [0, 0, 0] }, ref) => {
  const theme = useTheme();
  const nodePositions = [
    { pos: [0, 1.2, 0], label: 'stylesheet', tier: 'root' },
    { pos: [-1, 0.4, 0], label: 'body', tier: 'mid' },
    { pos: [1, 0.4, 0], label: '.container', tier: 'mid' },
    { pos: [-1.3, -0.4, 0], label: 'color', tier: 'leaf' },
    { pos: [-0.7, -0.4, 0], label: 'font', tier: 'leaf' },
    { pos: [0.7, -0.4, 0], label: 'display', tier: 'leaf' },
    { pos: [1.3, -0.4, 0], label: 'padding', tier: 'leaf' },
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
      <mesh position={[0, 0.4, -0.2]} material={MONO.panel}>
        <planeGeometry args={[4, 3]} />
        <Edges threshold={15} color={theme.line} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 1.8, 0]}
        fontSize={0.25}
        color={theme.text}
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
          color={theme.lineMuted}
          lineWidth={2}
        />
      ))}

      {/* Tree nodes */}
      {nodePositions.map((node, i) => {
        const s = tierStyle(theme, node.tier);
        return (
          <group key={i} position={node.pos}>
            <mesh material={s.mat ?? undefined}>
              <boxGeometry args={[0.55, 0.3, 0.1]} />
              {!s.mat && (
                <meshStandardMaterial color={s.fill} roughness={0.9} />
              )}
              <Edges threshold={15} color={s.edge} />
            </mesh>
            <Text
              position={[0, 0, 0.06]}
              fontSize={0.1}
              color={s.text}
              anchorX="center"
            >
              {node.label}
            </Text>
          </group>
        );
      })}
    </group>
  );
});

/**
 * Render Tree - combination of DOM + CSSOM
 */
export const RenderTree = forwardRef(({ position = [0, 0, 0] }, ref) => {
  const theme = useTheme();
  const root = tierStyle(theme, 'root');
  const mid = tierStyle(theme, 'mid');
  const leaf = tierStyle(theme, 'leaf');

  return (
    <group position={position} ref={ref}>
      {/* Background panel */}
      <mesh position={[0, 0, -0.2]} material={MONO.panel}>
        <planeGeometry args={[4, 3.5]} />
        <Edges threshold={15} color={theme.line} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 1.4, 0]}
        fontSize={0.25}
        color={theme.text}
        anchorX="center"
      >
        Render Tree
      </Text>

      {/* Combined visual */}
      <group position={[0, 0.3, 0]}>
        {/* Root */}
        <RoundedBox args={[1.2, 0.4, 0.1]} position={[0, 0.6, 0]} radius={0.05}>
          <meshStandardMaterial color={root.fill} roughness={0.9} />
        </RoundedBox>
        <Text
          position={[0, 0.6, 0.06]}
          fontSize={0.12}
          color={root.text}
          anchorX="center"
        >
          RenderView
        </Text>

        {/* Children */}
        <RoundedBox
          args={[1, 0.35, 0.1]}
          position={[-0.8, -0.1, 0]}
          radius={0.05}
          material={mid.mat}
        >
          <Edges threshold={15} color={mid.edge} />
        </RoundedBox>
        <Text
          position={[-0.8, -0.1, 0.06]}
          fontSize={0.1}
          color={mid.text}
          anchorX="center"
        >
          RenderBlock
        </Text>

        <RoundedBox
          args={[1, 0.35, 0.1]}
          position={[0.8, -0.1, 0]}
          radius={0.05}
          material={mid.mat}
        >
          <Edges threshold={15} color={mid.edge} />
        </RoundedBox>
        <Text
          position={[0.8, -0.1, 0.06]}
          fontSize={0.1}
          color={mid.text}
          anchorX="center"
        >
          RenderBlock
        </Text>

        {/* Leaf nodes */}
        <RoundedBox
          args={[0.7, 0.3, 0.1]}
          position={[-1.2, -0.7, 0]}
          radius={0.05}
          material={leaf.mat}
        >
          <Edges threshold={15} color={leaf.edge} />
        </RoundedBox>
        <Text
          position={[-1.2, -0.7, 0.06]}
          fontSize={0.08}
          color={leaf.text}
          anchorX="center"
        >
          RenderText
        </Text>

        <RoundedBox
          args={[0.7, 0.3, 0.1]}
          position={[0, -0.7, 0]}
          radius={0.05}
          material={leaf.mat}
        >
          <Edges threshold={15} color={leaf.edge} />
        </RoundedBox>
        <Text
          position={[0, -0.7, 0.06]}
          fontSize={0.08}
          color={leaf.text}
          anchorX="center"
        >
          RenderImage
        </Text>

        <RoundedBox
          args={[0.7, 0.3, 0.1]}
          position={[1.2, -0.7, 0]}
          radius={0.05}
          material={leaf.mat}
        >
          <Edges threshold={15} color={leaf.edge} />
        </RoundedBox>
        <Text
          position={[1.2, -0.7, 0.06]}
          fontSize={0.08}
          color={leaf.text}
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
  const theme = useTheme();
  return (
    <group position={position} ref={ref}>
      {/* Background panel */}
      <mesh position={[0, 0, -0.2]} material={MONO.panel}>
        <planeGeometry args={[4, 2.5]} />
        <Edges threshold={15} color={theme.line} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 1, 0]}
        fontSize={0.2}
        color={theme.text}
        anchorX="center"
      >
        JavaScript Engine
      </Text>

      {/* Pipeline stages: a light-to-dark shade ramp shows progression */}
      {[
        { x: -1.3, label: 'Parse', fill: theme.line, text: theme.bg },
        { x: -0.4, label: 'Compile', fill: theme.textMuted, text: theme.bg },
        { x: 0.5, label: 'Execute', fill: theme.lineMuted, text: theme.text },
        { x: 1.4, label: 'Hydrate', fill: theme.panel, text: theme.text },
      ].map((stage, i) => (
        <group key={i} position={[stage.x, 0.2, 0]}>
          <RoundedBox args={[0.7, 0.5, 0.1]} radius={0.05}>
            <meshStandardMaterial color={stage.fill} roughness={0.9} />
            <Edges threshold={15} color={theme.line} />
          </RoundedBox>
          <Text
            position={[0, 0, 0.06]}
            fontSize={0.1}
            color={stage.text}
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
          color={theme.textMuted}
          anchorX="center"
        >
          {'->'}
        </Text>
      ))}

      {/* Memory/Call Stack indicator */}
      <group position={[0, -0.5, 0]}>
        <mesh material={MONO.body}>
          <boxGeometry args={[2, 0.4, 0.1]} />
          <Edges threshold={15} color={theme.lineMuted} />
        </mesh>
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.1}
          color={theme.text}
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
  const theme = useTheme();
  return (
    <group position={position} ref={ref}>
      {/* Background */}
      <mesh position={[0, 0, -0.2]} material={MONO.panel}>
        <planeGeometry args={[4, 3]} />
        <Edges threshold={15} color={theme.line} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.2}
        color={theme.text}
        anchorX="center"
      >
        Layout (Reflow)
      </Text>

      {/* Boxes with dimensions */}
      <mesh position={[0, 0.3, 0]} material={MONO.wire}>
        <boxGeometry args={[2.5, 1.5, 0.05]} />
      </mesh>

      <mesh position={[-0.5, 0.5, 0]}>
        <boxGeometry args={[1, 0.6, 0.05]} />
        <meshStandardMaterial
          color={theme.lineMuted}
          roughness={0.9}
          transparent
          opacity={0.5}
        />
        <Edges threshold={15} color={theme.line} />
      </mesh>
      <Text
        position={[-0.5, 0.5, 0.05]}
        fontSize={0.08}
        color={theme.text}
        anchorX="center"
      >
        200x100px
      </Text>

      <mesh position={[0.6, 0.1, 0]}>
        <boxGeometry args={[1.2, 0.8, 0.05]} />
        <meshStandardMaterial
          color={theme.textMuted}
          roughness={0.9}
          transparent
          opacity={0.5}
        />
        <Edges threshold={15} color={theme.line} />
      </mesh>
      <Text
        position={[0.6, 0.1, 0.05]}
        fontSize={0.08}
        color={theme.text}
        anchorX="center"
      >
        300x150px
      </Text>

      {/* Coordinates */}
      <Text
        position={[-1.4, 0.9, 0]}
        fontSize={0.08}
        color={theme.textMuted}
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
  const theme = useTheme();
  return (
    <group position={position} ref={ref}>
      {/* Background - canvas (lit paper) */}
      <mesh position={[0, 0, -0.2]} material={MONO.screen}>
        <planeGeometry args={[4, 3]} />
        <Edges threshold={15} color={theme.line} />
      </mesh>

      {/* Paint strokes / pixels appearing (greys on paper) */}
      <group>
        {/* Header area */}
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[3.5, 0.5, 0.02]} />
          <meshStandardMaterial color={PAPER.browser} roughness={0.9} />
        </mesh>

        {/* Content blocks */}
        <mesh position={[-0.8, 0, 0]}>
          <boxGeometry args={[1.5, 1, 0.02]} />
          <meshStandardMaterial color={PAPER.body} roughness={0.9} />
        </mesh>

        <mesh position={[1, 0.1, 0]}>
          <boxGeometry args={[1.2, 0.8, 0.02]} />
          <meshStandardMaterial color={PAPER.panel} roughness={0.9} />
        </mesh>

        {/* Image placeholder */}
        <mesh position={[1, -0.5, 0]}>
          <boxGeometry args={[1, 0.6, 0.02]} />
          <meshStandardMaterial color={PAPER.lineMuted} roughness={0.9} />
        </mesh>
      </group>

      {/* Title (sits on the paper canvas) */}
      <Text
        position={[0, 1.3, 0]}
        fontSize={0.2}
        color={PAPER.text}
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
  const theme = useTheme();
  return (
    <group position={position} ref={ref}>
      {/* Monitor frame */}
      <RoundedBox
        args={[4.5, 3, 0.2]}
        radius={0.1}
        position={[0, 0, -0.2]}
        material={MONO.body}
      >
        <Edges threshold={15} color={theme.line} />
      </RoundedBox>

      {/* Screen */}
      <mesh position={[0, 0.1, 0]} material={MONO.screen}>
        <planeGeometry args={[4, 2.5]} />
      </mesh>

      {/* Google-like page (drawn on the lit screen) */}
      <group position={[0, 0.1, 0.01]}>
        {/* Logo placeholder */}
        <Text
          position={[0, 0.6, 0]}
          fontSize={0.4}
          color={PAPER.text}
          anchorX="center"
        >
          Google
        </Text>

        {/* Search bar */}
        <mesh position={[0, 0, 0]} material={MONO.screen}>
          <boxGeometry args={[2.5, 0.35, 0.01]} />
        </mesh>
        <RoundedBox
          args={[2.5, 0.35, 0.02]}
          radius={0.1}
          position={[0, 0, 0.01]}
          material={MONO.screen}
        >
          <Edges threshold={15} color={PAPER.textMuted} />
        </RoundedBox>

        {/* Buttons */}
        <mesh position={[-0.5, -0.5, 0]}>
          <boxGeometry args={[0.8, 0.25, 0.01]} />
          <meshStandardMaterial color={PAPER.body} roughness={0.9} />
        </mesh>
        <mesh position={[0.5, -0.5, 0]}>
          <boxGeometry args={[0.8, 0.25, 0.01]} />
          <meshStandardMaterial color={PAPER.body} roughness={0.9} />
        </mesh>
      </group>

      {/* Title */}
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.2}
        color={theme.text}
        anchorX="center"
      >
        OK - Page Rendered!
      </Text>
    </group>
  );
});

/**
 * Network Waterfall Timeline - shows timing of network requests
 */
export const NetworkWaterfall = forwardRef(({ position = [0, 0, 0] }, ref) => {
  const theme = useTheme();
  // Bars use the accent of the network layer each phase belongs to.
  const requests = [
    { label: 'DNS Lookup', start: 0, duration: 0.8, layer: 'application' },
    { label: 'TCP Connect', start: 0.8, duration: 0.6, layer: 'transport' },
    { label: 'SSL/TLS', start: 1.4, duration: 0.7, layer: 'security' },
    { label: 'Request', start: 2.1, duration: 0.3, layer: 'application' },
    // Waiting = idle time on the wire, so drawn dimmer (no glow)
    {
      label: 'Waiting (TTFB)',
      start: 2.4,
      duration: 1.0,
      layer: 'application',
      intensity: 0.5,
    },
    { label: 'Download HTML', start: 3.4, duration: 0.5, layer: 'application' },
    { label: 'Download CSS', start: 3.6, duration: 0.4, layer: 'application' },
    { label: 'Download JS', start: 3.7, duration: 0.6, layer: 'application' },
  ];

  const totalWidth = 4.5;
  const totalTime = 4.5;
  const barHeight = 0.25;
  const rowHeight = 0.4;

  return (
    <group position={position} ref={ref}>
      {/* Background panel */}
      <mesh position={[0.5, -0.8, -0.2]} material={MONO.panel}>
        <planeGeometry args={[6, 4.5]} />
        <Edges threshold={15} color={theme.line} />
      </mesh>

      {/* Title */}
      <Text
        position={[0.5, 1.2, 0]}
        fontSize={0.22}
        color={theme.text}
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
        color={theme.lineMuted}
        lineWidth={1}
      />
      {[0, 1, 2, 3, 4].map((t) => (
        <group key={t} position={[-1.5 + (t / totalTime) * totalWidth, 0.8, 0]}>
          <mesh>
            <boxGeometry args={[0.02, 0.1, 0.01]} />
            <meshBasicMaterial color={theme.lineMuted} />
          </mesh>
          <Text
            position={[0, 0.15, 0]}
            fontSize={0.1}
            color={theme.textMuted}
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
              color={theme.text}
              anchorX="left"
            >
              {req.label}
            </Text>

            {/* Bar */}
            <mesh
              position={[x + width / 2, y, 0]}
              material={accent(req.layer, req.intensity ?? 1.2)}
            >
              <boxGeometry args={[width, barHeight, 0.05]} />
            </mesh>

            {/* Duration label */}
            <Text
              position={[x + width + 0.1, y, 0]}
              fontSize={0.08}
              color={theme.textMuted}
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
        color={theme.textMuted}
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
    const theme = useTheme();
    // Emoji icons replaced by ASCII step numbers (3D font is Latin-only)
    const stages = [
      { label: 'Layer\nComposition', icon: '1' },
      { label: 'Tile\nRasterization', icon: '2' },
      { label: 'Texture\nUpload', icon: '3' },
      { label: 'Draw\nCalls', icon: '4' },
      { label: 'Frame\nBuffer', icon: '5' },
    ];

    const stageWidth = 0.9;
    const gap = 0.15;
    const totalWidth = stages.length * (stageWidth + gap) - gap;
    const startX = -totalWidth / 2 + stageWidth / 2;

    return (
      <group position={position} ref={ref}>
        {/* Background panel */}
        <mesh position={[0, 0, -0.2]} material={MONO.panel}>
          <planeGeometry args={[6, 3]} />
        </mesh>

        {/* Title */}
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.2}
          color={theme.text}
          anchorX="center"
        >
          GPU Rendering Pipeline
        </Text>

        {/* GPU chip visual */}
        <RoundedBox
          args={[5.5, 2, 0.1]}
          radius={0.1}
          position={[0, -0.1, -0.1]}
          material={MONO.body}
        >
          <Edges threshold={15} color={theme.line} />
        </RoundedBox>

        {/* Pipeline stages */}
        {stages.map((stage, i) => {
          const x = startX + i * (stageWidth + gap);
          return (
            <group key={i} position={[x, 0, 0]}>
              {/* Stage box */}
              <RoundedBox
                args={[stageWidth, 1.2, 0.15]}
                radius={0.08}
                material={MONO.panel}
              >
                <Edges threshold={15} color={theme.line} />
              </RoundedBox>

              {/* Icon (step number) */}
              <Text
                position={[0, 0.25, 0.1]}
                fontSize={0.25}
                color={theme.textMuted}
                anchorX="center"
                anchorY="middle"
              >
                {stage.icon}
              </Text>

              {/* Label */}
              <Text
                position={[0, -0.2, 0.1]}
                fontSize={0.09}
                color={theme.text}
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
                  color={theme.textMuted}
                  anchorX="center"
                >
                  {'->'}
                </Text>
              )}
            </group>
          );
        })}

        {/* FPS indicator (filled = final/active state) */}
        <group position={[0, -1.1, 0]}>
          <RoundedBox args={[1.5, 0.35, 0.05]} radius={0.05}>
            <meshStandardMaterial color={theme.line} roughness={0.9} />
          </RoundedBox>
          <Text
            position={[0, 0, 0.05]}
            fontSize={0.12}
            color={theme.bg}
            anchorX="center"
          >
            60 FPS OK
          </Text>
        </group>
      </group>
    );
  },
);
