import { Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF } from '@react-three/drei';
import CanvasLoader from './Loader';

function EarthModel() {
  const earth = useGLTF('/planet/scene.gltf');
  const scene = useMemo(() => {
    const cloned = earth.scene.clone(true);

    cloned.traverse((child) => {
      if (!child.isMesh || !child.material) {
        return;
      }

      const material = child.material.clone();
      const name = child.material.name || child.name || '';

      if (name.includes('Clouds')) {
        material.color = new THREE.Color('#7dd3fc');
      }

      if (name.includes('Planet')) {
        material.color = new THREE.Color('#6ee7b7');
      }

      child.material = material;
    });

    return cloned;
  }, [earth.scene]);

  return <primitive object={scene} scale={3.45} position-y={-0.15} rotation-y={0.35} />;
}

export default function EarthCanvas() {
  return (
    <Canvas
      shadows
      frameloop="always"
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      camera={{ fov: 38, near: 0.1, far: 200, position: [-5.8, 3.9, 7.8] }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <ambientLight intensity={1.02} color="#f8fbff" />
        <hemisphereLight intensity={1} color="#93c5fd" groundColor="#0f172a" />
        <directionalLight intensity={2.3} position={[4, 5, 4]} color="#ffffff" />
        <pointLight intensity={1.85} position={[-4, 1, 3]} color="#67e8f9" />
        <pointLight intensity={1.35} position={[2, 2, 4]} color="#f9a8d4" />
        <pointLight intensity={1.05} position={[0, -3, -2]} color="#c4b5fd" />
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
