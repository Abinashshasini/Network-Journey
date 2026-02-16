import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Phase 3: TCP 3-Way Handshake Animation
 * SYN → SYN-ACK → ACK
 */
export default function useTCPHandshake(synRef, synAckRef, ackRef) {
  useEffect(() => {
    if (!synRef.current || !synAckRef.current || !ackRef.current) return;

    // Initial positions - hidden at client side (near DNS)
    const clientX = 24;
    const serverX = 32;
    const y = 0.5;
    const hiddenY = -5;

    gsap.set(synRef.current.position, { x: clientX, y: hiddenY, z: 0 });
    gsap.set(synRef.current.scale, { x: 0, y: 0, z: 0 });

    gsap.set(synAckRef.current.position, { x: serverX, y: hiddenY, z: 0 });
    gsap.set(synAckRef.current.scale, { x: 0, y: 0, z: 0 });

    gsap.set(ackRef.current.position, { x: clientX, y: hiddenY, z: 0 });
    gsap.set(ackRef.current.scale, { x: 0, y: 0, z: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    });

    // Timeline position: TCP starts at ~40% scroll
    tl.addLabel('tcpStart', 0.4);

    // ========== SYN: Client → Server ==========
    tl.to(
      synRef.current.scale,
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.02,
        ease: 'back.out',
      },
      'tcpStart',
    );

    tl.to(
      synRef.current.position,
      {
        x: clientX,
        y: y,
        z: 0,
        duration: 0.01,
      },
      'tcpStart',
    );

    tl.to(
      synRef.current.position,
      {
        x: serverX,
        duration: 0.05,
        ease: 'power2.inOut',
      },
      'tcpStart+=0.02',
    );

    // SYN arrives, pulse effect
    tl.to(
      synRef.current.scale,
      {
        x: 1.3,
        y: 1.3,
        z: 1.3,
        duration: 0.01,
      },
      'tcpStart+=0.07',
    );

    tl.to(
      synRef.current.scale,
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.01,
      },
      'tcpStart+=0.08',
    );

    // ========== SYN-ACK: Server → Client ==========
    tl.addLabel('synAck', 0.48);

    tl.to(
      synAckRef.current.scale,
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.02,
        ease: 'back.out',
      },
      'synAck',
    );

    tl.to(
      synAckRef.current.position,
      {
        x: serverX,
        y: y + 0.5,
        z: 0,
        duration: 0.01,
      },
      'synAck',
    );

    tl.to(
      synAckRef.current.position,
      {
        x: clientX,
        duration: 0.05,
        ease: 'power2.inOut',
      },
      'synAck+=0.02',
    );

    // SYN-ACK arrives
    tl.to(
      synAckRef.current.scale,
      {
        x: 1.3,
        y: 1.3,
        z: 1.3,
        duration: 0.01,
      },
      'synAck+=0.07',
    );

    tl.to(
      synAckRef.current.scale,
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.01,
      },
      'synAck+=0.08',
    );

    // ========== ACK: Client → Server ==========
    tl.addLabel('ack', 0.55);

    tl.to(
      ackRef.current.scale,
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.02,
        ease: 'back.out',
      },
      'ack',
    );

    tl.to(
      ackRef.current.position,
      {
        x: clientX,
        y: y + 1,
        z: 0,
        duration: 0.01,
      },
      'ack',
    );

    tl.to(
      ackRef.current.position,
      {
        x: serverX,
        duration: 0.05,
        ease: 'power2.inOut',
      },
      'ack+=0.02',
    );

    // Connection established - all packets pulse
    tl.addLabel('connected', 0.6);

    // Fade out TCP packets after connection
    tl.to(
      [synRef.current.scale, synAckRef.current.scale, ackRef.current.scale],
      {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.03,
        stagger: 0.01,
      },
      'connected+=0.02',
    );

    return () => {
      tl.kill();
    };
  }, [synRef, synAckRef, ackRef]);
}
