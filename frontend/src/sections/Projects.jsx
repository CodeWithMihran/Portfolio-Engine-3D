import { createElement } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Code2, ExternalLink, Play } from 'lucide-react';
import EmptyStatePanel from '../components/EmptyStatePanel';
import SectionIntro from '../components/SectionIntro';
import SafeImage from '../components/SafeImage';
import { createProjectImageFallback, resolveMediaUrl } from '../lib/media';
import { fadeInUp, staggerContainer } from '../lib/motion';
import { useStore } from '../store/useStore';

void motion;

const getProjectImage = (project) =>
  resolveMediaUrl(
    project.thumbnail || project.images?.[0],
    createProjectImageFallback(project.title)
  );

function ProjectLinks({ project }) {
  const links = [
    project.liveLink && {
      href: project.liveLink,
      label: 'Live project',
      icon: ExternalLink,
      primary: true,
    },
    project.githubLink && {
      href: project.githubLink,
      label: 'Source code',
      icon: Code2,
    },
    project.videoDemo && {
      href: project.videoDemo,
      label: 'Watch demo',
      icon: Play,
    },
  ].filter(Boolean);

  if (!links.length) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {links.map(({ href, label, icon: Icon, primary }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          className={primary
            ? 'inline-flex items-center gap-2 border border-rose-300/25 bg-rose-400/15 px-3 py-2 text-xs font-semibold text-rose-50 transition hover:bg-rose-400/25'
            : 'inline-flex items-center gap-2 border border-white/10 bg-white/[0.03] px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-rose-300/25 hover:text-white'}
        >
          {createElement(Icon, { size: 15 })}
          {label}
          <ArrowUpRight size={14} className="opacity-60" />
        </a>
      ))}
    </div>
  );
}

