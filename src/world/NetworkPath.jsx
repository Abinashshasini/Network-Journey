import { Text, Line } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

import Laptop from './Laptop';
import Router from './Router';
import ISPNode from './ISPNode';
import SubmarineCable from './SubmarineCable';
import DNSServer from './DNSServer';
import GoogleServer from './GoogleServer';
import TCPHandshakeIndicator from '../ui/TCPHandshakeIndicator';
import SSLHandshakeIndicator from '../ui/SSLHandshakeIndicator';

// New visualizations
import { ARPTable } from './ARPVisualization';
import { NATGateway, NATTable } from './NATVisualization';
import { LoadBalancer, ServerFarm } from './LoadBalancerVisualization';

// Connection line between nodes
function ConnectionLine({ start, end, color = '#94a3b8' }) {
  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  }, [start, end]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1.5}
      dashed
      dashSize={0.2}
      dashScale={1}
      gapSize={0.15}
    />
  );
}

export default function NetworkPath() {
  // Node positions (left to right journey)
  const positions = {
    laptop: [-12, 0, 0],
    router: [-6, 0, 0],
    isp: [0, 0, 0],
    cableStart: [4, -1, 0],
    cableEnd: [18, -1, 0],
    dns: [22, 0, 0],
    google: [32, 0, 0],
  };

  return (
    <group>
      {/* ==================
          NODES
      ================== */}

      {/* User's Laptop */}
      <Laptop position={positions.laptop} />

      {/* Home Router */}
      <Router position={positions.router} />

      {/* ISP Server */}
      <ISPNode position={positions.isp} />

      {/* Submarine Cable (leads to DNS servers) */}
      <SubmarineCable
        startPos={positions.cableStart}
        endPos={positions.cableEnd}
      />

      {/* DNS Server */}
      <DNSServer position={positions.dns} />

      {/* Google Server (destination) */}
      <GoogleServer position={positions.google} />

      {/* ==================
          CONNECTIONS
      ================== */}

      {/* Laptop → Router (WiFi) */}
      <ConnectionLine
        start={[-10, 0.5, 0]}
        end={[-7.5, 0.5, 0]}
        color="#22c55e"
      />

      {/* Router → ISP */}
      <ConnectionLine start={[-4.5, 0, 0]} end={[-1.5, 0, 0]} color="#3b82f6" />

      {/* ISP → Submarine Cable */}
      <ConnectionLine start={[1.5, 0, 0]} end={[4, -1, 0]} color="#f97316" />

      {/* Submarine Cable → DNS */}
      <ConnectionLine start={[18, -1, 0]} end={[20.5, 0, 0]} color="#8b5cf6" />

      {/* DNS → Google Server */}
      <ConnectionLine start={[23.5, 0, 0]} end={[29, 0, 0]} color="#ec4899" />

      {/* ==================
          PATH LABELS
      ================== */}
      <Text
        position={[-9, 2, 0]}
        fontSize={0.2}
        color="#16a34a"
        anchorX="center"
      >
        WiFi
      </Text>

      <Text
        position={[-3, 2, 0]}
        fontSize={0.2}
        color="#2563eb"
        anchorX="center"
      >
        Fiber
      </Text>

      <Text
        position={[2.5, 1.5, 0]}
        fontSize={0.2}
        color="#ea580c"
        anchorX="center"
      >
        Backbone
      </Text>

      <Text
        position={[19.5, 1.5, 0]}
        fontSize={0.2}
        color="#7c3aed"
        anchorX="center"
      >
        DNS Query
      </Text>

      <Text
        position={[26, 2, 0]}
        fontSize={0.2}
        color="#db2777"
        anchorX="center"
      >
        TCP/SSL
      </Text>

      {/* ==================
          HANDSHAKE INDICATORS
      ================== */}

      {/* TCP Handshake visual guide */}
      <TCPHandshakeIndicator position={[28, 4.5, -2]} />

      {/* SSL Handshake visual guide */}
      <SSLHandshakeIndicator position={[28, 4.5, -5]} />

      {/* ==================
          ARP, NAT, LOAD BALANCER VISUALIZATIONS
      ================== */}

      {/* ARP Table - shows MAC address resolution between Laptop and Router */}
      <ARPTable position={[-9, 4, -3]} />

      {/* NAT Gateway - shows IP translation at router */}
      <NATGateway position={[-6, 3.5, -4]} />

      {/* NAT Translation Table */}
      <NATTable position={[-3, 4, -5]} />

      {/* Load Balancer - before Google servers */}
      <LoadBalancer position={[28, 0, 3]} />

      {/* Server Farm - shows distributed Google servers */}
      <ServerFarm position={[36, 0, 0]} activeServer={1} />
    </group>
  );
}
