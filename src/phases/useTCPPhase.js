import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useTCPPhase(synRef, synAckRef, ackRef, setState) {
  useEffect(() => {
    if (!synRef.current || !synAckRef.current || !ackRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.scroll-container',
        start: 'top+=1000 top',
        end: 'top+=2000 top',
        scrub: 1.5,
      },
    });

    // SYN
    tl.call(() => setState('SYN_SENT'));
    tl.to(synRef.current.position, {
      x: 8,
      duration: 1,
      ease: 'power1.inOut',
    });

    // SYN-ACK
    tl.call(() => setState('SYN_RECEIVED'));
    tl.to(synAckRef.current.position, {
      x: -8,
      duration: 1,
      ease: 'power1.inOut',
    });

    // ACK
    tl.call(() => setState('ESTABLISHED'));
    tl.to(ackRef.current.position, {
      x: 8,
      duration: 1,
    });

    return () => {
      tl.kill();
    };
  }, [synRef, synAckRef, ackRef, setState]);
}
