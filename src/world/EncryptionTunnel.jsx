import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { subscribe } from '../stores/scrollStore';

// The tunnel stretches between the client-side handshake area and the server.
// These match the SSL packet positions in AnimatedPackets.jsx:
//   client side ≈ x=25, server side ≈ x=32
const CLIENT_POS = new THREE.Vector3(25, 0.5, 0);
const SERVER_POS = new THREE.Vector3(32, 0.5, 0);

// Scroll thresholds
const FADE_IN_START  = 0.51;  // lock appears
const FADE_IN_END    = 0.54;  // fully visible
const FADE_OUT_START = 0.66;  // browser render begins
const FADE_OUT_END   = 0.68;

function getTargetOpacity(progress) {
  if (progress < FADE_IN_START)   return 0;
  if (progress < FADE_IN_END)     return (progress - FADE_IN_START) / (FADE_IN_END - FADE_IN_START) * 0.3;
  if (progress < FADE_OUT_START)  return 0.3;
  if (progress < FADE_OUT_END)    return 0.3 * (1 - (progress - FADE_OUT_START) / (FADE_OUT_END - FADE_OUT_START));
  return 0;
}

export default function EncryptionTunnel() {
  const meshRef  = useRef();
  const glowRef  = useRef();
  const opacityRef = useRef(0);

  // Build a tube along the straight path client→server
  const { tubeGeo, glowGeo } = useMemo(() => {
    const path = new THREE.CatmullRomCurve3([CLIENT_POS, SERVER_POS]);
    const tubeGeo = new THREE.TubeGeometry(path, 12, 0.18, 8, false);
    const glowGeo = new THREE.TubeGeometry(path, 12, 0.35, 8, false);
    return { tubeGeo, glowGeo };
  }, []);

  useEffect(() => {
    return subscribe((progress) => {
      opacityRef.current = getTargetOpacity(progress);
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const target = opacityRef.current;

    if (meshRef.current) {
      // Smooth opacity transition
      meshRef.current.material.opacity = THREE.MathUtils.lerp(
        meshRef.current.material.opacity, target, 0.06,
      );
      meshRef.current.visible = meshRef.current.material.opacity > 0.005;
      // Pulse the emissive so the tunnel "breathes"
      meshRef.current.material.emissiveIntensity = 0.4 + Math.sin(t * 2.5) * 0.2;
    }

    if (glowRef.current) {
      glowRef.current.material.opacity = THREE.MathUtils.lerp(
        glowRef.current.material.opacity, target * 0.4, 0.06,
      );
      glowRef.current.visible = glowRef.current.material.opacity > 0.005;
    }
  });

  return (
    <group>
      {/* Outer soft glow */}
      <mesh ref={glowRef} geometry={glowGeo}>
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={0.2}
          transparent
          opacity={0}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Inner tunnel surface */}
      <mesh ref={meshRef} geometry={tubeGeo}>
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={0.4}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}
