import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/store'

/* ─── Section manifest ───────────────────────────────────── */
export const SECTIONS = [
  { id:'about',        label:'ABOUT',        icon:'◈', color:'#00d4ff', lat: 22,  lon: 10  },
  { id:'projects',     label:'PROJECTS',     icon:'⬡', color:'#f5c842', lat:-14,  lon: 72  },
  { id:'skills',       label:'SKILLS',       icon:'◎', color:'#00ffcc', lat: 36,  lon:135  },
  { id:'experience',   label:'EXPERIENCE',   icon:'◆', color:'#ff4d8d', lat:-28,  lon:200  },
  { id:'education',    label:'EDUCATION',    icon:'△', color:'#a070ff', lat: 24,  lon:258  },
  { id:'certificates', label:'CERTIFICATES', icon:'✦', color:'#ff9040', lat:-18,  lon:316  },
  { id:'achievements', label:'ACHIEVEMENTS', icon:'★', color:'#ff3355', lat: 46,  lon:175  },
  { id:'contact',      label:'CONTACT',      icon:'⊕', color:'#39ff90', lat:-44,  lon: 95  },
]

function ll2v(lat, lon, r) {
  const phi   = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  )
}

/* ─── Procedural planet texture ──────────────────────────── */
function makePlanetTex() {
  const W = 2048, H = 1024
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H
  const cx = cv.getContext('2d')

  // Deep sci-fi ocean
  const og = cx.createLinearGradient(0, 0, 0, H)
  og.addColorStop(0,   '#000d22')
  og.addColorStop(0.3, '#001840')
  og.addColorStop(0.6, '#002255')
  og.addColorStop(1,   '#000a18')
  cx.fillStyle = og; cx.fillRect(0, 0, W, H)

  // Bioluminescent ocean shimmer
  cx.globalAlpha = 0.18
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * W, y = Math.random() * H
    const len = Math.random() * 180 + 40
    const g2 = cx.createLinearGradient(x, y, x + len, y)
    g2.addColorStop(0, 'transparent')
    g2.addColorStop(0.5, `hsl(${190 + Math.random()*40}, 100%, 65%)`)
    g2.addColorStop(1, 'transparent')
    cx.fillStyle = g2
    cx.fillRect(x, y, len, Math.random() * 2 + 0.5)
  }
  cx.globalAlpha = 1

  // Continents — rich amber/terracotta sci-fi land
  const landMasses = [
    { cx: 310,  cy: 290, rx: 290, ry: 165, r: 0.25 },
    { cx: 870,  cy: 240, rx: 230, ry: 135, r:-0.18 },
    { cx: 1380, cy: 390, rx: 215, ry: 128, r: 0.42 },
    { cx: 680,  cy: 610, rx: 185, ry: 105, r: 0.08 },
    { cx: 1620, cy: 210, rx: 165, ry: 95,  r:-0.35 },
    { cx: 1080, cy: 510, rx: 100, ry: 58,  r: 0.65 },
    { cx: 195,  cy: 660, rx: 110, ry: 62,  r:-0.28 },
    { cx: 1820, cy: 590, rx: 140, ry: 75,  r: 0.15 },
    { cx: 470,  cy: 145, rx: 88,  ry: 48,  r: 0.55 },
    { cx: 1290, cy: 710, rx: 120, ry: 68,  r:-0.48 },
  ]

  landMasses.forEach(lm => {
    cx.save(); cx.translate(lm.cx, lm.cy); cx.rotate(lm.r)

    // Land fill — deep amber gradient
    const lg = cx.createRadialGradient(0, -lm.ry*.2, 0, 0, 0, Math.max(lm.rx, lm.ry))
    lg.addColorStop(0,   '#e8a428')
    lg.addColorStop(0.3, '#c87c0e')
    lg.addColorStop(0.6, '#9e5c06')
    lg.addColorStop(1,   '#6a3802')
    cx.beginPath(); cx.ellipse(0, 0, lm.rx, lm.ry, 0, 0, Math.PI*2)
    cx.fillStyle = lg; cx.fill()

    // Terrain details
    cx.globalAlpha = 0.28
    for (let j = 0; j < 10; j++) {
      const tx = (Math.random()-.5)*lm.rx*1.5, ty = (Math.random()-.5)*lm.ry*1.5
      const tr = Math.random()*38+14
      const tg = cx.createRadialGradient(tx, ty, 0, tx, ty, tr)
      tg.addColorStop(0, j%3===0 ? 'rgba(255,210,80,.6)' : j%3===1 ? 'rgba(100,50,0,.5)' : 'rgba(160,90,20,.4)')
      tg.addColorStop(1, 'transparent')
      cx.fillStyle = tg; cx.beginPath(); cx.arc(tx, ty, tr, 0, Math.PI*2); cx.fill()
    }
    cx.globalAlpha = 1

    // Country-like glowing borders
    cx.save()
    cx.strokeStyle = '#00ffcc'; cx.lineWidth = 2.5
    cx.shadowColor = '#00ffcc'; cx.shadowBlur = 10
    cx.globalAlpha = 0.75
    cx.beginPath(); cx.ellipse(0, 0, lm.rx, lm.ry, 0, 0, Math.PI*2)
    cx.stroke()
    cx.restore()

    // Inner sub-borders
    cx.save()
    cx.strokeStyle = 'rgba(0,255,204,0.3)'; cx.lineWidth = 1
    cx.setLineDash([6, 12])
    cx.beginPath(); cx.ellipse(0, 0, lm.rx*.6, lm.ry*.6, .5, 0, Math.PI*2)
    cx.stroke()
    cx.restore()

    cx.restore()
  })

  // Polar ice
  ;[{ y:0, h:170, iy:45 }, { y:H-160, h:160, iy:H-40 }].forEach(({ y, h, iy }) => {
    const pg = cx.createRadialGradient(W/2, iy, 0, W/2, iy, 250)
    pg.addColorStop(0, 'rgba(210,245,255,.88)')
    pg.addColorStop(.5, 'rgba(150,210,240,.45)')
    pg.addColorStop(1, 'transparent')
    cx.globalAlpha = .7; cx.fillStyle = pg; cx.fillRect(0, y, W, h)
    cx.globalAlpha = 1
  })

  // Cloud wisps
  cx.globalAlpha = .09
  for (let i = 0; i < 90; i++) {
    const x = Math.random()*W, y = Math.random()*H
    const rx = Math.random()*90+22, ry = Math.random()*22+6
    const cg = cx.createRadialGradient(x, y, 0, x, y, rx)
    cg.addColorStop(0, 'rgba(220,238,255,.9)'); cg.addColorStop(1, 'transparent')
    cx.fillStyle = cg; cx.beginPath()
    cx.ellipse(x, y, rx, ry, Math.random()*Math.PI, 0, Math.PI*2); cx.fill()
  }
  cx.globalAlpha = 1

  return new THREE.CanvasTexture(cv)
}

