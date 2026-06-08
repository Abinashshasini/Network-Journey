import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import { subscribe } from '../stores/scrollStore';

const DNS_ACTIVE_START = 0.22;
const DNS_ACTIVE_END = 0.34;

const nodes = [
  { id: 'recursive', label: 'Recursive\nResolver',  color: '#06b6d4', pos: [-1,  2.2, 0] },
  { id: 'root',      label: 'Root DNS\nServer',      color: '#f87171', pos: [ 0,  4.5, 0] },
  { id: 'tld',       label: '.com TLD\nServer',      color: '#fb923c', pos: [ 2,  3.0, 0] },
  { id: 'auth',      label: 'Authoritative\ngoogle.com', color: '#4ade80', pos: [ 1,  1.0, 0] },
];

// Edges: recursive→root→tld→auth→recursive (query path)
const edges = [
  [0, 1], // Recursive → Root
  [1, 2], // Root → TLD
  [2, 3], // TLD → Authoritative
  [3, 0], // Authoritative → Recursive (returns IP)
];

function DNSNodeMesh({ pos, color, label, pulseOffset = 0 }) {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime + pulseOffset;
    if (meshRef.current) {
      meshRef.current.scale.setScalar(0.9 + Math.sin(t * 1.8) * 0.08);
    }
    if (glowRef.current) {
      glowRef.current.material.emissiveIntensity = 0.3 + Math.sin(t * 1.8 + 0.5) * 0.2;
    }
  });

  return (
    <group position={pos}>
      {/* Outer glow ring */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.32, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} transparent opacity={0.25} />
      </mesh>
      {/* Core sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} roughness={0.2} />
      </mesh>
      {/* Label */}
      <Text
        position={[0.55, 0, 0]}
        fontSize={0.18}
        color={color}
        anchorX="left"
        anchorY="middle"
        lineHeight={1.3}
      >
        {label}
      </Text>
    </group>
  );
}

export default function DNSNodes({ position = [0, 0, 0] }) {
  const groupRef = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return subscribe((progress) => {
      setVisible(progress >= DNS_ACTIVE_START && progress <= DNS_ACTIVE_END);
    });
  }, []);

  // Edge line points (in local space)
  const edgePoints = edges.map(([a, b]) => [
    new THREE.Vector3(...nodes[a].pos),
    new THREE.Vector3(...nodes[b].pos),
  ]);

  if (!visible) return null;

  return (
    <group ref={groupRef} position={position}>
      {/* Connection lines between DNS nodes */}
      {edgePoints.map((pts, i) => (
        <Line
          key={i}
          points={pts}
          color={nodes[edges[i][0]].color}
          lineWidth={1}
          dashed
          dashSize={0.1}
          gapSize={0.08}
          transparent
          opacity={0.5}
        />
      ))}

      {/* DNS node spheres + labels */}
      {nodes.map((n, i) => (
        <DNSNodeMesh
          key={n.id}
          pos={n.pos}
          color={n.color}
          label={n.label}
          pulseOffset={i * 0.7}
        />
      ))}

      {/* Section header */}
      <Text
        position={[0.5, 5.5, 0]}
        fontSize={0.22}
        color="#8b5cf6"
        anchorX="center"
        fontWeight="bold"
      >
        DNS Hierarchy
      </Text>
    </group>
  );
}
