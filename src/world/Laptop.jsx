import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import { MetalMaterial, NeonMaterial } from '../materials/PremiumMaterials';
import { subscribe } from '../stores/scrollStore';

const RING_COLOR  = '#22c55e'; // matches Laptop→Router WiFi line
const RING_ACTIVE = [[0.00, 0.12], [0.60, 1.00]]; // two active windows

function isInActiveRange(progress) {
  return RING_ACTIVE.some(([lo, hi]) => progress >= lo && progress <= hi);
}

export default function Laptop({ position = [-12, 0, 0] }) {
  const groupRef    = useRef();
  const screenRef   = useRef();
  const cursorRef   = useRef();
  const ringRef     = useRef();

  // Finale page elements
  const navbarRef   = useRef();
  const heroRef     = useRef();
  const contentRef  = useRef();

  const [ringActive, setRingActive] = useState(false);

  useEffect(() => {
    let timeouts = [];
    let lastFinale = false;

    const unsub = subscribe((progress) => {
      setRingActive(isInActiveRange(progress));

      const inFinale = progress >= 0.94;
      if (inFinale && !lastFinale) {
        // Staggered page load
        timeouts.forEach(clearTimeout);
        timeouts = [
          setTimeout(() => { if (navbarRef.current)  navbarRef.current.visible  = true; }, 0),
          setTimeout(() => { if (heroRef.current)    heroRef.current.visible    = true; }, 350),
          setTimeout(() => { if (contentRef.current) contentRef.current.visible = true; }, 700),
        ];
      } else if (!inFinale && lastFinale) {
        // Reset when scrolling back
        timeouts.forEach(clearTimeout);
        if (navbarRef.current)  navbarRef.current.visible  = false;
        if (heroRef.current)    heroRef.current.visible    = false;
        if (contentRef.current) contentRef.current.visible = false;
      }
      lastFinale = inFinale;
    });

    return () => { unsub(); timeouts.forEach(clearTimeout); };
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.03;
    }
    if (screenRef.current) {
      screenRef.current.material.emissiveIntensity = 0.15 + Math.sin(t * 1.5) * 0.05;
    }
    if (cursorRef.current) {
      cursorRef.current.visible = Math.sin(t * 3) > 0;
    }
    if (ringRef.current) {
      if (ringActive) {
        ringRef.current.material.emissiveIntensity = 0.4 + Math.sin(t * 3) * 0.25;
        ringRef.current.material.opacity = THREE_lerp(ringRef.current.material.opacity, 0.8, 0.06);
      } else {
        ringRef.current.material.opacity = THREE_lerp(ringRef.current.material.opacity, 0, 0.04);
      }
    }
  });

  return (
    <group ref={groupRef} position={position} scale={1.5}>
      {/* Active highlight ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <torusGeometry args={[1.2, 0.04, 8, 48]} />
        <meshStandardMaterial
          color={RING_COLOR}
          emissive={RING_COLOR}
          emissiveIntensity={0}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      {/* Chassis */}
      <mesh position={[0, 0, 0]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[2.5, 0.15, 1.8]} />
        <MetalMaterial color="#334155" metalness={0.85} roughness={0.3} clearcoat={0.6} />
      </mesh>

      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[2.2, 0.02, 1.4]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} />
      </mesh>

      {/* Screen assembly */}
      <group position={[0, 1.1, -0.85]} rotation={[0.3, 0, 0]}>
        <RoundedBox args={[2.5, 1.8, 0.1]} radius={0.05}>
          <MetalMaterial color="#334155" metalness={0.85} roughness={0.25} clearcoat={0.7} />
        </RoundedBox>

        {/* Display */}
        <mesh ref={screenRef} position={[0, 0, 0.06]}>
          <planeGeometry args={[2.2, 1.5]} />
          <meshStandardMaterial color="#0d1b2e" emissive="#2563eb" emissiveIntensity={0.15} roughness={0.4} />
        </mesh>

        {/* Search bar (only visible before page loads) */}
        <mesh position={[0, 0.3, 0.07]}>
          <planeGeometry args={[1.8, 0.25]} />
          <meshStandardMaterial color="#f1f5f9" emissive="#e2e8f0" emissiveIntensity={0.15} />
        </mesh>
        <Text position={[0, 0.3, 0.08]} fontSize={0.12} color="#475569" anchorX="center">
          google.com
        </Text>
        <mesh ref={cursorRef} position={[0.55, 0.3, 0.08]}>
          <planeGeometry args={[0.02, 0.14]} />
          <NeonMaterial color="#3b82f6" intensity={1.5} />
        </mesh>

        {/* ── FINALE: staggered page-load elements ─────── */}
        {/* Navbar strip */}
        <mesh ref={navbarRef} position={[0, 0.62, 0.065]} visible={false}>
          <planeGeometry args={[2.1, 0.15]} />
          <meshStandardMaterial color="#f8fafc" emissive="#e2e8f0" emissiveIntensity={0.2} />
        </mesh>

        {/* Hero / search box (Google-style) */}
        <mesh ref={heroRef} position={[0, 0.25, 0.065]} visible={false}>
          <planeGeometry args={[1.4, 0.28]} />
          <meshStandardMaterial color="#ffffff" emissive="#dbeafe" emissiveIntensity={0.15} roughness={0.8} />
        </mesh>

        {/* Content rows */}
        <group ref={contentRef} visible={false}>
          {[-0.1, -0.25, -0.4].map((y, i) => (
            <mesh key={i} position={[0, y, 0.065]}>
              <planeGeometry args={[1.6 - i * 0.15, 0.07]} />
              <meshStandardMaterial color="#e2e8f0" emissive="#94a3b8" emissiveIntensity={0.05} />
            </mesh>
          ))}
        </group>
      </group>

      <Text position={[0, -0.8, 0]} fontSize={0.25} color="#94a3b8" anchorX="center">
        Your Device
      </Text>
    </group>
  );
}

// Inline lerp to avoid importing THREE just for this
function THREE_lerp(a, b, t) { return a + (b - a) * t; }
