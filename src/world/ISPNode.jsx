import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { MetalMaterial } from '../materials/PremiumMaterials';

export default function ISPNode({ position = [0, 0, 0] }) {
  const groupRef = useRef();
  const windowRefs = useRef([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.6 + 1.5) * 0.02;
    }
    // Windows: gentle flicker at low intensity — readable, not blinding
    windowRefs.current.forEach((ref, i) => {
      if (ref) {
        ref.material.emissiveIntensity =
          0.25 + Math.sin(t * 2 + i * 1.3) * 0.12;
      }
    });
  });

  return (
    <group ref={groupRef} position={position} scale={1.5}>
      {/* Building */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2.5, 2]} />
        <MetalMaterial color="#1e293b" metalness={0.6} roughness={0.5} clearcoat={0.3} />
      </mesh>

      {/* Window grid — plain meshStandardMaterial, soft blue, low emissive */}
      {[-0.6, 0, 0.6].map((y, yi) =>
        [-0.6, 0, 0.6].map((x, xi) => (
          <mesh
            key={`${xi}-${yi}`}
            position={[x, y, 1.01]}
            ref={(el) => (windowRefs.current[yi * 3 + xi] = el)}
          >
            <planeGeometry args={[0.3, 0.3]} />
            <meshStandardMaterial
              color="#60a5fa"
              emissive="#60a5fa"
              emissiveIntensity={0.25}
            />
          </mesh>
        )),
      )}

      {/* Satellite dish */}
      <group position={[0.7, 1.5, 0]}>
        <mesh rotation={[0.5, 0, 0]}>
          <sphereGeometry args={[0.4, 16, 8, 0, Math.PI]} />
          <MetalMaterial color="#94a3b8" metalness={0.85} roughness={0.25} clearcoat={0.6} />
        </mesh>
        <mesh position={[0, 0.3, -0.2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      <Text position={[0, -1.8, 0]} fontSize={0.25} color="#94a3b8" anchorX="center">
        ISP Server
      </Text>
      <Text position={[0, -2.1, 0]} fontSize={0.15} color="#475569" anchorX="center">
        (Internet Service Provider)
      </Text>
    </group>
  );
}
