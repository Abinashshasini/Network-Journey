import * as THREE from 'three';

export default function FiberBeams() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-8, 0, 0),
    new THREE.Vector3(0, 2, 0),
    new THREE.Vector3(8, 0, 0),
  ]);

  const geometry = new THREE.TubeGeometry(curve, 100, 0.1, 16);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        emissive="#00f2ff"
        emissiveIntensity={3}
        color="#00f2ff"
      />
    </mesh>
  );
}
