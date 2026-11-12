import { Text, Edges } from '@react-three/drei';
import { MONO } from '../theme/materials';
import { useTheme, LAYER } from '../theme/tokens';

/**
 * Visual indicator showing the TCP 3-way handshake process
 * Positioned between DNS and Google Server
 */
export default function TCPHandshakeIndicator({ position = [28, 3, 0] }) {
  const theme = useTheme();
  return (
    <group position={position}>
      {/* Background panel */}
      <mesh position={[0, 0, -0.1]} material={MONO.panel}>
        <planeGeometry args={[6, 2.5]} />
        <Edges threshold={15} color={theme.line} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.25}
        color={theme.text}
        anchorX="center"
        fontWeight="bold"
      >
        TCP 3-Way Handshake
      </Text>

      {/* Step 1: SYN */}
      <group position={[-1.5, 0.2, 0]}>
        <Text fontSize={0.15} color={LAYER.transport} anchorX="center">
          {'1. SYN ->'}
        </Text>
      </group>

      {/* Step 2: SYN-ACK */}
      <group position={[0, -0.2, 0]}>
        <Text fontSize={0.15} color={LAYER.transport} anchorX="center">
          {'2. <- SYN-ACK'}
        </Text>
      </group>

      {/* Step 3: ACK */}
      <group position={[1.5, -0.6, 0]}>
        <Text fontSize={0.15} color={LAYER.transport} anchorX="center">
          {'3. ACK ->'}
        </Text>
      </group>
    </group>
  );
}