function StoryBlock({ title, children, tone = 'rose' }) {
  if (!children) return null;
  const accent = tone === 'amber' ? 'text-orange-100/65' : 'text-rose-100/65';

  return (
    <div className="border-l border-white/10 pl-4 sm:pl-5">
      <p className={`text-[10px] font-mono uppercase tracking-[0.28em] ${accent}`}>{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-300/85">{children}</p>
    </div>
  );
}

function FeaturedCaseStudy({ project }) {
  const image = getProjectImage(project);
  const gallery = (project.images || []).filter((item) => item && item !== project.thumbnail).slice(0, 3);
  const technologies = (project.technologies || []).filter(Boolean);
  const impactPoints = Array.isArray(project.impactPoints)
    ? project.impactPoints.filter((point) => typeof point === 'string' && point.trim())
    : [];
  const metrics = Array.isArray(project.metrics)
    ? project.metrics.filter((metric) => metric?.label?.trim() && metric?.value?.trim())
    : [];
  const problem = project.problem || project.challenges;
  const storyBlocks = [
    { title: 'Context', body: problem },
    { title: 'Approach', body: project.approach },
    { title: 'Outcome', body: project.outcome, tone: 'amber' },
  ].filter((block) => block.body?.trim());

  return (
    <motion.article
      variants={fadeInUp}
      className="portfolio-panel"
    >
      <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
        <div className="group relative min-h-[250px] overflow-hidden sm:min-h-[340px] lg:min-h-[430px]">
          <SafeImage
            src={image}
            fallbackSrc={createProjectImageFallback(project.title)}
            alt={`${project.title} project preview`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,10,0.04)_15%,rgba(10,8,10,0.85)_100%)]" />
          <div className="absolute inset-x-5 top-5 flex flex-wrap items-center justify-between gap-3 sm:inset-x-7 sm:top-7">
            <span className="border border-rose-300/30 bg-black/70 px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.22em] text-rose-200 backdrop-blur-md">
              {project.featured ? 'Featured project' : 'Selected project'}
            </span>
            <span className="border border-white/15 bg-black/70 px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-white/80 backdrop-blur-md">
              {(project.status || 'completed').replace('-', ' ')}
            </span>
          </div>
          <div className="absolute inset-x-5 bottom-5 sm:inset-x-7 sm:bottom-7">
            <p className="portfolio-panel-label">Flagship deployment</p>
            <p className="mt-2 max-w-xl text-2xl font-black tracking-tight text-white sm:text-3xl">{project.title}</p>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-5 py-7 sm:gap-6 sm:py-10 sm:pl-8 lg:py-14 lg:pl-12">
          <div>
            <p className="portfolio-panel-label">The project</p>
            <h3 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">{project.title}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300/80 sm:text-base">
              {project.shortDescription || project.description}
            </p>
          </div>

          {project.role ? (
            <p className="text-sm text-slate-400">
              <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.22em] text-orange-100/65">Role</span>
              {project.role}
            </p>
          ) : null}

          {technologies.length ? (
            <div className="flex flex-wrap gap-2">
              {technologies.slice(0, 8).map((technology) => (
                <span key={`${project._id}-${technology}`} className="border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                  {technology}
                </span>
              ))}
            </div>
          ) : null}

          <ProjectLinks project={project} />
        </div>
      </div>

      {storyBlocks.length ? (
        <div className={`grid gap-6 border-t border-white/[0.07] px-5 py-6 sm:px-8 sm:py-8 ${storyBlocks.length > 1 ? 'md:grid-cols-2 xl:grid-cols-3' : ''}`}>
          {storyBlocks.map((block) => (
            <StoryBlock key={block.title} title={block.title} tone={block.tone}>
              {block.body}
            </StoryBlock>
          ))}
        </div>
      ) : null}

      {impactPoints.length ? (
        <div className="border-t border-white/[0.07] px-5 py-6 sm:px-8 sm:py-8">
          <p className="text-[10px] font-mono uppercase tracking-[0.28em] text-rose-100/65">Selected contributions</p>
          <ul className="mt-4 grid gap-x-8 md:grid-cols-2">
            {impactPoints.slice(0, 4).map((point, index) => (
              <li key={`${index}-${point}`} className="flex gap-3 border-b border-white/[0.07] py-4 text-sm leading-6 text-slate-200/90">
                <span className="mt-0.5 font-mono text-xs text-rose-300/80">0{index + 1}</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {metrics.length ? (
        <dl className="grid grid-cols-2 border-t border-white/[0.07] sm:grid-cols-3 lg:grid-cols-4">
          {metrics.slice(0, 4).map((metric) => (
            <div key={`${metric.label}-${metric.value}`} className="border-b border-r border-white/[0.06] px-5 py-5 last:border-r-0 sm:px-8 sm:py-6">
              <dt className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">{metric.label}</dt>
              <dd className="mt-2 break-words text-xl font-black tracking-tight text-orange-100 sm:text-2xl">{metric.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {project.learnings ? (
        <div className="border-t border-white/[0.07] px-5 py-5 sm:px-8">
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500">Project notes</p>
          <p className="mt-2 text-sm leading-7 text-slate-400">{project.learnings}</p>
        </div>
      ) : null}

      {gallery.length ? (
        <div className="grid grid-cols-2 gap-2 border-t border-white/[0.07] p-3 sm:grid-cols-3 sm:gap-3 sm:p-5">
          {gallery.map((asset, index) => (
            <SafeImage
              key={`${project._id}-gallery-${asset}`}
              src={resolveMediaUrl(asset, createProjectImageFallback(project.title))}
              fallbackSrc={createProjectImageFallback(project.title)}
              alt={`${project.title} gallery view ${index + 1}`}
              loading="lazy"
              decoding="async"
              className="h-28 w-full rounded-2xl object-cover sm:h-40"
            />
          ))}
        </div>
      ) : null}
    </motion.article>
  );
}

function ProjectCard({ project }) {
  const technologies = (project.technologies || []).filter(Boolean).slice(0, 4);
  const impact = Array.isArray(project.impactPoints) ? project.impactPoints.filter(Boolean).slice(0, 2) : [];

  return (
    <motion.article variants={fadeInUp} className="portfolio-panel group min-w-0 p-4 sm:p-5">
      <p className="portfolio-panel-label mb-3">{project.featured ? 'Featured work' : 'Project'}<span className="px-2 text-rose-100/30">/</span>{(project.status || 'completed').replace('-', ' ')}</p>
      <div className="relative aspect-[16/10] overflow-hidden border border-white/10">
        <SafeImage src={getProjectImage(project)} fallbackSrc={createProjectImageFallback(project.title)} alt={`${project.title} preview`} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute inset-x-5 bottom-4 flex items-end justify-between gap-3">
          <h3 className="text-xl font-black text-white sm:text-2xl">{project.title}</h3>
          <span className="shrink-0 border border-rose-300/25 bg-black/60 px-2 py-1 text-[9px] font-mono uppercase tracking-[0.18em] text-rose-100 backdrop-blur">{(project.status || 'completed').replace('-', ' ')}</span>
        </div>
      </div>

      <div className="space-y-4 pt-5">
        {project.role ? <p className="portfolio-panel-label">{project.role}</p> : null}
        <p className="text-sm leading-7 text-slate-300/80">{project.shortDescription || project.description}</p>
        {technologies.length ? (
          <div className="flex flex-wrap gap-2">
            {technologies.map((technology) => <span key={`${project._id}-${technology}`} className="border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[9px] uppercase tracking-[0.14em] text-slate-300">{technology}</span>)}
          </div>
        ) : null}
        {project.outcome ? <StoryBlock title="Outcome" tone="amber">{project.outcome}</StoryBlock> : null}
        {impact.length ? (
          <ul className="space-y-2 border-t border-white/10 pt-3">
            {impact.map((point, index) => <li key={`${index}-${point}`} className="flex gap-2 text-sm leading-6 text-slate-300"><span className="text-rose-300">/</span>{point}</li>)}
          </ul>
        ) : null}
        <ProjectLinks project={project} />
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const featuredProjects = useStore((state) => state.featuredProjects);
  const projects = useStore((state) => state.projects);
  const flagship = featuredProjects[0] || projects[0] || null;
  const otherProjects = projects
    .filter((project) => project._id !== flagship?._id)
    .slice(0, 6);

  return (
    <section id="projects" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24">
      <SectionIntro
        eyebrow="Selected work"
        title="Flagship"
        accent="Deployments"
        body="A closer look at the problem, the decisions behind the build, and the outcomes that can be substantiated."
      />

      {flagship ? (
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.08 }}>
          <FeaturedCaseStudy project={flagship} />

          {otherProjects.length ? (
        <div className="mt-16 pt-10 sm:mt-20 sm:pt-12">
              <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-rose-200/60">More work</p>
                  <h3 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">Other selected projects</h3>
                </div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500">{otherProjects.length} projects</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {otherProjects.map((project) => <ProjectCard key={project._id} project={project} />)}
              </div>
            </div>
          ) : null}
        </motion.div>
      ) : (
        <EmptyStatePanel
          eyebrow="Project space"
          title="Your flagship case study will appear here."
          body="Publish a project from the admin console. Add a thumbnail, problem, approach, outcome, and any verified impact points or metrics you want visitors to see."
          ctaLabel="Add a project"
          ctaHref="/login"
          tone="red"
        />
      )}
    </section>
  );
}
