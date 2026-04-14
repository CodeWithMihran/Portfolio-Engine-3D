import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ─── Particle star field ─────────────────────────────────── */
function StarField() {
  const ref  = useRef()
  const N    = 3200

  const [pos, col, sz] = useMemo(() => {
    const pos = new Float32Array(N * 3)
    const col = new Float32Array(N * 3)
    const sz  = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      const r  = 25 + Math.random() * 80
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      pos[i*3]   = r * Math.sin(ph) * Math.cos(th)
      pos[i*3+1] = r * Math.sin(ph) * Math.sin(th)
      pos[i*3+2] = r * Math.cos(ph)
      sz[i] = Math.random() * 2.2 + 0.3
      const t = Math.random()
      if (t < .08) { col[i*3]=1; col[i*3+1]=.9; col[i*3+2]=.4 }       // gold
      else if (t < .25) { col[i*3]=.4; col[i*3+1]=.8; col[i*3+2]=1 }   // cyan
      else { col[i*3]=.88; col[i*3+1]=.94; col[i*3+2]=1 }               // white
    }
    return [pos, col, sz]
  }, [])

  const sprite = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 64; c.height = 64
    const x = c.getContext('2d')
    const g = x.createRadialGradient(32,32,0,32,32,32)
    g.addColorStop(0,  'rgba(255,255,255,1)')
    g.addColorStop(.35,'rgba(255,255,255,.7)')
    g.addColorStop(1,  'rgba(255,255,255,0)')
    x.fillStyle = g; x.fillRect(0,0,64,64)
    return new THREE.CanvasTexture(c)
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    const mx = +document.documentElement.style.getPropertyValue('--mx') || 0
    const my = +document.documentElement.style.getPropertyValue('--my') || 0
    ref.current.rotation.y = state.clock.elapsedTime * .004 + mx * .012
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, my * .018, .01)
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color"    args={[col, 3]} />
        <bufferAttribute attach="attributes-size"     args={[sz,  1]} />
      </bufferGeometry>
      <pointsMaterial map={sprite} vertexColors sizeAttenuation transparent opacity={.88} size={.14} depthWrite={false} />
    </points>
  )
}

/* ─── Twinkling bright stars ──────────────────────────────── */
function TwinkleStars() {
  const meshes = useRef([])
  const N = 90

  const data = useMemo(() => Array.from({ length: N }, () => {
    const r  = 14 + Math.random() * 52
    const th = Math.random() * Math.PI * 2
    const ph = Math.acos(2 * Math.random() - 1)
    return {
      pos: new THREE.Vector3(
        r * Math.sin(ph) * Math.cos(th),
        r * Math.sin(ph) * Math.sin(th),
        r * Math.cos(ph)
      ),
      spd: Math.random() * 2.2 + .6,
      off: Math.random() * Math.PI * 2,
      col: ['#00d4ff','#f5c842','#ffffff','#a070ff','#00ffcc'][Math.floor(Math.random()*5)],
      sz:  Math.random() * .065 + .018,
    }
  }), [])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    meshes.current.forEach((m, i) => {
      if (!m) return
      const tw = Math.sin(t * data[i].spd + data[i].off) * .5 + .5
      m.material.emissiveIntensity = tw * 3.5
      const s = .65 + tw * .7
      m.scale.set(s, s, s)
    })
  })

  return (
    <>
      {data.map((d, i) => (
        <mesh key={i} position={d.pos} ref={el => meshes.current[i] = el}>
          <sphereGeometry args={[d.sz, 8, 8]} />
          <meshStandardMaterial color={d.col} emissive={d.col} emissiveIntensity={1.2} />
        </mesh>
      ))}
    </>
  )
}

/* ─── Procedural mini-planet texture ─────────────────────── */
function makeMiniTex(c1, c2) {
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 128
  const cx = cv.getContext('2d')
  const g = cx.createLinearGradient(0,0,256,128)
  g.addColorStop(0, c1); g.addColorStop(.55, c2); g.addColorStop(1, c1)
  cx.fillStyle = g; cx.fillRect(0,0,256,128)
  for (let i = 0; i < 22; i++) {
    cx.globalAlpha = .28
    cx.beginPath()
    cx.ellipse(Math.random()*256, Math.random()*128, Math.random()*32+8, Math.random()*14+4, Math.random()*Math.PI, 0, Math.PI*2)
    cx.fillStyle = Math.random()<.5 ? 'rgba(255,255,255,.3)' : 'rgba(0,0,0,.4)'
    cx.fill()
  }
  cx.globalAlpha = 1
  return new THREE.CanvasTexture(cv)
}

