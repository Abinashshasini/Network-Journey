import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { registerTimeline } from './stores/player';

/**
 * CameraRig — the camera path is one paused GSAP timeline (authored on a 0–1
 * scale) that the player scrubs. GSAP animates a *base* position; each frame
 * we add a small pointer parallax and ease the real camera towards it, which
 * keeps motion smooth even when the player seeks.
 */
export default function CameraRig() {
  const baseRef = useRef({ x: -10, y: 3, z: 12 });
  const lookAtTarget = useRef({ x: -10, y: 0, z: 0 });
  const fovTarget = useRef({ value: 50 });
  const pointer = useRef({ x: 0, y: 0 });
  const smoothLook = useRef(new THREE.Vector3(-10, 0, 0));

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame(({ camera }, delta) => {
    const base = baseRef.current;
    // Frame-rate independent damping
    const k = 1 - Math.exp(-delta * 6);
    const px = pointer.current.x * 0.6;
    const py = -pointer.current.y * 0.35;
    camera.position.x += (base.x + px - camera.position.x) * k;
    camera.position.y += (base.y + py - camera.position.y) * k;
    camera.position.z += (base.z - camera.position.z) * k;

    const lt = lookAtTarget.current;
    smoothLook.current.x += (lt.x - smoothLook.current.x) * k;
    smoothLook.current.y += (lt.y - smoothLook.current.y) * k;
    smoothLook.current.z += (lt.z - smoothLook.current.z) * k;
    camera.lookAt(smoothLook.current);

    if (Math.abs(camera.fov - fovTarget.current.value) > 0.05) {
      camera.fov += (fovTarget.current.value - camera.fov) * k;
      camera.updateProjectionMatrix();
    }
  });

  useEffect(() => {
    const base = baseRef.current;
    const tl = gsap.timeline({ paused: true });

    // ========== PHASE 1: Journey Start (0-10%) ==========

    // Start at laptop - warm cozy view
    tl.to(base, { x: -10, y: 3, z: 10, duration: 0.02 })
      .to(lookAtTarget.current, { x: -10, y: 0, z: 0, duration: 0.02 }, '<')

      // Move to Router
      .to(base, { x: -4, y: 3, z: 10, duration: 0.02 })
      .to(lookAtTarget.current, { x: -6, y: 0, z: 0, duration: 0.02 }, '<')

      // ARP - slight zoom in
      .to(base, { x: -5, y: 2.5, z: 8, duration: 0.02 })
      .to(lookAtTarget.current, { x: -6, y: 0.5, z: 0, duration: 0.02 }, '<')

      // Move to ISP
      .to(base, { x: 2, y: 4, z: 12, duration: 0.02 })
      .to(lookAtTarget.current, { x: 0, y: 0, z: 0, duration: 0.02 }, '<')

      // ========== REST ZONE (10-12%) - gentle drift ==========
      .to(base, { x: 3, y: 4.5, z: 13, duration: 0.02 })
      .to(lookAtTarget.current, { x: 2, y: 0, z: 0, duration: 0.02 }, '<')

      // ========== PHASE 2: Submarine Cable (12-20%) ==========

      // NAT view
      .to(base, { x: 2, y: 3, z: 10, duration: 0.02 })
      .to(lookAtTarget.current, { x: 0, y: 0, z: 0, duration: 0.02 }, '<')

      // Dramatic dive - camera tilts down into ocean!
      .to(base, { x: 8, y: 0, z: 10, duration: 0.03 })
      .to(lookAtTarget.current, { x: 10, y: -3, z: 0, duration: 0.03 }, '<')
      .to(fovTarget.current, { value: 60, duration: 0.03 }, '<') // widen FOV for drama

      // Through submarine cable - underwater journey
      .to(base, { x: 14, y: -1, z: 8, duration: 0.04 })
      .to(lookAtTarget.current, { x: 14, y: -2, z: 0, duration: 0.04 }, '<')

      // Rising from cable
      .to(base, { x: 18, y: 2, z: 10, duration: 0.02 })
      .to(lookAtTarget.current, { x: 18, y: 0, z: 0, duration: 0.02 }, '<')
      .to(fovTarget.current, { value: 50, duration: 0.02 }, '<') // restore FOV

      // ========== REST ZONE (20-22%) - ocean ambience ==========
      .to(base, { x: 19, y: 3, z: 11, duration: 0.02 })
      .to(lookAtTarget.current, { x: 20, y: 0, z: 0, duration: 0.02 }, '<')

      // ========== PHASE 3: DNS Server (22-30%) ==========

      // Swing around to reveal DNS from behind - dramatic reveal!
      .to(base, { x: 22, y: 5, z: -4, duration: 0.03 })
      .to(lookAtTarget.current, { x: 22, y: 0, z: 0, duration: 0.03 }, '<')
      .to(fovTarget.current, { value: 45, duration: 0.03 }, '<') // tighter for reveal

      // DNS front view
      .to(base, { x: 22, y: 3, z: 8, duration: 0.03 })
      .to(lookAtTarget.current, { x: 22, y: 1, z: 0, duration: 0.03 }, '<')
      .to(fovTarget.current, { value: 50, duration: 0.03 }, '<')

      // ========== REST ZONE (30-32%) - data center hum ==========
      .to(base, { x: 23, y: 3.5, z: 9, duration: 0.02 })
      .to(lookAtTarget.current, { x: 24, y: 0, z: 0, duration: 0.02 }, '<')

      // ========== PHASE 4: TCP Handshake (32-42%) ==========

      // Wide shot - pull back to see both client and server
      .to(base, { x: 28, y: 6, z: 18, duration: 0.02 })
      .to(lookAtTarget.current, { x: 29, y: 0, z: 0, duration: 0.02 }, '<')
      .to(fovTarget.current, { value: 58, duration: 0.02 }, '<') // wider for handshake

      // Follow SYN to Google
      .to(base, { x: 32, y: 4, z: 12, duration: 0.03 })
      .to(lookAtTarget.current, { x: 32, y: 0, z: 0, duration: 0.03 }, '<')

      // SYN-ACK bounce - snap back
      .to(base, { x: 29, y: 4, z: 14, duration: 0.02 })
      .to(lookAtTarget.current, { x: 28, y: 0, z: 0, duration: 0.02 }, '<')

      // ACK final
      .to(base, { x: 32, y: 4, z: 12, duration: 0.02 })
      .to(lookAtTarget.current, { x: 32, y: 0, z: 0, duration: 0.02 }, '<')
      .to(fovTarget.current, { value: 50, duration: 0.02 }, '<')

      // ========== PHASE 5: SSL Handshake (42-52%) ==========

      // Wide view for SSL
      .to(base, { x: 29, y: 5, z: 15, duration: 0.02 })
      .to(lookAtTarget.current, { x: 30, y: 0, z: 0, duration: 0.02 }, '<')

      // Client Hello
      .to(base, { x: 30, y: 4, z: 12, duration: 0.02 })
      .to(lookAtTarget.current, { x: 29, y: 0, z: 0, duration: 0.02 }, '<')

      // Server Hello
      .to(base, { x: 32, y: 4, z: 10, duration: 0.02 })
      .to(lookAtTarget.current, { x: 32, y: 0, z: 0, duration: 0.02 }, '<')

      // Key Exchange
      .to(base, { x: 30, y: 3, z: 12, duration: 0.02 })
      .to(lookAtTarget.current, { x: 30, y: 0, z: 0, duration: 0.02 }, '<')

      // Lock appears - zoom to center
      .to(base, { x: 29, y: 3, z: 8, duration: 0.02 })
      .to(lookAtTarget.current, { x: 28.5, y: 2, z: 0, duration: 0.02 }, '<')
      .to(fovTarget.current, { value: 42, duration: 0.02 }, '<') // tight on lock

      // ========== REST ZONE (52-54%) - secure tunnel glow ==========
      .to(base, { x: 29, y: 3.5, z: 9, duration: 0.02 })
      .to(lookAtTarget.current, { x: 30, y: 1, z: 0, duration: 0.02 }, '<')
      .to(fovTarget.current, { value: 50, duration: 0.02 }, '<')

      // ========== PHASE 6: HTTP Request/Response (54-64%) ==========

      // View at Google server for HTTP
      .to(base, { x: 32, y: 4, z: 10, duration: 0.02 })
      .to(lookAtTarget.current, { x: 32, y: 0, z: 0, duration: 0.02 }, '<')

      // Pull back to see response traveling - increasing speed feel
      .to(base, { x: 15, y: 5, z: 15, duration: 0.03 })
      .to(lookAtTarget.current, { x: 10, y: 0, z: 0, duration: 0.03 }, '<')
      .to(fovTarget.current, { value: 62, duration: 0.02 }, '<') // wide for speed

      // Follow response back toward laptop
      .to(base, { x: 0, y: 4, z: 14, duration: 0.03 })
      .to(lookAtTarget.current, { x: -5, y: 0, z: 0, duration: 0.03 }, '<')
      .to(fovTarget.current, { value: 50, duration: 0.03 }, '<')

      // ========== REST ZONE (64-66%) - data in flight ==========
      .to(base, { x: -2, y: 3.5, z: 12, duration: 0.02 })
      .to(lookAtTarget.current, { x: -5, y: 0, z: 0, duration: 0.02 }, '<')

      // ========== PHASE 7: Network Waterfall (66-68%) ==========
      .to(base, { x: -7, y: 3, z: 10, duration: 0.02 })
      .to(lookAtTarget.current, { x: -7, y: 1, z: 4, duration: 0.02 }, '<')

      // ========== PHASE 8: Browser Rendering (68-88%) ==========

      // Zoom INTO the laptop screen - dramatic entry!
      .to(base, { x: -12, y: 2, z: 6, duration: 0.02 })
      .to(lookAtTarget.current, { x: -12, y: 1, z: 0, duration: 0.02 }, '<')
      .to(fovTarget.current, { value: 40, duration: 0.02 }, '<') // close-up

      // DOM Tree view
      .to(base, { x: -14, y: 3, z: 8, duration: 0.03 })
      .to(lookAtTarget.current, { x: -14, y: 2, z: 2, duration: 0.03 }, '<')

      // CSSOM view
      .to(base, { x: -10, y: 3, z: 8, duration: 0.03 })
      .to(lookAtTarget.current, { x: -10, y: 2, z: 2, duration: 0.03 }, '<')

      // Render Tree view
      .to(base, { x: -12, y: 3, z: 8, duration: 0.03 })
      .to(lookAtTarget.current, { x: -12, y: 2, z: 2, duration: 0.03 }, '<')

      // JS Engine view - drop down
      .to(base, { x: -12, y: 1, z: 8, duration: 0.03 })
      .to(lookAtTarget.current, { x: -12, y: -1, z: 2, duration: 0.03 }, '<')

      // Layout/Paint view
      .to(base, { x: -12, y: 2, z: 8, duration: 0.03 })
      .to(lookAtTarget.current, { x: -12, y: 1, z: 2, duration: 0.03 }, '<')

      // ========== PHASE 9: GPU Pipeline (88-94%) ==========

      .to(base, { x: -12, y: 2, z: 10, duration: 0.03 })
      .to(lookAtTarget.current, { x: -12, y: 0, z: 4, duration: 0.03 }, '<')
      .to(fovTarget.current, { value: 50, duration: 0.03 }, '<')

      // ========== PHASE 10: Complete (94-100%) ==========

      // Final composite view
      .to(base, { x: -12, y: 2, z: 9, duration: 0.02 })
      .to(lookAtTarget.current, { x: -12, y: 1, z: 3, duration: 0.02 }, '<')

      // Grand pullback - see entire journey path
      .to(base, { x: 10, y: 15, z: 30, duration: 0.04 })
      .to(lookAtTarget.current, { x: 10, y: 0, z: 0, duration: 0.04 }, '<')
      .to(fovTarget.current, { value: 65, duration: 0.04 }, '<'); // widest for panorama

    const unregister = registerTimeline(tl);
    return () => {
      unregister();
      tl.kill();
    };
  }, []);

  return null;
}
