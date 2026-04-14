import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/store'

const PLANET_RADIUS = 2
const SURFACE_RADIUS = 2.032
const LABEL_RADIUS = 2.1

export const SECTIONS = [
  { id: 'about', label: 'ABOUT', icon: 'A', color: '#3fe2ff', lat: 41, lon: -104, rx: 0.52, ry: 0.29, seed: 0.2 },
  { id: 'projects', label: 'PROJECTS', icon: 'P', color: '#f6bc53', lat: -19, lon: -58, rx: 0.46, ry: 0.28, seed: 1.1 },
  { id: 'skills', label: 'SKILLS', icon: 'S', color: '#41ffd2', lat: 48, lon: 11, rx: 0.42, ry: 0.24, seed: 2.4 },
  { id: 'experience', label: 'EXPERIENCE', icon: 'E', color: '#ff5fa5', lat: 8, lon: 18, rx: 0.47, ry: 0.31, seed: 3.1 },
  { id: 'education', label: 'EDUCATION', icon: 'ED', color: '#a882ff', lat: 30, lon: 92, rx: 0.58, ry: 0.27, seed: 4.5 },
  { id: 'certificates', label: 'CERTIFICATES', icon: 'C', color: '#ff9a4d', lat: -25, lon: 135, rx: 0.36, ry: 0.22, seed: 5.8 },
  { id: 'achievements', label: 'ACHIEVEMENTS', icon: 'H', color: '#ff6b73', lat: 56, lon: 96, rx: 0.42, ry: 0.22, seed: 6.4 },
  { id: 'contact', label: 'CONTACT', icon: '@', color: '#75ff9a', lat: 18, lon: -5, rx: 0.38, ry: 0.2, seed: 7.2 },
]

function latLonToVector(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

function getBasis(lat, lon) {
  const normal = latLonToVector(lat, lon, 1).normalize()
  const reference = Math.abs(normal.y) > 0.92 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0)
  const tangent = new THREE.Vector3().crossVectors(reference, normal).normalize()
  const bitangent = new THREE.Vector3().crossVectors(normal, tangent).normalize()

  return { normal, tangent, bitangent }
}

