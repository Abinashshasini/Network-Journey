import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Edges } from '@react-three/drei';
import { MONO } from '../theme/materials';
import { useTheme, LAYER } from '../theme/tokens';
import { subscribe } from '../stores/player';

const RING_COLOR = LAYER.network; // matches ISP->Cable backbone line
const LO = 0.10, HI = 0.22;

export default function ISPNode({ position = [0, 0, 0] }) {
  const theme = useTheme();
  const groupRef    = useRef();
  const windowRefs  = useRef([]);
  const ringRef     = useRef();
  const [ringActive, setRingActive] = useState(false);

  useEffect(() => {
    return subscribe((p) => setRingActive(p >= LO && p <= HI));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.6 + 1.5) * 0.02;
    }
    windowRefs.current.forEach((ref, i) => {
      if (ref) {
        ref.material.emissiveIntensity = 1.1 + Math.sin(t * 2 + i * 1.3) * 0.3;
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
        <torusGeometry args={[1.4, 0.04, 8, 48]} />
        <meshStandardMaterial color={RING_COLOR} emissive={RING_COLOR} emissiveIntensity={0} transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>

      <mesh position={[0, 0, 0]} material={MONO.body}>
        <boxGeometry args={[2, 2.5, 2]} />
        <Edges threshold={15} color={theme.line} />
      </mesh>

      {[-0.6, 0, 0.6].map((y, yi) =>
        [-0.6, 0, 0.6].map((x, xi) => (
          <mesh
            key={`${xi}-${yi}`}
            position={[x, y, 1.01]}
            ref={(el) => (windowRefs.current[yi * 3 + xi] = el)}
          >
            <planeGeometry args={[0.3, 0.3]} />
            <meshStandardMaterial color={LAYER.network} emissive={LAYER.network} emissiveIntensity={1.1} toneMapped={false} />
          </mesh>
        )),
      )}

      <group position={[0.7, 1.5, 0]}>
        <mesh rotation={[0.5, 0, 0]} material={MONO.panel}>
          <sphereGeometry args={[0.4, 16, 8, 0, Math.PI]} />
        </mesh>
        <mesh position={[0, 0.3, -0.2]} material={MONO.panel}>
          <cylinderGeometry args={[0.02, 0.02, 0.4]} />
        </mesh>
      </group>

      <Text position={[0, -1.8, 0]} fontSize={0.25} color={theme.textMuted} anchorX="center">ISP Server</Text>
      <Text position={[0, -2.1, 0]} fontSize={0.15} color={theme.textMuted} anchorX="center">(Internet Service Provider)</Text>
    </group>
  );
}
