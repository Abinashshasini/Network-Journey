import { Text } from '@react-three/drei';
import { forwardRef } from 'react';

const TCPPacket = forwardRef(({ position, color = '#3b82f6', label }, ref) => {
  return (
    <group position={position} ref={ref}>
      {/* Simple sphere packet */}
      <mesh>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Label */}
      <Text
        position={[0, 0.7, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
      >
        {label}
      </Text>
    </group>
  );
});

export default TCPPacket;
