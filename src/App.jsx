import { useState } from 'react';
import ScrollLayout from './ScrollLayout';
import Scene from './Scene';
import SmoothScroll from './components/SmoothScroll';
import LandingScreen from './components/LandingScreen';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showExperience, setShowExperience] = useState(false);

  const handleEnter = () => {
    setShowExperience(true);
    // Delay hiding landing to allow smooth transition
    setTimeout(() => {
      setShowLanding(false);
    }, 500);
  };

  return (
    <>
      {showLanding && <LandingScreen onEnter={handleEnter} />}
      {showExperience && (
        <SmoothScroll>
          <Scene />
          <ScrollLayout />
        </SmoothScroll>
      )}
    </>
  );
}
