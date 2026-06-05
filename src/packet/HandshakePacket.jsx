import { useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Trail } from '@react-three/drei';

const HandshakePacket = forwardRef(
  ({ position, color = '#3b82f6', label, size = 0.3 }, ref) => {
    const meshRef = useRef();

    useFrame((state) => {
      if (!meshRef.current) return;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.04;
      meshRef.current.scale.setScalar(pulse);
    });

    return (
      <group position={position} ref={ref}>
        <Trail width={0.5} length={5} color={color} attenuation={(w) => w * w}>
          <group ref={meshRef}>
            <mesh>
              <boxGeometry args={[size * 2, size, size * 1.5]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.5}
                roughness={0.3}
                metalness={0.2}
              />
            </mesh>
            <mesh position={[size * 1.2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <coneGeometry args={[size * 0.3, size * 0.5, 4]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
            </mesh>
          </group>
        </Trail>

        <Text
          position={[0, size + 0.3, 0]}
          fontSize={0.18}
          color="#ffffff"
          anchorX="center"
          fontWeight="bold"
        >
          {label}
        </Text>
      </group>
    );
  },
);

export default HandshakePacket;
