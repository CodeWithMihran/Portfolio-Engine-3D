import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/store'
import { SECTIONS } from '../planet/PlanetSurface'

/* ══════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════ */
export function CustomCursor() {
  const dot  = useRef()
  const ring = useRef()
  const pos  = useRef({ x:0, y:0 })
  const rpos = useRef({ x:0, y:0 })

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dot.current) {
        dot.current.style.left  = e.clientX + 'px'
        dot.current.style.top   = e.clientY + 'px'
      }
      // CSS mouse vars for 3D parallax
      const mx = (e.clientX / window.innerWidth  - .5) * 2
      const my = (e.clientY / window.innerHeight - .5) * 2
      document.documentElement.style.setProperty('--mx', mx)
      document.documentElement.style.setProperty('--my', my)
    }

    const onOver = (e) => {
      const h = e.target.closest('button,a,[data-hover],canvas')
      if (ring.current) ring.current.classList.toggle('hovered', !!h)
    }

    window.addEventListener('mousemove', onMove, { passive:true })
    window.addEventListener('mouseover',  onOver)

    let raf
    const track = () => {
      rpos.current.x += (pos.current.x - rpos.current.x) * .11
      rpos.current.y += (pos.current.y - rpos.current.y) * .11
      if (ring.current) {
        ring.current.style.left = rpos.current.x + 'px'
        ring.current.style.top  = rpos.current.y + 'px'
      }
      raf = requestAnimationFrame(track)
    }
    track()

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover',  onOver)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div className="cursor-dot"  ref={dot}  />
      <div className="cursor-ring" ref={ring} />
    </>
  )
}

/* ══════════════════════════════════════
   LOADING SCREEN
══════════════════════════════════════ */
export function LoadingScreen() {
  const { loading, progress, loadMsg } = useStore()

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="loader-wrap"
          exit={{ opacity:0, scale:1.04 }}
          transition={{ duration:.85, ease:[.4,0,.2,1] }}
        >
          <div className="loader-orb">
            <div className="loader-ring lr1" />
            <div className="loader-ring lr2" />
            <div className="loader-ring lr3" />
            <div className="loader-orb-core" />
          </div>
          <div className="loader-title">INITIALIZING</div>
          <div className="loader-track">
            <motion.div
              className="loader-fill"
              animate={{ width: `${progress}%` }}
              transition={{ duration:.38, ease:'easeOut' }}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="loader-msg">{loadMsg}</div>
          <div className="loader-pct">{progress}%</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ══════════════════════════════════════
   TRANSITION OVERLAY (DOM-based)
══════════════════════════════════════ */
export function TransitionOverlay() {
  return <div id="tx-overlay" />
}

/* ══════════════════════════════════════
   PLANET HUD
══════════════════════════════════════ */
const GH = () => <svg viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
const LI = () => <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
const TW = () => <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.638 5.904-5.638zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>

export function PlanetHUD() {
  const { section, hovered, profile, transitioning } = useStore()
  const show = section === null && !transitioning
  const hovSec = SECTIONS.find(s => s.id === hovered)

  const socials = profile?.socialLinks || {}

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="hud"
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          exit={{ opacity:0 }}
          transition={{ duration:.6 }}
        >
          {/* Hero text — bottom left */}
          <motion.div
            className="hud-hero"
            initial={{ opacity:0, y:28 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-16 }}
            transition={{ duration:.7, delay:.2, ease:[.16,1,.3,1] }}
          >
            <p className="hud-greeting">WELCOME TO MY UNIVERSE</p>
            <h1 className="hud-name">{profile?.fullName || 'MY PORTFOLIO'}</h1>
            <p className="hud-title">{profile?.title || 'Developer · Creator'}</p>
            {profile?.tagline && <p className="hud-tagline">"{profile.tagline}"</p>}
            <motion.p
              className="hud-hint"
              animate={{ opacity:[.3,.9,.3] }}
              transition={{ duration:2.8, repeat:Infinity }}
            >
              ↓ CLICK SECTIONS ON THE PLANET TO EXPLORE ↓
            </motion.p>
          </motion.div>

          {/* Status bar — bottom center */}
          <motion.div
            className="hud-statusbar"
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:16 }}
            transition={{ duration:.6, delay:.35 }}
          >
            <span className="hud-dot" />
            <span>SYSTEM ONLINE</span>
            <span className="hud-sep" />
            <span>{SECTIONS.length} TERRITORIES</span>
            <span className="hud-sep" />
            <span>{profile?.availability || 'OPEN TO OPPORTUNITIES'}</span>
          </motion.div>

          {/* Socials — right edge */}
          {Object.values(socials).some(Boolean) && (
            <motion.div
              className="hud-socials"
              initial={{ opacity:0, x:18 }}
              animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x:18 }}
              transition={{ duration:.6, delay:.4 }}
            >
              {socials.github   && <a href={socials.github}   target="_blank" rel="noopener noreferrer" className="hud-soc"><GH /><span className="hud-soc-label">GITHUB</span></a>}
              {socials.linkedin && <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="hud-soc"><LI /><span className="hud-soc-label">LINKEDIN</span></a>}
              {socials.twitter  && <a href={socials.twitter}  target="_blank" rel="noopener noreferrer" className="hud-soc"><TW /><span className="hud-soc-label">TWITTER</span></a>}
            </motion.div>
          )}

          {/* Hover tooltip */}
          <AnimatePresence>
            {hovSec && (
              <motion.div
                className="hud-tooltip"
                style={{ '--tc': hovSec.color }}
                key={hovSec.id}
                initial={{ opacity:0, scale:.9, y:10 }}
                animate={{ opacity:1, scale:1,  y:0 }}
                exit={{ opacity:0, scale:.9, y:10 }}
                transition={{ duration:.18 }}
              >
                <span className="hud-tooltip-ico">{hovSec.icon}</span>
                <div>
                  <div className="hud-tooltip-name">{hovSec.label}</div>
                  <div className="hud-tooltip-cta">CLICK TO ENTER →</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Corner decorations */}
          <div className="hud-c tl" /><div className="hud-c tr" />
          <div className="hud-c bl" /><div className="hud-c br" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
