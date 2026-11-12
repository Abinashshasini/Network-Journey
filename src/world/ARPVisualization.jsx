import { Text, RoundedBox, Edges } from '@react-three/drei';
import { forwardRef } from 'react';
import { MONO, accent } from '../theme/materials';
import { useTheme, LAYER } from '../theme/tokens';

/**
 * ARP Broadcast Packet - shows the "Who has IP X?" broadcast
 */
export const ARPBroadcast = forwardRef(
  ({ position = [0, 0, 0], label = 'ARP Request' }, ref) => {
    const theme = useTheme();
    return (
      <group position={position} ref={ref}>
        {/* Broadcast waves (link accent, fading outward) */}
        <mesh>
          <ringGeometry args={[0.3, 0.35, 32]} />
          <meshBasicMaterial color={LAYER.link} transparent opacity={0.8} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.5, 0.55, 32]} />
          <meshBasicMaterial color={LAYER.link} transparent opacity={0.5} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.7, 0.75, 32]} />
          <meshBasicMaterial color={LAYER.link} transparent opacity={0.3} />
        </mesh>

        {/* Center packet */}
        <mesh material={accent('link')}>
          <sphereGeometry args={[0.2, 16, 16]} />
        </mesh>

        {/* Label */}
        <Text
          position={[0, 0.6, 0]}
          fontSize={0.15}
          color={theme.text}
          anchorX="center"
        >
          {label}
        </Text>
      </group>
    );
  },
);

/**
 * ARP Response Packet
 */
export const ARPResponse = forwardRef(
  ({ position = [0, 0, 0], macAddress = 'AA:BB:CC:DD:EE:FF' }, ref) => {
    const theme = useTheme();
    return (
      <group position={position} ref={ref}>
        {/* Response packet: mono body, link-accent outline */}
        <RoundedBox args={[0.6, 0.3, 0.15]} radius={0.05} material={MONO.body}>
          <Edges threshold={15} color={LAYER.link} />
        </RoundedBox>

        {/* MAC address label */}
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.08}
          color={LAYER.link}
          anchorX="center"
        >
          {macAddress}
        </Text>

        {/* Label */}
        <Text
          position={[0, 0.4, 0]}
          fontSize={0.12}
          color={theme.text}
          anchorX="center"
        >
          ARP Reply
        </Text>
      </group>
    );
  },
);

/**
 * ARP Table visualization
 */
export const ARPTable = forwardRef(({ position = [0, 0, 0] }, ref) => {
  const theme = useTheme();
  const entries = [
    { ip: '192.168.1.1', mac: 'AA:BB:CC:11:22:33', type: 'Router' },
    { ip: '192.168.1.5', mac: 'DD:EE:FF:44:55:66', type: 'Laptop' },
    { ip: '192.168.1.10', mac: '11:22:33:AA:BB:CC', type: 'Phone' },
  ];
  // Row 0 (the router / default gateway) is the entry the laptop resolves.
  const HIGHLIGHT_ROW = 0;

  return (
    <group position={position} ref={ref}>
      {/* Table background + outline */}
      <mesh position={[0, 0, -0.1]} material={MONO.panel}>
        <planeGeometry args={[3, 2]} />
        <Edges threshold={15} color={theme.line} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.18}
        color={theme.text}
        anchorX="center"
        fontWeight="bold"
      >
        ARP Cache Table
      </Text>

      {/* Headers */}
      <Text
        position={[-1, 0.5, 0]}
        fontSize={0.1}
        color={theme.textMuted}
        anchorX="left"
      >
        IP Address
      </Text>
      <Text
        position={[0.2, 0.5, 0]}
        fontSize={0.1}
        color={theme.textMuted}
        anchorX="left"
      >
        MAC Address
      </Text>
      <Text
        position={[1.1, 0.5, 0]}
        fontSize={0.1}
        color={theme.textMuted}
        anchorX="left"
      >
        Type
      </Text>

      {/* Header rule (link accent) */}
      <mesh position={[0, 0.35, 0]} material={accent('link', 1.0)}>
        <planeGeometry args={[2.8, 0.01]} />
      </mesh>

      {/* Table entries */}
      {entries.map((entry, i) => {
        const hi = i === HIGHLIGHT_ROW;
        return (
          <group key={i} position={[0, 0.15 - i * 0.35, 0]}>
            <Text
              position={[-1, 0, 0]}
              fontSize={0.1}
              color={theme.text}
              anchorX="left"
            >
              {entry.ip}
            </Text>
            <Text
              position={[0.2, 0, 0]}
              fontSize={0.08}
              color={hi ? LAYER.link : theme.text}
              anchorX="left"
              fontFamily="monospace"
            >
              {entry.mac}
            </Text>
            <Text
              position={[1.1, 0, 0]}
              fontSize={0.1}
              color={theme.textMuted}
              anchorX="left"
            >
              {entry.type}
            </Text>
          </group>
        );
      })}

      {/* Caption */}
      <Text
        position={[0, -0.85, 0]}
        fontSize={0.08}
        color={theme.textMuted}
        anchorX="center"
      >
        Maps IP addresses to hardware MAC addresses
      </Text>
    </group>
  );
});

export default { ARPBroadcast, ARPResponse, ARPTable };
