import { Suspense, lazy, useEffect } from 'react';
import { motion, MotionConfig, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MousePointer2 } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import { sectionReveal } from './lib/motion';
import { useStore } from './store/useStore';

void motion;

const About = lazy(() => import('./sections/About'));
const Achievements = lazy(() => import('./sections/Achievements'));
const Certificates = lazy(() => import('./sections/Certificates'));
const Contact = lazy(() => import('./sections/Contact'));
const Education = lazy(() => import('./sections/Education'));
const Experience = lazy(() => import('./sections/Experience'));
const Projects = lazy(() => import('./sections/Projects'));
const Resume = lazy(() => import('./sections/Resume'));
const Skills = lazy(() => import('./sections/Skills'));

function LoadingShell() {
  return (
    <main className="min-h-screen bg-[#090d12] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
        <div className="max-w-md rounded-[32px] border border-rose-200/10 bg-[linear-gradient(155deg,rgba(27,18,22,0.97),rgba(12,13,17,0.95))] p-7 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <p className="text-xs font-mono uppercase tracking-[0.35em] text-amber-100/55">
            Preparing your visit
          </p>
          <h1 className="mt-4 text-3xl font-bold text-white">A moment, please.</h1>
        </div>
      </div>
    </main>
  );
}

function BuildTrace({ index }) {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-6 top-7 z-20 h-5 sm:inset-x-10">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.85, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 right-0 top-2 h-px origin-left bg-gradient-to-r from-rose-500/70 via-rose-300/25 to-transparent"
      />
      {!reduceMotion ? [0, 1, 2].map((cursor) => (
        <motion.span
          key={`${index}-${cursor}`}
          initial={{ opacity: 0, x: -12, y: 8 }}
          whileInView={{ opacity: [0, 1, 1, 0], x: [-12, 0, 24, 42], y: [8, 0, -3, 0] }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.95, delay: 0.16 + cursor * 0.12, ease: 'easeInOut' }}
          className="absolute top-0 text-rose-300 drop-shadow-[0_0_10px_rgba(244,63,94,0.7)]"
          style={{ left: `${8 + cursor * 36}%` }}
        >
          <MousePointer2 size={15 + (cursor % 2) * 3} strokeWidth={1.8} />
        </motion.span>
      )) : null}
    </div>
  );
}

export default function App() {
  const loading = useStore((state) => state.loading);
  const loadError = useStore((state) => state.loadError);
  const init = useStore((state) => state.init);
  const profile = useStore((state) => state.profile);

  useEffect(() => {
    const title = profile?.seo?.metaTitle || `${profile?.fullName || 'Portfolio'} | ${profile?.title || 'Developer Portfolio'}`;
    const description = profile?.seo?.metaDescription || profile?.bio || 'Explore selected projects, experience, skills, and contact information.';
    document.title = title;

    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.name = 'description';
      document.head.append(descriptionTag);
    }
    descriptionTag.content = description;

    const setOpenGraph = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.append(tag);
      }
      tag.content = content;
    };

    setOpenGraph('og:title', title);
    setOpenGraph('og:description', description);
    if (profile?.seo?.ogImage) setOpenGraph('og:image', profile.seo.ogImage);
  }, [profile]);

  const sectionVisibility = profile?.sectionVisibility || {};

  if (loading) {
    return <LoadingShell />;
  }

  const contentSections = [
    sectionVisibility.about !== false ? <About key="about" /> : null,
    sectionVisibility.projects !== false ? <Projects key="projects" /> : null,
    sectionVisibility.skills !== false ? <Skills key="skills" /> : null,
    sectionVisibility.experience !== false ? <Experience key="experience" /> : null,
    sectionVisibility.education !== false ? <Education key="education" /> : null,
    sectionVisibility.certificates !== false ? <Certificates key="certificates" /> : null,
    sectionVisibility.achievements !== false ? <Achievements key="achievements" /> : null,
    profile?.resume ? <Resume key="resume" /> : null,
    sectionVisibility.contact !== false ? <Contact key="contact" /> : null,
  ].filter(Boolean);

  return (
    <MotionConfig reducedMotion="user">
    <main className="relative min-h-screen overflow-hidden bg-[#08090c] selection:bg-rose-500/30 selection:text-white">
      <a href="#main-content" className="sr-only z-[100] rounded-full bg-white px-5 py-3 font-semibold text-slate-950 focus:fixed focus:left-4 focus:top-4 focus:not-sr-only">
        Skip to main content
      </a>
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_80%_8%,rgba(105,20,31,0.24),transparent_34%),radial-gradient(ellipse_at_8%_42%,rgba(124,45,34,0.12),transparent_33%),linear-gradient(180deg,#08090c_0%,#0d0d11_50%,#09090c_100%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.16] [background-image:radial-gradient(rgba(248,232,225,0.48)_0.65px,transparent_0.8px)] [background-size:32px_32px]" />

      <div className="relative z-10">
        {loadError ? (
          <div role="status" className="mx-auto mt-24 flex max-w-3xl items-center justify-between gap-4 rounded-2xl border border-amber-200/20 bg-[#151a1d]/90 px-5 py-4 text-sm text-slate-200 shadow-xl">
            <span>Portfolio data is taking longer than expected. The page is still available; try reconnecting.</span>
            <button onClick={() => init()} className="shrink-0 rounded-full border border-amber-100/30 px-4 py-2 font-semibold text-amber-100 transition hover:bg-amber-100/10">Retry</button>
          </div>
        ) : null}
        <Navbar />
        <div id="main-content" tabIndex={-1}>
        <Hero />
        {contentSections.map((section, index) => (
          <motion.div
            key={section.key || index}
            variants={sectionReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.08 }}
            className="relative"
          >
            <BuildTrace index={index} />
            <Suspense fallback={<div className="min-h-32" />}>
              {section}
            </Suspense>
          </motion.div>
        ))}
        </div>
        <footer className="px-6 py-14">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 border-t border-white/10 pt-10 text-center">
            <Link
              to="/login"
              className="inline-flex items-center rounded-full border border-rose-300/20 bg-rose-400/10 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.32em] text-rose-100 transition hover:border-rose-200/40 hover:bg-rose-400/15 hover:text-white"
            >
              Admin Login
            </Link>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-slate-500">
              &copy; {new Date().getFullYear()} Md Mihran Sohail. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </main>
    </MotionConfig>
  );
}
