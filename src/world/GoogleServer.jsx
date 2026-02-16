import { Text, RoundedBox } from '@react-three/drei';

export default function GoogleServer({ position = [28, 0, 0] }) {
  return (
    <group position={position} scale={1.5}>
      {/* Main server building */}
      <RoundedBox args={[3, 2.5, 2]} radius={0.1} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1e293b" roughness={0.3} />
      </RoundedBox>

      {/* Google colors stripe */}
      <mesh position={[0, 0.8, 1.01]}>
        <boxGeometry args={[2.5, 0.15, 0.02]} />
        <meshStandardMaterial color="#4285f4" />
      </mesh>
      <mesh position={[0, 0.6, 1.01]}>
        <boxGeometry args={[2.5, 0.15, 0.02]} />
        <meshStandardMaterial color="#ea4335" />
      </mesh>
      <mesh position={[0, 0.4, 1.01]}>
        <boxGeometry args={[2.5, 0.15, 0.02]} />
        <meshStandardMaterial color="#fbbc05" />
      </mesh>
      <mesh position={[0, 0.2, 1.01]}>
        <boxGeometry args={[2.5, 0.15, 0.02]} />
        <meshStandardMaterial color="#34a853" />
      </mesh>

      {/* Server rack indicator */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={i} position={[x, -0.5, 1.01]}>
          <boxGeometry args={[0.2, 0.6, 0.02]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      ))}

      {/* Status lights */}
      <mesh position={[1, 1, 1.02]}>
        <sphereGeometry args={[0.08]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>

      {/* Main Label */}
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.3}
        color="#94a3b8"
        anchorX="center"
      >
        Google Server
      </Text>

      <Text
        position={[0, -2.15, 0]}
        fontSize={0.12}
        color="#475569"
        anchorX="center"
      >
        142.250.190.14
      </Text>
    </group>
  );
}
