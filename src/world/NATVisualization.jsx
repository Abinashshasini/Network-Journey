import { Text, RoundedBox } from '@react-three/drei';
import { forwardRef } from 'react';

/**
 * NAT Gateway visualization - shows IP translation
 */
export const NATGateway = forwardRef(({ position = [0, 0, 0] }, ref) => {
  return (
    <group position={position} ref={ref} scale={1.5}>
      {/* Gateway box */}
      <RoundedBox args={[1.5, 1, 0.8]} radius={0.1}>
        <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.7} />
      </RoundedBox>

      {/* NAT label */}
      <Text
        position={[0, 0.2, 0.45]}
        fontSize={0.2}
        color="#eab308"
        anchorX="center"
        fontWeight="bold"
      >
        NAT
      </Text>

      {/* Translation arrows */}
      <mesh position={[-0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.1, 0.2, 8]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      <mesh position={[0.9, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.1, 0.2, 8]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>

      {/* Private side indicator */}
      <Text
        position={[-0.9, -0.3, 0.45]}
        fontSize={0.08}
        color="#3b82f6"
        anchorX="center"
      >
        Private
      </Text>

      {/* Public side indicator */}
      <Text
        position={[0.9, -0.3, 0.45]}
        fontSize={0.08}
        color="#22c55e"
        anchorX="center"
      >
        Public
      </Text>

      {/* Label below */}
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.15}
        color="#94a3b8"
        anchorX="center"
      >
        Network Address Translation
      </Text>
    </group>
  );
});

/**
 * NAT Translation Table
 */
export const NATTable = forwardRef(({ position = [0, 0, 0] }, ref) => {
  const translations = [
    {
      private: '192.168.1.5:54321',
      public: '203.45.67.89:54321',
      protocol: 'TCP',
    },
    {
      private: '192.168.1.5:54322',
      public: '203.45.67.89:54322',
      protocol: 'TCP',
    },
    {
      private: '192.168.1.10:8080',
      public: '203.45.67.89:8080',
      protocol: 'UDP',
    },
  ];

  return (
    <group position={position} ref={ref}>
      {/* Table background */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[4, 2.2]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.95} />
      </mesh>

      {/* Border glow */}
      <mesh position={[0, 0, -0.12]}>
        <planeGeometry args={[4.1, 2.3]} />
        <meshStandardMaterial color="#eab308" transparent opacity={0.3} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 0.9, 0]}
        fontSize={0.18}
        color="#eab308"
        anchorX="center"
        fontWeight="bold"
      >
        NAT Translation Table
      </Text>

      {/* Headers */}
      <Text
        position={[-1.5, 0.55, 0]}
        fontSize={0.1}
        color="#94a3b8"
        anchorX="left"
      >
        Private IP:Port
      </Text>
      <Text
        position={[0.3, 0.55, 0]}
        fontSize={0.1}
        color="#94a3b8"
        anchorX="left"
      >
        Public IP:Port
      </Text>
      <Text
        position={[1.5, 0.55, 0]}
        fontSize={0.1}
        color="#94a3b8"
        anchorX="left"
      >
        Proto
      </Text>

      {/* Separator */}
      <mesh position={[0, 0.4, 0]}>
        <planeGeometry args={[3.8, 0.01]} />
        <meshStandardMaterial color="#475569" />
      </mesh>

      {/* Translation entries */}
      {translations.map((entry, i) => (
        <group key={i} position={[0, 0.15 - i * 0.35, 0]}>
          <Text
            position={[-1.5, 0, 0]}
            fontSize={0.1}
            color="#3b82f6"
            anchorX="left"
            fontFamily="monospace"
          >
            {entry.private}
          </Text>

          {/* Arrow */}
          <Text
            position={[0, 0, 0]}
            fontSize={0.12}
            color="#64748b"
            anchorX="center"
          >
            →
          </Text>

          <Text
            position={[0.3, 0, 0]}
            fontSize={0.1}
            color="#22c55e"
            anchorX="left"
            fontFamily="monospace"
          >
            {entry.public}
          </Text>
          <Text
            position={[1.5, 0, 0]}
            fontSize={0.1}
            color="#94a3b8"
            anchorX="left"
          >
            {entry.protocol}
          </Text>
        </group>
      ))}

      {/* Caption */}
      <Text
        position={[0, -0.95, 0]}
        fontSize={0.08}
        color="#64748b"
        anchorX="center"
      >
        Translates private addresses to public for internet communication
      </Text>
    </group>
  );
});

/**
 * IP Address transformation visual
 */
export const IPTransform = forwardRef(
  (
    {
      position = [0, 0, 0],
      privateIP = '192.168.1.5',
      publicIP = '203.45.67.89',
    },
    ref,
  ) => {
    return (
      <group position={position} ref={ref}>
        {/* Private IP box */}
        <group position={[-1.5, 0, 0]}>
          <RoundedBox args={[1.2, 0.5, 0.2]} radius={0.05}>
            <meshStandardMaterial color="#3b82f6" />
          </RoundedBox>
          <Text
            position={[0, 0, 0.15]}
            fontSize={0.1}
            color="#ffffff"
            anchorX="center"
            fontFamily="monospace"
          >
            {privateIP}
          </Text>
          <Text
            position={[0, -0.4, 0]}
            fontSize={0.08}
            color="#94a3b8"
            anchorX="center"
          >
            Private IP
          </Text>
        </group>

        {/* Transformation arrow */}
        <group position={[0, 0, 0]}>
          <mesh rotation={[0, 0, -Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
            <meshStandardMaterial color="#eab308" />
          </mesh>
          <mesh position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.08, 0.15, 8]} />
            <meshStandardMaterial color="#eab308" />
          </mesh>
          <Text
            position={[0, 0.25, 0]}
            fontSize={0.08}
            color="#eab308"
            anchorX="center"
          >
            NAT
          </Text>
        </group>

        {/* Public IP box */}
        <group position={[1.5, 0, 0]}>
          <RoundedBox args={[1.2, 0.5, 0.2]} radius={0.05}>
            <meshStandardMaterial color="#22c55e" />
          </RoundedBox>
          <Text
            position={[0, 0, 0.15]}
            fontSize={0.1}
            color="#ffffff"
            anchorX="center"
            fontFamily="monospace"
          >
            {publicIP}
          </Text>
          <Text
            position={[0, -0.4, 0]}
            fontSize={0.08}
            color="#94a3b8"
            anchorX="center"
          >
            Public IP
          </Text>
        </group>
      </group>
    );
  },
);

export default { NATGateway, NATTable, IPTransform };
