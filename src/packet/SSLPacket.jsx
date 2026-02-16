import { Text } from '@react-three/drei';
import { forwardRef } from 'react';

/**
 * SSL Packet - for SSL/TLS handshake visualization
 * Has a lock indicator for secure connection
 */
const SSLPacket = forwardRef(
  ({ position, color = '#22c55e', label, isLock = false, size = 0.3 }, ref) => {
    return (
      <group position={position} ref={ref}>
        {isLock ? (
          // Lock icon for "secure connection established"
          <group>
            {/* Lock body */}
            <mesh position={[0, -0.1, 0]}>
              <boxGeometry args={[size * 1.8, size * 1.2, size]} />
              <meshStandardMaterial color="#22c55e" roughness={0.2} />
            </mesh>
            {/* Lock shackle */}
            <mesh position={[0, 0.4, 0]}>
              <torusGeometry args={[size * 0.5, size * 0.15, 8, 16, Math.PI]} />
              <meshStandardMaterial color="#22c55e" />
            </mesh>
          </group>
        ) : (
          // Regular SSL packet
          <group>
            {/* Packet body with shield shape */}
            <mesh>
              <boxGeometry args={[size * 2, size * 1.2, size * 1.5]} />
              <meshStandardMaterial
                color={color}
                roughness={0.3}
                metalness={0.2}
              />
            </mesh>
            {/* SSL indicator stripe */}
            <mesh position={[0, 0, size * 0.76]}>
              <boxGeometry args={[size * 1.8, size * 0.2, 0.02]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        )}

        {/* Label */}
        <Text
          position={[0, size * 1.5 + 0.3, 0]}
          fontSize={0.16}
          color="#1e293b"
          anchorX="center"
        >
          {label}
        </Text>
      </group>
    );
  },
);

export default SSLPacket;
