import { Text, RoundedBox, Edges } from '@react-three/drei';
import { forwardRef, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MONO, accent } from '../theme/materials';
import { useTheme, LAYER } from '../theme/tokens';

/**
 * Load Balancer visualization
 */
export const LoadBalancer = forwardRef(({ position = [0, 0, 0] }, ref) => {
  const rotorRef = useRef();
  const theme = useTheme();

  useFrame((state) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.z = state.clock.elapsedTime * 2;
    }
  });

  return (
    <group position={position} ref={ref} scale={1.5}>
      {/* Main body */}
      <RoundedBox args={[1.2, 1.5, 0.8]} radius={0.1} material={MONO.body}>
        <Edges threshold={15} color={theme.line} />
      </RoundedBox>

      {/* Front panel */}
      <mesh position={[0, 0, 0.45]} material={MONO.panel}>
        <planeGeometry args={[1, 1.3]} />
      </mesh>

      {/* Rotating distribution indicator */}
      <group position={[0, 0.3, 0.5]} ref={rotorRef}>
        {[0, 1, 2, 3].map((i) => (
          <mesh
            key={i}
            position={[0, 0, 0]}
            rotation={[0, 0, (i * Math.PI) / 2]}
            material={accent('application', 1.2)}
          >
            <boxGeometry args={[0.4, 0.08, 0.02]} />
          </mesh>
        ))}
        <mesh material={accent('application')}>
          <sphereGeometry args={[0.1, 16, 16]} />
        </mesh>
      </group>

      {/* Server indicators */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh
          key={i}
          position={[x, -0.4, 0.47]}
          material={i === 1 ? accent('application') : MONO.body}
        >
          <boxGeometry args={[0.15, 0.15, 0.02]} />
        </mesh>
      ))}

      {/* Status lights */}
      <mesh position={[0.4, 0.6, 0.47]} material={accent('application')}>
        <sphereGeometry args={[0.05]} />
      </mesh>

      {/* Label */}
      <Text
        position={[0, -1, 0]}
        fontSize={0.15}
        color={theme.text}
        anchorX="center"
      >
        Load Balancer
      </Text>

      {/* Algorithm label */}
      <Text
        position={[0, -1.25, 0]}
        fontSize={0.08}
        color={theme.textMuted}
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
    const theme = useTheme();
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
              <RoundedBox args={[0.8, 1.5, 0.5]} radius={0.05} material={MONO.body}>
                <Edges
                  threshold={15}
                  color={isActive ? LAYER.application : theme.line}
                />
              </RoundedBox>

              {/* Server slots */}
              {[-0.4, -0.1, 0.2, 0.5].map((y, j) => (
                <mesh key={j} position={[0, y, 0.28]} material={MONO.panel}>
                  <boxGeometry args={[0.6, 0.2, 0.02]} />
                </mesh>
              ))}

              {/* Status LED: application accent on the routed server, shade otherwise */}
              <mesh
                position={[0.3, 0.6, 0.28]}
                material={
                  isActive
                    ? accent('application')
                    : server.status === 'active'
                      ? MONO.screen
                      : MONO.panel
                }
              >
                <sphereGeometry args={[0.04]} />
              </mesh>

              {/* Selection indicator */}
              {isActive && (
                <mesh position={[0, 0, 0.3]} material={accent('application', 1.2)}>
                  <ringGeometry args={[0.5, 0.55, 32]} />
                </mesh>
              )}

              {/* Server ID */}
              <Text
                position={[0, -1, 0]}
                fontSize={0.1}
                color={isActive ? LAYER.application : theme.textMuted}
                anchorX="center"
              >
                {server.id}
              </Text>

              {/* Load bar */}
              <group position={[0, -1.2, 0]}>
                <mesh material={MONO.panel}>
                  <planeGeometry args={[0.7, 0.1]} />
                </mesh>
                <mesh
                  position={[-(0.7 - (server.load / 100) * 0.7) / 2, 0, 0.01]}
                  material={isActive ? accent('application', 1.0) : MONO.screen}
                >
                  <planeGeometry args={[(server.load / 100) * 0.7, 0.08]} />
                </mesh>
              </group>
              <Text
                position={[0, -1.4, 0]}
                fontSize={0.06}
                color={theme.textMuted}
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
          color={theme.text}
          anchorX="center"
        >
          Google Server Farm
        </Text>
        <Text
          position={[0, 0.95, 0]}
          fontSize={0.1}
          color={theme.textMuted}
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
    const theme = useTheme();
    return (
      <group position={position} ref={ref}>
        {/* Incoming traffic line */}
        <mesh
          position={[-2, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          material={accent('application', 1.2)}
        >
          <cylinderGeometry args={[0.03, 0.03, 1.5, 8]} />
        </mesh>

        {/* Distribution arrows going to servers */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (-30 + i * 20) * (Math.PI / 180);
          const isActive = i === targetServer;
          const length = 1.5;

          return (
            <group key={i} position={[-1, 0, 0]} rotation={[0, 0, angle]}>
              {isActive ? (
                <mesh
                  position={[length / 2, 0, 0]}
                  rotation={[0, 0, Math.PI / 2]}
                  material={accent('application')}
                >
                  <cylinderGeometry args={[0.02, 0.02, length, 8]} />
                </mesh>
              ) : (
                <mesh
                  position={[length / 2, 0, 0]}
                  rotation={[0, 0, Math.PI / 2]}
                >
                  <cylinderGeometry args={[0.02, 0.02, length, 8]} />
                  <meshBasicMaterial
                    color={theme.lineMuted}
                    transparent
                    opacity={0.5}
                  />
                </mesh>
              )}
              {isActive && (
                <mesh
                  position={[length, 0, 0]}
                  rotation={[0, 0, -Math.PI / 2]}
                  material={accent('application')}
                >
                  <coneGeometry args={[0.06, 0.12, 8]} />
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
