import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import Planet from './PlanetSurface'
import SpaceBackground from './SpaceBackground'
import CameraController from './CameraController'

export default function Scene() {
  return (
    <Canvas
      camera={{ position:[0,0,7], fov:60, near:.01, far:800 }}
      gl={{ antialias:true, toneMapping:THREE.ACESFilmicToneMapping, toneMappingExposure:1.25 }}
      style={{ position:'fixed', inset:0, zIndex:1 }}
      dpr={[1, 2]}
    >
      {/* Lighting rig */}
      <ambientLight intensity={.14} color="#0a1f40" />
      <directionalLight position={[8,4,5]} intensity={2.6} color="#fff5e0" castShadow />
      <pointLight position={[-10,-5,-5]} intensity={.85} color="#002d88" />
      <pointLight position={[0,7,0]}    intensity={.45} color="#00aaff" />
      <pointLight position={[4,-3,4]}   intensity={.3}  color="#002244" />

      <SpaceBackground />
      <Planet />
      <CameraController />

      <EffectComposer>
        <Bloom intensity={.9} luminanceThreshold={.55} luminanceSmoothing={.88} blendFunction={BlendFunction.SCREEN} />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[.0004,.0004]} />
        <Vignette eskil={false} offset={.28} darkness={.82} />
      </EffectComposer>
    </Canvas>
  )
}
