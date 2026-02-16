import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CameraRig() {
  const { camera } = useThree();
  const lookAtTarget = useRef({ x: -10, y: 0, z: 0 });

  useFrame(() => {
    camera.lookAt(
      lookAtTarget.current.x,
      lookAtTarget.current.y,
      lookAtTarget.current.z,
    );
  });

  useEffect(() => {
    // Wait for scroll container to be ready
    const timer = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 500);

    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'camera-animation',
        trigger: '.scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 4, // Higher value = smoother, slower animation
      },
    });

    // ========== PHASE 1: Journey Start ==========

    // Start at laptop
    tl.to(camera.position, { x: -10, y: 3, z: 10, duration: 0.25 })
      .to(lookAtTarget.current, { x: -10, y: 0, z: 0, duration: 0.25 }, '<')

      // Move to Router
      .to(camera.position, { x: -4, y: 3, z: 10, duration: 0.25 })
      .to(lookAtTarget.current, { x: -6, y: 0, z: 0, duration: 0.25 }, '<')

      // Move to ISP
      .to(camera.position, { x: 2, y: 4, z: 12, duration: 0.25 })
      .to(lookAtTarget.current, { x: 0, y: 0, z: 0, duration: 0.25 }, '<')

      // Pull back to see submarine cable
      .to(camera.position, { x: 10, y: 2, z: 14, duration: 0.3 })
      .to(lookAtTarget.current, { x: 10, y: -2, z: 0, duration: 0.3 }, '<')

      // Follow through cable
      .to(camera.position, { x: 16, y: 3, z: 12, duration: 0.25 })
      .to(lookAtTarget.current, { x: 16, y: 0, z: 0, duration: 0.25 }, '<')

      // ========== PHASE 2: DNS Server ==========

      // Arrive at DNS
      .to(camera.position, { x: 22, y: 4, z: 12, duration: 0.25 })
      .to(lookAtTarget.current, { x: 22, y: 0, z: 0, duration: 0.25 }, '<')

      // DNS lookup view
      .to(camera.position, { x: 22, y: 3, z: 8, duration: 0.2 })
      .to(lookAtTarget.current, { x: 22, y: 1, z: 0, duration: 0.2 }, '<')

      // ========== PHASE 3: TCP Handshake ==========

      // Wide view for TCP handshake
      .to(camera.position, { x: 27, y: 5, z: 16, duration: 0.25 })
      .to(lookAtTarget.current, { x: 29, y: 0, z: 0, duration: 0.25 }, '<')

      // Follow SYN to Google
      .to(camera.position, { x: 32, y: 4, z: 12, duration: 0.2 })
      .to(lookAtTarget.current, { x: 32, y: 0, z: 0, duration: 0.2 }, '<')

      // SYN-ACK bounce
      .to(camera.position, { x: 29, y: 4, z: 14, duration: 0.15 })
      .to(lookAtTarget.current, { x: 29, y: 0, z: 0, duration: 0.15 }, '<')

      // ACK final
      .to(camera.position, { x: 32, y: 4, z: 12, duration: 0.15 })
      .to(lookAtTarget.current, { x: 32, y: 0, z: 0, duration: 0.15 }, '<')

      // ========== PHASE 4: SSL Handshake ==========

      // Wide view for SSL
      .to(camera.position, { x: 29, y: 5, z: 15, duration: 0.2 })
      .to(lookAtTarget.current, { x: 30, y: 0, z: 0, duration: 0.2 }, '<')

      // Client Hello
      .to(camera.position, { x: 30, y: 4, z: 12, duration: 0.12 })
      .to(lookAtTarget.current, { x: 29, y: 0, z: 0, duration: 0.12 }, '<')

      // Server Hello
      .to(camera.position, { x: 32, y: 4, z: 10, duration: 0.12 })
      .to(lookAtTarget.current, { x: 32, y: 0, z: 0, duration: 0.12 }, '<')

      // Key Exchange
      .to(camera.position, { x: 30, y: 3, z: 12, duration: 0.12 })
      .to(lookAtTarget.current, { x: 30, y: 0, z: 0, duration: 0.12 }, '<')

      // ========== PHASE 5: HTTP Request/Response ==========

      // View at Google server for HTTP
      .to(camera.position, { x: 32, y: 4, z: 10, duration: 0.2 })
      .to(lookAtTarget.current, { x: 32, y: 0, z: 0, duration: 0.2 }, '<')

      // Pull back to see response traveling
      .to(camera.position, { x: 15, y: 5, z: 15, duration: 0.3 })
      .to(lookAtTarget.current, { x: 10, y: 0, z: 0, duration: 0.3 }, '<')

      // Follow response back toward laptop
      .to(camera.position, { x: 0, y: 4, z: 14, duration: 0.25 })
      .to(lookAtTarget.current, { x: -5, y: 0, z: 0, duration: 0.25 }, '<')

      // ========== PHASE 6: Network Waterfall ==========

      // View waterfall timeline
      .to(camera.position, { x: -7, y: 3, z: 10, duration: 0.2 })
      .to(lookAtTarget.current, { x: -7, y: 1, z: 4, duration: 0.2 }, '<')

      // ========== PHASE 7: Browser Rendering ==========

      // Move to browser view - near laptop
      .to(camera.position, { x: -12, y: 3, z: 10, duration: 0.2 })
      .to(lookAtTarget.current, { x: -12, y: 1, z: 2, duration: 0.2 }, '<')

      // DOM Tree view
      .to(camera.position, { x: -14, y: 3, z: 8, duration: 0.15 })
      .to(lookAtTarget.current, { x: -14, y: 2, z: 2, duration: 0.15 }, '<')

      // CSSOM view
      .to(camera.position, { x: -10, y: 3, z: 8, duration: 0.15 })
      .to(lookAtTarget.current, { x: -10, y: 2, z: 2, duration: 0.15 }, '<')

      // Render Tree view
      .to(camera.position, { x: -12, y: 3, z: 8, duration: 0.15 })
      .to(lookAtTarget.current, { x: -12, y: 2, z: 2, duration: 0.15 }, '<')

      // JS Engine view
      .to(camera.position, { x: -12, y: 1, z: 8, duration: 0.15 })
      .to(lookAtTarget.current, { x: -12, y: -1, z: 2, duration: 0.15 }, '<')

      // Layout/Paint view
      .to(camera.position, { x: -12, y: 2, z: 8, duration: 0.12 })
      .to(lookAtTarget.current, { x: -12, y: 1, z: 2, duration: 0.12 }, '<')

      // ========== PHASE 8: GPU Pipeline ==========

      // View GPU rendering pipeline
      .to(camera.position, { x: -12, y: 2, z: 10, duration: 0.15 })
      .to(lookAtTarget.current, { x: -12, y: 0, z: 4, duration: 0.15 }, '<')

      // ========== PHASE 9: Complete ==========

      // Final composite view - see rendered page
      .to(camera.position, { x: -12, y: 2, z: 9, duration: 0.15 })
      .to(lookAtTarget.current, { x: -12, y: 1, z: 3, duration: 0.15 }, '<')

      // Celebrate - pull back slightly
      .to(camera.position, { x: -12, y: 3, z: 11, duration: 0.12 })
      .to(lookAtTarget.current, { x: -12, y: 1, z: 3, duration: 0.15 }, '<');

    return () => {
      clearTimeout(timer);
      tl.kill();
      // Only kill our own ScrollTrigger
      const st = ScrollTrigger.getById('camera-animation');
      if (st) st.kill();
    };
  }, [camera]);

  return null;
}
