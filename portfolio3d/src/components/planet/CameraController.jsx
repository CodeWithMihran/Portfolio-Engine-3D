import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import * as THREE from 'three'
import { useStore } from '../../store/store'

const HOME = new THREE.Vector3(0, 0, 7)
const LOOK = new THREE.Vector3(0, 0, 0)

export default function CameraController() {
  const { camera } = useThree()
  const { transitioning, txType, finishTransition, section } = useStore()
  const busy = useRef(false)
  const tween = useRef(null)

  /* Initial position */
  useEffect(() => {
    camera.position.copy(HOME)
    camera.lookAt(LOOK)
  }, [])

  /* Parallax on home */
  useFrame((_, dt) => {
    if (busy.current || section !== null) return
    const mx = +document.documentElement.style.getPropertyValue('--mx') || 0
    const my = +document.documentElement.style.getPropertyValue('--my') || 0
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mx * .75, .022)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, -my * .5,  .022)
    camera.lookAt(LOOK)
  })

  useEffect(() => {
    if (!transitioning || busy.current) return
    busy.current = true
    tween.current?.kill()

    if (txType === 'dive')   doDive()
    if (txType === 'emerge') doEmerge()
    if (txType === 'warp')   doWarp()
  }, [transitioning, txType])

  /* ── DIVE: planet → section ──────────────────────────── */
  function doDive() {
    fx('dive')
    const tl = gsap.timeline({
      onComplete: () => { busy.current = false; finishTransition() }
    })
    tl.to(camera.position, { z: 4.6, y: .6,  duration: .55, ease:'power2.in',   onUpdate: look })
      .to(camera.position, { z: 2.3, y: 0,   duration: .75, ease:'power3.in',   onUpdate: look })
      .to(camera.position, { z: .4,  duration: .55, ease:'expo.in', onUpdate: look })
  }

  /* ── EMERGE: section → planet ────────────────────────── */
  function doEmerge() {
    camera.position.set(0, 0, .4)
    fx('emerge')
    gsap.timeline({
      onComplete: () => { busy.current = false; finishTransition() }
    })
    .to(camera.position, { z: 3,   y: .4,  duration: .5,  ease:'power2.out',  onUpdate: look })
    .to(camera.position, { z: HOME.z, y: 0, duration: 1.1, ease:'power3.out', onUpdate: look })
  }

  /* ── WARP: section → section ─────────────────────────── */
  function doWarp() {
    fx('warp')
    gsap.timeline({
      onComplete: () => { busy.current = false; finishTransition() }
    })
    .to(camera.position, { z: 1.6,  duration: .38, ease:'expo.in',  onUpdate: look })
    .to(camera.position, { z: 1.2,  duration: .12, ease:'none',     onUpdate: look })
    .to(camera.position, { z: HOME.z, duration: .55, ease:'power3.out', onUpdate: look })
  }

  function look() { camera.lookAt(LOOK) }

  return null
}

/* DOM overlay trigger */
function fx(type) {
  const el = document.getElementById('tx-overlay')
  if (!el) return
  el.className = type
  setTimeout(() => { el.className = '' }, 2200)
}