function makeCloudTex() {
  const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 512
  const cx = cv.getContext('2d')
  for (let i = 0; i < 140; i++) {
    const x = Math.random()*1024, y = Math.random()*512
    const rx = Math.random()*70+18, ry = Math.random()*22+7
    const a = Math.random()*.45+.05
    const cg = cx.createRadialGradient(x,y,0,x,y,rx)
    cg.addColorStop(0, `rgba(220,240,255,${a})`); cg.addColorStop(1,'transparent')
    cx.fillStyle = cg; cx.beginPath()
    cx.ellipse(x,y,rx,ry,Math.random()*Math.PI,0,Math.PI*2); cx.fill()
  }
  return new THREE.CanvasTexture(cv)
}

/* ─── Continent hover rise effect ───────────────────────── */
function SectionMarker({ sec }) {
  const { navigate, setHovered, hovered, transitioning } = useStore()
  const isHov = hovered === sec.id
  const groupRef = useRef()
  const dotRef   = useRef()
  const ringRef  = useRef()
  const riseRef  = useRef(0)

  const basePos = useMemo(() => ll2v(sec.lat, sec.lon, 2.06), [sec])
  const riseDir = useMemo(() => ll2v(sec.lat, sec.lon, 1).normalize(), [sec])

  useFrame((_, dt) => {
    const target = isHov ? 0.22 : 0
    riseRef.current += (target - riseRef.current) * (1 - Math.exp(-12 * dt))

    if (groupRef.current) {
      groupRef.current.position.copy(basePos).addScaledVector(riseDir, riseRef.current)
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += 0.025
      const t = performance.now() * .001
      const oTarget = isHov ? .85 + Math.sin(t*5)*.15 : .38 + Math.sin(t*1.5+sec.lat*.1)*.1
      ringRef.current.material.opacity += (oTarget - ringRef.current.material.opacity) * .12
      const sTarget = isHov ? 1.4 : 1
      ringRef.current.scale.lerp(new THREE.Vector3(sTarget,sTarget,sTarget), .1)
    }

    if (dotRef.current) {
      const eTarget = isHov ? 4 : 1.8
      dotRef.current.material.emissiveIntensity += (eTarget - dotRef.current.material.emissiveIntensity) * .12
    }
  })

  return (
    <group ref={groupRef} position={basePos}>
      {/* Outer glow halo */}
      <mesh>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshBasicMaterial
          color={sec.color} transparent opacity={isHov ? .14 : .04}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Spin ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.085, 0.112, 36]} />
        <meshBasicMaterial color={sec.color} transparent opacity={.38} side={THREE.DoubleSide} />
      </mesh>

      {/* Core orb — clickable */}
      <mesh
        ref={dotRef}
        onPointerEnter={() => !transitioning && setHovered(sec.id)}
        onPointerLeave={() => setHovered(null)}
        onClick={() => !transitioning && navigate(sec.id)}
      >
        <sphereGeometry args={[0.075, 20, 20]} />
        <meshStandardMaterial
          color={sec.color} emissive={sec.color} emissiveIntensity={1.8}
          roughness={0} metalness={0.9}
        />
      </mesh>

      {/* Label billboard */}
      <Billboard lockX={false} lockY={false}>
        <Text
          position={[0, 0.24, 0]}
          fontSize={isHov ? 0.092 : 0.072}
          color={isHov ? sec.color : '#88aabb'}
          anchorX="center" anchorY="middle"
          outlineWidth={0.004} outlineColor="#000820"
        >
          {sec.icon}  {sec.label}
        </Text>
      </Billboard>
    </group>
  )
}

