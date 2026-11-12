import { useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Trail } from '@react-three/drei';
import { accent } from '../theme/materials';
import { useTheme, LAYER } from '../theme/tokens';

/**
 * showData — when true, shows the source->destination IP and port as a small
 * floating billboard. Used on the main search packet so viewers understand
 * a packet carries real addressing information, not just colour.
 */
const TCPPacket = forwardRef(({ position, color = LAYER.transport, label, showData = false }, ref) => {
  const theme = useTheme();
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    meshRef.current.scale.setScalar(pulse);
  });

  return (
    <group position={position} ref={ref}>
      <Trail width={0.6} length={6} color={color} attenuation={(w) => w * w}>
        <mesh ref={meshRef} material={accent(color)}>
          <sphereGeometry args={[0.35, 32, 32]} />
        </mesh>
      </Trail>

      {/* Packet label (SYN / ACK / etc.) */}
      <Text position={[0, 0.7, 0]} fontSize={0.2} color={theme.text} anchorX="center">
        {label}
      </Text>

      {/* IP address billboard — only on the main request packet */}
      {showData && (
        <Text
          position={[0, -0.65, 0]}
          fontSize={0.13}
          color={theme.textMuted}
          anchorX="center"
          anchorY="middle"
          lineHeight={1.4}
          outlineWidth={0.008}
          outlineColor={theme.bg}
        >
          {`192.168.1.5 -> 142.250.190.14\nPort: 443`}
        </Text>
      )}
    </group>
  );
});

export default TCPPacket;
