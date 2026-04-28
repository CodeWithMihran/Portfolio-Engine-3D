import { Code2, ExternalLink } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Projects() {
  const featuredProjects = useStore((state) => state.featuredProjects);

  return (
    <section id="projects" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-white">
          Featured <span className="text-gradient">Creations</span>
        </h2>
        <p className="mt-4 text-slate-400">A curated selection of my most challenging work.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {featuredProjects.map((project, index) => (
          <div
            key={project._id}
            className={`bento-card relative group ${
              index === 0 ? 'md:col-span-8' : 'md:col-span-4'
            }`}
          >
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
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

            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 to-emerald-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </section>
  );
}
