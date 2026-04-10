const Projects = ({ projects, loading }) => {
  return (
    <section id="projects" className="scroll-mt-28 py-24">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/75">
            Projects
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Selected work with strong visual and engineering intent.
          </h2>
        </div>
        <p className="max-w-xl text-white/60">
          Each project card is sourced from the backend so your portfolio can
          evolve without reworking the frontend every time.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-[380px] animate-pulse rounded-[2rem] border border-white/10 bg-white/5"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-10 text-center text-white/60">
          No projects added yet. Use the admin panel to start building the
          portfolio story.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <article
              key={project._id}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-cyan-300/25"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_35%)] opacity-0 transition group-hover:opacity-100" />

              <div className="relative z-10">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/55">
                    0{index + 1}
                  </span>
                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                    {project.status || "completed"}
                  </span>
                </div>

                <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/60">
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(14,165,233,0.05),rgba(16,185,129,0.12))] text-lg font-semibold text-white/55">
                      Visual coming soon
                    </div>
                  )}
                </div>

                <h3 className="mt-5 text-2xl font-bold">{project.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  {project.shortDescription || project.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {project.githubLink ? (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
                    >
                      GitHub
                    </a>
                  ) : null}
                  {project.liveLink ? (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                    >
                      Live Demo
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default Projects;
