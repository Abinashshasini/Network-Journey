import { Text } from '@react-three/drei';
import { forwardRef } from 'react';

/**
 * Handshake Packet - specialized for TCP/SSL handshake visualization
 */
const HandshakePacket = forwardRef(
  ({ position, color = '#3b82f6', label, size = 0.3 }, ref) => {
    return (
      <group position={position} ref={ref}>
        {/* Packet body */}
        <mesh>
          <boxGeometry args={[size * 2, size, size * 1.5]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Direction indicator arrow */}
        <mesh position={[size * 1.2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[size * 0.3, size * 0.5, 4]} />
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Label */}
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
