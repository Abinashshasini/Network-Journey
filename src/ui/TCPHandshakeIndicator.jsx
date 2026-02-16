import { Text } from '@react-three/drei';

/**
 * Visual indicator showing the TCP 3-way handshake process
 * Positioned between DNS and Google Server
 */
export default function TCPHandshakeIndicator({ position = [28, 3, 0] }) {
  return (
    <group position={position}>
      {/* Background panel */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[6, 2.5]} />
        <meshStandardMaterial color="#fff7ed" transparent opacity={0.9} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.25}
        color="#ea580c"
        anchorX="center"
        fontWeight="bold"
      >
        TCP 3-Way Handshake
      </Text>

      {/* Step 1: SYN */}
      <group position={[-1.5, 0.2, 0]}>
        <Text fontSize={0.15} color="#f97316" anchorX="center">
          1. SYN →
        </Text>
      </group>

      {/* Step 2: SYN-ACK */}
      <group position={[0, -0.2, 0]}>
        <Text fontSize={0.15} color="#8b5cf6" anchorX="center">
          2. ← SYN-ACK
        </Text>
      </group>

      {/* Step 3: ACK */}
      <group position={[1.5, -0.6, 0]}>
        <Text fontSize={0.15} color="#22c55e" anchorX="center">
          3. ACK →
        </Text>
      </group>
    </group>
  );
}
