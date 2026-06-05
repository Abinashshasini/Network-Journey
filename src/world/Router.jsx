import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { MetalMaterial, NeonMaterial } from '../materials/PremiumMaterials';

export default function Router({ position = [-6, 0, 0] }) {
  const groupRef = useRef();
  const antennaRefs = useRef([]);
  const ledRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.7 + 1) * 0.03;
    }
    antennaRefs.current.forEach((ref, i) => {
      if (ref) {
        ref.rotation.z = Math.sin(t * 1.2 + i * 0.8) * 0.05;
        ref.rotation.x = Math.sin(t * 0.9 + i * 1.2) * 0.03;
      }
    });
    if (ledRef.current) {
      const v = 0.4 + Math.sin(t * 4) * 0.3 + Math.sin(t * 7) * 0.15;
      ledRef.current.material.emissiveIntensity = Math.max(0.1, v);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={1.5}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.3, 1]} />
        <MetalMaterial color="#1e293b" metalness={0.8} roughness={0.35} clearcoat={0.5} />
      </mesh>

      {/* Antennas — plain metal rods, tiny sphere tip */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <group key={i} position={[x, 0.15, -0.3]} ref={(el) => (antennaRefs.current[i] = el)}>
          <mesh>
            <cylinderGeometry args={[0.025, 0.03, 0.8]} />
            <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <sphereGeometry args={[0.045]} />
            <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.7} />
          </mesh>
        </group>
      ))}

      {/* LED — the only NeonMaterial element, small and intentional */}
      <mesh ref={ledRef} position={[0.4, 0.16, 0.4]}>
        <boxGeometry args={[0.08, 0.02, 0.08]} />
        <NeonMaterial color="#22c55e" intensity={0.8} />
      </mesh>

      <Text position={[0, -0.6, 0]} fontSize={0.2} color="#94a3b8" anchorX="center">
        Home Router
      </Text>
    </group>
  );
}
