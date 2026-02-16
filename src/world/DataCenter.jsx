function Rack({ position }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1.5, 5, 1]} />
      <meshStandardMaterial color="#111" metalness={0.9} />
    </mesh>
  );
}

export default function DataCenter() {
  return (
    <>
      <Rack position={[10, 0, 0]} />
      <Rack position={[13, 0, 0]} />
    </>
  );
}
