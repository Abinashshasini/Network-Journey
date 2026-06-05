import { useState, useCallback } from 'react';
import ScrollLayout from './ScrollLayout';
import Scene from './Scene';
import SmoothScroll from './components/SmoothScroll';
import LandingScreen from './components/LandingScreen';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showExperience, setShowExperience] = useState(false);

  const handleEnter = useCallback(() => {
    // Mount the experience first so the scroll container and Canvas are in the DOM
    setShowExperience(true);

    // Give React a frame to render the scroll container + Canvas,
    // then remove the landing screen so scroll events can reach the page
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setShowLanding(false);
        // Ensure we're at the top and ScrollTrigger knows the new page height
        window.scrollTo(0, 0);
      });
    });
  }, []);

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
