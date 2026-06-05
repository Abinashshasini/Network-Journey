import { useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Trail } from '@react-three/drei';

const SSLPacket = forwardRef(
  ({ position, color = '#22c55e', label, isLock = false, size = 0.3 }, ref) => {
    const meshRef = useRef();

    useFrame((state) => {
      if (!meshRef.current) return;
      if (isLock) {
        meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3;
      } else {
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 3.5) * 0.04;
        meshRef.current.scale.setScalar(pulse);
      }
    });

    return (
      <group position={position} ref={ref}>
        <Trail width={0.4} length={5} color={color} attenuation={(w) => w * w}>
          <group ref={meshRef}>
            {isLock ? (
              <group>
                {/* Lock body */}
                <mesh position={[0, -0.1, 0]}>
                  <boxGeometry args={[size * 1.8, size * 1.2, size]} />
                  <meshStandardMaterial
                    color="#22c55e"
                    emissive="#22c55e"
                    emissiveIntensity={0.5}
                    roughness={0.2}
                    metalness={0.3}
                  />
                </mesh>
                {/* Shackle */}
                <mesh position={[0, 0.4, 0]}>
                  <torusGeometry args={[size * 0.5, size * 0.15, 8, 16, Math.PI]} />
                  <meshStandardMaterial
                    color="#22c55e"
                    emissive="#22c55e"
                    emissiveIntensity={0.4}
                    roughness={0.2}
                    metalness={0.4}
                  />
                </mesh>
              </group>
            ) : (
              <group>
                <mesh>
                  <boxGeometry args={[size * 2, size * 1.2, size * 1.5]} />
                  <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.4}
                    roughness={0.3}
                    metalness={0.2}
                  />
                </mesh>
                <mesh position={[0, 0, size * 0.76]}>
                  <boxGeometry args={[size * 1.8, size * 0.2, 0.02]} />
                  <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.3} />
                </mesh>
              </group>
            )}
          </group>
        </Trail>

        <Text
          position={[0, size * 1.5 + 0.3, 0]}
          fontSize={0.16}
          color="#ffffff"
          anchorX="center"
        >
          {label}
        </Text>
      </group>
    );
  },
);

export default SSLPacket;
