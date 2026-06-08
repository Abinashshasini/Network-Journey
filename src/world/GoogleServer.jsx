import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import { MetalMaterial, NeonMaterial } from '../materials/PremiumMaterials';
import { getProgress, subscribe } from '../stores/scrollStore';

const RING_COLOR = '#ec4899'; // matches DNS→Google SSL/TCP line
const LO = 0.32, HI = 0.66;

// Server-side request lifecycle states
const STATES = [
  { label: 'Request received', color: '#06b6d4' },
  { label: 'Cache check...',   color: '#eab308' },
  { label: 'Building response', color: '#f97316' },
  { label: '→ Sending data',   color: '#22c55e' },
];

const HTTP_START = 0.54;
const HTTP_END   = 0.66;

export default function GoogleServer({ position = [28, 0, 0] }) {
  const groupRef    = useRef();
  const stripeRefs  = useRef([]);
  const statusRef   = useRef();
  const ringRef     = useRef();
  const stateDotRefs = useRef([]);
  const [ringActive, setRingActive] = useState(false);

  useEffect(() => {
    return subscribe((p) => setRingActive(p >= LO && p <= HI));
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const progress = getProgress();

    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.5 + 3) * 0.03;
    }

    stripeRefs.current.forEach((ref, i) => {
      if (ref) {
        const phase = t * 2 - i * 0.5;
        ref.material.emissiveIntensity = 0.2 + Math.max(0, Math.sin(phase)) * 0.3;
      }
    });

    if (statusRef.current) {
      const beat = Math.pow(Math.sin(t * 2), 20);
      statusRef.current.material.emissiveIntensity = 0.5 + beat * 1.5;
    }

    if (ringRef.current) {
      const mat = ringRef.current.material;
      mat.opacity = mat.opacity + (ringActive ? 0.8 : 0) * 0.06 - mat.opacity * 0.04;
      if (ringActive) mat.emissiveIntensity = 0.4 + Math.sin(t * 3) * 0.25;
    }

    // State machine: light up one row at a time during HTTP phase
    if (stateDotRefs.current.length > 0) {
      const inHTTP = progress >= HTTP_START && progress <= HTTP_END;
      const phaseT = inHTTP ? (progress - HTTP_START) / (HTTP_END - HTTP_START) : -1;

      stateDotRefs.current.forEach((ref, i) => {
        if (!ref) return;
        const activated = phaseT >= i / STATES.length;
        ref.material.emissiveIntensity = activated ? (0.7 + Math.sin(t * 4 + i) * 0.3) : 0.05;
        ref.material.color.set(activated ? STATES[i].color : '#1e293b');
        ref.material.emissive.set(activated ? STATES[i].color : '#000000');
      });
    }
  });

  const stripeColors = ['#4285f4', '#ea4335', '#fbbc05', '#34a853'];

  return (
    <group ref={groupRef} position={position} scale={1.5}>
      {/* Active ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.27, 0]}>
        <torusGeometry args={[1.6, 0.04, 8, 48]} />
        <meshStandardMaterial color={RING_COLOR} emissive={RING_COLOR} emissiveIntensity={0} transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Building chassis */}
      <RoundedBox args={[3, 2.5, 2]} radius={0.1} position={[0, 0, 0]}>
        <MetalMaterial color="#0f172a" metalness={0.8} roughness={0.3} clearcoat={0.7} />
      </RoundedBox>

      {/* Google stripes */}
      {stripeColors.map((color, i) => (
        <mesh key={i} position={[0, 0.8 - i * 0.2, 1.04]} ref={(el) => (stripeRefs.current[i] = el)}>
          <boxGeometry args={[2.5, 0.15, 0.02]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
        </mesh>
      ))}

      {/* Server rack bays */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={i} position={[x, -0.5, 1.04]}>
          <boxGeometry args={[0.2, 0.6, 0.02]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>
      ))}

      {/* Status heartbeat */}
      <mesh ref={statusRef} position={[1.2, 1.1, 1.05]}>
        <sphereGeometry args={[0.09]} />
        <NeonMaterial color="#22c55e" intensity={0.5} />
      </mesh>

      {/* ── Server-side state machine panel ────────── */}
      {/* Appears to the left of the server, only during HTTP phase */}
      <group position={[-2.4, 0.5, 0]}>
        {/* Background panel */}
        <mesh position={[0, 0, -0.05]}>
          <planeGeometry args={[1.8, 1.4]} />
          <meshStandardMaterial color="#0a1628" transparent opacity={0.85} />
        </mesh>

        {/* Panel title */}
        <Text position={[0, 0.55, 0]} fontSize={0.13} color="#64748b" anchorX="center">
          SERVER PROCESSING
        </Text>

        {/* State rows */}
        {STATES.map((s, i) => (
          <group key={i} position={[0, 0.28 - i * 0.26, 0]}>
            {/* Indicator dot */}
            <mesh
              position={[-0.72, 0, 0]}
              ref={(el) => (stateDotRefs.current[i] = el)}
            >
              <sphereGeometry args={[0.055, 8, 8]} />
              <meshStandardMaterial color="#1e293b" emissive="#000000" emissiveIntensity={0.05} />
            </mesh>
            {/* Label */}
            <Text position={[-0.03, 0, 0.01]} fontSize={0.12} color="#64748b" anchorX="left">
              {s.label}
            </Text>
          </group>
        ))}
      </group>

      <Text position={[0, -1.8, 0]}  fontSize={0.3}  color="#94a3b8" anchorX="center">Google Server</Text>
      <Text position={[0, -2.15, 0]} fontSize={0.12} color="#475569" anchorX="center">142.250.190.14</Text>
    </group>
  );
}
