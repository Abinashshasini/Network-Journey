# Network Journey

An immersive 3D visualization of how your browser connects to the internet — from typing a URL to rendering a webpage. Built with React Three Fiber and GSAP.

![Network Journey](https://img.shields.io/badge/React-19.2-blue) ![Three.js](https://img.shields.io/badge/Three.js-0.182-green) ![Vite](https://img.shields.io/badge/Vite-7.3-purple)

## Overview

Network Journey takes you on a visual journey through the complete network request lifecycle:

1. **DNS Lookup** — Resolving domain names to IP addresses
2. **TCP Handshake** — The 3-way handshake (SYN → SYN-ACK → ACK)
3. **SSL/TLS Handshake** — Secure connection establishment
4. **HTTP Request/Response** — Data transfer between client and server
5. **Browser Rendering** — DOM parsing, CSSOM, and paint

## Features

- **Immersive 3D Environment** — Navigate through a stylized network topology
- **Scroll-Driven Animation** — Smooth GSAP-powered transitions tied to scroll
- **Interactive Landing Screen** — Warp animation with star streaks and tunnel effect
- **Real-time Visualizations**:
  - ARP Table lookups
  - NAT Gateway translations
  - Load Balancer distribution
  - Data packet animations
- **Educational HUD** — Explanations for each network phase
- **Dark Theme** — Modern dark UI with blue accents

## Tech Stack

| Technology                                                  | Purpose            |
| ----------------------------------------------------------- | ------------------ |
| [React 19](https://react.dev)                               | UI Framework       |
| [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) | 3D Rendering       |
| [Three.js](https://threejs.org)                             | WebGL Engine       |
| [Drei](https://github.com/pmndrs/drei)                      | R3F Helpers        |
| [GSAP](https://gsap.com)                                    | Scroll & Animation |
| [Lenis](https://lenis.studiofreight.com)                    | Smooth Scrolling   |
| [Vite](https://vite.dev)                                    | Build Tool         |

## Project Structure

```
src/
├── components/
│   ├── LandingScreen.jsx    # Intro screen with warp animation
│   ├── SmoothScroll.jsx     # Lenis scroll wrapper
│   └── AnimatedPackets.jsx  # Data packet animations
├── world/
│   ├── NetworkPath.jsx      # Main network topology
│   ├── Laptop.jsx           # Client device
│   ├── Router.jsx           # Home router
│   ├── ISPNode.jsx          # ISP infrastructure
│   ├── DNSServer.jsx        # DNS resolver
│   ├── GoogleServer.jsx     # Destination server
│   ├── ARPVisualization.jsx # ARP table display
│   ├── NATVisualization.jsx # NAT gateway
│   ├── LoadBalancerVisualization.jsx
│   └── BackgroundElements.jsx
├── phases/
│   ├── useDNSPhase.js       # DNS lookup logic
│   ├── useTCPHandshake.js   # TCP 3-way handshake
│   ├── useSSLHandshake.js   # TLS negotiation
│   └── useSearchPhase.js    # URL parsing
├── ui/
│   ├── HUD.jsx              # Main heads-up display
│   ├── ExplanationSidebar.jsx
│   ├── ProgressBar.jsx
│   ├── MiniMap.jsx
│   ├── TimingDisplay.jsx
│   ├── DNSHUD.jsx
│   ├── TCPHUD.jsx
│   └── SSLHandshakeIndicator.jsx
├── styles/
│   └── LandingScreen.css
├── App.jsx
├── Scene.jsx                # Main 3D scene
├── CameraRig.jsx            # Scroll-based camera
└── ScrollLayout.jsx         # Scroll container
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/network-journey.git
cd network-journey

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start dev server at localhost:5173 |
| `npm run build`   | Build for production               |
| `npm run preview` | Preview production build           |
| `npm run lint`    | Run ESLint                         |

## How It Works

### Scroll-Driven Camera

The camera follows a predefined path through the 3D scene, controlled by scroll position using GSAP ScrollTrigger:

```jsx
// CameraRig.jsx
useGSAP(() => {
  gsap.to(camera.position, {
    scrollTrigger: {
      trigger: scrollContainer,
      scrub: 4,
    },
    motionPath: cameraPath,
  });
});
```

### Network Phases

Each phase is a custom hook that manages its own state and animations:

```jsx
// Example: useTCPHandshake.js
export function useTCPHandshake(progress) {
  const [phase, setPhase] = useState('idle');

  useEffect(() => {
    if (progress > 0.3) setPhase('syn');
    if (progress > 0.5) setPhase('syn-ack');
    if (progress > 0.7) setPhase('ack');
  }, [progress]);

  return { phase };
}
```

### Warp Animation

The landing screen features a hyperspace-style warp effect using 2D Canvas:

- 400 stars with depth-based perspective projection
- Tunnel rings expanding outward
- Smooth blend transition to the main experience

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this for educational purposes.

## Acknowledgments

- Inspired by Chrome DevTools Network panel
- 3D assets created with procedural geometry
- Color palette based on Tailwind CSS
