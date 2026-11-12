import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Edges } from '@react-three/drei';
import { MONO } from '../theme/materials';
import { useTheme, LAYER } from '../theme/tokens';
import { subscribe } from '../stores/player';

const RING_COLOR = LAYER.application; // matches Cable->DNS query line
const LO = 0.22, HI = 0.32;

export default function DNSServer({ position = [20, 0, 0] }) {
  const theme = useTheme();
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
        ref.material.emissiveIntensity = Math.max(0.4, 1.3 + flicker);
      }
    });
    if (ringRef.current) {
      const mat = ringRef.current.material;
      mat.opacity = mat.opacity + (ringActive ? 0.8 : 0) * 0.06 - mat.opacity * 0.04;
      if (ringActive) mat.emissiveIntensity = 1.4 + Math.sin(t * 3) * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={1.5}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.27, 0]}>
        <torusGeometry args={[1.2, 0.04, 8, 48]} />
        <meshStandardMaterial color={RING_COLOR} emissive={RING_COLOR} emissiveIntensity={0} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>

      <mesh position={[0, 0, 0]} material={MONO.body}>
        <boxGeometry args={[1.5, 2.5, 1]} />
        <Edges threshold={15} color={theme.line} />
      </mesh>

      {[-0.8, -0.4, 0, 0.4, 0.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0.51]} material={MONO.panel}>
          <boxGeometry args={[1.2, 0.25, 0.05]} />
        </mesh>
      ))}

      {[-0.8, -0.4, 0, 0.4, 0.8].map((y, i) => (
        <mesh key={i} position={[0.5, y, 0.55]} ref={(el) => (ledRefs.current[i] = el)}>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial color={LAYER.application} emissive={LAYER.application} emissiveIntensity={1.3} toneMapped={false} />
        </mesh>
      ))}

      <Text position={[0, 1.5, 0.52]}  fontSize={0.25} color={LAYER.application} anchorX="center">DNS</Text>
      <Text position={[0, -1.8, 0]}    fontSize={0.25} color={theme.textMuted} anchorX="center">DNS Server</Text>
      <Text position={[0, -2.1, 0]}    fontSize={0.12} color={theme.textMuted} anchorX="center">
        {'Resolves google.com -> 142.250.190.14'}
      </Text>
    </group>
  );
}