/* ─── Mini planet ─────────────────────────────────────────── */
function MiniPlanet({ base, r, c1, c2, spd, oR, oSpd, hasRing }) {
  const orb = useRef()
  const body = useRef()
  const angle = useRef(Math.random() * Math.PI * 2)
  const tex = useMemo(() => makeMiniTex(c1, c2), [c1, c2])

  useFrame((_, dt) => {
    if (!orb.current) return
    angle.current += oSpd * dt
    const mx = +document.documentElement.style.getPropertyValue('--mx') || 0
    const my = +document.documentElement.style.getPropertyValue('--my') || 0

    orb.current.position.set(
      base.x + Math.cos(angle.current) * oR * .32 + mx * .42,
      base.y + Math.sin(angle.current * .7) * oR * .14 + my * .28,
      base.z + Math.sin(angle.current) * oR * .32
    )
    if (body.current) body.current.rotation.y += spd * dt
  })

  return (
    <group ref={orb} position={base}>
      <mesh ref={body}>
        <sphereGeometry args={[r, 32, 32]} />
        <meshStandardMaterial map={tex} roughness={.65} />
      </mesh>
      {hasRing && (
        <mesh rotation={[Math.PI/3.5, 0, .3]}>
          <ringGeometry args={[r*1.45, r*2.0, 64]} />
          <meshBasicMaterial color={c1} transparent opacity={.22} side={THREE.DoubleSide} />
        </mesh>
      )}
      <mesh>
        <sphereGeometry args={[r*1.14, 20, 20]} />
        <meshBasicMaterial color={c1} transparent opacity={.055} side={THREE.BackSide} />
      </mesh>
    </group>
  )
}

/* ─── Nebula dust cloud ───────────────────────────────────── */
function Nebula() {
  const ref = useRef()
  const N   = 320

  const [pos, col, sz] = useMemo(() => {
    const pos = new Float32Array(N*3)
    const col = new Float32Array(N*3)
    const sz  = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      pos[i*3]   = (Math.random()-.5)*32 + 22
      pos[i*3+1] = (Math.random()-.5)*16
      pos[i*3+2] = (Math.random()-.5)*28 - 32
      const t = Math.random()
      col[i*3]   = .08 + t*.35; col[i*3+1] = .03 + t*.12; col[i*3+2] = .28 + t*.65
      sz[i] = Math.random() * 4.5 + 1.5
    }
    return [pos, col, sz]
  }, [])

  const sprite = useMemo(() => {
    const c = document.createElement('canvas'); c.width = 128; c.height = 128
    const x = c.getContext('2d')
    const g = x.createRadialGradient(64,64,0,64,64,64)
    g.addColorStop(0,'rgba(255,255,255,.7)'); g.addColorStop(1,'transparent')
    x.fillStyle = g; x.fillRect(0,0,128,128)
    return new THREE.CanvasTexture(c)
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.y += .00025
    const mx = +document.documentElement.style.getPropertyValue('--mx') || 0
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, mx*1.2, .008)
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos,3]} />
        <bufferAttribute attach="attributes-color"    args={[col,3]} />
        <bufferAttribute attach="attributes-size"     args={[sz,1]}  />
      </bufferGeometry>
      <pointsMaterial
        map={sprite} vertexColors sizeAttenuation transparent opacity={.38}
        size={.75} depthWrite={false} blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ─── Export ──────────────────────────────────────────────── */
const MINI_PLANETS = [
  { base: new THREE.Vector3(-19,  7, -26), r:.72, c1:'#4a1a7a', c2:'#2c0050', spd:1,   oR:2.8, oSpd:.07, hasRing:true  },
  { base: new THREE.Vector3( 21, -5, -31), r:.52, c1:'#7a3800', c2:'#4a2000', spd:1.4, oR:2.1, oSpd:.11, hasRing:false },
  { base: new THREE.Vector3( 16, 11, -21), r:.36, c1:'#005f52', c2:'#003830', spd:2,   oR:1.6, oSpd:.16, hasRing:false },
  { base: new THREE.Vector3(-23, -8, -19), r:.58, c1:'#550030', c2:'#330020', spd:.75, oR:2.4, oSpd:.055,hasRing:true  },
  { base: new THREE.Vector3(  9, 16, -36), r:.44, c1:'#003366', c2:'#001a42', spd:1.2, oR:1.9, oSpd:.09, hasRing:false },
  { base: new THREE.Vector3(-10,-13, -29), r:.28, c1:'#664200', c2:'#422000', spd:2.4, oR:1.2, oSpd:.19, hasRing:false },
]

export default function SpaceBackground() {
  return (
    <>
      <StarField />
      <TwinkleStars />
      <Nebula />
      {MINI_PLANETS.map((p, i) => <MiniPlanet key={i} {...p} />)}
    </>
  )
}
