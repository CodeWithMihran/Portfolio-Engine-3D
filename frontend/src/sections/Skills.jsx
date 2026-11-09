import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import EmptyStatePanel from '../components/EmptyStatePanel';
import SectionIntro from '../components/SectionIntro';
import { createSkillIconFallback, resolveMediaUrl } from '../lib/media';
import { fadeInUp } from '../lib/motion';
import { useStore } from '../store/useStore';

void motion;

const BallCanvas = lazy(() => import('../components/canvas/Ball'));

const getSkillColumns = (viewportWidth) => {
  if (viewportWidth < 640) return 3;
  if (viewportWidth < 1024) return 4;
  return 6;
};

export default function Skills() {
  const skills = useStore((state) => state.skills);
  const sectionRef = useRef(null);
  const [canvasReady, setCanvasReady] = useState(() =>
    typeof window !== 'undefined' && !('IntersectionObserver' in window)
  );
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    const updateWidth = () => setWidth(Math.max(320, Math.min(window.innerWidth - 32, 1200)));
    updateWidth();
    window.addEventListener('resize', updateWidth, { passive: true });
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    if (!('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setCanvasReady(true);
        observer.disconnect();
      }
    }, { rootMargin: '320px 0px' });

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const columns = getSkillColumns(width);
  const rows = Math.ceil(skills.length / columns);
  const height = Math.max(190, rows * 150);
  const sceneSkills = skills.map((skill) => ({
    ...skill,
    icon: resolveMediaUrl(skill.icon, createSkillIconFallback(skill.name)),
  }));

  return (
    <section ref={sectionRef} id="skills" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24">
      <SectionIntro
        eyebrow="Tools of the trade"
        title="A considered"
        accent="stack"
        body="The technologies I reach for, arranged as a small interactive constellation. Drag to explore."
        align="center"
      />

      {skills.length ? (
        <div className="portfolio-panel relative mt-8 px-2 py-5 sm:px-6 sm:py-8">
          <div className="pointer-events-none absolute inset-x-[15%] top-1/2 h-px bg-gradient-to-r from-transparent via-rose-100/15 to-transparent" />
          <motion.div variants={fadeInUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="relative">
            {canvasReady ? (
              <Suspense fallback={<div style={{ height }} className="animate-pulse rounded-3xl bg-white/[0.025]" />}>
                <BallCanvas skills={sceneSkills} height={height} />
              </Suspense>
            ) : (
              <div style={{ height }} className="flex items-center justify-center bg-white/[0.025] text-xs font-mono uppercase tracking-[0.22em] text-slate-500">
                Interactive stack loads as you explore
              </div>
            )}
          </motion.div>
          <p className="mt-1 text-center text-[10px] font-mono uppercase tracking-[0.24em] text-slate-500">Drag to rotate</p>
        </div>
      ) : (
        <div className="mx-auto mt-8 max-w-2xl">
          <EmptyStatePanel
            eyebrow="Stack in progress"
            title="The skill constellation will appear here."
            body="Add your technologies in the admin console to build this interactive view."
            ctaLabel="Add Skills From Admin"
            ctaHref="/login"
            tone="red"
          />
        </div>
      )}
    </section>
  );
}
