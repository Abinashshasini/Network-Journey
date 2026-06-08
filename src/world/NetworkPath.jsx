import { Text, Line } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getProgress } from '../stores/scrollStore';

import Laptop from './Laptop';
import Router from './Router';
import ISPNode from './ISPNode';
import SubmarineCable from './SubmarineCable';
import DNSServer from './DNSServer';
import GoogleServer from './GoogleServer';
import DNSNodes from './DNSNodes';
import EncryptionTunnel from './EncryptionTunnel';
import TCPHandshakeIndicator from '../ui/TCPHandshakeIndicator';
import SSLHandshakeIndicator from '../ui/SSLHandshakeIndicator';

import { ARPTable } from './ARPVisualization';
import { NATGateway, NATTable } from './NATVisualization';
import { LoadBalancer, ServerFarm } from './LoadBalancerVisualization';

/**
 * Animated connection line — dashes flow continuously, faster when data is
 * actively passing through this segment (activeRange = [startProgress, endProgress]).
 */
function ConnectionLine({ start, end, color = '#94a3b8', activeRange = [0, 0] }) {
  const lineRef = useRef();

  const points = useMemo(
    () => [new THREE.Vector3(...start), new THREE.Vector3(...end)],
    [start, end],
  );

  useFrame((state) => {
    if (!lineRef.current?.material) return;
    const progress = getProgress();
    const [lo, hi] = activeRange;
    const isActive = progress >= lo && progress <= hi;
    // Active: fast flow (2.5 units/s). Idle: slow background heartbeat (0.35).
    const speed = isActive ? 2.5 : 0.35;
    lineRef.current.material.dashOffset = -state.clock.elapsedTime * speed;
  });

  return (
    <Line
      ref={lineRef}
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
  const positions = {
    laptop:     [-12, 0, 0],
    router:     [-6, 0, 0],
    isp:        [0, 0, 0],
    cableStart: [4, -1, 0],
    cableEnd:   [18, -1, 0],
    dns:        [22, 0, 0],
    google:     [32, 0, 0],
  };

  return (
    <group>
      {/* ── NODES ─────────────────────────────────── */}
      <Laptop     position={positions.laptop} />
      <Router     position={positions.router} />
      <ISPNode    position={positions.isp} />
      <SubmarineCable startPos={positions.cableStart} endPos={positions.cableEnd} />
      <DNSServer  position={positions.dns} />
      <GoogleServer position={positions.google} />

      {/* DNS hierarchy — only visible during DNS phase (0.22-0.34) */}
      <DNSNodes position={positions.dns} />

      {/* Encryption tunnel — appears after SSL lock (0.51), persists through HTTP */}
      <EncryptionTunnel />

      {/* ── CONNECTIONS (each knows its active scroll range) ─── */}
      <ConnectionLine
        start={[-10, 0.5, 0]} end={[-7.5, 0.5, 0]}
        color="#22c55e" activeRange={[0.00, 0.12]}
      />
      <ConnectionLine
        start={[-4.5, 0, 0]} end={[-1.5, 0, 0]}
        color="#3b82f6" activeRange={[0.10, 0.20]}
      />
      <ConnectionLine
        start={[1.5, 0, 0]} end={[4, -1, 0]}
        color="#f97316" activeRange={[0.12, 0.22]}
      />
      <ConnectionLine
        start={[18, -1, 0]} end={[20.5, 0, 0]}
        color="#8b5cf6" activeRange={[0.20, 0.30]}
      />
      <ConnectionLine
        start={[23.5, 0, 0]} end={[29, 0, 0]}
        color="#ec4899" activeRange={[0.30, 0.66]}
      />

      {/* ── PATH LABELS ───────────────────────────── */}
      <Text position={[-9, 2, 0]}    fontSize={0.2} color="#16a34a" anchorX="center">WiFi</Text>
      <Text position={[-3, 2, 0]}    fontSize={0.2} color="#2563eb" anchorX="center">Fiber</Text>
      <Text position={[2.5, 1.5, 0]} fontSize={0.2} color="#ea580c" anchorX="center">Backbone</Text>
      <Text position={[19.5, 1.5, 0]} fontSize={0.2} color="#7c3aed" anchorX="center">DNS Query</Text>
      <Text position={[26, 2, 0]}    fontSize={0.2} color="#db2777" anchorX="center">TCP/SSL</Text>

      {/* ── HANDSHAKE INDICATORS ──────────────────── */}
      <TCPHandshakeIndicator position={[28, 4.5, -2]} />
      <SSLHandshakeIndicator position={[28, 4.5, -5]} />

      {/* ── VISUALIZATIONS ────────────────────────── */}
      <ARPTable    position={[-9, 4, -3]} />
      <NATGateway  position={[-6, 3.5, -4]} />
      <NATTable    position={[-3, 4, -5]} />
      <LoadBalancer position={[28, 0, 3]} />
      <ServerFarm  position={[36, 0, 0]} activeServer={1} />
    </group>
  );
}
