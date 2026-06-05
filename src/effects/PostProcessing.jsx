import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  EffectComposer,
  Bloom,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction, BloomEffect, VignetteEffect } from 'postprocessing';
import * as THREE from 'three';
import { getProgress } from '../stores/scrollStore';

function getEffectParams(progress) {
  // Bloom: kept subtle — only active packets/LEDs glow.
  // Vignette: gentle depth cue, nothing dramatic.
  let bloomIntensity = 0.15;
  let bloomThreshold = 0.75;
  let vignetteOffset = 0.35;
  let vignetteDarkness = 0.45;

  // Underwater — very slight atmosphere boost
  if (progress > 0.12 && progress < 0.22) {
    bloomIntensity = 0.2;
    vignetteDarkness = 0.55;
  }

  // DNS
  if (progress > 0.22 && progress < 0.32) {
    bloomIntensity = 0.2;
    bloomThreshold = 0.7;
  }

  // TCP
  if (progress > 0.32 && progress < 0.42) {
    bloomIntensity = 0.25;
    bloomThreshold = 0.65;
  }

  // SSL — the one moment we let bloom breathe
  if (progress > 0.42 && progress < 0.54) {
    bloomIntensity = 0.35;
    bloomThreshold = 0.6;
    vignetteDarkness = 0.5;
  }

  // Browser rendering — clean, no bloom
  if (progress > 0.66 && progress < 0.94) {
    bloomIntensity = 0.1;
    bloomThreshold = 0.8;
    vignetteOffset = 0.4;
    vignetteDarkness = 0.35;
  }

  // Finale
  if (progress > 0.94) {
    bloomIntensity = 0.4;
    bloomThreshold = 0.6;
  }

  return { bloomIntensity, bloomThreshold, vignetteOffset, vignetteDarkness };
}

export default function PostProcessing() {
  const composerRef = useRef();
  const fx = useRef({ bloom: null, vignette: null, resolved: false });

  useFrame(() => {
    const progress = getProgress();
    const params = getEffectParams(progress);

    if (!fx.current.resolved && composerRef.current?.passes) {
      for (const pass of composerRef.current.passes) {
        if (!pass.effects) continue;
        for (const e of pass.effects) {
          if (e instanceof BloomEffect) fx.current.bloom = e;
          else if (e instanceof VignetteEffect) fx.current.vignette = e;
        }
      }
      if (fx.current.bloom) fx.current.resolved = true;
    }

    const { bloom, vignette } = fx.current;

    if (bloom) {
      bloom.intensity = THREE.MathUtils.lerp(bloom.intensity, params.bloomIntensity, 0.04);
      bloom.luminanceMaterial.threshold = THREE.MathUtils.lerp(
        bloom.luminanceMaterial.threshold,
        params.bloomThreshold,
        0.04,
      );
    }

    if (vignette) {
      vignette.offset = THREE.MathUtils.lerp(vignette.offset, params.vignetteOffset, 0.04);
      vignette.darkness = THREE.MathUtils.lerp(vignette.darkness, params.vignetteDarkness, 0.04);
    }
  });

  return (
    <EffectComposer ref={composerRef} multisampling={4}>
      <Bloom
        intensity={0.15}
        luminanceThreshold={0.75}
        luminanceSmoothing={0.9}
        mipmapBlur
        levels={5}
      />
      <Vignette offset={0.35} darkness={0.45} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  );
}
