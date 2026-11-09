import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import CanvasLoader from './Loader';
import useDragRotation from './useDragRotation';

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

  stableMaterial.color = new THREE.Color(
    isCloudLayer ? '#ffd0c3' : isPlanetLayer ? '#ed796e' : '#f0c8bd'
  );
  stableMaterial.emissive = new THREE.Color(
    isCloudLayer ? '#9f3444' : isPlanetLayer ? '#bd2943' : '#000000'
  );
  stableMaterial.emissiveIntensity = isCloudLayer ? 0.18 : isPlanetLayer ? 0.3 : 0;
  stableMaterial.metalness = 0.18;
  stableMaterial.roughness = 0.62;

  return stableMaterial;
}

function SlowRenderLoop({ active }) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!active) return undefined;

    const intervalId = window.setInterval(invalidate, 1000 / 30);
    return () => window.clearInterval(intervalId);
  }, [active, invalidate]);

  return null;
}

function EarthModel({ autoRotate }) {
  const earth = useGLTF('/planet/scene.gltf');
  const draggingRef = useRef(false);
  const { rotationRef, dragHandlers } = useDragRotation({
    sensitivity: 0.006,
    verticalLimit: 0.55,
    onDragStateChange: (dragging) => {
      draggingRef.current = dragging;
    },
  });
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

  useFrame((_, delta) => {
    if (autoRotate && !draggingRef.current && rotationRef.current) {
      rotationRef.current.rotation.y += Math.min(delta, 0.05) * 0.12;
    }
  });

  return (
    <group ref={rotationRef} {...dragHandlers}>
      <primitive object={scene} scale={3.45} position-y={-0.15} rotation-y={0.35} />
    </group>
  );
}

export default function EarthCanvas({ autoRotate = false }) {
  const [compactQuality] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia?.('(max-width: 767px), (pointer: coarse)').matches
  );

  return (
    <Canvas
      frameloop="demand"
      dpr={compactQuality ? 1 : [1, 1.25]}
      gl={{ antialias: !compactQuality, alpha: true, powerPreference: 'low-power' }}
      camera={{ fov: 38, near: 0.1, far: 200, position: [-5.8, 3.9, 7.8] }}
      fallback={<div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_center,rgba(190,55,65,0.2),transparent_48%),radial-gradient(circle_at_55%_45%,rgba(251,146,60,0.08),transparent_24%)]" />}
      style={{ touchAction: 'pan-y' }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <SlowRenderLoop active={autoRotate} />
        <ambientLight intensity={1.02} color="#fff1ec" />
        <hemisphereLight intensity={1.08} color="#f5c5b8" groundColor="#201116" />
        <directionalLight intensity={2.1} position={[4, 5, 4]} color="#fff4eb" />
        <pointLight intensity={1.5} position={[-4, 1, 3]} color="#f05258" />
        <pointLight intensity={1.1} position={[2, 2, 4]} color="#f2a47c" />
        <pointLight intensity={0.55} position={[0, -3, -2]} color="#ffcfac" />
        <EarthModel autoRotate={autoRotate} />
      </Suspense>
    </Canvas>
  );
}
