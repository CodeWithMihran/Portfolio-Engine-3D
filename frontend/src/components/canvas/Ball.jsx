import { Suspense, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import useDragRotation from './useDragRotation';

function SkillOrb({ skill, index, columns, color }) {
  const texture = useTexture(skill.icon);
  const row = Math.floor(index / columns);
  const column = index % columns;
  const itemsInRow = Math.min(columns, skill.total - row * columns);
  const x = (column - (itemsInRow - 1) / 2) * 2.15;
  const y = -row * 2.2;

  return (
    <group position={[x, y, 0]}>
      <mesh>
        <icosahedronGeometry args={[0.72, 2]} />
        <meshStandardMaterial color={color} metalness={0.42} roughness={0.29} />
      </mesh>
      <mesh position={[0, 0, 0.74]}>
        <circleGeometry args={[0.34, 40]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      <Html position={[0, -1.12, 0]} center transform={false}>
        <div className="pointer-events-none min-w-24 text-center">
          <p className="whitespace-nowrap text-xs font-semibold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:text-sm">{skill.name}</p>
          <p className="mt-1 whitespace-nowrap text-[9px] font-mono uppercase tracking-[0.2em] text-slate-400">{skill.category}</p>
        </div>
      </Html>
    </group>
  );
}

function OrbField({ skills }) {
  const canvasWidth = useThree((state) => state.size.width);
  const { rotationRef, dragHandlers } = useDragRotation({ sensitivity: 0.006, verticalLimit: 0.6 });
  const columns = canvasWidth < 640 ? 3 : canvasWidth < 1024 ? 4 : 6;
  const rows = Math.ceil(skills.length / columns);
  const colors = ['#d08b4b', '#4c9a9a', '#6587bd', '#b8776d', '#8d9b68', '#9b7db7'];

  return (
    <group ref={rotationRef} {...dragHandlers}>
      <ambientLight intensity={1.65} />
      <directionalLight position={[3, 5, 8]} intensity={2.4} color="#fff1d6" />
      <pointLight position={[-4, 2, 3]} intensity={18} color="#4ec6c2" />
      <group position={[0, (rows - 1) * 1.1, 0]}>
        {skills.map((skill, index) => (
          <SkillOrb
            key={skill._id || skill.name}
            skill={{ ...skill, total: skills.length }}
            index={index}
            columns={columns}
            color={colors[index % colors.length]}
          />
        ))}
      </group>
    </group>
  );
}

export default function BallCanvas({ skills, height }) {
  const [compactQuality] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia?.('(max-width: 767px), (pointer: coarse)').matches
  );

  return (
    <Canvas
      frameloop="demand"
      dpr={compactQuality ? 1 : [1, 1.25]}
      orthographic
      camera={{ position: [0, 0, 18], zoom: compactQuality ? 58 : 68 }}
      gl={{ alpha: true, antialias: !compactQuality, powerPreference: 'low-power' }}
      style={{ height, touchAction: 'pan-y' }}
    >
      <Suspense fallback={null}>
        <OrbField skills={skills} />
      </Suspense>
    </Canvas>
  );
}
