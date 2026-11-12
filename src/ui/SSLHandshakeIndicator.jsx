import { Text, Edges } from '@react-three/drei';
import { MONO } from '../theme/materials';
import { useTheme, LAYER } from '../theme/tokens';

/**
 * Visual indicator showing the SSL/TLS handshake process
 * Shows the various stages of establishing a secure connection
 */
export default function SSLHandshakeIndicator({ position = [28, 3, 0] }) {
  const theme = useTheme();
  return (
    <group position={position}>
      {/* Background panel */}
      <mesh position={[0, 0, -0.1]} material={MONO.panel}>
        <planeGeometry args={[7, 3]} />
        <Edges threshold={15} color={theme.line} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 1, 0]}
        fontSize={0.25}
        color={theme.text}
        anchorX="center"
        fontWeight="bold"
      >
        SSL/TLS Handshake
      </Text>

      {/* Step 1: Client Hello */}
      <group position={[-2, 0.3, 0]}>
        <Text fontSize={0.14} color={LAYER.security} anchorX="left">
          {'1. Client Hello ->'}
        </Text>
        <Text
          position={[0, -0.2, 0]}
          fontSize={0.1}
          color={theme.textMuted}
          anchorX="left"
        >
          Supported ciphers, TLS version
        </Text>
      </group>

      {/* Step 2: Server Hello */}
      <group position={[-2, -0.2, 0]}>
        <Text fontSize={0.14} color={LAYER.security} anchorX="left">
          {'2. <- Server Hello + Certificate'}
        </Text>
        <Text
          position={[0, -0.2, 0]}
          fontSize={0.1}
          color={theme.textMuted}
          anchorX="left"
        >
          Chosen cipher, public key
        </Text>
      </group>

      {/* Step 3: Key Exchange */}
      <group position={[-2, -0.7, 0]}>
        <Text fontSize={0.14} color={LAYER.security} anchorX="left">
          {'3. Key Exchange ->'}
        </Text>
        <Text
          position={[0, -0.2, 0]}
          fontSize={0.1}
          color={theme.textMuted}
          anchorX="left"
        >
          Pre-master secret (encrypted)
        </Text>
      </group>

      {/* Step 4: Finished */}
      <group position={[2, -0.7, 0]}>
        <Text fontSize={0.14} color={LAYER.security} anchorX="center">
          4. Encrypted!
        </Text>
      </group>
    </group>
  );
}
