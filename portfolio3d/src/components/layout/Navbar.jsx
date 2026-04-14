import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/store'
import { SECTIONS } from '../planet/PlanetSurface'

export default function Navbar() {
  const { section, navigate, profile, transitioning } = useStore()
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  const go = (id) => {
    if (transitioning) return
    setMenuOpen(false)
    navigate(id === 'home' ? null : id)
  }

  return (
    <>
      <motion.nav
        className={`nav${scrolled ? ' frosted' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        transition={{ duration: .9, delay: .4, ease: [.16,1,.3,1] }}
      >
        {/* Logo */}
        <motion.div className="nav-logo" onClick={() => go('home')} whileHover={{ scale:1.04 }} whileTap={{ scale:.96 }}>
          <div className="nav-logo-planet">
            <div className="nlp-ring" />
            <div className="nlp-core" />
          </div>
          <span className="nav-logo-text">{profile?.fullName?.split(' ')[0] || 'PORTFOLIO'}</span>
        </motion.div>

        {/* Desktop links */}
        <div className="nav-links">
          {SECTIONS.map((s, i) => (
            <motion.button
              key={s.id}
              className={`nav-lnk${section === s.id ? ' active' : ''}`}
              style={{ '--sec-color': s.color }}
              onClick={() => go(s.id)}
              initial={{ opacity:0, y:-18 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay: .5 + i*.045, ease:[.16,1,.3,1] }}
              whileHover={{ y:-2 }}
              disabled={transitioning}
            >
              <span className="nl-icon">{s.icon}</span>
              {s.label}
              {section === s.id && (
                <motion.div className="nav-lnk-bar" style={{ background: s.color }} layoutId="bar" />
              )}
            </motion.button>
          ))}
        </div>

        {/* Right */}
        <div className="nav-right">
          {profile?.resume && (
            <motion.a
              href={profile.resume} target="_blank" rel="noopener noreferrer"
              className="nav-resume"
              whileHover={{ scale:1.04 }} whileTap={{ scale:.96 }}
            >RÉSUMÉ</motion.a>
          )}
          <button className={`nav-burger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-drawer"
            initial={{ x:'100%', opacity:0 }}
            animate={{ x:0, opacity:1 }}
            exit={{ x:'100%', opacity:0 }}
            transition={{ duration:.3, ease:[.4,0,.2,1] }}
          >
            {SECTIONS.map((s, i) => (
              <motion.button
                key={s.id}
                className={`md-lnk${section === s.id ? ' active' : ''}`}
                style={{ '--sec-color': s.color }}
                onClick={() => go(s.id)}
                initial={{ opacity:0, x:22 }}
                animate={{ opacity:1, x:0 }}
                transition={{ delay: i*.05 }}
              >
                <span style={{ fontSize:'1.1rem' }}>{s.icon}</span>
                {s.label}
                <span>→</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
