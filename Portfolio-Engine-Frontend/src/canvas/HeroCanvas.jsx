import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  Float, 
  OrbitControls, 
  Sphere, 
  Stars, 
  Html, 
  PerspectiveCamera,
  MeshDistortMaterial,
  Text
} from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// 📍 Component for Section Landmarks on the Planet
const PlanetLandmark = ({ position, title, onClick, color }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={position}>
      {/* The clickable dot/marker */}
      <mesh 
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial 
          color={hovered ? "#fff" : color} 
          emissive={color} 
          emissiveIntensity={2} 
        />
      </mesh>

      {/* 2D Label that stays oriented to camera */}
      <Html distanceFactor={10} zIndexRange={[100, 0]}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`cursor-pointer whitespace-nowrap rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md transition-all ${
            hovered ? "border-cyan-400 scale-110 shadow-[0_0_15px_rgba(34,211,238,0.5)]" : ""
          }`}
          onClick={onClick}
        >
          {title}
        </motion.div>
      </Html>
    </group>
  );
};

const HeroScene = ({ profile, projects, onSectionClick }) => {
  const planetRef = useRef();
  const { theme } = profile || {};

  // Auto-rotation logic
  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.002;
    }
  });

  return (
    <>
      {/* Dynamic Background from Admin Theme */}
      <color attach="background" args={[theme?.backgroundColor || "#050816"]} />
      
      <Stars 
        radius={100} 
        depth={50} 
        count={5000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1} 
      />

      <ambientLight intensity={theme?.ambientLightIntensity || 0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color={theme?.primaryColor} />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

      {/* 🌍 THE MAIN PLANET */}
      <group ref={planetRef}>
        <Sphere args={[2, 64, 64]}>
          <MeshDistortMaterial
            color={theme?.primaryColor || "#22d3ee"}
            speed={1.5}
            distort={0.2}
            radius={1}
            metalness={0.6}
            roughness={0.2}
          />
        </Sphere>

        {/* Atmosphere Glow */}
        <Sphere args={[2.1, 64, 64]}>
          <meshStandardMaterial 
            color={theme?.primaryColor || "#22d3ee"} 
            transparent 
            opacity={0.1} 
            side={THREE.BackSide} 
          />
        </Sphere>

        {/* 📍 Mapping Project Sections onto Planet Surface */}
        {projects?.map((proj, idx) => {
          // If the backend has coordinates, use them. 
          // Otherwise, generate a deterministic spherical distribution
          const phi = Math.acos(-1 + (2 * idx) / projects.length);
          const theta = Math.sqrt(projects.length * Math.PI) * phi;
          
          const defaultPos = [
            2 * Math.cos(theta) * Math.sin(phi),
            2 * Math.sin(theta) * Math.sin(phi),
            2 * Math.cos(phi)
          ];

          const pos = proj.threeJsConfig?.position 
            ? [proj.threeJsConfig.position.x, proj.threeJsConfig.position.y, proj.threeJsConfig.position.z]
            : defaultPos;

          return (
            <PlanetLandmark 
              key={proj._id}
              position={pos}
              title={proj.title}
              color={theme?.primaryColor || "#22d3ee"}
              onClick={() => onSectionClick(proj)}
            />
          );
        })}
      </group>

      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate={false}
      />
    </>
  );
};

const HeroCanvas = ({ profile, projects }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  const handleSectionClick = (section) => {
    setIsTransitioning(true);
    setSelectedSection(section);
    
    // Simulate the "Going inside the planet" delay before navigation
    setTimeout(() => {
      const element = document.getElementById('projects');
      element?.scrollIntoView({ behavior: 'smooth' });
      setIsTransitioning(false);
    }, 1500);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-950">
      {/* Overlay UI */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-8">
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="max-w-md space-y-4"
        >
          <div className="inline-block rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-cyan-400">
              System Active
            </span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter text-white lg:text-8xl">
            {profile?.fullName?.split(" ")[0] || "MIHRAN"}
            <span className="text-cyan-400">.</span>
          </h1>
          <p className="text-lg leading-relaxed text-white/50">
            {profile?.tagline || "Architecting digital universes through code and geometry."}
          </p>
        </motion.div>

        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Coordinate Origin</p>
            <p className="font-mono text-xs text-cyan-400/60">LAT: 28.6139° N | LONG: 77.2090° E</p>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
            Scroll to explore depth
          </p>
        </div>
      </div>

      {/* 🌌 Transition Overlay (The "Zoom In" Effect) */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center bg-white"
            transition={{ duration: 0.8, ease: "circIn" }}
          >
            <motion.h2 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              className="text-4xl font-black uppercase tracking-[0.5em] text-black"
            >
              Entering {selectedSection?.title}
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Canvas */}
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={40} />
        <HeroScene 
          profile={profile} 
          projects={projects} 
          onSectionClick={handleSectionClick} 
        />
      </Canvas>

      {/* Vignette & Noise for cinematic feel */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
    </div>
  );
};

export default HeroCanvas;