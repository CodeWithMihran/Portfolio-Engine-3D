import { motion } from 'framer-motion';
import { Code2, ExternalLink } from 'lucide-react';
import SectionIntro from '../components/SectionIntro';
import { fadeInUp, staggerContainer } from '../lib/motion';
import { useStore } from '../store/useStore';

void motion;

export default function Projects() {
  const featuredProjects = useStore((state) => state.featuredProjects);
  const projects = useStore((state) => state.projects);
  const visibleProjects = featuredProjects.length ? featuredProjects : projects.slice(0, 6);

  return (
    <section id="projects" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
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
        className="grid grid-cols-1 gap-6 md:grid-cols-12"
      >
        {visibleProjects.map((project, index) => (
          <motion.div
            key={project._id}
            variants={fadeInUp}
            className={`relative group rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10 ${
              index === 0 ? 'md:col-span-8' : 'md:col-span-4'
            }`}
          >
            <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.12),transparent_26%)] opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] text-violet-100">
                    {project.status || 'completed'}
                  </span>
                  {project.featured ? (
                    <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] text-emerald-100">
                      featured
                    </span>
                  ) : null}
                </div>
                <h3 className="mb-3 text-2xl font-bold transition-colors group-hover:text-blue-400">
                  {project.title}
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-slate-400">
                  {project.shortDescription || project.description}
                </p>
                <div className="mb-8 flex flex-wrap gap-2">
                  {(project.technologies || []).slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-wider"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white">
                    <Code2 size={20} />
                  </a>
                )}
                {project.liveLink && (
                  <a href={project.liveLink} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white">
                    <ExternalLink size={20} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
