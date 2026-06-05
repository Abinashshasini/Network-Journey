import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import { MetalMaterial, NeonMaterial } from '../materials/PremiumMaterials';

export default function GoogleServer({ position = [28, 0, 0] }) {
  const groupRef = useRef();
  const stripeRefs = useRef([]);
  const statusRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.5 + 3) * 0.03;
    }
    // Stripes: low emissive pulse — color accent not a floodlight
    stripeRefs.current.forEach((ref, i) => {
      if (ref) {
        const phase = t * 2 - i * 0.5;
        ref.material.emissiveIntensity = 0.2 + Math.max(0, Math.sin(phase)) * 0.3;
      }
    });
    // Status heartbeat — tiny sphere, intentional NeonMaterial
    if (statusRef.current) {
      const beat = Math.pow(Math.sin(t * 2), 20);
      statusRef.current.material.emissiveIntensity = 0.5 + beat * 1.5;
    }
  });

  const stripeColors = ['#4285f4', '#ea4335', '#fbbc05', '#34a853'];

  return (
    <group ref={groupRef} position={position} scale={1.5}>
      {/* Building chassis */}
      <RoundedBox args={[3, 2.5, 2]} radius={0.1} position={[0, 0, 0]}>
        <MetalMaterial color="#0f172a" metalness={0.8} roughness={0.3} clearcoat={0.7} />
      </RoundedBox>

      {/* Google stripes — plain emissive material, not NeonMaterial */}
      {stripeColors.map((color, i) => (
        <mesh
          key={i}
          position={[0, 0.8 - i * 0.2, 1.04]}
          ref={(el) => (stripeRefs.current[i] = el)}
        >
          <boxGeometry args={[2.5, 0.15, 0.02]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
        </mesh>
      ))}

      {/* Server rack bays */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={i} position={[x, -0.5, 1.04]}>
          <boxGeometry args={[0.2, 0.6, 0.02]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
      ))}

      {/* Status light — intentional NeonMaterial, tiny */}
      <mesh ref={statusRef} position={[1.2, 1.1, 1.05]}>
        <sphereGeometry args={[0.09]} />
        <NeonMaterial color="#22c55e" intensity={0.5} />
      </mesh>

      <Text position={[0, -1.8, 0]} fontSize={0.3} color="#94a3b8" anchorX="center">
        Google Server
      </Text>
      <Text position={[0, -2.15, 0]} fontSize={0.12} color="#475569" anchorX="center">
        142.250.190.14
      </Text>
    </group>
  );
}