function sampleBezier(points, steps = 18) {
  if (!Array.isArray(points) || points.length < 3) {
    return []
  }

  const path = []

  for (let index = 0; index < points.length; index += 1) {
    const p0 = points[(index - 1 + points.length) % points.length]
    const p1 = points[index]
    const p2 = points[(index + 1) % points.length]
    const p3 = points[(index + 2) % points.length]

    for (let step = 0; step < steps; step += 1) {
      const t = step / steps
      const t2 = t * t
      const t3 = t2 * t

      const x =
        0.5 *
        ((2 * p1[0]) +
          (-p0[0] + p2[0]) * t +
          (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
          (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3)

      const y =
        0.5 *
        ((2 * p1[1]) +
          (-p0[1] + p2[1]) * t +
          (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
          (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)

      path.push([x, y])
    }
  }

  return path
}

function drawContinent(context, points, fillStops, strokeColor) {
  const path = sampleBezier(points)

  context.beginPath()
  path.forEach(([x, y], index) => {
    if (index === 0) {
      context.moveTo(x, y)
    } else {
      context.lineTo(x, y)
    }
  })
  context.closePath()

  const bounds = path.reduce(
    (accumulator, [x, y]) => ({
      minX: Math.min(accumulator.minX, x),
      maxX: Math.max(accumulator.maxX, x),
      minY: Math.min(accumulator.minY, y),
      maxY: Math.max(accumulator.maxY, y),
    }),
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity }
  )

  const gradient = context.createLinearGradient(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY)
  fillStops.forEach(([stop, color]) => gradient.addColorStop(stop, color))
  context.fillStyle = gradient
  context.fill()

  context.save()
  context.strokeStyle = strokeColor
  context.lineWidth = 2.3
  context.shadowColor = strokeColor
  context.shadowBlur = 14
  context.globalAlpha = 0.38
  context.stroke()
  context.restore()

  context.save()
  context.clip()
  for (let i = 0; i < 22; i += 1) {
    const px = bounds.minX + Math.random() * (bounds.maxX - bounds.minX)
    const py = bounds.minY + Math.random() * (bounds.maxY - bounds.minY)
    const radius = Math.random() * 34 + 8
    const glow = context.createRadialGradient(px, py, 0, px, py, radius)
    glow.addColorStop(0, i % 3 === 0 ? 'rgba(255,229,176,0.26)' : 'rgba(19,53,31,0.2)')
    glow.addColorStop(1, 'transparent')
    context.fillStyle = glow
    context.beginPath()
    context.arc(px, py, radius, 0, Math.PI * 2)
    context.fill()
  }
  context.restore()
}

function makePlanetTexture() {
  const width = 4096
  const height = 2048
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')

  const ocean = context.createLinearGradient(0, 0, 0, height)
  ocean.addColorStop(0, '#021124')
  ocean.addColorStop(0.28, '#06294a')
  ocean.addColorStop(0.58, '#0b4f70')
  ocean.addColorStop(0.84, '#0a3353')
  ocean.addColorStop(1, '#020914')
  context.fillStyle = ocean
  context.fillRect(0, 0, width, height)

  for (let i = 0; i < 160; i += 1) {
    const x = Math.random() * width
    const y = Math.random() * height
    const radius = Math.random() * 180 + 70
    const glow = context.createRadialGradient(x, y, 0, x, y, radius)
    glow.addColorStop(0, i % 4 === 0 ? 'rgba(56,189,248,0.12)' : 'rgba(34,211,238,0.08)')
    glow.addColorStop(1, 'transparent')
    context.fillStyle = glow
    context.beginPath()
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fill()
  }

  context.save()
  context.strokeStyle = 'rgba(255,255,255,0.045)'
  context.lineWidth = 1
  for (let x = 0; x <= width; x += width / 12) {
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x, height)
    context.stroke()
  }
  for (let y = 0; y <= height; y += height / 8) {
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(width, y)
    context.stroke()
  }
  context.restore()

  const continents = [
    {
      points: [
        [280, 280], [250, 165], [390, 80], [560, 88],
        [690, 96], [850, 200], [820, 330], [760, 430],
        [695, 520], [620, 650], [520, 760], [415, 822],
        [320, 785], [232, 720], [200, 605], [232, 470],
        [248, 390], [292, 340], [280, 280],
      ],
      fillStops: [[0, '#8ed66f'], [0.45, '#509a4e'], [1, '#2b5c34']],
      stroke: 'rgba(161,245,147,0.28)',
    },
    {
      points: [
        [640, 840], [700, 760], [840, 730], [930, 780],
        [982, 890], [968, 1030], [905, 1155], [862, 1290],
        [834, 1430], [765, 1575], [674, 1710], [592, 1770],
        [520, 1715], [503, 1560], [540, 1420], [596, 1305],
        [620, 1180], [620, 1020], [640, 840],
      ],
      fillStops: [[0, '#c8d972'], [0.42, '#8aa34b'], [1, '#4e6224']],
      stroke: 'rgba(223,255,164,0.24)',
    },
    {
      points: [
        [1580, 260], [1720, 120], [1980, 105], [2180, 180],
        [2340, 140], [2530, 208], [2695, 315], [2750, 445],
        [2690, 560], [2460, 620], [2300, 665], [2145, 785],
        [1980, 870], [1815, 826], [1700, 715], [1574, 702],
        [1450, 620], [1368, 512], [1390, 386], [1490, 300],
        [1580, 260],
      ],
      fillStops: [[0, '#d5e88a'], [0.44, '#6fad57'], [1, '#2f613a']],
      stroke: 'rgba(210,255,176,0.26)',
    },
    {
      points: [
        [1765, 780], [1830, 730], [1948, 760], [2006, 858],
        [1965, 1005], [1880, 1140], [1808, 1265], [1735, 1415],
        [1650, 1530], [1568, 1492], [1530, 1350], [1562, 1180],
        [1620, 1030], [1688, 900], [1765, 780],
      ],
      fillStops: [[0, '#efc974'], [0.45, '#b07f33'], [1, '#6d4718']],
      stroke: 'rgba(255,227,163,0.24)',
    },
    {
      points: [
        [2760, 945], [2870, 890], [2990, 920], [3085, 1015],
        [3110, 1135], [3048, 1242], [2935, 1298], [2815, 1255],
        [2720, 1165], [2688, 1048], [2760, 945],
      ],
      fillStops: [[0, '#d0d96f'], [0.44, '#83903c'], [1, '#556521']],
      stroke: 'rgba(242,255,167,0.2)',
    },
    {
      points: [
        [3100, 1480], [3190, 1425], [3305, 1448], [3388, 1518],
        [3420, 1620], [3378, 1705], [3288, 1750], [3175, 1735],
        [3088, 1658], [3060, 1560], [3100, 1480],
      ],
      fillStops: [[0, '#d8ae79'], [0.44, '#9a6a35'], [1, '#66421f']],
      stroke: 'rgba(255,214,166,0.18)',
    },
  ]

  continents.forEach((continent) =>
    drawContinent(context, continent.points, continent.fillStops, continent.stroke)
  )

  const aurora = context.createLinearGradient(0, 0, width, 0)
  aurora.addColorStop(0, 'rgba(34,211,238,0)')
  aurora.addColorStop(0.25, 'rgba(34,211,238,0.14)')
  aurora.addColorStop(0.5, 'rgba(167,139,250,0.12)')
  aurora.addColorStop(0.75, 'rgba(34,211,238,0.12)')
  aurora.addColorStop(1, 'rgba(34,211,238,0)')
  context.fillStyle = aurora
  context.fillRect(0, 120, width, 160)
  context.fillRect(0, height - 280, width, 180)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8

  return texture
}

function makeCloudTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const context = canvas.getContext('2d')

  for (let i = 0; i < 220; i += 1) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const radiusX = Math.random() * 110 + 20
    const radiusY = Math.random() * 30 + 8
    const alpha = Math.random() * 0.34 + 0.04
    const cloud = context.createRadialGradient(x, y, 0, x, y, radiusX)
    cloud.addColorStop(0, `rgba(235,246,255,${alpha})`)
    cloud.addColorStop(1, 'transparent')
    context.fillStyle = cloud
    context.beginPath()
    context.ellipse(x, y, radiusX, radiusY, Math.random() * Math.PI, 0, Math.PI * 2)
    context.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace

  return texture
}

function createTerritory(sec) {
  const { normal, tangent, bitangent } = getBasis(sec.lat, sec.lon)
  const steps = 52
  const linePoints = []
  const vertices = []
  const normals = []
  const indices = []

  const center = normal.clone().multiplyScalar(SURFACE_RADIUS)
  vertices.push(center.x, center.y, center.z)
  normals.push(normal.x, normal.y, normal.z)

  for (let index = 0; index <= steps; index += 1) {
    const angle = (index / steps) * Math.PI * 2
    const contour =
      1 +
      Math.sin(angle * 2.2 + sec.seed) * 0.12 +
      Math.sin(angle * 3.7 + sec.seed * 1.7) * 0.08 +
      Math.cos(angle * 5.1 - sec.seed) * 0.04
    const dent = Math.max(0.72, contour)
    const local = tangent
      .clone()
      .multiplyScalar(Math.cos(angle) * sec.rx * dent)
      .add(bitangent.clone().multiplyScalar(Math.sin(angle) * sec.ry * (0.92 + Math.cos(angle + sec.seed) * 0.08)))
    const point = normal
      .clone()
      .multiplyScalar(PLANET_RADIUS)
      .add(local)
      .normalize()
      .multiplyScalar(SURFACE_RADIUS)

    linePoints.push(point.clone().multiplyScalar(1.003))

    if (index < steps) {
      vertices.push(point.x, point.y, point.z)
      const pointNormal = point.clone().normalize()
      normals.push(pointNormal.x, pointNormal.y, pointNormal.z)
    }
  }

  for (let index = 1; index <= steps; index += 1) {
    const next = index === steps ? 1 : index + 1
    indices.push(0, index, next)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geometry.setIndex(indices)

  return { geometry, linePoints }
}

function SectionTerritory({ sec }) {
  const { hovered, navigate, setHovered, transitioning } = useStore()
  const isHovered = hovered === sec.id
  const groupRef = useRef(null)
  const meshRef = useRef(null)
  const glowRef = useRef(null)
  const labelRef = useRef(null)

  const territory = useMemo(() => createTerritory(sec), [sec])
  const outward = useMemo(() => latLonToVector(sec.lat, sec.lon, 1).normalize(), [sec.lat, sec.lon])
  const labelQuaternion = useMemo(
    () => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), outward),
    [outward]
  )

  useFrame((_, delta) => {
    const lift = isHovered ? 0.18 : 0
    const emissive = isHovered ? 0.85 : 0.24
    const glowOpacity = isHovered ? 0.24 : 0.1
    const labelScale = isHovered ? 1.1 : 1

    if (groupRef.current) {
      const target = outward.clone().multiplyScalar(lift)
      groupRef.current.position.lerp(target, 1 - Math.exp(-8 * delta))
    }

    if (meshRef.current) {
      meshRef.current.material.emissiveIntensity +=
        (emissive - meshRef.current.material.emissiveIntensity) * 0.12
    }

    if (glowRef.current) {
      glowRef.current.material.opacity += (glowOpacity - glowRef.current.material.opacity) * 0.12
    }

    if (labelRef.current) {
      const nextScale = THREE.MathUtils.lerp(labelRef.current.scale.x, labelScale, 0.12)
      labelRef.current.scale.setScalar(nextScale)
    }
  })

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        geometry={territory.geometry}
        onPointerEnter={(event) => {
          event.stopPropagation()
          if (!transitioning) {
            setHovered(sec.id)
          }
        }}
        onPointerLeave={(event) => {
          event.stopPropagation()
          setHovered(null)
        }}
        onClick={(event) => {
          event.stopPropagation()
          if (!transitioning) {
            navigate(sec.id)
          }
        }}
      >
        <meshStandardMaterial
          color={new THREE.Color(sec.color).lerp(new THREE.Color('#2a2c15'), 0.45)}
          emissive={sec.color}
          emissiveIntensity={0.24}
          roughness={0.76}
          metalness={0.08}
        />
      </mesh>

      <mesh ref={glowRef} geometry={territory.geometry} scale={1.008}>
        <meshBasicMaterial color={sec.color} transparent opacity={0.1} side={THREE.BackSide} />
      </mesh>

      <Line
        points={territory.linePoints}
        color={isHovered ? '#ffffff' : sec.color}
        lineWidth={isHovered ? 1.7 : 1.1}
        transparent
        opacity={isHovered ? 0.95 : 0.72}
      />

      <group
        ref={labelRef}
        position={outward.clone().multiplyScalar(LABEL_RADIUS)}
        quaternion={labelQuaternion}
      >
        <Text
          fontSize={0.09}
          maxWidth={0.9}
          color="#f5fbff"
          outlineWidth={0.004}
          outlineColor="#00111e"
          anchorX="center"
          anchorY="middle"
        >
          {sec.label}
        </Text>
      </group>
    </group>
  )
}

