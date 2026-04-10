import { Float, OrbitControls, Sphere, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";

const OrbitalShape = ({ position, color, speed, scale, geometry }) => {
  const meshRef = useRef(null);

  useFrame((state) => {
    if (!meshRef.current) {
      return;
    }

    meshRef.current.rotation.x = state.clock.elapsedTime * speed;
    meshRef.current.rotation.y = state.clock.elapsedTime * (speed * 0.8);
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 1.5 * speed) * 0.12;
  });

  return (
    <Float speed={2} rotationIntensity={1.2} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometry}
        <meshStandardMaterial
          color={color}
          metalness={0.55}
          roughness={0.08}
        />
      </mesh>
    </Float>
  );
};

const HeroScene = () => {
  return (
    <>
      <color attach="background" args={["#050816"]} />
      <fog attach="fog" args={["#050816", 8, 20]} />
      <ambientLight intensity={0.75} />
      <directionalLight
        position={[4, 5, 3]}
        intensity={2.4}
        color="#9be7ff"
      />
      <pointLight
        position={[-4, -2, 4]}
        intensity={30}
        distance={12}
        color="#7dd3fc"
      />
      <pointLight
        position={[3, 2, -2]}
        intensity={18}
        distance={10}
        color="#6ee7b7"
      />

      <Stars
        radius={90}
        depth={50}
        count={2500}
        factor={3.2}
        saturation={0}
        fade
        speed={0.8}
      />

      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={1.1}>
        <Sphere args={[1.3, 64, 64]} position={[0, 0, 0]}>
          <meshStandardMaterial
            color="#67e8f9"
            emissive="#0f172a"
            metalness={0.45}
            roughness={0.12}
            wireframe
          />
        </Sphere>
      </Float>

      <OrbitalShape
        position={[-2.2, 1.1, -0.8]}
        color="#22d3ee"
        speed={0.55}
        scale={0.55}
        geometry={<icosahedronGeometry args={[1, 0]} />}
      />
      <OrbitalShape
        position={[2.3, -0.9, 0.3]}
        color="#34d399"
        speed={0.9}
        scale={0.72}
        geometry={<torusKnotGeometry args={[0.58, 0.17, 180, 24]} />}
      />
      <OrbitalShape
        position={[0.1, 1.8, -1.8]}
        color="#f0abfc"
        speed={0.7}
        scale={0.45}
        geometry={<octahedronGeometry args={[1, 0]} />}
      />

      <mesh rotation={[-1.15, 0, 0]} position={[0, -2.1, 0]}>
        <circleGeometry args={[5.5, 64]} />
        <meshStandardMaterial color="#0c1224" metalness={0.1} roughness={0.9} />
      </mesh>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.3}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate
        autoRotateSpeed={0.7}
      />
    </>
  );
};

const HeroCanvas = ({ profile }) => {
  return (
    <div className="relative h-[520px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),rgba(5,8,22,0.9)_45%)] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
      <div className="absolute left-6 top-6 z-10 max-w-xs rounded-3xl border border-white/10 bg-slate-950/45 p-5 backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/75">
          Live Identity
        </p>
        <h3 className="mt-3 text-2xl font-bold text-white">
          {profile?.fullName || "Mihran"}
        </h3>
        <p className="mt-2 text-sm leading-6 text-white/65">
          A visual-first portfolio shell powered by React, Three.js, and a
          dynamic MERN backend.
        </p>
      </div>

      <div className="absolute bottom-6 left-6 z-10 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/55 backdrop-blur">
        Responsive • Interactive • Dynamic
      </div>

      <Canvas camera={{ position: [0, 0.4, 6], fov: 45 }}>
        <HeroScene />
      </Canvas>
    </div>
  );
};

export default HeroCanvas;
