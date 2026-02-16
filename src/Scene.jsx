import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useState, useEffect } from 'react';

// Core Systems
import CameraRig from './CameraRig';

// World
import NetworkPath from './world/NetworkPath';
import BackgroundElements from './world/BackgroundElements';

// Animated Packets (handles all packet animations inside Canvas)
import AnimatedPackets from './components/AnimatedPackets';

// UI
import ExplanationSidebar from './ui/ExplanationSidebar';
import ProgressBar from './ui/ProgressBar';
import TimingDisplay from './ui/TimingDisplay';
import MiniMap from './ui/MiniMap';

// Hooks
import useKeyboardNav from './hooks/useKeyboardNav';

export default function Scene() {
  const [searchState, setSearchState] = useState('Ready to search...');

  // Enable keyboard navigation
  useKeyboardNav();

  // Track scroll progress for HUD state updates using native scroll
  useEffect(() => {
    const updateState = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;

      if (progress < 0.02) {
        setSearchState('User types google.com');
      } else if (progress < 0.04) {
        setSearchState('Browser creates HTTP request');
      } else if (progress < 0.06) {
        setSearchState('ARP: Who has 192.168.1.1?');
      } else if (progress < 0.08) {
        setSearchState('ARP: Router MAC: AA:BB:CC:11:22:33');
      } else if (progress < 0.1) {
        setSearchState('Sending to Router via WiFi...');
      } else if (progress < 0.12) {
        setSearchState('NAT: 192.168.1.5 → 203.45.67.89');
      } else if (progress < 0.14) {
        setSearchState('Router forwarding to ISP...');
      } else if (progress < 0.16) {
        setSearchState('Traveling through submarine cable...');
      } else if (progress < 0.18) {
        setSearchState('Reaching DNS Server...');
      } else if (progress < 0.21) {
        setSearchState('DNS Query: "What is google.com?"');
      } else if (progress < 0.24) {
        setSearchState('DNS Response: 142.250.190.14');
      } else if (progress < 0.27) {
        setSearchState('Initiating TCP connection...');
      } else if (progress < 0.3) {
        setSearchState('TCP: Sending SYN packet →');
      } else if (progress < 0.33) {
        setSearchState('TCP: Received SYN-ACK ←');
      } else if (progress < 0.36) {
        setSearchState('TCP: Sending ACK → Connected!');
      } else if (progress < 0.39) {
        setSearchState('Starting SSL/TLS Handshake...');
      } else if (progress < 0.42) {
        setSearchState('SSL: Client Hello →');
      } else if (progress < 0.45) {
        setSearchState('SSL: Server Hello + Certificate ←');
      } else if (progress < 0.48) {
        setSearchState('SSL: Key Exchange →');
      } else if (progress < 0.51) {
        setSearchState('SSL: Secure connection established! 🔒');
      } else if (progress < 0.54) {
        setSearchState('Sending encrypted HTTP GET request...');
      } else if (progress < 0.57) {
        setSearchState('Load Balancer: Routing to server...');
      } else if (progress < 0.6) {
        setSearchState('Server processing request...');
      } else if (progress < 0.63) {
        setSearchState('Server sends HTML response ←');
      } else if (progress < 0.66) {
        setSearchState('Browser requests CSS & JS files...');
      } else if (progress < 0.68) {
        setSearchState('Receiving CSS & JS files ←');
      } else if (progress < 0.71) {
        setSearchState('📊 Network Waterfall Timeline');
      } else if (progress < 0.74) {
        setSearchState('Parsing HTML → Building DOM Tree');
      } else if (progress < 0.77) {
        setSearchState('Parsing CSS → Building CSSOM');
      } else if (progress < 0.8) {
        setSearchState('Combining DOM + CSSOM → Render Tree');
      } else if (progress < 0.84) {
        setSearchState('JavaScript Execution & Hydration');
      } else if (progress < 0.88) {
        setSearchState('Layout: Calculating positions & sizes');
      } else if (progress < 0.92) {
        setSearchState('Paint: Drawing pixels to layers');
      } else if (progress < 0.96) {
        setSearchState('🎮 GPU Rendering Pipeline');
      } else {
        setSearchState('✓ Page Rendered @ 60 FPS!');
      }
    };

    // Initial update
    updateState();

    // Listen to scroll events
    window.addEventListener('scroll', updateState, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateState);
    };
  }, []);

  return (
    <>
      {/* Progress bar at top */}
      <ProgressBar />

      <div className="canvas-container">
        <Canvas camera={{ position: [-10, 3, 12], fov: 50 }}>
          {/* Dark theme background */}
          <color attach="background" args={['#0f172a']} />

          {/* Atmospheric fog for depth */}
          <fog attach="fog" args={['#0f172a', 30, 100]} />

          {/* Dramatic lighting for dark theme */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 20, 10]}
            intensity={1.2}
            color="#93c5fd"
          />
          <directionalLight
            position={[-10, 10, -10]}
            intensity={0.5}
            color="#c4b5fd"
          />
          <pointLight position={[0, 5, 0]} intensity={0.5} color="#60a5fa" />

          <Environment preset="night" />

          {/* Background elements for immersion */}
          <BackgroundElements />

          {/* Camera Scroll Control */}
          <CameraRig />

          {/* Network Path (all nodes) */}
          <NetworkPath />

          {/* All Animated Packets */}
          <AnimatedPackets />
        </Canvas>
      </div>

      {/* Explanation Sidebar - left */}
      <ExplanationSidebar state={searchState} />

      {/* Timing Display - bottom right */}
      <TimingDisplay />

      {/* Mini Map - bottom left */}
      <MiniMap />
    </>
  );
}
