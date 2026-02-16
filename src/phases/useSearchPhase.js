import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Complete Network Journey Animation
 * Phase 1: Laptop → Router → ISP → Submarine Cable
 * Phase 2: DNS Lookup
 * Phase 3: TCP 3-Way Handshake
 * Phase 4: SSL/TLS Handshake
 */
export default function useSearchPhase(packetRef, setSearchState) {
  useEffect(() => {
    if (!packetRef.current) return;

    // Starting position (at laptop)
    gsap.set(packetRef.current.position, { x: -10, y: 0.5, z: 0 });

    // Wait for DOM
    const timer = setTimeout(() => {
      ScrollTrigger.refresh(true);
    }, 500);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Phase 1: Initial Request Journey (0-25%)
          if (progress < 0.05) {
            setSearchState('User types google.com');
          } else if (progress < 0.08) {
            setSearchState('Browser creates HTTP request');
          } else if (progress < 0.12) {
            setSearchState('Sending to Router via WiFi...');
          } else if (progress < 0.16) {
            setSearchState('Router forwarding to ISP...');
          } else if (progress < 0.22) {
            setSearchState('Traveling through submarine cable...');
          }
          // Phase 2: DNS (25-40%)
          else if (progress < 0.28) {
            setSearchState('Reaching DNS Server...');
          } else if (progress < 0.32) {
            setSearchState('DNS Query: "What is google.com?"');
          } else if (progress < 0.38) {
            setSearchState('DNS Response: 142.250.190.14');
          }
          // Phase 3: TCP Handshake (40-60%)
          else if (progress < 0.45) {
            setSearchState('Initiating TCP connection...');
          } else if (progress < 0.5) {
            setSearchState('TCP: Sending SYN packet →');
          } else if (progress < 0.55) {
            setSearchState('TCP: Received SYN-ACK ←');
          } else if (progress < 0.6) {
            setSearchState('TCP: Sending ACK → Connection established!');
          }
          // Phase 4: SSL/TLS Handshake (60-85%)
          else if (progress < 0.65) {
            setSearchState('Starting SSL/TLS Handshake...');
          } else if (progress < 0.7) {
            setSearchState('SSL: Client Hello →');
          } else if (progress < 0.75) {
            setSearchState('SSL: Server Hello + Certificate ←');
          } else if (progress < 0.8) {
            setSearchState('SSL: Key Exchange →');
          } else if (progress < 0.85) {
            setSearchState('SSL: Secure connection established! 🔒');
          }
          // Phase 5: Data Transfer (85-100%)
          else if (progress < 0.92) {
            setSearchState('Sending encrypted HTTP request...');
          } else {
            setSearchState('Receiving google.com response! ✓');
          }
        },
      },
    });

    // ========== PHASE 1: Journey to DNS ==========

    // Step 1: Laptop → Router
    tl.to(packetRef.current.position, {
      x: -6,
      y: 0.5,
      duration: 0.5,
      ease: 'power1.inOut',
    });

    // Step 2: Router → ISP
    tl.to(packetRef.current.position, {
      x: 0,
      y: 1,
      duration: 0.5,
      ease: 'power1.inOut',
    });

    // Step 3: ISP → Submarine cable entry
    tl.to(packetRef.current.position, {
      x: 4,
      y: -1,
      duration: 0.4,
      ease: 'power2.in',
    });

    // Step 4: Through submarine cable (dipping underwater)
    tl.to(packetRef.current.position, {
      x: 11,
      y: -3,
      duration: 0.6,
      ease: 'sine.inOut',
    });

    // Step 5: Rising up from cable
    tl.to(packetRef.current.position, {
      x: 18,
      y: -1,
      duration: 0.5,
      ease: 'power2.out',
    });

    // ========== PHASE 2: DNS LOOKUP ==========

    // Step 6: Arrive at DNS Server
    tl.to(packetRef.current.position, {
      x: 22,
      y: 0.5,
      duration: 0.5,
      ease: 'power2.out',
    });

    // Step 7: DNS processes (packet hovers)
    tl.to(packetRef.current.position, {
      y: 1.5,
      duration: 0.3,
      ease: 'power1.out',
    });

    tl.to(packetRef.current.position, {
      y: 0.5,
      duration: 0.3,
      ease: 'power1.in',
    });

    // ========== PHASE 3: TCP HANDSHAKE ==========

    // Step 8: Move towards Google Server
    tl.to(packetRef.current.position, {
      x: 27,
      y: 0.5,
      duration: 0.4,
      ease: 'power1.inOut',
    });

    // SYN: Packet reaches Google
    tl.to(packetRef.current.position, {
      x: 32,
      y: 0.5,
      duration: 0.4,
      ease: 'power2.in',
    });

    // SYN-ACK: Packet bounces back
    tl.to(packetRef.current.position, {
      x: 27,
      y: 1,
      duration: 0.3,
      ease: 'power1.out',
    });

    // ACK: Packet goes to Google again
    tl.to(packetRef.current.position, {
      x: 32,
      y: 0.5,
      duration: 0.3,
      ease: 'power2.in',
    });

    // ========== PHASE 4: SSL HANDSHAKE ==========

    // Client Hello: bounce effect
    tl.to(packetRef.current.position, {
      x: 27,
      y: 0.5,
      duration: 0.25,
      ease: 'power1.out',
    });

    // Server Hello + Cert
    tl.to(packetRef.current.position, {
      x: 32,
      y: 1,
      duration: 0.25,
      ease: 'power1.in',
    });

    // Key Exchange
    tl.to(packetRef.current.position, {
      x: 27,
      y: 0.5,
      duration: 0.25,
      ease: 'power1.out',
    });

    // Secure connection - final position at Google
    tl.to(packetRef.current.position, {
      x: 32,
      y: 0.5,
      duration: 0.4,
      ease: 'power2.inOut',
    });

    // ========== PHASE 5: DATA TRANSFER ==========

    // Packet settles at server with scale pulse
    tl.to(packetRef.current.scale, {
      x: 1.3,
      y: 1.3,
      z: 1.3,
      duration: 0.2,
      ease: 'power2.out',
    });

    tl.to(packetRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.2,
      ease: 'power2.in',
    });

    return () => {
      clearTimeout(timer);
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [packetRef, setSearchState]);
}
