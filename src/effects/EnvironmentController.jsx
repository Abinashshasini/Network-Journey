import { useRef, useMemo, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getProgress, chapterIndexAt } from '../stores/player';
import { CHAPTERS } from '../journey/steps';
import { getTheme, subscribeTheme, layerColor } from '../theme/tokens';

/**
 * EnvironmentController — monochrome lighting.
 *
 * Background and fog come from the theme. Lights are neutral white; the only
 * colour is a faint rim light tinted with the current chapter's layer accent,
 * so each chapter has a mood without breaking the black & white look.
 * Fog distance tightens for the underwater (internet) chapter.
 */

// Per-chapter fog distances, indexed like CHAPTERS
const FOG = {
  local: [22, 80],
  internet: [12, 55],
  dns: [22, 85],
  tcp: [22, 85],
  tls: [18, 72],
  http: [22, 90],
  render: [25, 95],
  done: [28, 110],
};

const _rimTarget = new THREE.Color();

// Module-level singletons (one environment per page); mutated in place.
const BG = new THREE.Color(getTheme().bg);
const FOG_OBJ = new THREE.Fog(getTheme().fog, 22, 80);

export default function EnvironmentController() {
  const getThree = useThree((s) => s.get);
  const keyRef = useRef();
  const fillRef = useRef();
  const rimRef = useRef();
  const rimTargetRef = useRef();
  const ambientRef = useRef();

  // Theme flips: update colours in place (no re-render)
  useEffect(() => {
    const { scene } = getThree();
    scene.background = BG;
    scene.fog = FOG_OBJ;
    const apply = (t) => {
      BG.set(t.bg);
      FOG_OBJ.color.set(t.fog);
      if (ambientRef.current) ambientRef.current.intensity = t.name === 'light' ? 1.1 : 0.45;
      if (keyRef.current) keyRef.current.intensity = t.name === 'light' ? 1.4 : 1.1;
    };
    apply(getTheme());
    return subscribeTheme(apply);
  }, [getThree]);

  const _fwd = useMemo(() => new THREE.Vector3(), []);
  const _focus = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }, delta) => {
    const fog = FOG_OBJ;
    const p = getProgress();
    const ch = CHAPTERS[chapterIndexAt(p)];
    const k = 1 - Math.exp(-delta * 2.5);

    // Fog distance per chapter (eased)
    const [near, far] = FOG[ch.id] ?? FOG.local;
    fog.near += (near - fog.near) * k;
    fog.far += (far - fog.far) * k;

    // Rim light follows the camera's focus point, tinted by layer
    camera.getWorldDirection(_fwd);
    let dist = 14;
    if (Math.abs(_fwd.z) > 1e-4) {
      const tt = -camera.position.z / _fwd.z;
      if (tt > 0.5) dist = tt;
    }
    _focus.copy(camera.position).addScaledVector(_fwd, dist);
    if (rimRef.current && rimTargetRef.current) {
      rimTargetRef.current.position.copy(_focus);
      if (rimRef.current.target !== rimTargetRef.current) rimRef.current.target = rimTargetRef.current;
      rimRef.current.position.set(_focus.x + _fwd.x * 8, _focus.y + 5, _focus.z + _fwd.z * 8 - 4);
      _rimTarget.set(layerColor(ch.layer));
      rimRef.current.color.lerp(_rimTarget, k);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.45} />
      <directionalLight ref={keyRef} position={[10, 20, 10]} intensity={1.1} color="#ffffff" />
      <directionalLight ref={fillRef} position={[-10, 8, -10]} intensity={0.35} color="#ffffff" />
      <spotLight
        ref={rimRef}
        position={[0, 8, -6]}
        angle={0.6}
        penumbra={0.9}
        decay={1.1}
        distance={60}
        intensity={1.2}
        color="#ffffff"
      />
      <object3D ref={rimTargetRef} />
    </>
  );
}
