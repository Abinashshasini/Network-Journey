function DNSNode({ position, color }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
      />
    </mesh>
  );
}

export default function DNSNodes() {
  return (
    <>
      {/* Recursive Resolver */}
      <DNSNode position={[-2, 4, 0]} color="#00ffcc" />

      {/* Root */}
      <DNSNode position={[2, 8, 0]} color="#ff5555" />

      {/* TLD */}
      <DNSNode position={[6, 4, 0]} color="#ffaa00" />

      {/* Authoritative */}
      <DNSNode position={[10, 0, 0]} color="#55ff55" />
    </>
  );
}
