import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const HeroCanvas = () => {
  return (
    <Canvas>
      <ambientLight intensity={1} />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
};

export default HeroCanvas;