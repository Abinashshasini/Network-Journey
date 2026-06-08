import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Line } from '@react-three/drei';
import * as THREE from 'three';

function WaterSurface({ centerX = 11 }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = -2 + Math.sin(t * 0.5) * 0.05;
    ref.current.material.opacity = 0.45 + Math.sin(t * 0.8) * 0.06;
  });

  return (
    <mesh ref={ref} position={[centerX, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[18, 8]} />
      <meshStandardMaterial
        color="#0c2340"
        transparent
        opacity={0.5}
        emissive="#0a3060"
        emissiveIntensity={0.08}
      />
    </mesh>
  );
}

function Cable({ start, end, color = '#f97316' }) {
  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3(
        (start[0] + end[0]) / 2,
        Math.min(start[1], end[1]) - 2,
        (start[2] + end[2]) / 2,
      ),
      new THREE.Vector3(...end),
    ]);
    return curve.getPoints(50);
  }, [start, end]);

  return <Line points={points} color={color} lineWidth={2} />;
}

/**
 * A glowing sphere that travels along the cable curve — represents a light
 * pulse (photon) racing through the fiber optic at 200,000 km/s.
 */
function SignalPulse({ start, end }) {
  const meshRef = useRef();

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(...start),
      new THREE.Vector3(
        (start[0] + end[0]) / 2,
        Math.min(start[1], end[1]) - 2,
        (start[2] + end[2]) / 2,
      ),
      new THREE.Vector3(...end),
    ]);
  }, [start, end]);

  useFrame((state) => {
    if (!meshRef.current) return;
    // t cycles 0→1 every ~6.7s — one pass along the cable
    const t = (state.clock.elapsedTime * 0.15) % 1;
    const pt = curve.getPoint(t);
    meshRef.current.position.copy(pt);
    // Pulse the glow
    meshRef.current.material.emissiveIntensity =
      0.8 + Math.sin(state.clock.elapsedTime * 8) * 0.4;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial
        color="#f97316"
        emissive="#f97316"
        emissiveIntensity={0.8}
        roughness={0.1}
      />
    </mesh>
  );
}

function Bubbles({ centerX = 11 }) {
  const bubblesRef = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(30 * 3);
    for (let i = 0; i < 30; i++) {
      pos[i * 3]     = centerX - 8 + (i * 0.531) % 16; // deterministic
      pos[i * 3 + 1] = -4 + (i * 0.317) % 2;
      pos[i * 3 + 2] = -3 + (i * 0.719) % 6;
    }
    return pos;
  }, [centerX]);

  useFrame(() => {
    if (!bubblesRef.current) return;
    const arr = bubblesRef.current.geometry.attributes.position.array;
    for (let i = 0; i < 30; i++) {
      arr[i * 3 + 1] += 0.008;
      if (arr[i * 3 + 1] > -2) arr[i * 3 + 1] = -4.5;
    }
    bubblesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={bubblesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={30}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#60a5fa" size={0.07} transparent opacity={0.5} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function SubmarineCable({
  startPos = [4, -1, 0],
  endPos   = [18, -1, 0],
}) {
  const centerX = (startPos[0] + endPos[0]) / 2;

  return (
    <group>
      {/* Water surface */}
      <WaterSurface centerX={centerX} />

      {/* Deep ocean floor gradient */}
      <mesh position={[centerX, -4.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 6]} />
        <meshStandardMaterial color="#060d1a" />
      </mesh>

      {/* Mid-depth dark water volume */}
      <mesh position={[centerX, -3.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 6]} />
        <meshStandardMaterial color="#0a1a30" transparent opacity={0.6} depthWrite={false} />
      </mesh>

      {/* Submarine cable */}
      <Cable start={startPos} end={endPos} color="#f97316" />

      {/* Signal pulse traveling along the fiber */}
      <SignalPulse start={startPos} end={endPos} />

      {/* Bubbles */}
      <Bubbles centerX={centerX} />

      {/* Cable anchors */}
      <mesh position={[startPos[0], startPos[1] - 0.5, startPos[2]]}>
        <cylinderGeometry args={[0.2, 0.3, 0.5]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>
      <mesh position={[endPos[0], endPos[1] - 0.5, endPos[2]]}>
        <cylinderGeometry args={[0.2, 0.3, 0.5]} />
        <meshStandardMaterial color="#4b5563" />
      </mesh>

      {/* Scale context — the most important label in the whole scene */}
      <Text position={[centerX, 0.8, 0]} fontSize={0.3} color="#94a3b8" anchorX="center" fontWeight="bold">
        Pacific Ocean
      </Text>
      <Text position={[centerX, 0.3, 0]} fontSize={0.2} color="#64748b" anchorX="center">
        ~9,000 km · 45ms latency · 200,000 km/s in fiber
      </Text>

      {/* Existing depth label */}
      <Text position={[centerX, -4, 0]} fontSize={0.25} color="#1e3a5f" anchorX="center">
        Submarine Fiber Optic Cable
      </Text>
    </group>
  );
}
