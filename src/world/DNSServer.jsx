import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { MetalMaterial, NeonMaterial } from '../materials/PremiumMaterials';
import { subscribe } from '../stores/scrollStore';

const RING_COLOR = '#8b5cf6'; // matches Cable→DNS query line
const LO = 0.22, HI = 0.32;

export default function DNSServer({ position = [20, 0, 0] }) {
  const groupRef = useRef();
  const ledRefs  = useRef([]);
  const ringRef  = useRef();
  const [ringActive, setRingActive] = useState(false);

  const flickerSeeds = useMemo(
    () => Array.from({ length: 5 }, (_, i) => i * 1.7 + 0.3),
    [],
  );

  useEffect(() => {
    return subscribe((p) => setRingActive(p >= LO && p <= HI));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.6 + 2) * 0.02;
    }
    ledRefs.current.forEach((ref, i) => {
      if (ref) {
        const flicker = Math.sin(t * flickerSeeds[i] * 3) * 0.25 + Math.sin(t * flickerSeeds[i] * 7) * 0.15;
        ref.material.emissiveIntensity = Math.max(0.2, 0.7 + flicker);
      }
    });
    if (ringRef.current) {
      const mat = ringRef.current.material;
      mat.opacity = mat.opacity + (ringActive ? 0.8 : 0) * 0.06 - mat.opacity * 0.04;
      if (ringActive) mat.emissiveIntensity = 0.4 + Math.sin(t * 3) * 0.25;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={1.5}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.27, 0]}>
        <torusGeometry args={[1.2, 0.04, 8, 48]} />
        <meshStandardMaterial color={RING_COLOR} emissive={RING_COLOR} emissiveIntensity={0} transparent opacity={0} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 2.5, 1]} />
        <MetalMaterial color="#0f1e35" metalness={0.8} roughness={0.35} clearcoat={0.5} />
      </mesh>

      {[-0.8, -0.4, 0, 0.4, 0.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0.51]}>
          <boxGeometry args={[1.2, 0.25, 0.05]} />
          <meshStandardMaterial color="#060f1a" roughness={0.7} />
        </mesh>
      ))}

      {[-0.8, -0.4, 0, 0.4, 0.8].map((y, i) => (
        <mesh key={i} position={[0.5, y, 0.55]} ref={(el) => (ledRefs.current[i] = el)}>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <NeonMaterial color="#22c55e" intensity={0.7} />
        </mesh>
      ))}

      <Text position={[0, 1.5, 0.52]}  fontSize={0.25} color="#60a5fa" anchorX="center">DNS</Text>
      <Text position={[0, -1.8, 0]}    fontSize={0.25} color="#94a3b8" anchorX="center">DNS Server</Text>
      <Text position={[0, -2.1, 0]}    fontSize={0.12} color="#475569" anchorX="center">
        {'Resolves google.com → 142.250.190.14'}
      </Text>
    </group>
  );
}
