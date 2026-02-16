import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Phase 4: SSL/TLS Handshake Animation
 * Client Hello → Server Hello + Certificate → Key Exchange → Finished
 */
export default function useSSLHandshake(
  clientHelloRef,
  serverHelloRef,
  keyExchangeRef,
  finishedRef,
) {
  useEffect(() => {
    if (
      !clientHelloRef.current ||
      !serverHelloRef.current ||
      !keyExchangeRef.current ||
      !finishedRef.current
    )
      return;

    const clientX = 24;
    const serverX = 32;
    const y = 0.5;
    const hiddenY = -5;

    // Initial positions - all hidden
    gsap.set(clientHelloRef.current.position, { x: clientX, y: hiddenY, z: 0 });
    gsap.set(clientHelloRef.current.scale, { x: 0, y: 0, z: 0 });

    gsap.set(serverHelloRef.current.position, { x: serverX, y: hiddenY, z: 0 });
    gsap.set(serverHelloRef.current.scale, { x: 0, y: 0, z: 0 });

    gsap.set(keyExchangeRef.current.position, { x: clientX, y: hiddenY, z: 0 });
    gsap.set(keyExchangeRef.current.scale, { x: 0, y: 0, z: 0 });

    gsap.set(finishedRef.current.position, { x: serverX, y: hiddenY, z: 0 });
    gsap.set(finishedRef.current.scale, { x: 0, y: 0, z: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
      },
    });

    // SSL starts at ~62% scroll
    tl.addLabel('sslStart', 0.62);

    // ========== Client Hello: Client → Server ==========
    tl.to(
      clientHelloRef.current.scale,
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.02,
        ease: 'back.out',
      },
      'sslStart',
    );

    tl.to(
      clientHelloRef.current.position,
      {
        x: clientX,
        y: y,
        z: 0,
        duration: 0.01,
      },
      'sslStart',
    );

    tl.to(
      clientHelloRef.current.position,
      {
        x: serverX,
        duration: 0.04,
        ease: 'power2.inOut',
      },
      'sslStart+=0.02',
    );

    // ========== Server Hello + Certificate: Server → Client ==========
    tl.addLabel('serverHello', 0.68);

    tl.to(
      serverHelloRef.current.scale,
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.02,
        ease: 'back.out',
      },
      'serverHello',
    );

    tl.to(
      serverHelloRef.current.position,
      {
        x: serverX,
        y: y + 0.5,
        z: 0,
        duration: 0.01,
      },
      'serverHello',
    );

    // This packet is bigger (contains certificate)
    tl.to(
      serverHelloRef.current.scale,
      {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 0.02,
      },
      'serverHello+=0.01',
    );

    tl.to(
      serverHelloRef.current.position,
      {
        x: clientX,
        duration: 0.04,
        ease: 'power2.inOut',
      },
      'serverHello+=0.03',
    );

    tl.to(
      serverHelloRef.current.scale,
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.02,
      },
      'serverHello+=0.07',
    );

    // Hide client hello
    tl.to(
      clientHelloRef.current.scale,
      {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.02,
      },
      'serverHello+=0.02',
    );

    // ========== Key Exchange: Client → Server ==========
    tl.addLabel('keyExchange', 0.74);

    tl.to(
      keyExchangeRef.current.scale,
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.02,
        ease: 'back.out',
      },
      'keyExchange',
    );

    tl.to(
      keyExchangeRef.current.position,
      {
        x: clientX,
        y: y + 1,
        z: 0,
        duration: 0.01,
      },
      'keyExchange',
    );

    tl.to(
      keyExchangeRef.current.position,
      {
        x: serverX,
        duration: 0.04,
        ease: 'power2.inOut',
      },
      'keyExchange+=0.02',
    );

    // Hide server hello
    tl.to(
      serverHelloRef.current.scale,
      {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.02,
      },
      'keyExchange+=0.02',
    );

    // ========== Finished: Both sides confirm ==========
    tl.addLabel('finished', 0.8);

    tl.to(
      finishedRef.current.scale,
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.02,
        ease: 'back.out',
      },
      'finished',
    );

    tl.to(
      finishedRef.current.position,
      {
        x: (clientX + serverX) / 2,
        y: y + 1.5,
        z: 0,
        duration: 0.01,
      },
      'finished',
    );

    // Lock icon effect - grow then settle
    tl.to(
      finishedRef.current.scale,
      {
        x: 2,
        y: 2,
        z: 2,
        duration: 0.03,
        ease: 'power2.out',
      },
      'finished+=0.02',
    );

    tl.to(
      finishedRef.current.scale,
      {
        x: 1.5,
        y: 1.5,
        z: 1.5,
        duration: 0.02,
      },
      'finished+=0.05',
    );

    // Hide key exchange
    tl.to(
      keyExchangeRef.current.scale,
      {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.02,
      },
      'finished+=0.03',
    );

    // Final fade out of SSL indicator
    tl.addLabel('sslComplete', 0.88);
    tl.to(
      finishedRef.current.scale,
      {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.03,
      },
      'sslComplete',
    );

    return () => {
      tl.kill();
    };
  }, [clientHelloRef, serverHelloRef, keyExchangeRef, finishedRef]);
}
