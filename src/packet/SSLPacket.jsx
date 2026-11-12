import { useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Trail } from '@react-three/drei';
import { MONO, accent } from '../theme/materials';
import { useTheme, LAYER } from '../theme/tokens';

const SSLPacket = forwardRef(
  ({ position, color = LAYER.security, label, isLock = false, size = 0.3 }, ref) => {
    const theme = useTheme();
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
                <mesh position={[0, -0.1, 0]} material={accent('security')}>
                  <boxGeometry args={[size * 1.8, size * 1.2, size]} />
                </mesh>
                {/* Shackle */}
                <mesh position={[0, 0.4, 0]} material={accent('security', 1.4)}>
                  <torusGeometry args={[size * 0.5, size * 0.15, 8, 16, Math.PI]} />
                </mesh>
              </group>
            ) : (
              <group>
                <mesh material={accent(color)}>
                  <boxGeometry args={[size * 2, size * 1.2, size * 1.5]} />
                </mesh>
                <mesh position={[0, 0, size * 0.76]} material={MONO.screen}>
                  <boxGeometry args={[size * 1.8, size * 0.2, 0.02]} />
                </mesh>
              </group>
            )}
          </group>
        </Trail>

        <Text
          position={[0, size * 1.5 + 0.3, 0]}
          fontSize={0.16}
          color={theme.text}
          anchorX="center"
        >
          {label}
        </Text>
      </group>
    );
  },
);

export default SSLPacket;
