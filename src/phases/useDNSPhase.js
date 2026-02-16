import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function useDNSPhase(packetRef, setDNSState) {
  useEffect(() => {
    if (!packetRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.scroll-container',
        start: 'top+=500 top',
        end: 'top+=1200 top',
        scrub: 1.5,
      },
    });

    // Query Resolver
    tl.call(() => setDNSState('Querying Recursive Resolver')).to(
      packetRef.current.position,
      {
        x: -2,
        y: 4,
        duration: 1,
      },
    );

    // Resolver → Root
    tl.call(() => setDNSState('Resolver → Root Server')).to(
      packetRef.current.position,
      {
        x: 2,
        y: 8,
        duration: 1,
      },
    );

    // Root → TLD
    tl.call(() => setDNSState('Root → .com TLD')).to(
      packetRef.current.position,
      {
        x: 6,
        y: 4,
        duration: 1,
      },
    );

    // TLD → Authoritative
    tl.call(() => setDNSState('TLD → Authoritative')).to(
      packetRef.current.position,
      {
        x: 10,
        y: 0,
        duration: 1,
      },
    );

    // Response Back to Client
    tl.call(() => setDNSState('Returning IP: 142.250.183.14')).to(
      packetRef.current.position,
      {
        x: -8,
        y: 0,
        duration: 2,
      },
    );

    return () => {
      tl.kill();
    };
  }, [packetRef, setDNSState]);
}
