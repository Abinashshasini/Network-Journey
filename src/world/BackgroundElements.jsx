import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line } from '@react-three/drei';
import { useTheme } from '../theme/tokens';

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Mono dust / star field — a single cheap Points cloud, theme-tinted.
 */
function StarField({ count = 800 }) {
  const theme = useTheme();
  const pointsRef = useRef();
  const n = Math.min(count, 1200);

  const stars = useMemo(() => {
    const positions = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const theta = seededRandom(i * 3 + 100) * Math.PI * 2;
      const phi = seededRandom(i * 3 + 200) * Math.PI;
      const radius = 80 + seededRandom(i * 3 + 300) * 40;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return positions;
  }, [n]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
  });

  return (
    <Points ref={pointsRef} positions={stars} stride={3}>
      <PointMaterial
        transparent
        color={theme.textMuted}
        size={0.15}
        sizeAttenuation
        depthWrite={false}
        opacity={theme.name === 'light' ? 0.35 : 0.7}
      />
    </Points>
  );
}

/**
 * Grid floor — mono, theme-aware.
 */
function GridFloor() {
  const theme = useTheme();
  const gridLines = useMemo(() => {
    const lines = [];
    const size = 100;
    const divisions = 40;
    const step = size / divisions;
    const halfSize = size / 2;

    for (let i = 0; i <= divisions; i++) {
      const pos = -halfSize + i * step;
      lines.push([
        [-halfSize - 10, -5, pos - 20],
        [halfSize + 30, -5, pos - 20],
      ]);
      lines.push([
        [pos, -5, -halfSize - 20],
        [pos, -5, halfSize - 20],
      ]);
    }
    return lines;
  }, []);

  // One segmented Line (single draw call) instead of one Line per grid line.
  const segmentPoints = useMemo(() => gridLines.flat(), [gridLines]);

  return (
    <Line
      points={segmentPoints}
      segments
      color={theme.lineMuted}
      lineWidth={0.5}
      opacity={0.3}
      transparent
    />
  );
}

/**
 * Background: calm, mono, cheap.
 */
export default function BackgroundElements() {
  return (
    <group>
      <StarField count={800} />
      <GridFloor />
    </group>
  );
}
