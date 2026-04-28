import { motion } from 'framer-motion';
import { ArrowRight, BriefcaseBusiness, Code2, Download, Globe, Mail, MapPin } from 'lucide-react';
import { EarthCanvas } from '../components/canvas';
import { fadeInLeft, fadeInRight, staggerContainer } from '../lib/motion';
import { useStore } from '../store/useStore';

const SOCIAL_LABELS = {
  github: { icon: Code2, label: 'GitHub' },
  linkedin: { icon: BriefcaseBusiness, label: 'LinkedIn' },
  website: { icon: Globe, label: 'Website' },
};

void motion;

export default function Hero() {
  const profile = useStore((state) => state.profile);
  const firstName = profile?.fullName?.split(' ')?.[0] || 'Md';
  const restName = profile?.fullName?.split(' ')?.slice(1).join(' ') || 'Mihran Sohail';
  const socialLinks = Object.entries(profile?.socialLinks || {}).filter(([, value]) => value);

  return (
    <section className="relative mx-auto flex min-h-screen max-w-7xl items-center overflow-hidden px-6 pt-32 pb-20">
      <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_42%)]" />
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
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.3em] text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.08)]">
              <span className="h-2 w-2 rounded-full bg-orange-300" />
              {profile?.availability || 'Open to opportunities'}
            </div>

            <div className="space-y-5">
              <p className="text-sm font-mono uppercase tracking-[0.35em] text-cyan-200/55">
                Portfolio Presentation
              </p>
              <h1 className="max-w-4xl text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl xl:text-7xl">
                Hi, I&apos;m <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-orange-200 bg-clip-text text-transparent">{firstName}</span>
                <br />
                {restName}
              </h1>
              <p className="max-w-2xl text-xl text-slate-200">
                {profile?.title || 'Full Stack Developer'}
              </p>
              <p className="max-w-3xl text-base leading-8 text-slate-300/80">
                {profile?.bio ||
                  'Building polished products, practical systems, and thoughtful web experiences with a strong engineering core.'}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#06b6d4,#0ea5e9)] px-6 py-3 font-semibold text-white shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition hover:brightness-110"
              >
                View Projects
                <ArrowRight size={18} />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-100 transition hover:border-cyan-300/20 hover:bg-white/10"
              >
                Let&apos;s Talk
                <Mail size={18} />
              </a>
              {profile?.resume && (
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-orange-300/20 bg-orange-400/10 px-6 py-3 font-semibold text-orange-100 transition hover:bg-orange-400/15"
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
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-cyan-300/30 hover:bg-cyan-400/10"
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
          <div className="pointer-events-none absolute left-14 top-16 hidden h-44 w-44 rounded-full bg-cyan-400/20 blur-[120px] lg:block" />
          <div className="pointer-events-none absolute right-8 top-10 hidden h-56 w-56 rounded-full bg-orange-400/10 blur-[140px] lg:block" />
          <div className="pointer-events-none absolute bottom-16 left-1/2 hidden h-48 w-48 -translate-x-1/2 rounded-full bg-sky-400/14 blur-[125px] lg:block" />

          <div className="relative mx-auto flex h-[560px] w-full max-w-[620px] items-center justify-center">
            <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_42%),radial-gradient(circle_at_center,rgba(56,189,248,0.15),transparent_58%),radial-gradient(circle_at_60%_35%,rgba(251,146,60,0.08),transparent_34%)]" />
            <div className="pointer-events-none absolute inset-x-20 bottom-20 h-16 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="h-[540px] w-[540px] max-w-full">
              <EarthCanvas />
            </div>
          </div>
        </motion.div>
      </motion.div>

    </section>
  );
}
