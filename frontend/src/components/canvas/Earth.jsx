import { Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF } from '@react-three/drei';
import CanvasLoader from './Loader';

function hasValidPositions(geometry) {
  const positions = geometry?.attributes?.position?.array;

  if (!positions?.length) {
    return false;
  }

  for (let index = 0; index < positions.length; index += 1) {
    if (!Number.isFinite(positions[index])) {
      return false;
    }
  }

  return true;
}

function createStableMaterial(sourceMaterial, meshName) {
  const stableMaterial = new THREE.MeshStandardMaterial({
    map: sourceMaterial.map || null,
    normalMap: sourceMaterial.normalMap || null,
    roughnessMap: sourceMaterial.roughnessMap || null,
    metalnessMap: sourceMaterial.metalnessMap || null,
    emissiveMap: sourceMaterial.emissiveMap || null,
    transparent: Boolean(sourceMaterial.transparent),
    opacity: sourceMaterial.opacity ?? 1,
    side: sourceMaterial.side ?? THREE.FrontSide,
    depthWrite: sourceMaterial.depthWrite ?? true,
    depthTest: sourceMaterial.depthTest ?? true,
    toneMapped: sourceMaterial.toneMapped ?? true,
  });

  const materialName = String(sourceMaterial.name || meshName || '').toLowerCase();
  const isCloudLayer = materialName.includes('cloud');
  const isPlanetLayer = materialName.includes('planet');

  stableMaterial.color = new THREE.Color(isCloudLayer ? '#7dd3fc' : isPlanetLayer ? '#38d7c6' : '#dbeafe');
  stableMaterial.emissive = new THREE.Color(isCloudLayer ? '#38bdf8' : isPlanetLayer ? '#0891b2' : '#000000');
  stableMaterial.emissiveIntensity = isCloudLayer ? 0.2 : isPlanetLayer ? 0.28 : 0;
  stableMaterial.metalness = 0.18;
  stableMaterial.roughness = 0.62;

  return stableMaterial;
}

function EarthModel() {
  const earth = useGLTF('/planet/scene.gltf');
  const scene = useMemo(() => {
    const cloned = earth.scene.clone(true);

    cloned.traverse((child) => {
      if (!child.isMesh) {
        return;
      }

      if (!hasValidPositions(child.geometry)) {
        child.visible = false;
        return;
      }

      child.geometry = child.geometry.clone();
      child.geometry.computeVertexNormals();
      child.geometry.computeBoundingSphere();
      child.geometry.computeBoundingBox();

      const originalMaterial = Array.isArray(child.material) ? child.material[0] : child.material;

      if (!originalMaterial) {
        return;
      }

      child.material = createStableMaterial(originalMaterial, child.name);
      child.castShadow = false;
      child.receiveShadow = false;
    });

    return cloned;
  }, [earth.scene]);

  return <primitive object={scene} scale={3.45} position-y={-0.15} rotation-y={0.35} />;
}

export default function EarthCanvas() {
  return (
    <Canvas
      frameloop="always"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      camera={{ fov: 38, near: 0.1, far: 200, position: [-5.8, 3.9, 7.8] }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <ambientLight intensity={1.02} color="#f8fbff" />
        <hemisphereLight intensity={1.08} color="#93c5fd" groundColor="#0f172a" />
        <directionalLight intensity={2.1} position={[4, 5, 4]} color="#ffffff" />
        <pointLight intensity={1.9} position={[-4, 1, 3]} color="#22d3ee" />
        <pointLight intensity={1.25} position={[2, 2, 4]} color="#38bdf8" />
        <pointLight intensity={1.05} position={[0, -3, -2]} color="#34d399" />
        <OrbitControls
          autoRotate
          autoRotateSpeed={1.05}
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <EarthModel />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload('/planet/scene.gltf');
