import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../store/store'

import AboutSection        from './sections/AboutSection'
import ProjectsSection     from './sections/ProjectsSection'
import SkillsSection       from './sections/SkillsSection'
import ExperienceSection   from './sections/ExperienceSection'
import EducationSection    from './sections/EducationSection'
import CertificatesSection from './sections/CertificatesSection'
import AchievementsSection from './sections/AchievementsSection'
import ContactSection      from './sections/ContactSection'

const SECTION_MAP = {
  about:        AboutSection,
  projects:     ProjectsSection,
  skills:       SkillsSection,
  experience:   ExperienceSection,
  education:    EducationSection,
  certificates: CertificatesSection,
  achievements: AchievementsSection,
  contact:      ContactSection,
}

const pageVariants = {
  initial: { opacity: 0, scale: 1.04 },
  enter:   { opacity: 1, scale: 1,    transition: { duration: .5, ease: [.16, 1, .3, 1] } },
  exit:    { opacity: 0, scale: .97,  transition: { duration: .35, ease: [.4, 0, .6, 1] } },
}

export default function SectionRenderer() {
  const { section } = useStore()
  const Component = section ? SECTION_MAP[section] : null

  return (
    <AnimatePresence mode="wait">
      {Component && (
        <motion.div
          key={section}
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          style={{ position: 'fixed', inset: 0, zIndex: 600 }}
        >
          <Component />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
