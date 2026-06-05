/**
 * PremiumMaterials — a small set of reusable, drop-in material presets that
 * give the scene a cinematic, modern finish. Each is a thin wrapper around a
 * three material so existing meshes can swap their <meshStandardMaterial>
 * for one of these with no other changes.
 *
 * Performance note (balanced profile):
 *  - Neon / Metal / Emissive are cheap — use them freely on every node/packet.
 *  - Glass uses real transmission (an extra render pass). Reserve it for 1–2
 *    HERO elements only (e.g. the SSL lock, the laptop screen glass).
 *
 * The <Environment preset="night" /> already mounted in Scene.jsx supplies the
 * image-based reflections that make metalness / clearcoat / transmission read.
 */

/**
 * NeonMaterial — self-lit, glowing surface. The emissive is what the Bloom
 * post-pass picks up, so data packets / status lights bloom into the fog.
 */
export function NeonMaterial({
  color = '#3b82f6',
  intensity = 2.2,
  roughness = 0.25,
  metalness = 0.0,
  toneMapped = false,
  ...props
}) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={color}
      emissiveIntensity={intensity}
      roughness={roughness}
      metalness={metalness}
      toneMapped={toneMapped}
      {...props}
    />
  );
}

/**
 * MetalMaterial — brushed/anodized metal for device & server chassis.
 * Clearcoat adds a thin lacquer highlight that catches the rim light.
 */
export function MetalMaterial({
  color = '#1e293b',
  metalness = 0.85,
  roughness = 0.35,
  clearcoat = 0.6,
  clearcoatRoughness = 0.3,
  envMapIntensity = 1.0,
  emissive,
  emissiveIntensity = 0,
  ...props
}) {
  return (
    <meshPhysicalMaterial
      color={color}
      metalness={metalness}
      roughness={roughness}
      clearcoat={clearcoat}
      clearcoatRoughness={clearcoatRoughness}
      envMapIntensity={envMapIntensity}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      {...props}
    />
  );
}

/**
 * GlassMaterial — true refractive glass (transmission). HERO USE ONLY.
 * Great for the secure-tunnel SSL lock and the laptop's screen pane.
 */
export function GlassMaterial({
  color = '#ffffff',
  thickness = 0.5,
  roughness = 0.05,
  transmission = 1.0,
  ior = 1.4,
  reflectivity = 0.5,
  clearcoat = 1.0,
  clearcoatRoughness = 0.1,
  emissive,
  emissiveIntensity = 0,
  ...props
}) {
  return (
    <meshPhysicalMaterial
      color={color}
      transmission={transmission}
      thickness={thickness}
      roughness={roughness}
      ior={ior}
      reflectivity={reflectivity}
      clearcoat={clearcoat}
      clearcoatRoughness={clearcoatRoughness}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      transparent
      {...props}
    />
  );
}

/**
 * GlowScreenMaterial — emissive display surface (laptop / monitor screens).
 * Brighter than NeonMaterial and unaffected by tone mapping so the UI glow
 * stays crisp and feeds the bloom.
 */
export function GlowScreenMaterial({
  color = '#0a1628',
  emissiveColor = '#3b82f6',
  intensity = 1.4,
  roughness = 0.2,
  ...props
}) {
  return (
    <meshStandardMaterial
      color={color}
      emissive={emissiveColor}
      emissiveIntensity={intensity}
      roughness={roughness}
      metalness={0.1}
      toneMapped={false}
      {...props}
    />
  );
}
