import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Edges } from '@react-three/drei';
import { MONO, accent } from '../theme/materials';
import { useTheme, LAYER } from '../theme/tokens';
import { subscribe } from '../stores/player';

const RING_COLOR  = LAYER.link; // matches Laptop->Router link line
const RING_ACTIVE = [[0.00, 0.12], [0.60, 1.00]]; // two active windows

function isInActiveRange(progress) {
  return RING_ACTIVE.some(([lo, hi]) => progress >= lo && progress <= hi);
}

export default function Laptop({ position = [-12, 0, 0] }) {
  const theme = useTheme();
  const groupRef    = useRef();
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
    if (cursorRef.current) {
      cursorRef.current.visible = Math.sin(t * 3) > 0;
    }
    if (ringRef.current) {
      if (ringActive) {
        ringRef.current.material.emissiveIntensity = 1.4 + Math.sin(t * 3) * 0.3;
        ringRef.current.material.opacity = THREE_lerp(ringRef.current.material.opacity, 0.8, 0.06);
      } else {
        ringRef.current.material.opacity = THREE_lerp(ringRef.current.material.opacity, 0, 0.04);
      }
    }
  });

  return (
    <group ref={groupRef} position={position} scale={1.5}>
      {/* Active highlight ring (link accent) */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <torusGeometry args={[1.2, 0.04, 8, 48]} />
        <meshStandardMaterial
          color={RING_COLOR}
          emissive={RING_COLOR}
          emissiveIntensity={0}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Chassis */}
      <mesh position={[0, 0, 0]} rotation={[-0.1, 0, 0]} material={MONO.body}>
        <boxGeometry args={[2.5, 0.15, 1.8]} />
        <Edges threshold={15} color={theme.line} />
      </mesh>

      <mesh position={[0, 0.08, 0]} material={MONO.panel}>
        <boxGeometry args={[2.2, 0.02, 1.4]} />
      </mesh>

      {/* Screen assembly */}
      <group position={[0, 1.1, -0.85]} rotation={[0.3, 0, 0]}>
        <RoundedBox args={[2.5, 1.8, 0.1]} radius={0.05} material={MONO.body}>
          <Edges threshold={15} color={theme.line} />
        </RoundedBox>

        {/* Display (idle) */}
        <mesh position={[0, 0, 0.06]} material={MONO.panel}>
          <planeGeometry args={[2.2, 1.5]} />
        </mesh>

        {/* Search bar (only visible before page loads) */}
        <mesh position={[0, 0.3, 0.07]} material={MONO.screen}>
          <planeGeometry args={[1.8, 0.25]} />
        </mesh>
        <Text position={[0, 0.3, 0.08]} fontSize={0.12} color={theme.name === 'dark' ? theme.panel : theme.textMuted} anchorX="center">
          google.com
        </Text>
        <mesh ref={cursorRef} position={[0.55, 0.3, 0.08]} material={accent('link', 1.5)}>
          <planeGeometry args={[0.02, 0.14]} />
        </mesh>

        {/* ── FINALE: staggered page-load elements ─────── */}
        {/* Navbar strip */}
        <mesh ref={navbarRef} position={[0, 0.62, 0.065]} visible={false}>
          <planeGeometry args={[2.1, 0.15]} />
          <meshBasicMaterial color={theme.textMuted} toneMapped={false} />
        </mesh>

        {/* Hero / search box (Google-style) */}
        <mesh ref={heroRef} position={[0, 0.25, 0.065]} visible={false} material={MONO.screen}>
          <planeGeometry args={[1.4, 0.28]} />
        </mesh>

        {/* Content rows */}
        <group ref={contentRef} visible={false}>
          {[-0.1, -0.25, -0.4].map((y, i) => (
            <mesh key={i} position={[0, y, 0.065]}>
              <planeGeometry args={[1.6 - i * 0.15, 0.07]} />
              <meshBasicMaterial color={theme.lineMuted} toneMapped={false} />
            </mesh>
          ))}
        </group>
      </group>

      <Text position={[0, -0.8, 0]} fontSize={0.25} color={theme.textMuted} anchorX="center">
        Your Device
      </Text>
    </group>
  );
}

// Inline lerp to avoid importing THREE just for this
function THREE_lerp(a, b, t) { return a + (b - a) * t; }
