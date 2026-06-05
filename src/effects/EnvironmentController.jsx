import { useRef, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getProgress } from '../stores/scrollStore';

// Phase-specific environment palettes
const phases = [
  {
    start: 0,
    end: 0.12,
    bg: new THREE.Color('#1a1a2e'),
    fog: new THREE.Color('#1a1a2e'),
    fogNear: 20,
    fogFar: 80,
    ambientIntensity: 0.5,
    keyColor: new THREE.Color('#ffd4a0'),
    keyIntensity: 1.0,
    fillColor: new THREE.Color('#c4b5fd'),
    fillIntensity: 0.4,
    pointColor: new THREE.Color('#ffd4a0'),
    pointIntensity: 0.4,
  },
  {
    start: 0.12,
    end: 0.22,
    bg: new THREE.Color('#060d1a'),
    fog: new THREE.Color('#0a2540'),
    fogNear: 12,
    fogFar: 55,
    ambientIntensity: 0.15,
    keyColor: new THREE.Color('#1e90ff'),
    keyIntensity: 0.8,
    fillColor: new THREE.Color('#064e89'),
    fillIntensity: 0.3,
    pointColor: new THREE.Color('#00bfff'),
    pointIntensity: 0.6,
  },
  {
    start: 0.22,
    end: 0.32,
    bg: new THREE.Color('#1a0a2e'),
    fog: new THREE.Color('#2d1b4e'),
    fogNear: 22,
    fogFar: 85,
    ambientIntensity: 0.3,
    keyColor: new THREE.Color('#a855f7'),
    keyIntensity: 1.1,
    fillColor: new THREE.Color('#7c3aed'),
    fillIntensity: 0.5,
    pointColor: new THREE.Color('#c084fc'),
    pointIntensity: 0.5,
  },
  {
    start: 0.32,
    end: 0.42,
    bg: new THREE.Color('#0a1e0a'),
    fog: new THREE.Color('#0f2f1a'),
    fogNear: 20,
    fogFar: 80,
    ambientIntensity: 0.35,
    keyColor: new THREE.Color('#22c55e'),
    keyIntensity: 1.2,
    fillColor: new THREE.Color('#16a34a'),
    fillIntensity: 0.4,
    pointColor: new THREE.Color('#4ade80'),
    pointIntensity: 0.5,
  },
  {
    start: 0.42,
    end: 0.54,
    bg: new THREE.Color('#1a0a1e'),
    fog: new THREE.Color('#2d0a2e'),
    fogNear: 18,
    fogFar: 70,
    ambientIntensity: 0.3,
    keyColor: new THREE.Color('#ec4899'),
    keyIntensity: 1.1,
    fillColor: new THREE.Color('#be185d'),
    fillIntensity: 0.5,
    pointColor: new THREE.Color('#f472b6'),
    pointIntensity: 0.5,
  },
  {
    start: 0.54,
    end: 0.66,
    bg: new THREE.Color('#1e0f0a'),
    fog: new THREE.Color('#2e1a1a'),
    fogNear: 20,
    fogFar: 85,
    ambientIntensity: 0.4,
    keyColor: new THREE.Color('#f97316'),
    keyIntensity: 1.3,
    fillColor: new THREE.Color('#ea580c'),
    fillIntensity: 0.4,
    pointColor: new THREE.Color('#fb923c'),
    pointIntensity: 0.5,
  },
  {
    start: 0.66,
    end: 0.94,
    bg: new THREE.Color('#0f1729'),
    fog: new THREE.Color('#1a2540'),
    fogNear: 25,
    fogFar: 95,
    ambientIntensity: 0.6,
    keyColor: new THREE.Color('#e0e7ff'),
    keyIntensity: 1.2,
    fillColor: new THREE.Color('#93c5fd'),
    fillIntensity: 0.6,
    pointColor: new THREE.Color('#a5b4fc'),
    pointIntensity: 0.4,
  },
  {
    start: 0.94,
    end: 1.01,
    bg: new THREE.Color('#0a1a0a'),
    fog: new THREE.Color('#0f2f1a'),
    fogNear: 25,
    fogFar: 90,
    ambientIntensity: 0.6,
    keyColor: new THREE.Color('#22c55e'),
    keyIntensity: 1.5,
    fillColor: new THREE.Color('#16a34a'),
    fillIntensity: 0.5,
    pointColor: new THREE.Color('#4ade80'),
    pointIntensity: 0.6,
  },
];

function getPhaseBlend(progress) {
  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i];
    if (progress < phase.end) {
      const next = phases[Math.min(i + 1, phases.length - 1)];
      // Blend zone: last 15% of each phase transitions to next
      const blendStart = phase.end - (phase.end - phase.start) * 0.15;
      if (progress > blendStart && i < phases.length - 1) {
        const t = (progress - blendStart) / (phase.end - blendStart);
        return { from: phase, to: next, t };
      }
      return { from: phase, to: phase, t: 0 };
    }
  }
  const last = phases[phases.length - 1];
  return { from: last, to: last, t: 0 };
}

