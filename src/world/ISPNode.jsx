import { Text } from '@react-three/drei';

export default function ISPNode({ position = [0, 0, 0] }) {
  return (
    <group position={position} scale={1.5}>
      {/* ISP Building base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2.5, 2]} />
        <meshStandardMaterial color="#334155" roughness={0.4} />
      </mesh>

      {/* Building windows grid */}
      {[-0.6, 0, 0.6].map((y, yi) =>
        [-0.6, 0, 0.6].map((x, xi) => (
          <mesh key={`${xi}-${yi}`} position={[x, y, 1.01]}>
            <planeGeometry args={[0.3, 0.3]} />
            <meshStandardMaterial color="#60a5fa" />
          </mesh>
        )),
      )}

      {/* Satellite dish */}
      <group position={[0.7, 1.5, 0]}>
        <mesh rotation={[0.5, 0, 0]}>
          <sphereGeometry args={[0.4, 16, 8, 0, Math.PI]} />
          <meshStandardMaterial color="#6b7280" roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.3, -0.2]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4]} />
          <meshStandardMaterial color="#4b5563" />
        </mesh>
      </group>

      {/* Label */}
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.25}
        color="#94a3b8"
        anchorX="center"
      >
        ISP Server
      </Text>

      <Text
        position={[0, -2.1, 0]}
        fontSize={0.15}
        color="#475569"
        anchorX="center"
      >
        (Internet Service Provider)
      </Text>
    </group>
  );
}
