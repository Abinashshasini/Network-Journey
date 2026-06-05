import { useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Trail } from '@react-three/drei';

const TCPPacket = forwardRef(({ position, color = '#3b82f6', label }, ref) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05;
    meshRef.current.scale.setScalar(pulse);
  });

  return (
    <group position={position} ref={ref}>
      <Trail width={0.6} length={6} color={color} attenuation={(w) => w * w}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.35, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.6}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      </Trail>

      <Text position={[0, 0.7, 0]} fontSize={0.2} color="#ffffff" anchorX="center">
        {label}
      </Text>
    </group>
  );
});

export default TCPPacket;