// Temp colors to avoid allocations
const _bg = new THREE.Color();
const _fog = new THREE.Color();
const _key = new THREE.Color();
const _fill = new THREE.Color();
const _point = new THREE.Color();

export default function EnvironmentController() {
  const { scene, camera } = useThree();
  const ambientRef = useRef();
  const keyLightRef = useRef();
  const fillLightRef = useRef();
  const pointLightRef = useRef();
  const rimRef = useRef();
  const rimTargetRef = useRef();
  const accentRef = useRef();

  // Scratch vectors for the camera-tracking rim light (no per-frame allocs)
  const _fwd = useMemo(() => new THREE.Vector3(), []);
  const _focus = useMemo(() => new THREE.Vector3(), []);
  const _rim = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const progress = getProgress();
    const { from, to, t } = getPhaseBlend(progress);

    // ---- Subtle rim light — low intensity, tracks camera focus plane ----
    camera.getWorldDirection(_fwd);
    let dist = 14;
    if (Math.abs(_fwd.z) > 0.0001) {
      const tt = -camera.position.z / _fwd.z;
      if (tt > 0.5) dist = tt;
    }
    _focus.copy(camera.position).addScaledVector(_fwd, dist);

    if (rimTargetRef.current) rimTargetRef.current.position.copy(_focus);
    if (rimRef.current && rimTargetRef.current && rimRef.current.target !== rimTargetRef.current) {
      rimRef.current.target = rimTargetRef.current;
    }
    if (rimRef.current) {
      rimRef.current.position.set(_focus.x + _fwd.x * 8, _focus.y + 5, _focus.z + _fwd.z * 8 - 4);
      _rim.copy(from.pointColor).lerp(to.pointColor, t);
      rimRef.current.color.copy(_rim);
      // Keep rim subtle — just enough to separate nodes from fog
      rimRef.current.intensity = THREE.MathUtils.lerp(
        from.keyIntensity,
        to.keyIntensity,
        t,
      ) * 0.4;
    }

    // Lerp background
    _bg.copy(from.bg).lerp(to.bg, t);
    scene.background = _bg;

    // Lerp fog
    if (scene.fog) {
      _fog.copy(from.fog).lerp(to.fog, t);
      scene.fog.color.copy(_fog);
      scene.fog.near = THREE.MathUtils.lerp(from.fogNear, to.fogNear, t);
      scene.fog.far = THREE.MathUtils.lerp(from.fogFar, to.fogFar, t);
    }

    // Lerp lights
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        from.ambientIntensity,
        to.ambientIntensity,
        t,
      );
    }

    if (keyLightRef.current) {
      _key.copy(from.keyColor).lerp(to.keyColor, t);
      keyLightRef.current.color.copy(_key);
      keyLightRef.current.intensity = THREE.MathUtils.lerp(
        from.keyIntensity,
        to.keyIntensity,
        t,
      );
    }

    if (fillLightRef.current) {
      _fill.copy(from.fillColor).lerp(to.fillColor, t);
      fillLightRef.current.color.copy(_fill);
      fillLightRef.current.intensity = THREE.MathUtils.lerp(
        from.fillIntensity,
        to.fillIntensity,
        t,
      );
    }

    if (pointLightRef.current) {
      _point.copy(from.pointColor).lerp(to.pointColor, t);
      pointLightRef.current.color.copy(_point);
      pointLightRef.current.intensity = THREE.MathUtils.lerp(
        from.pointIntensity,
        to.pointIntensity,
        t,
      );
    }
  });

  // Initial values from first phase
  const init = phases[0];

  return (
    <>
      <color attach="background" args={[init.bg.r, init.bg.g, init.bg.b]} />
      <fog
        attach="fog"
        args={[
          new THREE.Color(init.fog.r, init.fog.g, init.fog.b),
          init.fogNear,
          init.fogFar,
        ]}
      />
      <ambientLight ref={ambientRef} intensity={init.ambientIntensity} />
      <directionalLight
        ref={keyLightRef}
        position={[10, 20, 10]}
        intensity={init.keyIntensity}
        color={init.keyColor}
      />
      <directionalLight
        ref={fillLightRef}
        position={[-10, 10, -10]}
        intensity={init.fillIntensity}
        color={init.fillColor}
      />
      <pointLight
        ref={pointLightRef}
        position={[0, 5, 0]}
        intensity={init.pointIntensity}
        color={init.pointColor}
      />

      {/* Camera-tracking rim/back spotlight — soft cone, distance falloff.
          Position/colour/intensity/target are all driven in useFrame. */}
      <spotLight
        ref={rimRef}
        position={[0, 8, -6]}
        angle={0.6}
        penumbra={0.9}
        decay={1.1}
        distance={60}
        intensity={1.5}
        color={init.pointColor}
      />
      <object3D ref={rimTargetRef} />

      {/* accent ref kept for forward compat but not mounted */}
    </>
  );
}
