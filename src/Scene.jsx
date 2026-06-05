import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useState, useEffect } from 'react';
import { initScrollStore, useScrollProgress } from './stores/scrollStore';

// Core Systems
import CameraRig from './CameraRig';

// Effects
import EnvironmentController from './effects/EnvironmentController';
import PostProcessing from './effects/PostProcessing';

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

// State mapping from scroll progress to description
function getSearchState(progress) {
  if (progress < 0.02) return 'User types google.com';
  if (progress < 0.04) return 'Browser creates HTTP request';
  if (progress < 0.05) return 'Service Worker: Checking cache...';
  if (progress < 0.06) return 'Service Worker: Cache MISS → Network';
  if (progress < 0.07) return 'OS: Socket creation & network stack';
  if (progress < 0.08) return 'ARP: Who has 192.168.1.1?';
  if (progress < 0.09) return 'ARP: Router MAC: AA:BB:CC:11:22:33';
  if (progress < 0.10) return 'Sending to Router via WiFi...';
  // Rest zone 10-12%
  if (progress < 0.12) return 'Sending to Router via WiFi...';
  if (progress < 0.13) return 'NAT: 192.168.1.5 → 203.45.67.89';
  if (progress < 0.14) return 'Router forwarding to ISP...';
  if (progress < 0.16) return 'BGP: Routing through autonomous systems';
  if (progress < 0.18) return 'Traveling through submarine cable...';
  // Rest zone 20-22%
  if (progress < 0.22) return 'Traveling through submarine cable...';
  if (progress < 0.24) return 'Reaching DNS Server...';
  if (progress < 0.27) return 'DNS Query: "What is google.com?"';
  if (progress < 0.29) return 'DNS Response: 142.250.190.14';
  if (progress < 0.30) return 'CDN Edge: Cache check → MISS';
  // Rest zone 30-32%
  if (progress < 0.32) return 'CDN Edge: Cache check → MISS';
  if (progress < 0.34) return 'Initiating TCP connection...';
  if (progress < 0.36) return 'TCP: Sending SYN packet →';
  if (progress < 0.38) return 'TCP: Received SYN-ACK ←';
  if (progress < 0.40) return 'TCP: Sending ACK → Connected!';
  if (progress < 0.42) return 'Starting SSL/TLS Handshake...';
  if (progress < 0.44) return 'SSL: Client Hello →';
  if (progress < 0.46) return 'SSL: Server Hello + Certificate ←';
  if (progress < 0.48) return 'SSL: Key Exchange →';
  if (progress < 0.52) return 'SSL: Secure connection established! 🔒';
  // Rest zone 52-54%
  if (progress < 0.54) return 'SSL: Secure connection established! 🔒';
  if (progress < 0.56) return 'Sending encrypted HTTP GET request...';
  if (progress < 0.58) return 'Load Balancer: Routing to server...';
  if (progress < 0.60) return 'Server processing request...';
  if (progress < 0.62) return 'Server sends HTML response ←';
  if (progress < 0.64) return 'Browser requests CSS & JS files...';
  // Rest zone 64-66%
  if (progress < 0.66) return 'Receiving CSS & JS files ←';
  if (progress < 0.68) return '📊 Network Waterfall Timeline';
  if (progress < 0.71) return 'Parsing HTML → Building DOM Tree';
  if (progress < 0.74) return 'Parsing CSS → Building CSSOM';
  if (progress < 0.77) return 'Combining DOM + CSSOM → Render Tree';
  if (progress < 0.80) return 'JavaScript Execution & Hydration';
  if (progress < 0.83) return 'Layout: Calculating positions & sizes';
  if (progress < 0.86) return 'Paint: Drawing pixels to layers';
  if (progress < 0.90) return '🎮 GPU Rendering Pipeline';
  if (progress < 0.94) return '📊 Web Vitals: LCP, FID, CLS';
  return '✓ Page Rendered @ 60 FPS!';
}

export default function Scene() {
  const [searchState, setSearchState] = useState('Ready to search...');
  const progress = useScrollProgress();

  // Init scroll store
  useEffect(() => {
    initScrollStore();
  }, []);

  // Enable keyboard navigation
  useKeyboardNav();

  // Update search state from centralized progress
  useEffect(() => {
    setSearchState(getSearchState(progress));
  }, [progress]);

  return (
    <>
      {/* Progress bar at top */}
      <ProgressBar />

      <div className="canvas-container">
        <Canvas camera={{ position: [-10, 3, 12], fov: 50 }}>
          {/* Dynamic environment - replaces static bg/fog/lights */}
          <EnvironmentController />

          <Environment preset="night" />

          {/* Post-processing effects */}
          <PostProcessing />

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
