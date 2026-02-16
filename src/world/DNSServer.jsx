import { Text } from '@react-three/drei';

export default function DNSServer({ position = [20, 0, 0] }) {
  return (
    <group position={position} scale={1.5}>
      {/* Server rack base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 2.5, 1]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.4} />
      </mesh>

      {/* Server slots */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0.51]}>
          <boxGeometry args={[1.2, 0.25, 0.05]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      ))}

      {/* Status LEDs */}
      {[-0.8, -0.4, 0, 0.4, 0.8].map((y, i) => (
        <mesh key={i} position={[0.5, y, 0.55]}>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>
      ))}

      {/* DNS Label on server */}
      <Text
        position={[0, 1.5, 0.52]}
        fontSize={0.25}
        color="#60a5fa"
        anchorX="center"
      >
        DNS
      </Text>

      {/* Main Label */}
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.25}
        color="#94a3b8"
        anchorX="center"
      >
        DNS Server
      </Text>

      <Text
        position={[0, -2.1, 0]}
        fontSize={0.12}
        color="#475569"
        anchorX="center"
      >
        Resolves google.com → 142.250.190.14
      </Text>
    </group>
  );
}
