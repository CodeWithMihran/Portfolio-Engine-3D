import { motion } from 'framer-motion';
import { Code2, ExternalLink } from 'lucide-react';
import EmptyStatePanel from '../components/EmptyStatePanel';
import SectionIntro from '../components/SectionIntro';
import { createProjectImageFallback, resolveMediaUrl } from '../lib/media';
import { fadeInUp, staggerContainer } from '../lib/motion';
import { useStore } from '../store/useStore';

const projectHighlights = (project) =>
  [project?.challenges, project?.learnings]
    .flatMap((value) =>
      String(value || '')
        .split(/\r?\n|[.!?]+/)
        .map((item) => item.trim())
        .filter(Boolean)
    )
    .filter((item, index, array) => array.indexOf(item) === index)
    .slice(0, 3);

void motion;

export default function Projects() {
  const featuredProjects = useStore((state) => state.featuredProjects);
  const projects = useStore((state) => state.projects);
  const visibleProjects = featuredProjects.length ? featuredProjects : projects.slice(0, 6);

  return (
    <section id="projects" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24">
      <SectionIntro
        eyebrow="My Work"
        title="Selected"
        accent="Projects"
        body="A showcase of practical builds, product thinking, and real implementation choices shaped by different goals, stacks, and constraints."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 gap-6 xl:grid-cols-2"
      >
        {visibleProjects.length ? (
          visibleProjects.map((project) => {
            const image = resolveMediaUrl(
              project.thumbnail || project.images?.[0],
              createProjectImageFallback(project.title)
            );
            const highlights = projectHighlights(project);

            return (
              <motion.article
                key={project._id}
                variants={fadeInUp}
                className="group overflow-hidden rounded-[28px] border border-cyan-300/12 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(125,211,252,0.08),transparent_22%),linear-gradient(180deg,rgba(9,17,31,0.95),rgba(10,18,32,0.82))] shadow-[0_24px_70px_rgba(2,6,23,0.32)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:shadow-[0_30px_80px_rgba(34,211,238,0.1)] sm:rounded-[32px]"
              >
                <div className="relative h-48 overflow-hidden sm:h-56">
                  <img
                    src={image}
                    alt={project.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,17,31,0.08),rgba(7,17,31,0.8))]" />
                  <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-cyan-300/16 bg-slate-950/55 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] text-cyan-100">
                      {project.status || 'completed'}
                    </span>
                    {project.featured ? (
                      <span className="rounded-full border border-orange-300/16 bg-orange-400/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] text-orange-100">
                        Featured
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-2xl font-black text-white">{project.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-300/80">
                        {project.shortDescription || project.description}
                      </p>
                    </div>
                    {project.role ? (
                      <span className="rounded-full border border-orange-300/14 bg-orange-400/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] text-orange-100">
                        {project.role}
                      </span>
                    ) : null}
                  </div>

                  {project.technologies?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 6).map((tech) => (
                        <span
                          key={`${project._id}-${tech}`}
                          className="rounded-full border border-cyan-300/10 bg-cyan-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[24px] border border-white/8 bg-white/5 p-4">
                      <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-cyan-100/45">
                        Outcome
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-300/80">
                        {project.learnings ||
                          project.shortDescription ||
                          'A polished implementation focused on usability, clarity, and practical engineering tradeoffs.'}
                      </p>
                    </div>
                    <div className="rounded-[24px] border border-white/8 bg-white/5 p-4">
                      <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-orange-100/45">
                        Role
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-300/80">
                        {project.role ||
                          'End-to-end delivery across interface, interaction, and implementation details.'}
                      </p>
                    </div>
                  </div>

                  {highlights.length ? (
                    <div className="space-y-3">
                      {highlights.map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-4 py-3 text-sm leading-6 text-slate-200"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-3">
                    {project.githubLink ? (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-cyan-300/14 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/15"
                      >
                        <Code2 size={16} />
                        Source
                      </a>
                    ) : null}
                    {project.liveLink ? (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-orange-300/14 bg-orange-400/10 px-4 py-2 text-sm font-semibold text-orange-100 transition hover:bg-orange-400/15"
                      >
                        <ExternalLink size={16} />
                        Live Demo
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            );
          })
        ) : (
          <motion.div variants={fadeInUp} className="xl:col-span-2">
            <EmptyStatePanel
              eyebrow="Project Space"
              title="Project case studies will appear here once you publish them."
              body="Add projects from the admin console to populate this section with thumbnails, outcomes, stack details, and links."
              ctaLabel="Add Projects"
              ctaHref="/login"
              tone="cyan"
            />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
