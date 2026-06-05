import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import { MetalMaterial, NeonMaterial } from '../materials/PremiumMaterials';

export default function Laptop({ position = [-12, 0, 0] }) {
  const groupRef = useRef();
  const screenGlowRef = useRef();
  const cursorRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.03;
    }
    if (screenGlowRef.current) {
      screenGlowRef.current.material.emissiveIntensity =
        0.15 + Math.sin(t * 1.5) * 0.05;
    }
    if (cursorRef.current) {
      cursorRef.current.visible = Math.sin(t * 3) > 0;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={1.5}>
      {/* Chassis */}
      <mesh position={[0, 0, 0]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[2.5, 0.15, 1.8]} />
        <MetalMaterial color="#334155" metalness={0.85} roughness={0.3} clearcoat={0.6} />
      </mesh>

      {/* Keyboard inset */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[2.2, 0.02, 1.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>

      {/* Screen */}
      <group position={[0, 1.1, -0.85]} rotation={[0.3, 0, 0]}>
        {/* Frame */}
        <RoundedBox args={[2.5, 1.8, 0.1]} radius={0.05}>
          <MetalMaterial color="#334155" metalness={0.85} roughness={0.25} clearcoat={0.7} />
        </RoundedBox>

        {/* Display — subtle blue glow, not overpowering */}
        <mesh ref={screenGlowRef} position={[0, 0, 0.06]}>
          <planeGeometry args={[2.2, 1.5]} />
          <meshStandardMaterial
            color="#0d1b2e"
            emissive="#2563eb"
            emissiveIntensity={0.15}
            roughness={0.4}
          />
        </mesh>

        {/* Search bar */}
        <mesh position={[0, 0.3, 0.07]}>
          <planeGeometry args={[1.8, 0.25]} />
          <meshStandardMaterial color="#f1f5f9" emissive="#e2e8f0" emissiveIntensity={0.15} />
        </mesh>

        <Text position={[0, 0.3, 0.08]} fontSize={0.12} color="#475569" anchorX="center">
          google.com
        </Text>

        {/* Cursor — only element using NeonMaterial (small, intentional) */}
        <mesh ref={cursorRef} position={[0.55, 0.3, 0.08]}>
          <planeGeometry args={[0.02, 0.14]} />
          <NeonMaterial color="#3b82f6" intensity={1.5} />
        </mesh>
      </group>

      <Text position={[0, -0.8, 0]} fontSize={0.25} color="#94a3b8" anchorX="center">
        Your Device
      </Text>
    </group>
  );
}
