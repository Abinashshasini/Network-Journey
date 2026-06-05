import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Line } from '@react-three/drei';
import * as THREE from 'three';

function WaterSurface({ centerX = 11 }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    // Gentle wave movement
    const t = state.clock.elapsedTime;
    ref.current.position.y = -2 + Math.sin(t * 0.5) * 0.05;
    ref.current.material.opacity = 0.35 + Math.sin(t * 0.8) * 0.05;
  });

  return (
    <mesh ref={ref} position={[centerX, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[18, 8]} />
      <meshStandardMaterial
        color="#3b82f6"
        transparent
        opacity={0.4}
        emissive="#1e90ff"
        emissiveIntensity={0.05}
      />
    </mesh>
  );
}

function Cable({ start, end, color = '#f97316' }) {
  const lineRef = useRef();
  const controlY = useRef(Math.min(start[1], end[1]) - 2);

  // Animate the cable undulation
  useFrame((state) => {
    controlY.current =
      Math.min(start[1], end[1]) - 2 + Math.sin(state.clock.elapsedTime * 0.6) * 0.2;
  });

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

// Bubble particles for underwater atmosphere
function Bubbles({ centerX = 11 }) {
  const bubblesRef = useRef();

  const positions = useMemo(() => {
    const pos = new Float32Array(30 * 3);
    for (let i = 0; i < 30; i++) {
      pos[i * 3] = centerX - 8 + Math.random() * 16;
      pos[i * 3 + 1] = -4 + Math.random() * 2;
      pos[i * 3 + 2] = -3 + Math.random() * 6;
    }
    return pos;
  }, [centerX]);

  useFrame((state) => {
    if (!bubblesRef.current) return;
    const arr = bubblesRef.current.geometry.attributes.position.array;
    for (let i = 0; i < 30; i++) {
      arr[i * 3 + 1] += 0.008;
      // Reset when above water
      if (arr[i * 3 + 1] > -2) {
        arr[i * 3 + 1] = -4.5;
      }
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
      <pointsMaterial
        color="#60a5fa"
        size={0.08}
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function SubmarineCable({
  startPos = [4, -1, 0],
  endPos = [18, -1, 0],
}) {
  const centerX = (startPos[0] + endPos[0]) / 2;

  return (
    <group>
      {/* Ocean water surface */}
      <WaterSurface centerX={centerX} />

      {/* Ocean floor */}
      <mesh position={[centerX, -4.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[18, 6]} />
        <meshStandardMaterial color="#1e3a5f" />
      </mesh>

      {/* Submarine cable */}
      <Cable start={startPos} end={endPos} color="#f97316" />

      {/* Underwater bubbles */}
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

      {/* Labels */}
      <Text
        position={[centerX, -4, 0]}
        fontSize={0.3}
        color="#334155"
        anchorX="center"
      >
        Submarine Fiber Cable
      </Text>

      <Text
        position={[centerX, -4.4, 0]}
        fontSize={0.15}
        color="#64748b"
        anchorX="center"
      >
        ~8000km across Atlantic
      </Text>
    </group>
  );
}
