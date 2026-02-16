import { useMemo } from 'react';
import { Text, Line } from '@react-three/drei';
import * as THREE from 'three';

function WaterSurface({ centerX = 11 }) {
  return (
    <mesh position={[centerX, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[18, 8]} />
      <meshStandardMaterial color="#3b82f6" transparent opacity={0.4} />
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
