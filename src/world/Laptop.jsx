import { Text, RoundedBox } from '@react-three/drei';

export default function Laptop({ position = [-12, 0, 0] }) {
  return (
    <group position={position} scale={1.5}>
      {/* Laptop Base */}
      <mesh position={[0, 0, 0]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[2.5, 0.15, 1.8]} />
        <meshStandardMaterial color="#475569" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* Keyboard area */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[2.2, 0.02, 1.4]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* Screen */}
      <group position={[0, 1.1, -0.85]} rotation={[0.3, 0, 0]}>
        {/* Screen frame */}
        <RoundedBox args={[2.5, 1.8, 0.1]} radius={0.05}>
          <meshStandardMaterial
            color="#475569"
            roughness={0.3}
            metalness={0.3}
          />
        </RoundedBox>

        {/* Screen display */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[2.2, 1.5]} />
          <meshStandardMaterial
            color="#1e293b"
            emissive="#1e293b"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Search bar on screen */}
        <mesh position={[0, 0.3, 0.07]}>
          <planeGeometry args={[1.8, 0.25]} />
          <meshStandardMaterial
            color="#f1f5f9"
            emissive="#f1f5f9"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* "google.com" text */}
        <Text
          position={[0, 0.3, 0.08]}
          fontSize={0.12}
          color="#475569"
          anchorX="center"
        >
          google.com
        </Text>
      </group>

      {/* Label */}
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.25}
        color="#94a3b8"
        anchorX="center"
      >
        Your Device
      </Text>
    </group>
  );
}
