import { Text } from '@react-three/drei';

export default function Router({ position = [-6, 0, 0] }) {
  return (
    <group position={position} scale={1.5}>
      {/* Router body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.3, 1]} />
        <meshStandardMaterial color="#1e293b" roughness={0.4} />
      </mesh>

      {/* Antennas */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <group key={i} position={[x, 0.15, -0.3]}>
          <mesh>
            <cylinderGeometry args={[0.03, 0.03, 0.8]} />
            <meshStandardMaterial color="#475569" />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <sphereGeometry args={[0.05]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
        </group>
      ))}

      {/* Simple LED indicator */}
      <mesh position={[0.4, 0.16, 0.4]}>
        <boxGeometry args={[0.08, 0.02, 0.08]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>

      {/* Label */}
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.2}
        color="#94a3b8"
        anchorX="center"
      >
        Home Router
      </Text>
    </group>
  );
}
