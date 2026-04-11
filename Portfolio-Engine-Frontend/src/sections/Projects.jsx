import { motion, AnimatePresence } from "framer-motion";

const Projects = ({ projects, loading }) => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="projects" className="relative scroll-mt-32 py-24">
      {/* --- Header Section --- */}
      <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-cyan-400/50" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400">
              Selected.Deployments
            </p>
          </div>
          <h2 className="mt-6 text-4xl font-black leading-tight tracking-tighter text-white sm:text-6xl">
            Engineering <span className="text-cyan-400">Artifacts</span>.
          </h2>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-md text-sm font-medium leading-relaxed text-white/40"
        >
          A curated collection of full-stack systems and 3D experiences, 
          synced directly from the core database.
        </motion.p>
      </div>

      {loading ? (
        /* --- Cinematic Skeleton Loader --- */
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[450px] animate-pulse rounded-[2.5rem] border border-white/5 bg-white/[0.02]"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        /* --- Empty State HUD --- */
        <div className="rounded-[3rem] border border-dashed border-white/10 bg-white/[0.02] p-20 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-white/20">
            Error: No artifacts found in current sector.
          </p>
        </div>
      ) : (
        /* --- Project Grid --- */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project, index) => (
            <motion.article
              key={project._id}
              variants={cardVariants}
              className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/40 backdrop-blur-2xl transition-all duration-500 hover:border-cyan-400/30 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            >
              {/* Image / Visual Header */}
              <div className="relative h-60 w-full overflow-hidden">
                <AnimatePresence>
                  {project.thumbnail ? (
                    <motion.img
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      src={project.thumbnail}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-900/20 via-slate-900 to-black">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/20">No Visual Record</p>
                    </div>
                  )}
                </AnimatePresence>
                
                {/* HUD Overlay elements on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                <div className="absolute left-6 top-6">
                  <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 font-mono text-[9px] text-white/40 backdrop-blur-md">
                    REF_0{index + 1}
                  </span>
                </div>
                {project.status && (
                  <div className="absolute right-6 top-6">
                    <span className="flex items-center gap-1.5 rounded-full bg-cyan-400/10 px-3 py-1 border border-cyan-400/20 text-[9px] font-black uppercase tracking-widest text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                      <span className="h-1 w-1 rounded-full bg-cyan-400 animate-pulse" />
                      {project.status}
                    </span>
                  </div>
                )}
              </div>

              {/* Project Details */}
              <div className="flex flex-1 flex-col p-8">
                <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-cyan-100 transition-colors">
                  {project.title}
                </h3>
                
                <p className="mt-4 text-sm leading-relaxed text-white/50 group-hover:text-white/70 transition-colors line-clamp-3">
                  {project.shortDescription || project.description}
                </p>

                {/* Tech Stack Shards */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.technologies?.slice(0, 4).map((tech, i) => (
                    <span key={i} className="rounded-lg bg-white/[0.03] px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-white/30 border border-white/5">
                      {tech}
                    </span>
                  ))}
                  {project.technologies?.length > 4 && (
                    <span className="text-[9px] font-bold text-white/10">+{project.technologies.length - 4}</span>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="mt-auto flex items-center gap-3 pt-8">
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center rounded-xl bg-cyan-500 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 transition-all hover:bg-cyan-400 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                    >
                      Initialize
                    </a>
                  )}
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:border-cyan-400/40 hover:text-cyan-400 hover:bg-cyan-400/5 text-white/40"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Interactive Hover Light Effect */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(34,211,238,0.02)_1px,transparent_1px)] bg-[size:100%_4px] opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.article>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default Projects;