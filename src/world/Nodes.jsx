function Node({ position, color }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
      />
    </mesh>
  );
}

export default function Nodes() {
  return (
    <>
      <Node position={[-8, 0, 0]} color="#5555ff" />
      <Node position={[0, 2, 0]} color="#00ff88" />
      <Node position={[8, 0, 0]} color="#ffcc00" />
    </>
  );
}
