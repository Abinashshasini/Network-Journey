import { useRef, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Trail } from '@react-three/drei';
import { MONO, accent } from '../theme/materials';
import { useTheme, LAYER } from '../theme/tokens';

// All payload types are application-layer: same hue, told apart by the
// "document" line pattern on the face and the type tag.
//   html — three full-width lines (markup block)
//   css  — indented rule lines (selector + declarations)
//   js   — staggered, shortening lines (code)
const TYPE_LINES = {
  html: [
    { y: 0.2, w: 0.5, x: 0 },
    { y: 0, w: 0.5, x: 0 },
    { y: -0.2, w: 0.5, x: 0 },
  ],
  css: [
    { y: 0.2, w: 0.5, x: 0 },
    { y: 0, w: 0.36, x: 0.07 },
    { y: -0.2, w: 0.36, x: 0.07 },
  ],
  js: [
    { y: 0.2, w: 0.5, x: 0 },
    { y: 0, w: 0.38, x: 0.06 },
    { y: -0.2, w: 0.24, x: -0.13 },
  ],
};

const typeLabels = {
  html: 'HTML',
  css: 'CSS',
  js: 'JS',
};

const ResponsePacket = forwardRef(
  ({ position, color = LAYER.application, label, type = 'html' }, ref) => {
    const theme = useTheme();
    const meshRef = useRef();

    const packetColor = color;
    const lines = TYPE_LINES[type] || TYPE_LINES.html;

    useFrame((state) => {
      if (!meshRef.current) return;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.03;
      meshRef.current.scale.setScalar(pulse);
    });

    return (
      <group position={position} ref={ref}>
        <Trail width={0.5} length={6} color={packetColor} attenuation={(w) => w * w}>
          <group ref={meshRef}>
            <RoundedBox args={[0.8, 1, 0.2]} radius={0.05} material={accent(packetColor, 1.3)} />

            {lines.map((l, i) => (
              <mesh key={i} position={[l.x, l.y, 0.11]} material={MONO.screen}>
                <boxGeometry args={[l.w, 0.08, 0.01]} />
              </mesh>
            ))}

            <mesh position={[0.25, 0.35, 0.11]} material={MONO.body}>
              <boxGeometry args={[0.3, 0.15, 0.02]} />
            </mesh>
            <Text position={[0.25, 0.35, 0.13]} fontSize={0.08} color={theme.text} anchorX="center">
              {typeLabels[type]}
            </Text>
          </group>
        </Trail>

        <Text position={[0, -0.7, 0]} fontSize={0.15} color={theme.text} anchorX="center">
          {label}
        </Text>
      </group>
    );
  },
);

export default ResponsePacket;
