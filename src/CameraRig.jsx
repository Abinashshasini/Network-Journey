import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CameraRig() {
  const { camera } = useThree();
  const lookAtTarget = useRef({ x: -10, y: 0, z: 0 });
  const fovTarget = useRef({ value: 50 });

  useFrame(() => {
    camera.lookAt(
      lookAtTarget.current.x,
      lookAtTarget.current.y,
      lookAtTarget.current.z,
    );
    // Smooth FOV animation
    if (Math.abs(camera.fov - fovTarget.current.value) > 0.1) {
      camera.fov += (fovTarget.current.value - camera.fov) * 0.08;
      camera.updateProjectionMatrix();
    }
  });

  useEffect(() => {
    // Refresh after the DOM is fully settled (scroll container rendered)
    const timer = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 800);

    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'camera-animation',
        trigger: '.scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 4,
      },
    });

    // ========== PHASE 1: Journey Start (0-10%) ==========

    // Start at laptop - warm cozy view
    tl.to(camera.position, { x: -10, y: 3, z: 10, duration: 0.02 })
      .to(lookAtTarget.current, { x: -10, y: 0, z: 0, duration: 0.02 }, '<')

      // Move to Router
      .to(camera.position, { x: -4, y: 3, z: 10, duration: 0.02 })
      .to(lookAtTarget.current, { x: -6, y: 0, z: 0, duration: 0.02 }, '<')

      // ARP - slight zoom in
      .to(camera.position, { x: -5, y: 2.5, z: 8, duration: 0.02 })
      .to(lookAtTarget.current, { x: -6, y: 0.5, z: 0, duration: 0.02 }, '<')

      // Move to ISP
      .to(camera.position, { x: 2, y: 4, z: 12, duration: 0.02 })
      .to(lookAtTarget.current, { x: 0, y: 0, z: 0, duration: 0.02 }, '<')

      // ========== REST ZONE (10-12%) - gentle drift ==========
      .to(camera.position, { x: 3, y: 4.5, z: 13, duration: 0.02 })
      .to(lookAtTarget.current, { x: 2, y: 0, z: 0, duration: 0.02 }, '<')

      // ========== PHASE 2: Submarine Cable (12-20%) ==========

      // NAT view
      .to(camera.position, { x: 2, y: 3, z: 10, duration: 0.02 })
      .to(lookAtTarget.current, { x: 0, y: 0, z: 0, duration: 0.02 }, '<')

      // Dramatic dive - camera tilts down into ocean!
      .to(camera.position, { x: 8, y: 0, z: 10, duration: 0.03 })
      .to(lookAtTarget.current, { x: 10, y: -3, z: 0, duration: 0.03 }, '<')
      .to(fovTarget.current, { value: 60, duration: 0.03 }, '<') // widen FOV for drama

      // Through submarine cable - underwater journey
      .to(camera.position, { x: 14, y: -1, z: 8, duration: 0.04 })
      .to(lookAtTarget.current, { x: 14, y: -2, z: 0, duration: 0.04 }, '<')

      // Rising from cable
      .to(camera.position, { x: 18, y: 2, z: 10, duration: 0.02 })
      .to(lookAtTarget.current, { x: 18, y: 0, z: 0, duration: 0.02 }, '<')
      .to(fovTarget.current, { value: 50, duration: 0.02 }, '<') // restore FOV

      // ========== REST ZONE (20-22%) - ocean ambience ==========
      .to(camera.position, { x: 19, y: 3, z: 11, duration: 0.02 })
      .to(lookAtTarget.current, { x: 20, y: 0, z: 0, duration: 0.02 }, '<')

      // ========== PHASE 3: DNS Server (22-30%) ==========

      // Swing around to reveal DNS from behind - dramatic reveal!
      .to(camera.position, { x: 22, y: 5, z: -4, duration: 0.03 })
      .to(lookAtTarget.current, { x: 22, y: 0, z: 0, duration: 0.03 }, '<')
      .to(fovTarget.current, { value: 45, duration: 0.03 }, '<') // tighter for reveal

      // DNS front view
      .to(camera.position, { x: 22, y: 3, z: 8, duration: 0.03 })
      .to(lookAtTarget.current, { x: 22, y: 1, z: 0, duration: 0.03 }, '<')
      .to(fovTarget.current, { value: 50, duration: 0.03 }, '<')

      // ========== REST ZONE (30-32%) - data center hum ==========
      .to(camera.position, { x: 23, y: 3.5, z: 9, duration: 0.02 })
      .to(lookAtTarget.current, { x: 24, y: 0, z: 0, duration: 0.02 }, '<')

      // ========== PHASE 4: TCP Handshake (32-42%) ==========

      // Wide shot - pull back to see both client and server
      .to(camera.position, { x: 28, y: 6, z: 18, duration: 0.02 })
      .to(lookAtTarget.current, { x: 29, y: 0, z: 0, duration: 0.02 }, '<')
      .to(fovTarget.current, { value: 58, duration: 0.02 }, '<') // wider for handshake

      // Follow SYN to Google
      .to(camera.position, { x: 32, y: 4, z: 12, duration: 0.03 })
      .to(lookAtTarget.current, { x: 32, y: 0, z: 0, duration: 0.03 }, '<')

      // SYN-ACK bounce - snap back
      .to(camera.position, { x: 29, y: 4, z: 14, duration: 0.02 })
      .to(lookAtTarget.current, { x: 28, y: 0, z: 0, duration: 0.02 }, '<')

      // ACK final
      .to(camera.position, { x: 32, y: 4, z: 12, duration: 0.02 })
      .to(lookAtTarget.current, { x: 32, y: 0, z: 0, duration: 0.02 }, '<')
      .to(fovTarget.current, { value: 50, duration: 0.02 }, '<')

      // ========== PHASE 5: SSL Handshake (42-52%) ==========

      // Wide view for SSL
      .to(camera.position, { x: 29, y: 5, z: 15, duration: 0.02 })
      .to(lookAtTarget.current, { x: 30, y: 0, z: 0, duration: 0.02 }, '<')

      // Client Hello
      .to(camera.position, { x: 30, y: 4, z: 12, duration: 0.02 })
      .to(lookAtTarget.current, { x: 29, y: 0, z: 0, duration: 0.02 }, '<')

      // Server Hello
      .to(camera.position, { x: 32, y: 4, z: 10, duration: 0.02 })
      .to(lookAtTarget.current, { x: 32, y: 0, z: 0, duration: 0.02 }, '<')

      // Key Exchange
      .to(camera.position, { x: 30, y: 3, z: 12, duration: 0.02 })
      .to(lookAtTarget.current, { x: 30, y: 0, z: 0, duration: 0.02 }, '<')

      // Lock appears - zoom to center
      .to(camera.position, { x: 29, y: 3, z: 8, duration: 0.02 })
      .to(lookAtTarget.current, { x: 28.5, y: 2, z: 0, duration: 0.02 }, '<')
      .to(fovTarget.current, { value: 42, duration: 0.02 }, '<') // tight on lock

      // ========== REST ZONE (52-54%) - secure tunnel glow ==========
      .to(camera.position, { x: 29, y: 3.5, z: 9, duration: 0.02 })
      .to(lookAtTarget.current, { x: 30, y: 1, z: 0, duration: 0.02 }, '<')
      .to(fovTarget.current, { value: 50, duration: 0.02 }, '<')

      // ========== PHASE 6: HTTP Request/Response (54-64%) ==========

      // View at Google server for HTTP
      .to(camera.position, { x: 32, y: 4, z: 10, duration: 0.02 })
      .to(lookAtTarget.current, { x: 32, y: 0, z: 0, duration: 0.02 }, '<')

      // Pull back to see response traveling - increasing speed feel
      .to(camera.position, { x: 15, y: 5, z: 15, duration: 0.03 })
      .to(lookAtTarget.current, { x: 10, y: 0, z: 0, duration: 0.03 }, '<')
      .to(fovTarget.current, { value: 62, duration: 0.02 }, '<') // wide for speed

      // Follow response back toward laptop
      .to(camera.position, { x: 0, y: 4, z: 14, duration: 0.03 })
      .to(lookAtTarget.current, { x: -5, y: 0, z: 0, duration: 0.03 }, '<')
      .to(fovTarget.current, { value: 50, duration: 0.03 }, '<')

      // ========== REST ZONE (64-66%) - data in flight ==========
      .to(camera.position, { x: -2, y: 3.5, z: 12, duration: 0.02 })
      .to(lookAtTarget.current, { x: -5, y: 0, z: 0, duration: 0.02 }, '<')

      // ========== PHASE 7: Network Waterfall (66-68%) ==========
      .to(camera.position, { x: -7, y: 3, z: 10, duration: 0.02 })
      .to(lookAtTarget.current, { x: -7, y: 1, z: 4, duration: 0.02 }, '<')

      // ========== PHASE 8: Browser Rendering (68-88%) ==========

      // Zoom INTO the laptop screen - dramatic entry!
      .to(camera.position, { x: -12, y: 2, z: 6, duration: 0.02 })
      .to(lookAtTarget.current, { x: -12, y: 1, z: 0, duration: 0.02 }, '<')
      .to(fovTarget.current, { value: 40, duration: 0.02 }, '<') // close-up

      // DOM Tree view
      .to(camera.position, { x: -14, y: 3, z: 8, duration: 0.03 })
      .to(lookAtTarget.current, { x: -14, y: 2, z: 2, duration: 0.03 }, '<')

      // CSSOM view
      .to(camera.position, { x: -10, y: 3, z: 8, duration: 0.03 })
      .to(lookAtTarget.current, { x: -10, y: 2, z: 2, duration: 0.03 }, '<')

      // Render Tree view
      .to(camera.position, { x: -12, y: 3, z: 8, duration: 0.03 })
      .to(lookAtTarget.current, { x: -12, y: 2, z: 2, duration: 0.03 }, '<')

      // JS Engine view - drop down
      .to(camera.position, { x: -12, y: 1, z: 8, duration: 0.03 })
      .to(lookAtTarget.current, { x: -12, y: -1, z: 2, duration: 0.03 }, '<')

      // Layout/Paint view
      .to(camera.position, { x: -12, y: 2, z: 8, duration: 0.03 })
      .to(lookAtTarget.current, { x: -12, y: 1, z: 2, duration: 0.03 }, '<')

      // ========== PHASE 9: GPU Pipeline (88-94%) ==========

      .to(camera.position, { x: -12, y: 2, z: 10, duration: 0.03 })
      .to(lookAtTarget.current, { x: -12, y: 0, z: 4, duration: 0.03 }, '<')
      .to(fovTarget.current, { value: 50, duration: 0.03 }, '<')

      // ========== PHASE 10: Complete (94-100%) ==========

      // Final composite view
      .to(camera.position, { x: -12, y: 2, z: 9, duration: 0.02 })
      .to(lookAtTarget.current, { x: -12, y: 1, z: 3, duration: 0.02 }, '<')

      // Grand pullback - see entire journey path
      .to(camera.position, { x: 10, y: 15, z: 30, duration: 0.04 })
      .to(lookAtTarget.current, { x: 10, y: 0, z: 0, duration: 0.04 }, '<')
      .to(fovTarget.current, { value: 65, duration: 0.04 }, '<'); // widest for panorama

    return () => {
      clearTimeout(timer);
      tl.kill();
      const st = ScrollTrigger.getById('camera-animation');
      if (st) st.kill();
    };
  }, [camera]);

  return null;
}
