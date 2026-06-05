import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

import TCPPacket from '../packet/TCPPacket';
import HandshakePacket from '../packet/HandshakePacket';
import SSLPacket from '../packet/SSLPacket';
import ResponsePacket from '../packet/ResponsePacket';
import {
  DOMTree,
  CSSOMTree,
  RenderTree,
  JSEngine,
  LayoutStage,
  PaintStage,
  CompositeStage,
  NetworkWaterfall,
  GPURenderingPipeline,
} from '../world/BrowserRenderer';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedPackets() {
  const searchPacketRef = useRef();
  const synRef = useRef();
  const synAckRef = useRef();
  const ackRef = useRef();
  const clientHelloRef = useRef();
  const serverHelloRef = useRef();
  const keyExchangeRef = useRef();
  const finishedRef = useRef();
  const htmlPacketRef = useRef();
  const cssPacketRef = useRef();
  const jsPacketRef = useRef();
  const domTreeRef = useRef();
  const cssomTreeRef = useRef();
  const renderTreeRef = useRef();
  const jsEngineRef = useRef();
  const layoutRef = useRef();
  const paintRef = useRef();
  const compositeRef = useRef();
  const waterfallRef = useRef();
  const gpuPipelineRef = useRef();

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchPacketRef.current) setInitialized(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!initialized || !searchPacketRef.current) return;

    // Initial positions
    gsap.set(searchPacketRef.current.position, { x: -10, y: 0.5, z: 0 });

    // Hide all packets initially
    const hideRefs = [
      synRef, synAckRef, ackRef,
      clientHelloRef, serverHelloRef, keyExchangeRef, finishedRef,
      htmlPacketRef, cssPacketRef, jsPacketRef,
      domTreeRef, cssomTreeRef, renderTreeRef, jsEngineRef,
      layoutRef, paintRef, compositeRef,
      waterfallRef, gpuPipelineRef,
    ];
    hideRefs.forEach((ref) => {
      if (ref.current) gsap.set(ref.current.scale, { x: 0, y: 0, z: 0 });
    });

    setTimeout(() => ScrollTrigger.refresh(true), 800);

    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'packets-animation',
        trigger: '.scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 4,
      },
    });

    // ========== MAIN PACKET JOURNEY (0-10%) ==========

    // Laptop -> Router
    tl.to(
      searchPacketRef.current.position,
      { x: -6, y: 0.5, duration: 0.03, ease: 'power1.inOut' },
      0.02,
    );

    // Router -> ISP
    tl.to(
      searchPacketRef.current.position,
      { x: 0, y: 1, duration: 0.03, ease: 'power1.inOut' },
      0.06,
    );

    // ========== SUBMARINE CABLE (12-20%) ==========

    // ISP -> Cable entry
    tl.to(
      searchPacketRef.current.position,
      { x: 4, y: -1, duration: 0.02, ease: 'power2.in' },
      0.13,
    );

    // Through submarine cable - deep dive
    tl.to(
      searchPacketRef.current.position,
      { x: 11, y: -3, duration: 0.03, ease: 'sine.inOut' },
      0.15,
    );

    // Rising from cable
    tl.to(
      searchPacketRef.current.position,
      { x: 18, y: -1, duration: 0.02, ease: 'power2.out' },
      0.18,
    );

    // ========== DNS (22-30%) ==========

    // Arrive at DNS
    tl.to(
      searchPacketRef.current.position,
      { x: 22, y: 0.5, duration: 0.02, ease: 'power2.out' },
      0.23,
    );

    // DNS hover effect
    tl.to(searchPacketRef.current.position, { y: 1.5, duration: 0.02 }, 0.26);
    tl.to(searchPacketRef.current.position, { y: 0.5, duration: 0.02 }, 0.28);

    // Move to handshake area
    tl.to(
      searchPacketRef.current.position,
      { x: 25, y: 0.5, duration: 0.02 },
      0.30,
    );

    // ========== TCP HANDSHAKE (32-42%) ==========
    const clientX = 25;
    const serverX = 32;

    // SYN: appear and fly to server
    tl.to(synRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.01 }, 0.33);
    tl.fromTo(
      synRef.current.position,
      { x: clientX, y: 0.5, z: 0 },
      { x: serverX, y: 0.5, z: 0, duration: 0.03, ease: 'power2.inOut' },
      0.34,
    );

    // SYN-ACK: appear and fly back
    tl.to(synAckRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.01 }, 0.37);
    tl.fromTo(
      synAckRef.current.position,
      { x: serverX, y: 1, z: 0 },
      { x: clientX, y: 1, z: 0, duration: 0.03, ease: 'power2.inOut' },
      0.38,
    );

    // ACK: appear and fly to server
    tl.to(ackRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.01 }, 0.40);
    tl.fromTo(
      ackRef.current.position,
      { x: clientX, y: 1.5, z: 0 },
      { x: serverX, y: 1.5, z: 0, duration: 0.02, ease: 'power2.inOut' },
      0.40,
    );

    // Fade TCP packets
    tl.to(synRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 0.42);
    tl.to(synAckRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 0.42);
    tl.to(ackRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 0.42);

    // ========== SSL HANDSHAKE (42-52%) ==========

    // Client Hello
    tl.to(clientHelloRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.01 }, 0.43);
    tl.fromTo(
      clientHelloRef.current.position,
      { x: clientX, y: 0.5, z: 0 },
      { x: serverX, y: 0.5, z: 0, duration: 0.03, ease: 'power2.inOut' },
      0.44,
    );

    // Server Hello (bigger - has cert)
    tl.to(serverHelloRef.current.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.01 }, 0.46);
    tl.fromTo(
      serverHelloRef.current.position,
      { x: serverX, y: 1, z: 0 },
      { x: clientX, y: 1, z: 0, duration: 0.03, ease: 'power2.inOut' },
      0.46,
    );
    tl.to(clientHelloRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 0.48);

    // Key Exchange
    tl.to(keyExchangeRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.01 }, 0.48);
    tl.fromTo(
      keyExchangeRef.current.position,
      { x: clientX, y: 1.5, z: 0 },
      { x: serverX, y: 1.5, z: 0, duration: 0.02, ease: 'power2.inOut' },
      0.49,
    );
    tl.to(serverHelloRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 0.50);

    // Secure lock appears
    tl.to(finishedRef.current.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.01 }, 0.51);
    tl.set(finishedRef.current.position, { x: 28.5, y: 2, z: 0 }, 0.51);
    tl.to(keyExchangeRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 0.52);

    // ========== HTTP REQUEST/RESPONSE (54-64%) ==========

    // Main packet arrives at Google Server
    tl.to(
      searchPacketRef.current.position,
      { x: 32, y: 0.5, duration: 0.02, ease: 'power2.inOut' },
      0.55,
    );

    // Hide the request packet
    tl.to(searchPacketRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 0.57);
    tl.to(finishedRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 0.57);

    // HTML Response comes back from server
    tl.to(htmlPacketRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.01 }, 0.58);
    tl.fromTo(
      htmlPacketRef.current.position,
      { x: serverX, y: 0.5, z: 0 },
      { x: -10, y: 0.5, z: 0, duration: 0.05, ease: 'power2.inOut' },
      0.59,
    );

    // CSS packet follows
    tl.to(cssPacketRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.01 }, 0.61);
    tl.fromTo(
      cssPacketRef.current.position,
      { x: serverX, y: 1, z: 0 },
      { x: -10, y: 1, z: 0, duration: 0.04, ease: 'power2.inOut' },
      0.62,
    );

    // JS packet follows
    tl.to(jsPacketRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.01 }, 0.63);
    tl.fromTo(
      jsPacketRef.current.position,
      { x: serverX, y: 1.5, z: 0 },
      { x: -10, y: 1.5, z: 0, duration: 0.03, ease: 'power2.inOut' },
      0.64,
    );

    // Hide response packets
    tl.to(htmlPacketRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 0.66);
    tl.to(cssPacketRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 0.66);
    tl.to(jsPacketRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 0.67);

    // ========== NETWORK WATERFALL (66-68%) ==========
    const browserX = -12;
    tl.to(waterfallRef.current.scale, { x: 0.5, y: 0.5, z: 0.5, duration: 0.01 }, 0.66);
    tl.set(waterfallRef.current.position, { x: browserX + 5, y: 1, z: 4 }, 0.66);
    tl.to(waterfallRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 0.68);

    // ========== BROWSER RENDERING (68-88%) ==========
    // Each sub-stage gets ~3.3% = more breathing room

    // DOM Tree
    tl.to(domTreeRef.current.scale, { x: 0.6, y: 0.6, z: 0.6, duration: 0.02 }, 0.68);
    tl.set(domTreeRef.current.position, { x: browserX - 3, y: 2, z: 2 }, 0.68);
    tl.to(domTreeRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 0.71);

    // CSSOM Tree
    tl.to(cssomTreeRef.current.scale, { x: 0.6, y: 0.6, z: 0.6, duration: 0.02 }, 0.71);
    tl.set(cssomTreeRef.current.position, { x: browserX + 2, y: 2, z: 2 }, 0.71);
    tl.to(cssomTreeRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 0.74);

    // Render Tree
    tl.to(renderTreeRef.current.scale, { x: 0.7, y: 0.7, z: 0.7, duration: 0.02 }, 0.74);
    tl.set(renderTreeRef.current.position, { x: browserX, y: 2, z: 2 }, 0.74);
    tl.to(renderTreeRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 0.77);

    // JS Engine
    tl.to(jsEngineRef.current.scale, { x: 0.6, y: 0.6, z: 0.6, duration: 0.02 }, 0.77);
    tl.set(jsEngineRef.current.position, { x: browserX, y: -1, z: 2 }, 0.77);
    tl.to(jsEngineRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 0.80);

    // Layout stage
    tl.to(layoutRef.current.scale, { x: 0.7, y: 0.7, z: 0.7, duration: 0.02 }, 0.80);
    tl.set(layoutRef.current.position, { x: browserX, y: 1, z: 2 }, 0.80);
    tl.to(layoutRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 0.83);

    // Paint stage
    tl.to(paintRef.current.scale, { x: 0.7, y: 0.7, z: 0.7, duration: 0.02 }, 0.83);
    tl.set(paintRef.current.position, { x: browserX, y: 1, z: 2 }, 0.83);
    tl.to(paintRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 0.86);

    // ========== GPU RENDERING PIPELINE (88-92%) ==========
    tl.to(gpuPipelineRef.current.scale, { x: 0.6, y: 0.6, z: 0.6, duration: 0.02 }, 0.88);
    tl.set(gpuPipelineRef.current.position, { x: browserX, y: 0, z: 4 }, 0.88);
    tl.to(gpuPipelineRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.02 }, 0.92);

    // Composite - Final rendered page (92-94%)
    tl.to(compositeRef.current.scale, { x: 0.8, y: 0.8, z: 0.8, duration: 0.02 }, 0.92);
    tl.set(compositeRef.current.position, { x: browserX, y: 1, z: 3 }, 0.92);

    return () => {
      tl.kill();
      const st = ScrollTrigger.getById('packets-animation');
      if (st) st.kill();
    };
  }, [initialized]);

  return (
    <group>
      {/* Main Request Packet */}
      <TCPPacket ref={searchPacketRef} position={[-10, 0.5, 0]} color="#3b82f6" label="Request" />

      {/* TCP Handshake Packets */}
      <HandshakePacket ref={synRef} position={[25, -5, 0]} color="#f97316" label="SYN" />
      <HandshakePacket ref={synAckRef} position={[32, -5, 0]} color="#8b5cf6" label="SYN-ACK" />
      <HandshakePacket ref={ackRef} position={[25, -5, 0]} color="#22c55e" label="ACK" />

      {/* SSL Handshake Packets */}
      <SSLPacket ref={clientHelloRef} position={[25, -5, 0]} color="#06b6d4" label="Client Hello" />
      <SSLPacket ref={serverHelloRef} position={[32, -5, 0]} color="#ec4899" label="Server Hello" />
      <SSLPacket ref={keyExchangeRef} position={[25, -5, 0]} color="#eab308" label="Key Exchange" />
      <SSLPacket ref={finishedRef} position={[28, -5, 0]} color="#22c55e" label="Secure" isLock />

      {/* HTTP Response Packets */}
      <ResponsePacket ref={htmlPacketRef} position={[32, -5, 0]} type="html" />
      <ResponsePacket ref={cssPacketRef} position={[32, -5, 0]} type="css" />
      <ResponsePacket ref={jsPacketRef} position={[32, -5, 0]} type="js" />

      {/* Browser Rendering Stages */}
      <DOMTree ref={domTreeRef} position={[-15, -10, 0]} />
      <CSSOMTree ref={cssomTreeRef} position={[-10, -10, 0]} />
      <RenderTree ref={renderTreeRef} position={[-12, -10, 0]} />
      <JSEngine ref={jsEngineRef} position={[-12, -10, 0]} />
      <LayoutStage ref={layoutRef} position={[-12, -10, 0]} />
      <PaintStage ref={paintRef} position={[-12, -10, 0]} />
      <CompositeStage ref={compositeRef} position={[-12, -10, 0]} />

      {/* Network & GPU Visualizations */}
      <NetworkWaterfall ref={waterfallRef} position={[-7, -10, 0]} />
      <GPURenderingPipeline ref={gpuPipelineRef} position={[-12, -10, 0]} />
    </group>
  );
}
