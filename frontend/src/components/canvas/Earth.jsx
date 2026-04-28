import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei';
import * as THREE from 'three';
import CanvasLoader from './Loader';

function PlanetCore() {
  const planetRef = useRef(null);
  const ringRef = useRef(null);

  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.22;
      planetRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.08;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.08;
      ringRef.current.rotation.x = Math.PI * 0.38;
    }
  });

  return (
    <group>
      <mesh ref={planetRef} castShadow receiveShadow>
        <sphereGeometry args={[2.45, 128, 128]} />
        <meshStandardMaterial
          color="#6ee7ff"
          emissive="#0f4c81"
          emissiveIntensity={0.7}
          roughness={0.7}
          metalness={0.15}
        />
      </mesh>

      <mesh scale={1.018}>
        <sphereGeometry args={[2.45, 128, 128]} />
        <meshStandardMaterial
          color="#d8fbff"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={ringRef} position={[0, -0.1, 0]}>
        <torusGeometry args={[3.55, 0.075, 32, 240]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#22d3ee"
          emissiveIntensity={0.35}
          transparent
          opacity={0.75}
        />
      </mesh>

      <mesh rotation={[Math.PI / 3.2, 0, Math.PI / 5]} scale={1.04}>
        <torusGeometry args={[3.1, 0.03, 24, 220]} />
        <meshStandardMaterial
          color="#c4b5fd"
          emissive="#60a5fa"
          emissiveIntensity={0.28}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

export default function EarthCanvas() {
  return (
    <Canvas
      shadows
      frameloop="always"
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      camera={{ fov: 42, near: 0.1, far: 200, position: [-5.4, 3.5, 7.2] }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={1.1} color="#dafeff" />
        <directionalLight intensity={2.4} position={[4, 5, 4]} color="#b4f6ff" castShadow />
        <pointLight intensity={2.2} position={[-5, 1, 3]} color="#67e8f9" />
        <pointLight intensity={1.5} position={[0, -4, -2]} color="#a78bfa" />
        <OrbitControls
          autoRotate
          autoRotateSpeed={1}
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <PlanetCore />
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
