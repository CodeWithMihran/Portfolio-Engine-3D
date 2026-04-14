import { useEffect } from 'react'
import { useStore } from './store/store'
import { useBootstrap } from './hooks/useBootstrap'

import Scene            from './components/planet/Scene'
import Navbar           from './components/layout/Navbar'
import SectionRenderer  from './components/SectionRenderer'
import { CustomCursor, LoadingScreen, TransitionOverlay, PlanetHUD } from './components/ui/UI'

import './styles/global.css'

export default function App() {
  useBootstrap()

  const { loading } = useStore()

  // Prevent body scroll when a section is open
  useEffect(() => {
    const unsub = useStore.subscribe(
      state => state.section,
      (sec) => {
        document.body.style.overflow = sec ? 'hidden' : ''
      }
    )
    return unsub
  }, [])

  return (
    <>
      {/* Custom cursor */}
      <CustomCursor />

      {/* Loading screen */}
      <LoadingScreen />

      {/* Transition flash overlay */}
      <TransitionOverlay />

      {/* 3D scene — always mounted */}
      {!loading && <Scene />}

      {/* Navigation */}
      {!loading && <Navbar />}

      {/* Planet HUD — hero text, socials, tooltip */}
      {!loading && <PlanetHUD />}

      {/* Section pages */}
      {!loading && <SectionRenderer />}
    </>
  )
}
