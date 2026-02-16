import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Line } from '@react-three/drei';
import * as THREE from 'three';

// Seeded random function for deterministic results
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Animated floating particles throughout the scene
 */
function FloatingParticles({ count = 500, color = '#3b82f6' }) {
  const pointsRef = useRef();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (seededRandom(i * 3 + 1) - 0.5) * 80 - 5;
      positions[i * 3 + 1] = (seededRandom(i * 3 + 2) - 0.5) * 30;
      positions[i * 3 + 2] = (seededRandom(i * 3 + 3) - 0.5) * 40 - 10;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime * 0.1;
    pointsRef.current.rotation.y = time * 0.05;
    pointsRef.current.rotation.x = Math.sin(time * 0.2) * 0.02;
  });

  return (
    <Points ref={pointsRef} positions={particles} stride={3}>
      <PointMaterial
        transparent
        color={color}
        size={0.08}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

/**
 * Star field background
 */
function StarField({ count = 1000 }) {
  const pointsRef = useRef();

  const stars = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = seededRandom(i * 3 + 100) * Math.PI * 2;
      const phi = seededRandom(i * 3 + 200) * Math.PI;
      const radius = 80 + seededRandom(i * 3 + 300) * 40;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
  });

  return (
    <Points ref={pointsRef} positions={stars} stride={3}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.15}
        sizeAttenuation
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

/**
 * Grid floor for depth perception
 */
function GridFloor() {
  const gridLines = useMemo(() => {
    const lines = [];
    const size = 100;
    const divisions = 40;
    const step = size / divisions;
    const halfSize = size / 2;

    // Create grid lines
    for (let i = 0; i <= divisions; i++) {
      const pos = -halfSize + i * step;
      // X-axis lines
      lines.push([
        [-halfSize - 10, -5, pos - 20],
        [halfSize + 30, -5, pos - 20],
      ]);
      // Z-axis lines
      lines.push([
        [pos, -5, -halfSize - 20],
        [pos, -5, halfSize - 20],
      ]);
    }
    return lines;
  }, []);

  return (
    <group>
      {gridLines.map((points, i) => (
        <Line
          key={i}
          points={points}
          color="#1e3a5f"
          lineWidth={0.5}
          opacity={0.3}
          transparent
        />
      ))}
    </group>
  );
}

/**
 * Glowing orbs at key points
 */
function GlowingOrb({
  position,
  color = '#3b82f6',
  size = 0.5,
  pulseSpeed = 1,
}) {
  const meshRef = useRef();
  const lightRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const pulse = Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.2 + 0.8;
    meshRef.current.scale.setScalar(pulse);
    if (lightRef.current) {
      lightRef.current.intensity = pulse * 2;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      <pointLight ref={lightRef} color={color} intensity={1} distance={8} />
    </group>
  );
}

/**
 * Data stream lines (animated dashes)
 */
function DataStream({ start, end, color = '#60a5fa' }) {
  const lineRef = useRef();

  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  }, [start, end]);

  useFrame((state) => {
    if (!lineRef.current) return;
    lineRef.current.material.dashOffset = -state.clock.elapsedTime * 2;
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={2}
      dashed
      dashSize={0.3}
      dashScale={1}
      gapSize={0.2}
      transparent
      opacity={0.6}
    />
  );
}

/**
 * Ambient data particles that flow through the scene
 */
function DataParticles({ count = 100 }) {
  const pointsRef = useRef();

  const { particles, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const vels = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (seededRandom(i * 3 + 500) - 0.5) * 60;
      positions[i * 3 + 1] = seededRandom(i * 3 + 600) * 10 - 2;
      positions[i * 3 + 2] = (seededRandom(i * 3 + 700) - 0.5) * 20;
      vels.push(0.02 + seededRandom(i + 800) * 0.05);
    }
    return { particles: positions, velocities: vels };
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const positions = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      positions[i * 3] += velocities[i];
      if (positions[i * 3] > 50) {
        positions[i * 3] = -30;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={particles} stride={3}>
      <PointMaterial
        transparent
        color="#22d3ee"
        size={0.12}
        sizeAttenuation
        depthWrite={false}
        opacity={0.8}
      />
    </Points>
  );
}

/**
 * Hexagonal network nodes in background
 */
function HexagonalNodes() {
  const nodes = useMemo(() => {
    const positions = [];
    const colors = ['#3b82f6', '#8b5cf6', '#22c55e', '#f97316'];
    for (let i = 0; i < 20; i++) {
      positions.push({
        pos: [
          (seededRandom(i * 4 + 1000) - 0.5) * 70,
          seededRandom(i * 4 + 1001) * 15 - 5,
          -15 - seededRandom(i * 4 + 1002) * 20,
        ],
        size: 0.3 + seededRandom(i * 4 + 1003) * 0.5,
        color: colors[Math.floor(seededRandom(i + 1100) * 4)],
      });
    }
    return positions;
  }, []);

  return (
    <group>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.pos}>
          <dodecahedronGeometry args={[node.size, 0]} />
          <meshStandardMaterial
            color={node.color}
            emissive={node.color}
            emissiveIntensity={0.3}
            transparent
            opacity={0.4}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Main background elements component
 */
export default function BackgroundElements() {
  return (
    <group>
      {/* Star field */}
      <StarField count={800} />

      {/* Floating particles */}
      <FloatingParticles count={300} color="#60a5fa" />
      <FloatingParticles count={200} color="#a78bfa" />

      {/* Ground grid */}
      <GridFloor />

      {/* Moving data particles */}
      <DataParticles count={80} />

      {/* Hexagonal background nodes */}
      <HexagonalNodes />

      {/* Ambient glowing orbs */}
      <GlowingOrb
        position={[-20, 8, -15]}
        color="#3b82f6"
        size={0.8}
        pulseSpeed={0.8}
      />
      <GlowingOrb
        position={[10, 12, -20]}
        color="#8b5cf6"
        size={1}
        pulseSpeed={1.2}
      />
      <GlowingOrb
        position={[35, 6, -18]}
        color="#22c55e"
        size={0.6}
        pulseSpeed={1.5}
      />
      <GlowingOrb
        position={[-5, -3, -12]}
        color="#06b6d4"
        size={0.4}
        pulseSpeed={2}
      />
      <GlowingOrb
        position={[25, 10, -25]}
        color="#f97316"
        size={0.7}
        pulseSpeed={0.6}
      />

      {/* Data stream lines */}
      <DataStream start={[-25, 5, -10]} end={[40, 5, -10]} color="#3b82f6" />
      <DataStream start={[-20, -2, -8]} end={[35, -2, -8]} color="#8b5cf6" />
      <DataStream start={[-15, 8, -15]} end={[30, 8, -15]} color="#22c55e" />
    </group>
  );
}
