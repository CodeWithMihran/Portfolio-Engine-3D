import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls, Preload, useTexture } from '@react-three/drei';
import CanvasLoader from './Loader';

function Ball({
  imgUrl,
  baseColor = '#fff8eb',
  emissiveColor = '#0f172a',
  ambientColor = '#ffffff',
  directionalColor = '#ffffff',
}) {
  const [decal] = useTexture([imgUrl]);

  return (
    <Float speed={1.75} rotationIntensity={1} floatIntensity={2}>
      <ambientLight intensity={0.78} color={ambientColor} />
      <directionalLight intensity={1.25} position={[0, 0, 1]} color={directionalColor} />
      <pointLight intensity={1.05} position={[-1.6, 1.8, 2.4]} color="#ffffff" />
      <mesh castShadow receiveShadow scale={2.75}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={emissiveColor}
          emissiveIntensity={0.28}
          metalness={0.22}
          roughness={0.36}
          flatShading
          polygonOffset
          polygonOffsetFactor={-5}
        />
      </mesh>
      <mesh position={[0, 0, 2.86]} scale={1.15}>
        <circleGeometry args={[0.6, 48]} />
        <meshBasicMaterial map={decal} transparent toneMapped={false} />
      </mesh>
    </Float>
  );
}

export default function BallCanvas({
  icon,
  baseColor,
  emissiveColor,
  ambientColor,
  directionalColor,
}) {
  return (
    <Canvas frameloop="demand" dpr={[1, 2]} gl={{ preserveDrawingBuffer: true }}>
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls enableZoom={false} />
        <Ball
          imgUrl={icon}
          baseColor={baseColor}
          emissiveColor={emissiveColor}
          ambientColor={ambientColor}
          directionalColor={directionalColor}
        />
      </Suspense>
      <Preload all />
    </Canvas>
  );
}
