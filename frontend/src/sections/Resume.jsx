import { motion } from 'framer-motion';
import { Download, FileText, Sparkles } from 'lucide-react';
import SectionIntro from '../components/SectionIntro';
import { fadeInLeft, fadeInRight } from '../lib/motion';
import { useStore } from '../store/useStore';

void motion;

const calculateExperienceYears = (experience = []) => {
  if (!experience.length) {
    return '0+';
  }

  const earliest = experience.reduce((min, item) => {
    const timestamp = new Date(item.startDate || Date.now()).getTime();
    return Math.min(min, timestamp);
  }, Date.now());

  const years = Math.max(1, Math.floor((Date.now() - earliest) / (365.25 * 24 * 60 * 60 * 1000)));
  return `${years}+`;
};

const getResumeDownloadUrl = (url) => {
  if (!url?.includes('res.cloudinary.com') || !url.includes('/image/upload/')) return url;
  if (url.includes('/fl_attachment/')) return url;
  return url.replace('/image/upload/', '/image/upload/fl_attachment/');
};

export default function Resume() {
  const profile = useStore((state) => state.profile);
  const experience = useStore((state) => state.experience);
  const skills = useStore((state) => state.skills);
  const skillsByCategory = useStore((state) => state.skillsByCategory);

  if (!profile?.resume) {
    return null;
  }

  const topStack = skills.slice(0, 4).map((item) => item.name);
  const focusAreas = Object.keys(skillsByCategory).slice(0, 3);
  const resumeDownloadUrl = getResumeDownloadUrl(profile.resume);

  return (
    <section id="resume" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24">
      <SectionIntro
        eyebrow="Resume"
        title="Career"
        accent="Snapshot"
        body="A quick, polished way to review the resume, download it instantly, and understand the strongest career highlights at a glance."
      />

      <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.16 }}
          className="portfolio-panel p-4 sm:p-5"
        >
          <div className="border border-white/10 bg-black/40 p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center border border-rose-300/20 bg-rose-400/[0.08] text-rose-100">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.28em] text-rose-100/65">Resume preview</p>
                <p className="text-sm text-slate-300">Portable profile snapshot</p>
              </div>
            </div>

            <div className="mt-5 overflow-hidden border border-white/10 bg-slate-950/85">
              <iframe
                title="Resume Preview"
                src={profile.resume}
                className="h-[320px] w-full sm:h-[420px]"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeInRight}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.16 }}
          className="portfolio-panel space-y-5 p-5 sm:p-6"
        >
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.32em] text-rose-100/65">Download experience</p>
            <h3 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              Resume built for{' '}
              <span className="bg-gradient-to-r from-rose-200 via-red-300 to-orange-200 bg-clip-text text-transparent">
                quick review
              </span>
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
              Download the full resume, review the strongest highlights, and get a faster sense of the roles, stacks, and focus areas behind the portfolio.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="border border-white/10 bg-black/30 p-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-rose-100/70">Experience</p>
              <p className="mt-3 text-2xl font-black text-white">{calculateExperienceYears(experience)}</p>
              <p className="mt-2 text-sm text-slate-300">Years of active building</p>
            </div>
            <div className="border border-white/10 bg-black/30 p-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-orange-100/70">Top stack</p>
              <p className="mt-3 text-xl font-black text-white">{topStack[0] || 'MERN'}</p>
              <p className="mt-2 text-sm text-slate-300">{topStack.slice(1).join(' · ') || 'Frontend · Backend · UI'}</p>
            </div>
            <div className="border border-white/10 bg-black/30 p-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-rose-100/70">Focus</p>
              <p className="mt-3 text-xl font-black text-white">{focusAreas[0] || 'Product UI'}</p>
              <p className="mt-2 text-sm text-slate-300">{focusAreas.slice(1).join(' · ') || 'Systems · Delivery'}</p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-5">
            <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-cyan-300" />
              <p className="text-sm font-semibold text-white">What the resume emphasizes</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {[...topStack, ...focusAreas].filter(Boolean).slice(0, 6).map((item) => (
                <span
                  key={item}
                  className="border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[9px] font-mono uppercase tracking-[0.18em] text-slate-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={resumeDownloadUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 border border-rose-300/25 bg-rose-500/15 px-5 py-4 font-semibold text-white transition hover:bg-rose-500/25"
            >
              <Download size={18} />
              Download Resume
            </a>
            <a
              href={profile.resume}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 border border-white/10 bg-white/[0.03] px-5 py-4 font-semibold text-slate-100 transition hover:bg-white/[0.07]"
            >
              <FileText size={18} />
              Open Full View
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
