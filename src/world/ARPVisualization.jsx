import { Text, RoundedBox } from '@react-three/drei';
import { forwardRef } from 'react';

/**
 * ARP Broadcast Packet - shows the "Who has IP X?" broadcast
 */
export const ARPBroadcast = forwardRef(
  ({ position = [0, 0, 0], label = 'ARP Request' }, ref) => {
    return (
      <group position={position} ref={ref}>
        {/* Broadcast waves */}
        <mesh>
          <ringGeometry args={[0.3, 0.35, 32]} />
          <meshStandardMaterial color="#f97316" transparent opacity={0.8} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.5, 0.55, 32]} />
          <meshStandardMaterial color="#f97316" transparent opacity={0.5} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.7, 0.75, 32]} />
          <meshStandardMaterial color="#f97316" transparent opacity={0.3} />
        </mesh>

        {/* Center packet */}
        <mesh>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color="#f97316"
            emissive="#f97316"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Label */}
        <Text
          position={[0, 0.6, 0]}
          fontSize={0.15}
          color="#ffffff"
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
    return (
      <group position={position} ref={ref}>
        {/* Response packet */}
        <RoundedBox args={[0.6, 0.3, 0.15]} radius={0.05}>
          <meshStandardMaterial color="#22c55e" />
        </RoundedBox>

        {/* MAC address label */}
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.08}
          color="#ffffff"
          anchorX="center"
        >
          {macAddress}
        </Text>

        {/* Label */}
        <Text
          position={[0, 0.4, 0]}
          fontSize={0.12}
          color="#ffffff"
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
  const entries = [
    { ip: '192.168.1.1', mac: 'AA:BB:CC:11:22:33', type: 'Router' },
    { ip: '192.168.1.5', mac: 'DD:EE:FF:44:55:66', type: 'Laptop' },
    { ip: '192.168.1.10', mac: '11:22:33:AA:BB:CC', type: 'Phone' },
  ];

  return (
    <group position={position} ref={ref}>
      {/* Table background */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial color="#1e293b" transparent opacity={0.9} />
      </mesh>

      {/* Border */}
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[3.1, 2.1]} />
        <meshStandardMaterial color="#f97316" transparent opacity={0.5} />
      </mesh>

      {/* Title */}
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.18}
        color="#f97316"
        anchorX="center"
        fontWeight="bold"
      >
        ARP Cache Table
      </Text>

      {/* Headers */}
      <Text
        position={[-1, 0.5, 0]}
        fontSize={0.1}
        color="#94a3b8"
        anchorX="left"
      >
        IP Address
      </Text>
      <Text
        position={[0.2, 0.5, 0]}
        fontSize={0.1}
        color="#94a3b8"
        anchorX="left"
      >
        MAC Address
      </Text>
      <Text
        position={[1.1, 0.5, 0]}
        fontSize={0.1}
        color="#94a3b8"
        anchorX="left"
      >
        Type
      </Text>

      {/* Separator line */}
      <mesh position={[0, 0.35, 0]}>
        <planeGeometry args={[2.8, 0.01]} />
        <meshStandardMaterial color="#475569" />
      </mesh>

      {/* Table entries */}
      {entries.map((entry, i) => (
        <group key={i} position={[0, 0.15 - i * 0.35, 0]}>
          <Text
            position={[-1, 0, 0]}
            fontSize={0.1}
            color="#e2e8f0"
            anchorX="left"
          >
            {entry.ip}
          </Text>
          <Text
            position={[0.2, 0, 0]}
            fontSize={0.08}
            color="#06b6d4"
            anchorX="left"
            fontFamily="monospace"
          >
            {entry.mac}
          </Text>
          <Text
            position={[1.1, 0, 0]}
            fontSize={0.1}
            color="#22c55e"
            anchorX="left"
          >
            {entry.type}
          </Text>
        </group>
      ))}

      {/* Caption */}
      <Text
        position={[0, -0.85, 0]}
        fontSize={0.08}
        color="#64748b"
        anchorX="center"
      >
        Maps IP addresses to hardware MAC addresses
      </Text>
    </group>
  );
});

export default { ARPBroadcast, ARPResponse, ARPTable };
