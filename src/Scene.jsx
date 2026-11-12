import { Canvas, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import { configureTextBuilder } from 'troika-three-text';
import { setLoadingStage } from './stores/loading';

// Core
import CameraRig from './CameraRig';

// Effects
import EnvironmentController from './effects/EnvironmentController';
import PostProcessing from './effects/PostProcessing';

// World
import NetworkPath from './world/NetworkPath';
import BackgroundElements from './world/BackgroundElements';
import AnimatedPackets from './components/AnimatedPackets';

// UI
import StepPanel from './ui/StepPanel';
import ControlBar from './ui/ControlBar';
import TopBar from './ui/TopBar';
import TimingDisplay from './ui/TimingDisplay';
import useKeyboardNav from './hooks/useKeyboardNav';

// Self-hosted label font: no CDN round-trip, no glyph fallback fetches.
configureTextBuilder({ defaultFontURL: '/fonts/jetbrains-mono-500.woff' });

// This module is the lazily-loaded 3D chunk; evaluating it means the engine
// has downloaded.
setLoadingStage('scene');

/**
 * Warmup — mounted after the world has resolved (fonts etc). Compiles every
 * material up front (including hidden objects) so nothing stutters the first
 * time it appears during playback.
 */
function Warmup() {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    setLoadingStage('compiling');
    let cancelled = false;
    const hidden = [];
    scene.traverse((o) => {
      if (!o.visible) {
        hidden.push(o);
        o.visible = true;
      }
    });
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      hidden.forEach((o) => (o.visible = false));
      if (cancelled) return;
      // Two frames so the first real render (and the composer) has happened
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setLoadingStage('ready')),
      );
    };
    // compileAsync can hang forever: if a material is swapped/disposed while
    // it polls (troika text, StrictMode remounts) its internal check throws
    // inside a setTimeout and the promise never settles. Cap the wait so the
    // intro can never get stuck — worst case a shader compiles on first use.
    const timeout = setTimeout(finish, 4000);
    let job;
    try {
      job = gl.compileAsync
        ? gl.compileAsync(scene, camera)
        : Promise.resolve(gl.compile(scene, camera));
    } catch (err) {
      job = Promise.reject(err);
    }
    job.then(finish, finish);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      // Restore visibility now; a later finish() would be skipped by `done`
      if (!done) {
        done = true;
        hidden.forEach((o) => (o.visible = false));
      }
    };
  }, [gl, scene, camera]);
  return null;
}

export default function Scene() {
  // Adaptive quality: drop DPR, then effects, if the frame rate sags.
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio, 2));
  const [fx, setFx] = useState('high');

  useKeyboardNav();

  return (
    <>
      <div className="canvas-container">
        <Canvas
          dpr={dpr}
          camera={{ position: [-10, 3, 12], fov: 50 }}
          gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
        >
          <PerformanceMonitor
            bounds={() => [45, 58]}
            flipflops={3}
            onDecline={() => {
              setDpr((d) => Math.max(1, d - 0.5));
              setFx((q) => (q === 'high' ? 'low' : q));
            }}
            onIncline={() => setDpr((d) => Math.min(window.devicePixelRatio, 2, d + 0.5))}
            onFallback={() => {
              setDpr(1);
              setFx('off');
            }}
          />

          <EnvironmentController />
          <CameraRig />

          <Suspense fallback={null}>
            <BackgroundElements />
            <NetworkPath />
            <AnimatedPackets />
            <Warmup />
          </Suspense>

          <PostProcessing quality={fx} />
        </Canvas>
      </div>

      <TopBar />
      <StepPanel />
      <TimingDisplay />
      <ControlBar />
    </>
  );
}
