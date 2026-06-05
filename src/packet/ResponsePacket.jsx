import { useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Trail } from '@react-three/drei';

const ResponsePacket = forwardRef(
  ({ position, color = '#22c55e', label, type = 'html' }, ref) => {
    const meshRef = useRef();

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

    const packetColor = typeColors[type] || color;

    useFrame((state) => {
      if (!meshRef.current) return;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.03;
      meshRef.current.scale.setScalar(pulse);
    });

    return (
      <group position={position} ref={ref}>
        <Trail width={0.5} length={6} color={packetColor} attenuation={(w) => w * w}>
          <group ref={meshRef}>
            <RoundedBox args={[0.8, 1, 0.2]} radius={0.05}>
              <meshStandardMaterial
                color={packetColor}
                emissive={packetColor}
                emissiveIntensity={0.4}
                roughness={0.3}
              />
            </RoundedBox>

            {[-0.2, 0, 0.2].map((y, i) => (
              <mesh key={i} position={[0, y, 0.11]}>
                <boxGeometry args={[0.5, 0.08, 0.01]} />
                <meshStandardMaterial color="#ffffff" opacity={0.6} transparent />
              </mesh>
            ))}

            <mesh position={[0.25, 0.35, 0.11]}>
              <boxGeometry args={[0.3, 0.15, 0.02]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            <Text position={[0.25, 0.35, 0.13]} fontSize={0.08} color="#ffffff" anchorX="center">
              {typeLabels[type]}
            </Text>
          </group>
        </Trail>

        <Text position={[0, -0.7, 0]} fontSize={0.15} color="#ffffff" anchorX="center">
          {label}
        </Text>
      </group>
    );
  },
);

export default ResponsePacket;