/* ─── Cloud shell ────────────────────────────────────────── */
function Clouds() {
  const ref = useRef()
  const tex = useMemo(() => makeCloudTex(), [])
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.y += dt * .00035 })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[2.065, 64, 64]} />
      <meshStandardMaterial map={tex} transparent opacity={.55} roughness={1} depthWrite={false} />
    </mesh>
  )
}

/* ─── Atmosphere shells ──────────────────────────────────── */
function Atmo() {
  return (
    <>
      <mesh>
        <sphereGeometry args={[2.28, 64, 64]} />
        <meshStandardMaterial color="#0055cc" transparent opacity={.09} side={THREE.BackSide} roughness={1} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.22, 64, 64]} />
        <meshStandardMaterial color="#003388" transparent opacity={.13} side={THREE.BackSide} roughness={1} emissive="#003388" emissiveIntensity={.25} />
      </mesh>
    </>
  )
}

/* ─── Main export ────────────────────────────────────────── */
export default function Planet() {
  const ref = useRef()
  const { setPlanetReady } = useStore()
  const tex = useMemo(() => makePlanetTex(), [])

  useEffect(() => { setTimeout(setPlanetReady, 600) }, [])

  useFrame((_, dt) => {
    if (!ref.current) return
    ref.current.rotation.y += dt * 0.075

    const mx = +document.documentElement.style.getPropertyValue('--mx') || 0
    const my = +document.documentElement.style.getPropertyValue('--my') || 0
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, my * .04, .02)
    ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, mx * .025, .02)
  })

  return (
    <group ref={ref}>
      {/* Core planet */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[2, 128, 128]} />
        <meshStandardMaterial map={tex} roughness={.72} metalness={.08} />
      </mesh>

      {/* Ocean specular sheen */}
      <mesh>
        <sphereGeometry args={[2.002, 64, 64]} />
        <meshStandardMaterial color="#0044aa" transparent opacity={.16} roughness={.08} metalness={.9} />
      </mesh>

      <Clouds />
      <Atmo />

      {SECTIONS.map(s => <SectionMarker key={s.id} sec={s} />)}
    </group>
  )
}
