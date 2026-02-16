import { Text, RoundedBox } from '@react-three/drei';
import { forwardRef, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Load Balancer visualization
 */
export const LoadBalancer = forwardRef(({ position = [0, 0, 0] }, ref) => {
  const rotorRef = useRef();

  useFrame((state) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.z = state.clock.elapsedTime * 2;
    }
  });

  return (
    <group position={position} ref={ref} scale={1.5}>
      {/* Main body */}
      <RoundedBox args={[1.2, 1.5, 0.8]} radius={0.1}>
        <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.6} />
      </RoundedBox>

      {/* Front panel */}
      <mesh position={[0, 0, 0.45]}>
        <planeGeometry args={[1, 1.3]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Rotating distribution indicator */}
      <group position={[0, 0.3, 0.5]} ref={rotorRef}>
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[0, 0, 0]}
            rotation={[0, 0, (i * Math.PI) / 2]}
          >
            <boxGeometry args={[0.4, 0.08, 0.02]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#06b6d4"
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* Server indicators */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={i} position={[x, -0.4, 0.47]}>
          <boxGeometry args={[0.15, 0.15, 0.02]} />
          <meshStandardMaterial color={i === 1 ? '#22c55e' : '#475569'} />
        </mesh>
      ))}

      {/* Status lights */}
      <mesh position={[0.4, 0.6, 0.47]}>
        <sphereGeometry args={[0.05]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Label */}
      <Text
        position={[0, -1, 0]}
        fontSize={0.15}
        color="#94a3b8"
        anchorX="center"
      >
        Load Balancer
      </Text>

      {/* Algorithm label */}
      <Text
        position={[0, -1.25, 0]}
        fontSize={0.08}
        color="#64748b"
        anchorX="center"
      >
        Round Robin / Least Connections
      </Text>
    </group>
  );
});

/**
 * Server Farm visualization
 */
export const ServerFarm = forwardRef(
  ({ position = [0, 0, 0], activeServer = 1 }, ref) => {
    const servers = [
      { id: 'srv-01', load: 45, status: 'active' },
      { id: 'srv-02', load: 72, status: 'active' },
      { id: 'srv-03', load: 23, status: 'active' },
      { id: 'srv-04', load: 0, status: 'standby' },
    ];

    return (
      <group position={position} ref={ref}>
        {servers.map((server, i) => {
          const isActive = i === activeServer;
          const x = (i - 1.5) * 1.2;

          return (
            <group key={i} position={[x, 0, 0]}>
              {/* Server rack */}
              <RoundedBox args={[0.8, 1.5, 0.5]} radius={0.05}>
                <meshStandardMaterial
                  color={isActive ? '#1e3a5f' : '#1e293b'}
                  emissive={isActive ? '#3b82f6' : '#000000'}
                  emissiveIntensity={isActive ? 0.2 : 0}
                />
              </RoundedBox>

              {/* Server slots */}
              {[-0.4, -0.1, 0.2, 0.5].map((y, j) => (
                <mesh key={j} position={[0, y, 0.28]}>
                  <boxGeometry args={[0.6, 0.2, 0.02]} />
                  <meshStandardMaterial color="#0f172a" />
                </mesh>
              ))}

              {/* Status LED */}
              <mesh position={[0.3, 0.6, 0.28]}>
                <sphereGeometry args={[0.04]} />
                <meshStandardMaterial
                  color={server.status === 'active' ? '#22c55e' : '#64748b'}
                  emissive={server.status === 'active' ? '#22c55e' : '#000000'}
                  emissiveIntensity={0.5}
                />
              </mesh>

              {/* Selection indicator */}
              {isActive && (
                <mesh position={[0, 0, 0.3]}>
                  <ringGeometry args={[0.5, 0.55, 32]} />
                  <meshStandardMaterial
                    color="#3b82f6"
                    transparent
                    opacity={0.6}
                  />
                </mesh>
              )}

              {/* Server ID */}
              <Text
                position={[0, -1, 0]}
                fontSize={0.1}
                color={isActive ? '#3b82f6' : '#64748b'}
                anchorX="center"
              >
                {server.id}
              </Text>

              {/* Load bar */}
              <group position={[0, -1.2, 0]}>
                <mesh>
                  <planeGeometry args={[0.7, 0.1]} />
                  <meshStandardMaterial color="#1e293b" />
                </mesh>
                <mesh
                  position={[-(0.7 - (server.load / 100) * 0.7) / 2, 0, 0.01]}
                >
                  <planeGeometry args={[(server.load / 100) * 0.7, 0.08]} />
                  <meshStandardMaterial
                    color={
                      server.load > 70
                        ? '#ef4444'
                        : server.load > 40
                          ? '#eab308'
                          : '#22c55e'
                    }
                  />
                </mesh>
              </group>
              <Text
                position={[0, -1.4, 0]}
                fontSize={0.06}
                color="#64748b"
                anchorX="center"
              >
                {server.load}% load
              </Text>
            </group>
          );
        })}

        {/* Title */}
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.2}
          color="#94a3b8"
          anchorX="center"
        >
          Google Server Farm
        </Text>
        <Text
          position={[0, 0.95, 0]}
          fontSize={0.1}
          color="#64748b"
          anchorX="center"
        >
          Distributed across data centers worldwide
        </Text>
      </group>
    );
  },
);

/**
 * Traffic distribution arrows
 */
export const TrafficDistribution = forwardRef(
  ({ position = [0, 0, 0], targetServer = 1 }, ref) => {
    return (
      <group position={position} ref={ref}>
        {/* Incoming traffic line */}
        <mesh position={[-2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 1.5, 8]} />
          <meshStandardMaterial color="#3b82f6" />
        </mesh>

        {/* Distribution arrows going to servers */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (-30 + i * 20) * (Math.PI / 180);
          const isActive = i === targetServer;
          const length = 1.5;

          return (
            <group key={i} position={[-1, 0, 0]} rotation={[0, 0, angle]}>
              <mesh
                position={[length / 2, 0, 0]}
                rotation={[0, 0, Math.PI / 2]}
              >
                <cylinderGeometry args={[0.02, 0.02, length, 8]} />
                <meshStandardMaterial
                  color={isActive ? '#22c55e' : '#475569'}
                  transparent
                  opacity={isActive ? 1 : 0.3}
                />
              </mesh>
              {isActive && (
                <mesh position={[length, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                  <coneGeometry args={[0.06, 0.12, 8]} />
                  <meshStandardMaterial color="#22c55e" />
                </mesh>
              )}
            </group>
          );
        })}
      </group>
    );
  },
);

export default { LoadBalancer, ServerFarm, TrafficDistribution };
