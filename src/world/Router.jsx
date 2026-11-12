import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Edges } from '@react-three/drei';
import { MONO } from '../theme/materials';
import { useTheme, LAYER } from '../theme/tokens';
import { subscribe } from '../stores/player';

const RING_COLOR = LAYER.link; // router serves the laptop<->router link
const LO = 0.00, HI = 0.14;

export default function Router({ position = [-6, 0, 0] }) {
  const theme = useTheme();
  const groupRef    = useRef();
  const antennaRefs = useRef([]);
  const ledRef      = useRef();
  const ringRef     = useRef();
  const [ringActive, setRingActive] = useState(false);

  useEffect(() => {
    return subscribe((p) => setRingActive(p >= LO && p <= HI));
  }, []);

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
      const v = 1.3 + Math.sin(t * 4) * 0.4 + Math.sin(t * 7) * 0.2;
      ledRef.current.material.emissiveIntensity = Math.max(0.3, v);
    }
    if (ringRef.current) {
      const mat = ringRef.current.material;
      mat.opacity = mat.opacity + (ringActive ? 0.8 : 0) * 0.06 - mat.opacity * 0.04;
      if (ringActive) mat.emissiveIntensity = 1.4 + Math.sin(t * 3) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={1.5}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.17, 0]}>
        <torusGeometry args={[1.1, 0.04, 8, 48]} />
        <meshStandardMaterial color={RING_COLOR} emissive={RING_COLOR} emissiveIntensity={0} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>

      <mesh position={[0, 0, 0]} material={MONO.body}>
        <boxGeometry args={[1.5, 0.3, 1]} />
        <Edges threshold={15} color={theme.line} />
      </mesh>

      {[-0.5, 0, 0.5].map((x, i) => (
        <group key={i} position={[x, 0.15, -0.3]} ref={(el) => (antennaRefs.current[i] = el)}>
          <mesh material={MONO.panel}>
            <cylinderGeometry args={[0.025, 0.03, 0.8]} />
          </mesh>
          <mesh position={[0, 0.45, 0]} material={MONO.panel}>
            <sphereGeometry args={[0.045]} />
          </mesh>
        </group>
      ))}

      <mesh ref={ledRef} position={[0.4, 0.16, 0.4]}>
        <boxGeometry args={[0.08, 0.02, 0.08]} />
        <meshStandardMaterial color={LAYER.link} emissive={LAYER.link} emissiveIntensity={1.3} toneMapped={false} />
      </mesh>

      <Text position={[0, -0.6, 0]} fontSize={0.2} color={theme.textMuted} anchorX="center">
        Home Router
      </Text>
    </group>
  );
}
