import { Text, RoundedBox } from '@react-three/drei';
import { forwardRef } from 'react';

/**
 * HTTP Response Packet - larger than request, contains HTML/CSS/JS
 */
const ResponsePacket = forwardRef(
  ({ position, color = '#22c55e', label, type = 'html' }, ref) => {
    const typeColors = {
      html: '#f97316',
      css: '#3b82f6',
      js: '#eab308',
    };

    const typeLabels = {
      html: 'HTML',
      css: 'CSS',
      js: 'JS',
    };

    return (
      <group position={position} ref={ref}>
        {/* Document-shaped packet */}
        <RoundedBox args={[0.8, 1, 0.2]} radius={0.05}>
          <meshStandardMaterial
            color={typeColors[type] || color}
            roughness={0.3}
          />
        </RoundedBox>

        {/* Document lines */}
        {[-0.2, 0, 0.2].map((y, i) => (
          <mesh key={i} position={[0, y, 0.11]}>
            <boxGeometry args={[0.5, 0.08, 0.01]} />
            <meshStandardMaterial color="#ffffff" opacity={0.8} transparent />
          </mesh>
        ))}

        {/* Type badge */}
        <mesh position={[0.25, 0.35, 0.11]}>
          <boxGeometry args={[0.3, 0.15, 0.02]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>

        {/* Type label */}
        <Text
          position={[0.25, 0.35, 0.13]}
          fontSize={0.08}
          color="#ffffff"
          anchorX="center"
        >
          {typeLabels[type]}
        </Text>

        {/* Main label */}
        <Text
          position={[0, -0.7, 0]}
          fontSize={0.15}
          color="#1e293b"
          anchorX="center"
        >
          {label}
        </Text>
      </group>
    );
  },
);

export default ResponsePacket;
