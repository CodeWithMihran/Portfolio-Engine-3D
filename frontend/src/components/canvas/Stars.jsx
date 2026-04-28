import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial, Points, Preload } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

function StarsField(props) {
  const ref = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.2 }));

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial transparent color="#d8b4fe" size={0.002} sizeAttenuation depthWrite={false} />
      </Points>
    </group>
  );
}

export default function StarsCanvas() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 h-auto w-full">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <StarsField />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
}