function Clouds() {
  const ref = useRef(null)
  const texture = useMemo(() => makeCloudTexture(), [])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.018
    }
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[2.065, 96, 96]} />
      <meshStandardMaterial map={texture} transparent opacity={0.42} roughness={1} depthWrite={false} />
    </mesh>
  )
}

function Atmosphere() {
  return (
    <>
      <mesh>
        <sphereGeometry args={[2.24, 96, 96]} />
        <meshStandardMaterial
          color="#3fe2ff"
          emissive="#1b6ca8"
          emissiveIntensity={0.22}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          roughness={1}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.36, 96, 96]} />
        <meshBasicMaterial color="#9e66ff" transparent opacity={0.055} side={THREE.BackSide} />
      </mesh>
    </>
  )
}

export default function PlanetSurface() {
  const ref = useRef(null)
  const sheenRef = useRef(null)
  const { setPlanetReady } = useStore()
  const texture = useMemo(() => makePlanetTexture(), [])

  useEffect(() => {
    const timeout = window.setTimeout(setPlanetReady, 600)
    return () => window.clearTimeout(timeout)
  }, [setPlanetReady])

  useFrame((_, delta) => {
    if (!ref.current) {
      return
    }

    ref.current.rotation.y += delta * 0.075

    const mx = +document.documentElement.style.getPropertyValue('--mx') || 0
    const my = +document.documentElement.style.getPropertyValue('--my') || 0

    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, my * 0.04, 0.02)
    ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, mx * 0.025, 0.02)

    if (sheenRef.current) {
      sheenRef.current.material.opacity = THREE.MathUtils.lerp(
        sheenRef.current.material.opacity,
        0.12 + Math.abs(mx) * 0.06,
        0.06
      )
    }
  })

  return (
    <group ref={ref}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[PLANET_RADIUS, 160, 160]} />
        <meshStandardMaterial map={texture} roughness={0.78} metalness={0.06} />
      </mesh>

      <mesh ref={sheenRef}>
        <sphereGeometry args={[2.004, 96, 96]} />
        <meshStandardMaterial
          color="#6df3ff"
          emissive="#0a3054"
          emissiveIntensity={0.08}
          transparent
          opacity={0.12}
          roughness={0.1}
          metalness={0.92}
        />
      </mesh>

      <Clouds />
      <Atmosphere />

      {SECTIONS.map((section) => (
        <SectionTerritory key={section.id} sec={section} />
      ))}
    </group>
  )
}
