import { motion } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, Code2, Download, Globe, Mail, MapPin } from 'lucide-react';
import { EarthCanvas } from '../components/canvas';
import { fadeInLeft, fadeInRight, fadeInUp, staggerContainer } from '../lib/motion';
import { useStore } from '../store/useStore';

const SOCIAL_LABELS = {
  github: { icon: Code2, label: 'GitHub' },
  linkedin: { icon: BriefcaseBusiness, label: 'LinkedIn' },
  website: { icon: Globe, label: 'Website' },
};

void motion;

export default function Hero() {
  const profile = useStore((state) => state.profile);
  const featuredProjects = useStore((state) => state.featuredProjects);
  const skills = useStore((state) => state.skills);
  const firstName = profile?.fullName?.split(' ')?.[0] || 'Md';
  const restName = profile?.fullName?.split(' ')?.slice(1).join(' ') || 'Mihran Sohail';
  const socialLinks = Object.entries(profile?.socialLinks || {}).filter(([, value]) => value);

  return (
    <section className="relative mx-auto flex min-h-screen max-w-7xl items-center overflow-hidden px-6 pt-32 pb-20">
      <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.22),transparent_42%)]" />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid w-full gap-12 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <motion.div variants={fadeInLeft} className="relative flex gap-5">
          <div className="mt-2 hidden flex-col items-center sm:flex">
            <div className="h-5 w-5 rounded-full bg-violet-300 shadow-[0_0_35px_rgba(196,181,253,0.75)]" />
            <div className="mt-2 h-72 w-[3px] rounded-full bg-gradient-to-b from-violet-300 via-sky-400 to-emerald-300" />
          </div>

          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.3em] text-violet-100">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {profile?.availability || 'Open to opportunities'}
            </div>

            <div className="space-y-5">
              <p className="text-sm font-mono uppercase tracking-[0.35em] text-slate-500">
                Portfolio Presentation
              </p>
              <h1 className="max-w-4xl text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl xl:text-7xl">
                Hi, I&apos;m <span className="bg-gradient-to-r from-violet-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">{firstName}</span>
                <br />
                {restName}
              </h1>
              <p className="max-w-2xl text-xl text-slate-200">
                {profile?.title || 'Full Stack Developer'}
              </p>
              <p className="max-w-3xl text-base leading-8 text-slate-400">
                {profile?.bio ||
                  'Building polished products, practical systems, and thoughtful web experiences with a strong engineering core.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full bg-violet-500 px-6 py-3 font-semibold text-white transition hover:bg-violet-400"
              >
                View Projects
                <ArrowRight size={18} />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-100 transition hover:bg-white/10"
              >
                Let&apos;s Talk
                <Mail size={18} />
              </a>
              {profile?.resume && (
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-6 py-3 font-semibold text-emerald-200 transition hover:bg-emerald-400/15"
                >
                  Resume
                  <Download size={18} />
                </a>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-5 text-sm text-slate-400">
              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="transition hover:text-white">
                  {profile.email}
                </a>
              )}
              {profile?.location && (
                <span className="inline-flex items-center gap-2">
                  <MapPin size={16} />
                  {profile.location}
                </span>
              )}
            </div>

            {socialLinks.length ? (
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(([key, value]) => {
                  const config = SOCIAL_LABELS[key];
                  if (!config) return null;
                  const Icon = config.icon;
                  return (
                    <a
                      key={key}
                      href={value}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-violet-300/30 hover:bg-violet-400/10"
                    >
                      <Icon size={16} />
                      {config.label}
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>
        </motion.div>

        <motion.div variants={fadeInRight} className="relative">
          <div className="absolute -left-10 top-10 hidden h-24 w-24 rounded-full bg-violet-400/15 blur-3xl lg:block" />
          <div className="absolute -right-2 bottom-8 hidden h-28 w-28 rounded-full bg-sky-400/15 blur-3xl lg:block" />

          <div className="relative rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,24,39,0.92),rgba(15,23,42,0.68))] p-6 shadow-[0_30px_80px_rgba(2,6,23,0.5)] backdrop-blur-2xl">
            <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.16),transparent_28%)]" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">Showcase Capsule</p>
                  <h3 className="mt-3 text-2xl font-bold text-white">{profile?.tagline || 'Developer Portfolio'}</h3>
                </div>
                <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border border-white/10 bg-white/5 text-2xl font-black text-white">
                  {firstName.slice(0, 1)}
                  {restName.slice(0, 1)}
                </div>
              </div>

              <div className="relative mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-black/20">
                <div className="h-[320px]">
                  <EarthCanvas />
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                  <p className="text-[11px] font-mono uppercase tracking-[0.32em] text-slate-500">Featured Projects</p>
                  <p className="mt-4 text-5xl font-black text-white">{featuredProjects.length}</p>
                </div>
                <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                  <p className="text-[11px] font-mono uppercase tracking-[0.32em] text-slate-500">Skills Catalog</p>
                  <p className="mt-4 text-5xl font-black text-white">{skills.length}</p>
                </div>
              </div>

              <div className="mt-5 rounded-[28px] border border-white/10 bg-black/20 p-5">
                <p className="text-[11px] font-mono uppercase tracking-[0.32em] text-slate-500">Current Focus</p>
                <p className="mt-4 max-w-lg text-lg leading-8 text-slate-200">
                  {profile?.about?.slice(0, 180) ||
                    'Designing expressive interfaces, building dependable backend integrations, and turning ideas into polished experiences.'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.a
        variants={fadeInUp}
        initial="hidden"
        animate="show"
        href="#about"
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-[11px] font-mono uppercase tracking-[0.35em] text-slate-500">Scroll</span>
        <div className="flex h-16 w-10 items-start justify-center rounded-full border border-white/15 p-2">
          <motion.span
            animate={{ y: [0, 22, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            className="h-3 w-3 rounded-full bg-violet-300"
          />
        </div>
      </motion.a>
    </section>
  );
}
