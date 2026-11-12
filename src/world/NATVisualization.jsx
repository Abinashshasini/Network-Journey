import { Text, RoundedBox, Edges } from '@react-three/drei';
import { forwardRef } from 'react';
import { MONO, accent } from '../theme/materials';
import { useTheme, LAYER } from '../theme/tokens';

/**
 * NAT Gateway visualization - shows IP translation
 */
export const NATGateway = forwardRef(({ position = [0, 0, 0] }, ref) => {
  const theme = useTheme();
  return (
    <group position={position} ref={ref} scale={1.5}>
      {/* Gateway box */}
      <RoundedBox args={[1.5, 1, 0.8]} radius={0.1} material={MONO.body}>
        <Edges threshold={15} color={theme.line} />
      </RoundedBox>

      {/* NAT label */}
      <Text
        position={[0, 0.2, 0.45]}
        fontSize={0.2}
        color={LAYER.network}
        anchorX="center"
        fontWeight="bold"
      >
        NAT
      </Text>

      {/* Translation arrows: private side in mono, public side in network accent */}
      <mesh
        position={[-0.9, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
        material={MONO.screen}
      >
        <coneGeometry args={[0.1, 0.2, 8]} />
      </mesh>
      <mesh
        position={[0.9, 0, 0]}
        rotation={[0, 0, -Math.PI / 2]}
        material={accent('network')}
      >
        <coneGeometry args={[0.1, 0.2, 8]} />
      </mesh>

      {/* Private side indicator */}
      <Text
        position={[-0.9, -0.3, 0.45]}
        fontSize={0.08}
        color={theme.textMuted}
        anchorX="center"
      >
        Private
      </Text>

      {/* Public side indicator */}
      <Text
        position={[0.9, -0.3, 0.45]}
        fontSize={0.08}
        color={LAYER.network}
        anchorX="center"
      >
        Public
      </Text>

      {/* Label below */}
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.15}
        color={theme.textMuted}
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
  const theme = useTheme();
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
  // Row 0 is our laptop's connection - the highlighted mapping.
  const HIGHLIGHT_ROW = 0;

  return (
    <group position={position} ref={ref}>
      {/* Table background + outline */}
      <mesh position={[0, 0, -0.1]} material={MONO.panel}>
        <planeGeometry args={[4, 2.2]} />
        <Edges threshold={15} color={theme.line} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 0.9, 0]}
        fontSize={0.18}
        color={theme.text}
        anchorX="center"
        fontWeight="bold"
      >
        NAT Translation Table
      </Text>

      {/* Headers */}
      <Text
        position={[-1.5, 0.55, 0]}
        fontSize={0.1}
        color={theme.textMuted}
        anchorX="left"
      >
        Private IP:Port
      </Text>
      <Text
        position={[0.3, 0.55, 0]}
        fontSize={0.1}
        color={theme.textMuted}
        anchorX="left"
      >
        Public IP:Port
      </Text>
      <Text
        position={[1.5, 0.55, 0]}
        fontSize={0.1}
        color={theme.textMuted}
        anchorX="left"
      >
        Proto
      </Text>

      {/* Header rule (network accent) */}
      <mesh position={[0, 0.4, 0]} material={accent('network', 1.0)}>
        <planeGeometry args={[3.8, 0.01]} />
      </mesh>

      {/* Translation entries */}
      {translations.map((entry, i) => {
        const hi = i === HIGHLIGHT_ROW;
        return (
          <group key={i} position={[0, 0.15 - i * 0.35, 0]}>
            <Text
              position={[-1.5, 0, 0]}
              fontSize={0.1}
              color={theme.text}
              anchorX="left"
              fontFamily="monospace"
            >
              {entry.private}
            </Text>

            {/* Arrow */}
            <Text
              position={[0, 0, 0]}
              fontSize={0.12}
              color={hi ? LAYER.network : theme.textMuted}
              anchorX="center"
            >
              {'->'}
            </Text>

            <Text
              position={[0.3, 0, 0]}
              fontSize={0.1}
              color={hi ? LAYER.network : theme.text}
              anchorX="left"
              fontFamily="monospace"
            >
              {entry.public}
            </Text>
            <Text
              position={[1.5, 0, 0]}
              fontSize={0.1}
              color={theme.textMuted}
              anchorX="left"
            >
              {entry.protocol}
            </Text>
          </group>
        );
      })}

      {/* Caption */}
      <Text
        position={[0, -0.95, 0]}
        fontSize={0.08}
        color={theme.textMuted}
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
    const theme = useTheme();
    return (
      <group position={position} ref={ref}>
        {/* Private IP box */}
        <group position={[-1.5, 0, 0]}>
          <RoundedBox args={[1.2, 0.5, 0.2]} radius={0.05} material={MONO.panel}>
            <Edges threshold={15} color={theme.line} />
          </RoundedBox>
          <Text
            position={[0, 0, 0.15]}
            fontSize={0.1}
            color={theme.text}
            anchorX="center"
            fontFamily="monospace"
          >
            {privateIP}
          </Text>
          <Text
            position={[0, -0.4, 0]}
            fontSize={0.08}
            color={theme.textMuted}
            anchorX="center"
          >
            Private IP
          </Text>
        </group>

        {/* Transformation arrow */}
        <group position={[0, 0, 0]}>
          <mesh rotation={[0, 0, -Math.PI / 2]} material={accent('network')}>
            <cylinderGeometry args={[0.03, 0.03, 0.8, 8]} />
          </mesh>
          <mesh
            position={[0.5, 0, 0]}
            rotation={[0, 0, -Math.PI / 2]}
            material={accent('network')}
          >
            <coneGeometry args={[0.08, 0.15, 8]} />
          </mesh>
          <Text
            position={[0, 0.25, 0]}
            fontSize={0.08}
            color={LAYER.network}
            anchorX="center"
          >
            NAT
          </Text>
        </group>

        {/* Public IP box (network-accent outline) */}
        <group position={[1.5, 0, 0]}>
          <RoundedBox args={[1.2, 0.5, 0.2]} radius={0.05} material={MONO.panel}>
            <Edges threshold={15} color={LAYER.network} />
          </RoundedBox>
          <Text
            position={[0, 0, 0.15]}
            fontSize={0.1}
            color={theme.text}
            anchorX="center"
            fontFamily="monospace"
          >
            {publicIP}
          </Text>
          <Text
            position={[0, -0.4, 0]}
            fontSize={0.08}
            color={theme.textMuted}
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
