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

/**
 * AnimatedPackets - Handles all packet animations inside Canvas context
 */
export default function AnimatedPackets() {
  // Main request packet
  const searchPacketRef = useRef();

  // TCP Handshake packets
  const synRef = useRef();
  const synAckRef = useRef();
  const ackRef = useRef();

  // SSL Handshake packets
  const clientHelloRef = useRef();
  const serverHelloRef = useRef();
  const keyExchangeRef = useRef();
  const finishedRef = useRef();

  // HTTP Response packets
  const htmlPacketRef = useRef();
  const cssPacketRef = useRef();
  const jsPacketRef = useRef();

  // Browser Rendering stages
  const domTreeRef = useRef();
  const cssomTreeRef = useRef();
  const renderTreeRef = useRef();
  const jsEngineRef = useRef();
  const layoutRef = useRef();
  const paintRef = useRef();
  const compositeRef = useRef();

  // Network & GPU visualizations
  const waterfallRef = useRef();
  const gpuPipelineRef = useRef();

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Wait a frame for refs to be ready
    const timer = setTimeout(() => {
      if (searchPacketRef.current) {
        setInitialized(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!initialized || !searchPacketRef.current) return;

    // Initial positions
    gsap.set(searchPacketRef.current.position, { x: -10, y: 0.5, z: 0 });

    // TCP packets - hidden
    if (synRef.current) gsap.set(synRef.current.scale, { x: 0, y: 0, z: 0 });
    if (synAckRef.current)
      gsap.set(synAckRef.current.scale, { x: 0, y: 0, z: 0 });
    if (ackRef.current) gsap.set(ackRef.current.scale, { x: 0, y: 0, z: 0 });

    // SSL packets - hidden
    if (clientHelloRef.current)
      gsap.set(clientHelloRef.current.scale, { x: 0, y: 0, z: 0 });
    if (serverHelloRef.current)
      gsap.set(serverHelloRef.current.scale, { x: 0, y: 0, z: 0 });
    if (keyExchangeRef.current)
      gsap.set(keyExchangeRef.current.scale, { x: 0, y: 0, z: 0 });
    if (finishedRef.current)
      gsap.set(finishedRef.current.scale, { x: 0, y: 0, z: 0 });

    // Response packets - hidden
    if (htmlPacketRef.current)
      gsap.set(htmlPacketRef.current.scale, { x: 0, y: 0, z: 0 });
    if (cssPacketRef.current)
      gsap.set(cssPacketRef.current.scale, { x: 0, y: 0, z: 0 });
    if (jsPacketRef.current)
      gsap.set(jsPacketRef.current.scale, { x: 0, y: 0, z: 0 });

    // Browser rendering stages - hidden
    if (domTreeRef.current)
      gsap.set(domTreeRef.current.scale, { x: 0, y: 0, z: 0 });
    if (cssomTreeRef.current)
      gsap.set(cssomTreeRef.current.scale, { x: 0, y: 0, z: 0 });
    if (renderTreeRef.current)
      gsap.set(renderTreeRef.current.scale, { x: 0, y: 0, z: 0 });
    if (jsEngineRef.current)
      gsap.set(jsEngineRef.current.scale, { x: 0, y: 0, z: 0 });
    if (layoutRef.current)
      gsap.set(layoutRef.current.scale, { x: 0, y: 0, z: 0 });
    if (paintRef.current)
      gsap.set(paintRef.current.scale, { x: 0, y: 0, z: 0 });
    if (compositeRef.current)
      gsap.set(compositeRef.current.scale, { x: 0, y: 0, z: 0 });

    // Network & GPU visualizations - hidden
    if (waterfallRef.current)
      gsap.set(waterfallRef.current.scale, { x: 0, y: 0, z: 0 });
    if (gpuPipelineRef.current)
      gsap.set(gpuPipelineRef.current.scale, { x: 0, y: 0, z: 0 });

    // Refresh ScrollTrigger
    setTimeout(() => ScrollTrigger.refresh(true), 300);

    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'packets-animation',
        trigger: '.scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 4, // Higher value = smoother, slower animation
      },
    });

    // ========== MAIN PACKET JOURNEY ==========

    // Laptop → Router
    tl.to(
      searchPacketRef.current.position,
      { x: -6, y: 0.5, duration: 0.04, ease: 'power1.inOut' },
      0.02,
    );

    // Router → ISP
    tl.to(
      searchPacketRef.current.position,
      { x: 0, y: 1, duration: 0.03, ease: 'power1.inOut' },
      0.06,
    );

    // ISP → Cable entry
    tl.to(
      searchPacketRef.current.position,
      { x: 4, y: -1, duration: 0.02, ease: 'power2.in' },
      0.09,
    );

    // Through submarine cable
    tl.to(
      searchPacketRef.current.position,
      { x: 11, y: -3, duration: 0.04, ease: 'sine.inOut' },
      0.11,
    );

    // Rising from cable
    tl.to(
      searchPacketRef.current.position,
      { x: 18, y: -1, duration: 0.02, ease: 'power2.out' },
      0.15,
    );

    // Arrive at DNS
    tl.to(
      searchPacketRef.current.position,
      { x: 22, y: 0.5, duration: 0.03, ease: 'power2.out' },
      0.17,
    );

    // DNS hover effect
    tl.to(searchPacketRef.current.position, { y: 1.5, duration: 0.02 }, 0.2);
    tl.to(searchPacketRef.current.position, { y: 0.5, duration: 0.02 }, 0.22);

    // Move to handshake area
    tl.to(
      searchPacketRef.current.position,
      { x: 25, y: 0.5, duration: 0.03 },
      0.24,
    );

    // ========== TCP HANDSHAKE (0.27 - 0.37) ==========
    const clientX = 25;
    const serverX = 32;

    // SYN: appear and fly to server
    tl.to(synRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.01 }, 0.27);
    tl.fromTo(
      synRef.current.position,
      { x: clientX, y: 0.5, z: 0 },
      { x: serverX, y: 0.5, z: 0, duration: 0.03, ease: 'power2.inOut' },
      0.28,
    );

    // SYN-ACK: appear and fly back
    tl.to(synAckRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.01 }, 0.31);
    tl.fromTo(
      synAckRef.current.position,
      { x: serverX, y: 1, z: 0 },
      { x: clientX, y: 1, z: 0, duration: 0.03, ease: 'power2.inOut' },
      0.32,
    );

    // ACK: appear and fly to server
    tl.to(ackRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.01 }, 0.35);
    tl.fromTo(
      ackRef.current.position,
      { x: clientX, y: 1.5, z: 0 },
      { x: serverX, y: 1.5, z: 0, duration: 0.02, ease: 'power2.inOut' },
      0.36,
    );

    // Fade TCP packets
    tl.to(synRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 0.38);
    tl.to(synAckRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 0.38);
    tl.to(ackRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.01 }, 0.38);

    // ========== SSL HANDSHAKE (0.39 - 0.52) ==========

    // Client Hello
    tl.to(
      clientHelloRef.current.scale,
      { x: 1, y: 1, z: 1, duration: 0.01 },
      0.39,
    );
    tl.fromTo(
      clientHelloRef.current.position,
      { x: clientX, y: 0.5, z: 0 },
      { x: serverX, y: 0.5, z: 0, duration: 0.03, ease: 'power2.inOut' },
      0.4,
    );

    // Server Hello (bigger - has cert)
    tl.to(
      serverHelloRef.current.scale,
      { x: 1.3, y: 1.3, z: 1.3, duration: 0.01 },
      0.43,
    );
    tl.fromTo(
      serverHelloRef.current.position,
      { x: serverX, y: 1, z: 0 },
      { x: clientX, y: 1, z: 0, duration: 0.03, ease: 'power2.inOut' },
      0.44,
    );
    tl.to(
      clientHelloRef.current.scale,
      { x: 0, y: 0, z: 0, duration: 0.01 },
      0.45,
    );

    // Key Exchange
    tl.to(
      keyExchangeRef.current.scale,
      { x: 1, y: 1, z: 1, duration: 0.01 },
      0.47,
    );
    tl.fromTo(
      keyExchangeRef.current.position,
      { x: clientX, y: 1.5, z: 0 },
      { x: serverX, y: 1.5, z: 0, duration: 0.03, ease: 'power2.inOut' },
      0.48,
    );
    tl.to(
      serverHelloRef.current.scale,
      { x: 0, y: 0, z: 0, duration: 0.01 },
      0.49,
    );

    // Secure lock appears
    tl.to(
      finishedRef.current.scale,
      { x: 1.5, y: 1.5, z: 1.5, duration: 0.01 },
      0.5,
    );
    tl.set(finishedRef.current.position, { x: 28.5, y: 2, z: 0 }, 0.5);
    tl.to(
      keyExchangeRef.current.scale,
      { x: 0, y: 0, z: 0, duration: 0.01 },
      0.51,
    );

    // ========== HTTP REQUEST/RESPONSE (0.52 - 0.70) ==========

    // Main packet arrives at Google Server
    tl.to(
      searchPacketRef.current.position,
      { x: 32, y: 0.5, duration: 0.03, ease: 'power2.inOut' },
      0.52,
    );

    // Hide the request packet
    tl.to(
      searchPacketRef.current.scale,
      { x: 0, y: 0, z: 0, duration: 0.01 },
      0.56,
    );

    // Hide lock
    tl.to(
      finishedRef.current.scale,
      { x: 0, y: 0, z: 0, duration: 0.01 },
      0.56,
    );

    // HTML Response comes back from server
    tl.to(
      htmlPacketRef.current.scale,
      { x: 1, y: 1, z: 1, duration: 0.01 },
      0.58,
    );
    tl.fromTo(
      htmlPacketRef.current.position,
      { x: serverX, y: 0.5, z: 0 },
      { x: -10, y: 0.5, z: 0, duration: 0.08, ease: 'power2.inOut' },
      0.59,
    );

    // CSS packet follows
    tl.to(
      cssPacketRef.current.scale,
      { x: 1, y: 1, z: 1, duration: 0.01 },
      0.63,
    );
    tl.fromTo(
      cssPacketRef.current.position,
      { x: serverX, y: 1, z: 0 },
      { x: -10, y: 1, z: 0, duration: 0.06, ease: 'power2.inOut' },
      0.64,
    );

    // JS packet follows
    tl.to(
      jsPacketRef.current.scale,
      { x: 1, y: 1, z: 1, duration: 0.01 },
      0.67,
    );
    tl.fromTo(
      jsPacketRef.current.position,
      { x: serverX, y: 1.5, z: 0 },
      { x: -10, y: 1.5, z: 0, duration: 0.05, ease: 'power2.inOut' },
      0.68,
    );

    // Hide response packets as they arrive
    tl.to(
      htmlPacketRef.current.scale,
      { x: 0, y: 0, z: 0, duration: 0.01 },
      0.7,
    );
    tl.to(
      cssPacketRef.current.scale,
      { x: 0, y: 0, z: 0, duration: 0.01 },
      0.71,
    );
    tl.to(
      jsPacketRef.current.scale,
      { x: 0, y: 0, z: 0, duration: 0.01 },
      0.73,
    );

    // ========== NETWORK WATERFALL (0.68 - 0.74) ==========
    const browserX = -12; // Position near laptop
    tl.to(
      waterfallRef.current.scale,
      { x: 0.5, y: 0.5, z: 0.5, duration: 0.02 },
      0.68,
    );
    tl.set(
      waterfallRef.current.position,
      { x: browserX + 5, y: 1, z: 4 },
      0.68,
    );
    tl.to(
      waterfallRef.current.scale,
      { x: 0, y: 0, z: 0, duration: 0.02 },
      0.74,
    );

    // ========== BROWSER RENDERING (0.74 - 0.98) ==========

    // DOM Tree appears
    tl.to(
      domTreeRef.current.scale,
      { x: 0.6, y: 0.6, z: 0.6, duration: 0.02 },
      0.74,
    );
    tl.set(domTreeRef.current.position, { x: browserX - 3, y: 2, z: 2 }, 0.74);

    // CSSOM Tree appears
    tl.to(
      cssomTreeRef.current.scale,
      { x: 0.6, y: 0.6, z: 0.6, duration: 0.02 },
      0.77,
    );
    tl.set(
      cssomTreeRef.current.position,
      { x: browserX + 2, y: 2, z: 2 },
      0.77,
    );

    // DOM and CSSOM combine into Render Tree
    tl.to(domTreeRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.02 }, 0.8);
    tl.to(
      cssomTreeRef.current.scale,
      { x: 0, y: 0, z: 0, duration: 0.02 },
      0.8,
    );
    tl.to(
      renderTreeRef.current.scale,
      { x: 0.7, y: 0.7, z: 0.7, duration: 0.02 },
      0.8,
    );
    tl.set(renderTreeRef.current.position, { x: browserX, y: 2, z: 2 }, 0.8);

    // JS Engine processes
    tl.to(
      jsEngineRef.current.scale,
      { x: 0.6, y: 0.6, z: 0.6, duration: 0.02 },
      0.84,
    );
    tl.set(jsEngineRef.current.position, { x: browserX, y: -1, z: 2 }, 0.84);
    tl.to(
      renderTreeRef.current.scale,
      { x: 0, y: 0, z: 0, duration: 0.02 },
      0.86,
    );
    tl.to(
      jsEngineRef.current.scale,
      { x: 0, y: 0, z: 0, duration: 0.02 },
      0.88,
    );

    // Layout stage
    tl.to(
      layoutRef.current.scale,
      { x: 0.7, y: 0.7, z: 0.7, duration: 0.02 },
      0.88,
    );
    tl.set(layoutRef.current.position, { x: browserX, y: 1, z: 2 }, 0.88);
    tl.to(layoutRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.02 }, 0.91);

    // Paint stage
    tl.to(
      paintRef.current.scale,
      { x: 0.7, y: 0.7, z: 0.7, duration: 0.02 },
      0.89,
    );
    tl.set(paintRef.current.position, { x: browserX, y: 1, z: 2 }, 0.89);
    tl.to(paintRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.02 }, 0.92);

    // ========== GPU RENDERING PIPELINE (0.92 - 0.96) ==========
    tl.to(
      gpuPipelineRef.current.scale,
      { x: 0.6, y: 0.6, z: 0.6, duration: 0.02 },
      0.92,
    );
    tl.set(gpuPipelineRef.current.position, { x: browserX, y: 0, z: 4 }, 0.92);
    tl.to(
      gpuPipelineRef.current.scale,
      { x: 0, y: 0, z: 0, duration: 0.02 },
      0.96,
    );

    // Composite - Final rendered page
    tl.to(
      compositeRef.current.scale,
      { x: 0.8, y: 0.8, z: 0.8, duration: 0.02 },
      0.96,
    );
    tl.set(compositeRef.current.position, { x: browserX, y: 1, z: 3 }, 0.96);

    return () => {
      tl.kill();
      // Only kill our own ScrollTrigger
      const st = ScrollTrigger.getById('packets-animation');
      if (st) st.kill();
    };
  }, [initialized]);

  return (
    <group>
      {/* Main Request Packet */}
      <TCPPacket
        ref={searchPacketRef}
        position={[-10, 0.5, 0]}
        color="#3b82f6"
        label="Request"
      />

      {/* TCP Handshake Packets */}
      <HandshakePacket
        ref={synRef}
        position={[25, -5, 0]}
        color="#f97316"
        label="SYN"
      />
      <HandshakePacket
        ref={synAckRef}
        position={[32, -5, 0]}
        color="#8b5cf6"
        label="SYN-ACK"
      />
      <HandshakePacket
        ref={ackRef}
        position={[25, -5, 0]}
        color="#22c55e"
        label="ACK"
      />

      {/* SSL Handshake Packets */}
      <SSLPacket
        ref={clientHelloRef}
        position={[25, -5, 0]}
        color="#06b6d4"
        label="Client Hello"
      />
      <SSLPacket
        ref={serverHelloRef}
        position={[32, -5, 0]}
        color="#ec4899"
        label="Server Hello"
      />
      <SSLPacket
        ref={keyExchangeRef}
        position={[25, -5, 0]}
        color="#eab308"
        label="Key Exchange"
      />
      <SSLPacket
        ref={finishedRef}
        position={[28, -5, 0]}
        color="#22c55e"
        label="🔒 Secure"
        isLock={true}
      />

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
