import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useTheme } from '../theme/tokens';

/**
 * Selective glow: the luminance threshold sits at 1.0, and only accent
 * materials (toneMapped: false, emissiveIntensity > 1) exceed it. White
 * line-art and screens stay crisp.
 *
 * `quality` is lowered by the PerformanceMonitor in Scene on slow GPUs.
 */
export default function PostProcessing({ quality = 'high' }) {
  const theme = useTheme();
  const dark = theme.name === 'dark';

  if (quality === 'off') return null;

  return (
    <EffectComposer multisampling={quality === 'high' ? 4 : 0}>
      <Bloom
        intensity={dark ? 0.6 : 0.3}
        luminanceThreshold={1}
        luminanceSmoothing={0.2}
        mipmapBlur
        levels={quality === 'high' ? 6 : 4}
        radius={0.75}
      />
      <Vignette
        offset={0.3}
        darkness={dark ? 0.55 : 0.18}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
