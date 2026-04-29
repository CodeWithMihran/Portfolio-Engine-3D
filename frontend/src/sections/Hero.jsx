import { Suspense, lazy, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BriefcaseBusiness,
  Code2,
  Download,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
} from 'lucide-react';
import EmptyStatePanel from '../components/EmptyStatePanel';
import { createProjectImageFallback, resolveMediaUrl } from '../lib/media';
import { fadeInLeft, fadeInRight, fadeInUp, staggerContainer } from '../lib/motion';
import { useStore } from '../store/useStore';

const SOCIAL_LABELS = {
  github: { icon: Code2, label: 'GitHub' },
  linkedin: { icon: BriefcaseBusiness, label: 'LinkedIn' },
  website: { icon: Globe, label: 'Website' },
};

const EarthCanvas = lazy(() => import('../components/canvas/Earth'));

const collectHighlights = (project) =>
  [project?.challenges, project?.learnings]
    .flatMap((value) =>
      String(value || '')
        .split(/\r?\n|[.!?]+/)
        .map((item) => item.trim())
        .filter(Boolean)
    )
    .filter((item, index, array) => array.indexOf(item) === index)
    .slice(0, 2);

void motion;

export default function Hero() {
  const profile = useStore((state) => state.profile);
  const featuredProjects = useStore((state) => state.featuredProjects);
  const projects = useStore((state) => state.projects);
  const [showPlanet, setShowPlanet] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowPlanet(true), 180);
    return () => window.clearTimeout(timer);
  }, []);

  const firstName = profile?.fullName?.split(' ')?.[0] || 'Md';
  const restName = profile?.fullName?.split(' ')?.slice(1).join(' ') || 'Mihran Sohail';
  const socialLinks = Object.entries(profile?.socialLinks || {}).filter(([, value]) => value);
  const featuredProject = featuredProjects[0] || projects[0] || null;
  const featuredImage = featuredProject
    ? resolveMediaUrl(
        featuredProject.thumbnail || featuredProject.images?.[0],
        createProjectImageFallback(featuredProject.title)
      )
    : '';
  const featuredHighlights = featuredProject ? collectHighlights(featuredProject) : [];

  return (
    <section className="relative mx-auto flex min-h-screen max-w-7xl items-center overflow-hidden px-4 pt-28 pb-16 sm:px-6 sm:pt-32 sm:pb-20">
      <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_42%)]" />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid w-full gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12"
      >
        <motion.div variants={fadeInLeft} className="relative flex gap-5">
          <div className="mt-2 hidden flex-col items-center sm:flex">
            <div className="h-5 w-5 rounded-full bg-violet-300 shadow-[0_0_35px_rgba(196,181,253,0.75)]" />
            <div className="mt-2 h-72 w-[3px] rounded-full bg-gradient-to-b from-violet-300 via-sky-400 to-emerald-300" />
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.3em] text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.08)]">
              <span className="h-2 w-2 rounded-full bg-orange-300" />
              {profile?.availability || 'Open to opportunities'}
            </div>

            <div className="space-y-5">
              <p className="text-sm font-mono uppercase tracking-[0.35em] text-cyan-200/55">
                Portfolio Presentation
              </p>
              <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl xl:text-7xl">
                Hi, I&apos;m{' '}
                <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-orange-200 bg-clip-text text-transparent">
                  {firstName}
                </span>
                <br />
                {restName}
              </h1>
              <p className="max-w-2xl text-lg text-slate-200 sm:text-xl">
                {profile?.title || 'Full Stack Developer'}
              </p>
              <p className="max-w-3xl text-sm leading-7 text-slate-300/80 sm:text-base sm:leading-8">
                {profile?.bio ||
                  'Building polished products, practical systems, and thoughtful web experiences with a strong engineering core.'}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <a
                href="#projects"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#06b6d4,#0ea5e9)] px-6 py-3 font-semibold text-white shadow-[0_18px_45px_rgba(14,165,233,0.28)] transition hover:brightness-110 sm:w-auto"
              >
                View Projects
                <ArrowRight size={18} />
              </a>
              <a
                href="#contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-100 transition hover:border-cyan-300/20 hover:bg-white/10 sm:w-auto"
              >
                Let&apos;s Talk
                <Mail size={18} />
              </a>
              {profile?.resume ? (
                <a
                  href="#resume"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-orange-300/20 bg-orange-400/10 px-6 py-3 font-semibold text-orange-100 transition hover:bg-orange-400/15 sm:w-auto"
                >
                  Resume
                  <Download size={18} />
                </a>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-5 text-sm text-slate-400">
              {profile?.email ? (
                <a href={`mailto:${profile.email}`} className="transition hover:text-white">
                  {profile.email}
                </a>
              ) : null}
              {profile?.location ? (
                <span className="inline-flex items-center gap-2">
                  <MapPin size={16} />
                  {profile.location}
                </span>
              ) : null}
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

            {featuredProject ? (
              <motion.article
                variants={fadeInUp}
                className="overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,17,31,0.95),rgba(9,17,31,0.82))] shadow-[0_24px_65px_rgba(2,6,23,0.28)] backdrop-blur-xl"
              >
                <div className="grid gap-0 md:grid-cols-[0.4fr_0.6fr]">
                  <div className="relative min-h-[200px] overflow-hidden">
                    <img src={featuredImage} alt={featuredProject.title} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,17,31,0.1),rgba(7,17,31,0.78))]" />
                    <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-slate-950/55 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.28em] text-cyan-100">
                      Current Focus
                    </div>
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-cyan-300/16 bg-cyan-400/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-100">
                        {featuredProject.status || 'completed'}
                      </span>
                      {featuredProject.role ? (
                        <span className="rounded-full border border-orange-300/16 bg-orange-400/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] text-orange-100">
                          {featuredProject.role}
                        </span>
                      ) : null}
                    </div>

                    <div>
                      <h3 className="text-2xl font-black text-white">{featuredProject.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-300/80">
                        {featuredProject.shortDescription || featuredProject.description}
                      </p>
                    </div>

                    {featuredProject.technologies?.length ? (
                      <div className="flex flex-wrap gap-2">
                        {featuredProject.technologies.slice(0, 4).map((tech) => (
                          <span
                            key={`${featuredProject._id}-${tech}`}
                            className="rounded-full border border-cyan-300/10 bg-cyan-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-50"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {featuredHighlights.length ? (
                      <div className="space-y-2">
                        {featuredHighlights.map((item) => (
                          <div
                            key={item}
                            className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-200"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <div className="flex flex-wrap gap-3">
                      <a
                        href="#projects"
                        className="inline-flex items-center gap-2 rounded-full border border-cyan-300/14 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/15"
                      >
                        Explore Project
                        <ArrowRight size={16} />
                      </a>
                      {featuredProject.liveLink ? (
                        <a
                          href={featuredProject.liveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-orange-300/14 bg-orange-400/10 px-4 py-2 text-sm font-semibold text-orange-100 transition hover:bg-orange-400/15"
                        >
                          Live Preview
                          <ExternalLink size={16} />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </motion.article>
            ) : (
              <motion.div variants={fadeInUp}>
                <EmptyStatePanel
                  eyebrow="Portfolio Story"
                  title="Feature a project to complete the hero narrative."
                  body="Mark one project as featured in the admin console and this area will transform into your current-focus story card automatically."
                  ctaLabel="Open Admin"
                  tone="cyan"
                />
              </motion.div>
            )}
          </div>
        </motion.div>

        <motion.div variants={fadeInRight} className="relative">
          <div className="pointer-events-none absolute left-14 top-16 hidden h-44 w-44 rounded-full bg-cyan-400/20 blur-[120px] lg:block" />
          <div className="pointer-events-none absolute right-8 top-10 hidden h-56 w-56 rounded-full bg-orange-400/10 blur-[140px] lg:block" />
          <div className="pointer-events-none absolute bottom-16 left-1/2 hidden h-48 w-48 -translate-x-1/2 rounded-full bg-sky-400/14 blur-[125px] lg:block" />

          <div className="relative mx-auto flex h-[340px] w-full max-w-[620px] items-center justify-center sm:h-[420px] lg:h-[560px]">
            <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04),transparent_42%),radial-gradient(circle_at_center,rgba(56,189,248,0.15),transparent_58%),radial-gradient(circle_at_60%_35%,rgba(251,146,60,0.08),transparent_34%)]" />
            <div className="pointer-events-none absolute inset-x-20 bottom-20 h-16 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="h-[320px] w-[320px] max-w-full sm:h-[420px] sm:w-[420px] lg:h-[540px] lg:w-[540px]">
              {showPlanet ? (
                <Suspense
                  fallback={
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.18),transparent_48%),radial-gradient(circle_at_55%_45%,rgba(251,146,60,0.1),transparent_24%)]">
                      <div className="h-40 w-40 rounded-full border border-cyan-300/15 bg-cyan-400/10 blur-[1px] sm:h-56 sm:w-56 lg:h-72 lg:w-72" />
                    </div>
                  }
                >
                  <EarthCanvas />
                </Suspense>
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.18),transparent_48%),radial-gradient(circle_at_55%_45%,rgba(251,146,60,0.1),transparent_24%)]">
                  <div className="h-40 w-40 rounded-full border border-cyan-300/15 bg-cyan-400/10 blur-[1px] sm:h-56 sm:w-56 lg:h-72 lg:w-72" />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
