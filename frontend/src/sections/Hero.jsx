import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
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
import SafeImage from '../components/SafeImage';
import { createMonogramFallback, createProjectImageFallback, resolveMediaUrl } from '../lib/media';
import { fadeInLeft, fadeInRight, fadeInUp, staggerContainer } from '../lib/motion';
import { useStore } from '../store/useStore';

const SOCIAL_LABELS = {
  github: { icon: Code2, label: 'GitHub' },
  linkedin: { icon: BriefcaseBusiness, label: 'LinkedIn' },
  website: { icon: Globe, label: 'Website' },
};

const EarthCanvas = lazy(() => import('../components/canvas/Earth'));

function GlobePlaceholder() {
  return (
    <div aria-hidden="true" className="flex h-full w-full items-center justify-center rounded-full bg-[radial-gradient(circle_at_center,rgba(190,55,65,0.2),transparent_48%),radial-gradient(circle_at_55%_45%,rgba(251,146,60,0.08),transparent_24%)]">
      <div className="h-[52%] w-[52%] rounded-full border border-rose-300/15 bg-rose-400/[0.08] blur-[1px]" />
    </div>
  );
}

void motion;

export default function Hero() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: false, amount: 0.05 });
  const reduceMotion = useReducedMotion();
  const profile = useStore((state) => state.profile);
  const featuredProjects = useStore((state) => state.featuredProjects);
  const projects = useStore((state) => state.projects);
  const [showGlobe, setShowGlobe] = useState(false);

  useEffect(() => {
    let idleCallbackId;
    const timer = window.setTimeout(() => {
      if ('requestIdleCallback' in window) {
        idleCallbackId = window.requestIdleCallback(() => setShowGlobe(true), { timeout: 1400 });
      } else {
        setShowGlobe(true);
      }
    }, 500);

    return () => {
      window.clearTimeout(timer);
      if (idleCallbackId !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleCallbackId);
      }
    };
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
  const portraitUrl = resolveMediaUrl(
    profile?.profileImage,
    createMonogramFallback(profile?.fullName || 'MM', {
      subtitle: 'Developer',
      background: ['#241116', '#6f2630'],
      accent: '#f5a78d',
      size: 720,
    })
  );

  return (
    <section ref={heroRef} className="relative mx-auto flex min-h-screen max-w-7xl items-center overflow-hidden px-4 pt-28 pb-16 sm:px-6 sm:pt-32 sm:pb-20">
      <div aria-hidden="true" className="pointer-events-none absolute left-[-0.04em] top-[17%] z-0 select-none whitespace-nowrap text-[clamp(5.5rem,17vw,15rem)] font-black uppercase leading-none tracking-[-0.095em] text-transparent [-webkit-text-stroke:1px_rgba(244,63,94,0.17)]">
        PORTFOLIO
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(190,45,55,0.16),transparent_44%)]" />
      <div aria-hidden="true" className="absolute left-1/2 top-[48%] z-[1] aspect-square w-[min(118vw,900px)] -translate-x-1/2 -translate-y-1/2 opacity-25 mix-blend-screen sm:opacity-35">
        {showGlobe ? (
          <Suspense fallback={<GlobePlaceholder />}>
            <EarthCanvas autoRotate={heroInView && reduceMotion === false} />
          </Suspense>
        ) : (
          <GlobePlaceholder />
        )}
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_46%,transparent_25%,rgba(8,9,12,0.16)_62%,rgba(8,9,12,0.6)_100%)]" />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative z-10 grid w-full items-center gap-10 lg:grid-cols-[1.08fr_0.82fr] lg:gap-14"
      >
        <motion.div variants={fadeInLeft} className="relative flex gap-5">
          <div className="mt-2 hidden flex-col items-center sm:flex">
            <div className="h-5 w-5 rounded-full bg-rose-300 shadow-[0_0_35px_rgba(251,113,133,0.5)]" />
            <div className="mt-2 h-72 w-[2px] rounded-full bg-gradient-to-b from-rose-300 via-red-500/70 to-transparent" />
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-400/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.3em] text-rose-100 shadow-[0_0_35px_rgba(244,63,94,0.08)]">
              <span className="h-2 w-2 rounded-full bg-rose-300" />
              {profile?.availability || 'Open to opportunities'}
            </div>

            <div className="space-y-5">
              <p className="text-sm font-mono uppercase tracking-[0.35em] text-rose-200/65">
                Independent developer · Portfolio
              </p>
              <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-5xl xl:text-7xl">
                Hi, I&apos;m{' '}
                <span className="bg-gradient-to-r from-rose-200 via-red-300 to-orange-200 bg-clip-text text-transparent">
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
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#e5484d,#a92335)] px-6 py-3 font-semibold text-white shadow-[0_18px_45px_rgba(165,35,53,0.28)] transition hover:brightness-110 sm:w-auto"
              >
                View Projects
                <ArrowRight size={18} />
              </a>
              <a
                href="#contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 font-semibold text-slate-100 transition hover:border-rose-300/25 hover:bg-white/[0.08] sm:w-auto"
              >
                Let&apos;s Talk
                <Mail size={18} />
              </a>
              {profile?.resume ? (
                <a
                  href="#resume"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-rose-300/20 bg-rose-400/10 px-6 py-3 font-semibold text-rose-100 transition hover:bg-rose-400/15 sm:w-auto"
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
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200 transition hover:border-rose-300/30 hover:bg-rose-400/10"
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
                className="portfolio-panel p-4 sm:p-5"
              >
                <div className="grid items-center gap-4 sm:grid-cols-[104px_minmax(0,1fr)] sm:gap-5">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl sm:aspect-square">
                    <SafeImage src={featuredImage} fallbackSrc={createProjectImageFallback(featuredProject.title)} alt={`${featuredProject.title} project preview`} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#100a0c]/45 to-transparent" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-mono uppercase tracking-[0.28em] text-rose-200/65">{featuredProject.featured ? 'Featured project' : 'Selected work'}<span className="px-2 text-rose-100/25">/</span>{(featuredProject.status || 'completed').replace('-', ' ')}</p>
                    <h3 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">{featuredProject.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300/75">{featuredProject.shortDescription || featuredProject.description}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <a href="#projects" className="inline-flex items-center gap-2 text-xs font-semibold text-rose-100 transition hover:text-white">
                        Explore case study <ArrowRight size={14} />
                      </a>
                      {featuredProject.liveLink ? (
                        <a href={featuredProject.liveLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-semibold text-orange-100/80 transition hover:text-orange-100">
                          Live preview <ExternalLink size={13} />
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

        <motion.div variants={fadeInRight} className="relative mx-auto w-full max-w-[430px] lg:mr-2">
          <div className="portfolio-panel relative mx-auto aspect-[0.82] w-[min(76vw,360px)] p-2 sm:w-[390px] lg:w-full">
            <SafeImage
              src={portraitUrl}
              fallbackSrc={createMonogramFallback(profile?.fullName || 'MM', { subtitle: 'Developer', background: ['#241116', '#6f2630'], accent: '#f5a78d', size: 720 })}
              alt={`${profile?.fullName || 'Portfolio owner'} portrait`}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-full w-full border border-white/10 object-cover object-center"
            />
            <div aria-hidden="true" className="absolute inset-2 bg-[linear-gradient(180deg,rgba(8,9,12,0.12)_28%,rgba(8,9,12,0.78)_100%)]" />
            <div className="absolute inset-x-2 bottom-2 border-t border-white/15 bg-[#080809]/85 p-4 sm:p-5">
              <p className="portfolio-panel-label">Profile / {profile?.title || 'Developer'}</p>
              <p className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">{profile?.fullName || 'Md Mihran Sohail'}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
