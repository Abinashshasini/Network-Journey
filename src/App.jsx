import { Component, lazy, Suspense, useCallback, useState } from 'react';
import Intro from './components/Intro';
import { play } from './stores/player';
import { hasWebGL, setLoadingFailed } from './stores/loading';

// The whole 3D experience (three, r3f, postprocessing, scene) is a separate
// chunk. It starts downloading immediately and mounts behind the intro, so
// shaders are compiled before the user presses Start.
const Scene = lazy(() => import('./Scene'));

// Checked once up front: without WebGL the scene can never load, so don't
// even fetch it — the intro shows a "WebGL unavailable" message instead.
const WEBGL_OK = hasWebGL();
if (!WEBGL_OK) setLoadingFailed();

/** Catches a crash in the 3D scene (e.g. context creation) → intro error. */
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err) {
    console.error(err);
    setLoadingFailed();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function App() {
  const [introState, setIntroState] = useState('shown'); // shown → leaving → gone

  const handleStart = useCallback(() => {
    setIntroState((s) => {
      if (s !== 'shown') return s;
      setTimeout(() => {
        setIntroState('gone');
      }, 700);
      // Begin playback as the intro fades so the camera is already moving
      setTimeout(play, 250);
      return 'leaving';
    });
  }, []);

  return (
    <>
      {WEBGL_OK && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </SceneBoundary>
      )}
      {introState !== 'gone' && (
        <Intro onStart={handleStart} leaving={introState === 'leaving'} />
      )}
    </>
  );
}
