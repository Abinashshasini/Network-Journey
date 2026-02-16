import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Packet() {
  const ref = useRef();

  useFrame(() => {
    ref.current.rotation.y += 0.03;
  });

  return (
    <mesh ref={ref} position={[-8, 0, 0]}>
      <icosahedronGeometry args={[0.6, 1]} />
      <meshStandardMaterial
        color="#00f2ff"
        emissive="#00f2ff"
        emissiveIntensity={2}
      />
    </mesh>
  );
}
