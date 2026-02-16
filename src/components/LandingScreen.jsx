import { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import gsap from 'gsap';
import '../styles/LandingScreen.css';

/**
 * Animated preview packet for landing screen
 */
function PreviewPacket({ position, delay, color }) {
  const meshRef = useRef();

  useEffect(() => {
    if (!meshRef.current) return;

    // Infinite animation loop
    const tl = gsap.timeline({ repeat: -1, delay });

    tl.fromTo(
      meshRef.current.position,
      { x: -8, y: position[1] },
      { x: 8, y: position[1], duration: 3, ease: 'power1.inOut' },
    )
      .to(meshRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.2 }, '-=0.2')
      .set(meshRef.current.position, { x: -8 })
      .to(meshRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.2 });

    return () => tl.kill();
  }, [delay, position]);

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

/**
 * Simple network path visualization for preview
 */
function PreviewPath() {
  return (
    <group>
      {/* Path line */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 16, 8]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>

      {/* Nodes */}
      {[-6, -3, 0, 3, 6].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Preview 3D scene
 */
function PreviewScene() {
  return (
    <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
      <color attach="background" args={['#0f172a']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Environment preset="night" />

      <PreviewPath />

      {/* Animated packets */}
      <PreviewPacket position={[-8, 0.5, 0]} delay={0} color="#3b82f6" />
      <PreviewPacket position={[-8, 0, 0]} delay={0.8} color="#8b5cf6" />
      <PreviewPacket position={[-8, -0.5, 0]} delay={1.6} color="#22c55e" />
    </Canvas>
  );
}

/**
 * Hyperspace/Warp travel animation - Deep space tunnel effect with spaceship
 */
function WarpAnimation() {
  const containerRef = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Create star field with depth
    const stars = [];
    const numStars = 400;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * canvas.width * 2,
        y: (Math.random() - 0.5) * canvas.height * 2,
        z: Math.random() * 2000,
        size: Math.random() * 2 + 0.5,
        color: `hsl(${Math.random() * 60 + 200}, 80%, ${Math.random() * 40 + 60}%)`,
      });
    }

    // Ring  particles for tunnel effect
    const rings = [];
    const numRings = 15;
    for (let i = 0; i < numRings; i++) {
      rings.push({
        z: i * 150 + 100,
        opacity: 0,
      });
    }

    let animationId;
    let speed = 0;
    let targetSpeed = 80;
    let startTime = Date.now();
    let phase = 0; // 0: accelerating, 1: cruising, 2: arriving

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;

      // Phase transitions
      if (elapsed < 0.8) {
        // Phase 0: Acceleration
        phase = 0;
        speed = Math.min(speed + 2, targetSpeed);
      } else if (elapsed < 2.5) {
        // Phase 1: Cruising at full speed
        phase = 1;
        speed = targetSpeed;
      } else if (elapsed < 3.5) {
        // Phase 2: Deceleration / arrival - blend to dark theme
        phase = 2;
        speed = Math.max(speed - 3, 0);
      }

      // Clear with trail effect - use dark theme color for blend
      if (phase === 2) {
        // Gradually blend to #0f172a (15, 23, 42)
        const blendProgress = Math.min((elapsed - 2.5) * 1.2, 1);
        ctx.fillStyle = `rgba(15, 23, 42, ${0.1 + blendProgress * 0.4})`;
      } else {
        ctx.fillStyle = 'rgba(0, 0, 20, 0.15)';
      }
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw tunnel rings
      rings.forEach((ring) => {
        ring.z -= speed * 0.5;
        if (ring.z < 1) {
          ring.z = 2000;
          ring.opacity = 0;
        }

        const scale = 600 / ring.z;
        const radius = Math.max(canvas.width, canvas.height) * scale;
        ring.opacity = Math.min(ring.opacity + 0.02, 0.3);

        // Fade rings during arrival
        const ringFade = phase === 2 ? Math.max(speed / targetSpeed, 0) : 1;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(100, 150, 255, ${ring.opacity * (1 - ring.z / 2000) * ringFade})`;
        ctx.lineWidth = 2 * scale;
        ctx.stroke();
      });

      // Draw and update stars
      stars.forEach((star) => {
        // Move star towards camera
        star.z -= speed;

        // Reset star if it passes camera
        if (star.z < 1) {
          star.z = 2000;
          star.x = (Math.random() - 0.5) * canvas.width * 2;
          star.y = (Math.random() - 0.5) * canvas.height * 2;
        }

        // Project to 2D
        const scale = 600 / star.z;
        const x2d = centerX + star.x * scale;
        const y2d = centerY + star.y * scale;

        const prevScale = 600 / (star.z + speed);
        const prevX = centerX + star.x * prevScale;
        const prevY = centerY + star.y * prevScale;

        // Fade stars during arrival
        const starFade = phase === 2 ? Math.max(speed / targetSpeed, 0) : 1;

        // Draw star streak
        const gradient = ctx.createLinearGradient(prevX, prevY, x2d, y2d);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(1, star.color);

        ctx.globalAlpha = starFade;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x2d, y2d);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = star.size * scale * 2;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Draw star point
        ctx.beginPath();
        ctx.arc(x2d, y2d, star.size * scale, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Central glow effect
      const glowFade = phase === 2 ? Math.max(speed / targetSpeed, 0) : 1;
      const glowGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        150,
      );
      glowGradient.addColorStop(
        0,
        `rgba(100, 150, 255, ${(0.1 + speed * 0.003) * glowFade})`,
      );
      glowGradient.addColorStop(
        0.5,
        `rgba(80, 100, 200, ${(0.05 + speed * 0.001) * glowFade})`,
      );
      glowGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Vignette effect
      const vignetteGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        canvas.width * 0.3,
        centerX,
        centerY,
        canvas.width * 0.8,
      );
      vignetteGradient.addColorStop(0, 'transparent');
      vignetteGradient.addColorStop(1, 'rgba(0, 0, 30, 0.8)');
      ctx.fillStyle = vignetteGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Final blend overlay to dark theme
      if (phase === 2) {
        const blendProgress = Math.min((elapsed - 2.5) * 1.2, 1);
        ctx.fillStyle = `rgba(15, 23, 42, ${blendProgress * 0.7})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      if (elapsed < 3.8) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div ref={containerRef} className="warp-container">
      <canvas ref={canvasRef} className="warp-canvas" />
    </div>
  );
}

/**
 * LandingScreen - GitHub-style intro with preview animation
 */
export default function LandingScreen({ onEnter }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [showWarp, setShowWarp] = useState(false);
  const containerRef = useRef();

  // Handle enter action
  const handleEnter = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);

    // Fade out content first
    const tl = gsap.timeline({
      onComplete: () => {
        // Show warp animation
        setShowWarp(true);

        // After warp, transition to main experience
        setTimeout(() => {
          setIsVisible(false);
          onEnter();
        }, 4000);
      },
    });

    tl.to('.landing-content', {
      opacity: 0,
      scale: 0.9,
      duration: 0.4,
      ease: 'power2.in',
    });
  }, [isExiting, onEnter]);

  // Entrance animations
  useEffect(() => {
    const tl = gsap.timeline();

    // Animate title
    tl.fromTo(
      '.landing-title',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
    )
      .fromTo(
        '.landing-subtitle',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5',
      )
      .fromTo(
        '.landing-preview',
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' },
        '-=0.3',
      )
      .fromTo(
        '.landing-features',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
        '-=0.5',
      )
      .fromTo(
        '.press-enter',
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        '-=0.3',
      );

    // Pulse animation for "Press Enter"
    gsap.to('.press-enter-text', {
      opacity: 0.5,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
    });

    return () => tl.kill();
  }, []);

  // Handle Enter key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleEnter();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleEnter]);

  if (!isVisible) return null;

  return (
    <>
      {showWarp && <WarpAnimation />}
      <div ref={containerRef} className="landing-container">
        <div className="landing-grid-bg" />

        <div className="landing-content">
          <h1 className="landing-title">Network Journey</h1>

          <p className="landing-subtitle">
            Experience how your browser connects to the internet — from DNS
            lookup to page render, visualized in 3D
          </p>

          <div className="landing-preview">
            <PreviewScene />
          </div>

          <div className="feature-pills-container">
            {[
              { icon: '🌐', text: 'DNS Lookup' },
              { icon: '🤝', text: 'TCP Handshake' },
              { icon: '🔒', text: 'SSL/TLS' },
              { icon: '📦', text: 'HTTP Request' },
              { icon: '🎨', text: 'Browser Rendering' },
            ].map((feature, i) => (
              <div key={i} className="landing-features">
                <span className="feature-icon">{feature.icon}</span>
                {feature.text}
              </div>
            ))}
          </div>

          <div className="press-enter">
            <button onClick={handleEnter} className="start-button">
              Start Journey
            </button>
            <span className="press-enter-text">
              or press <kbd className="kbd">Enter ↵</kbd>
            </span>
          </div>
        </div>

        <div className="landing-bottom-gradient" />
      </div>
    </>
  );
}
