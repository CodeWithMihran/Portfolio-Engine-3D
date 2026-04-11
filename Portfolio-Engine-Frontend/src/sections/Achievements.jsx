import React from "react";
import { motion } from "framer-motion";

const Achievements = ({ achievements, loading }) => {
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
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section id="achievements" className="relative scroll-mt-32 py-24">
      {/* --- Section Header --- */}
      <div className="mb-16">
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-12 bg-cyan-400/50" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400">
            Archive.Records
          </p>
        </div>
        <h2 className="mt-6 text-4xl font-black leading-tight tracking-tighter text-white sm:text-6xl">
          Major <span className="text-cyan-400">Milestones</span>.
        </h2>
      </div>

      {loading ? (
        /* --- Cinematic Loading State --- */
        <div className="grid gap-8 lg:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-[3rem] border border-white/5 bg-white/[0.02]"
            />
          ))}
        </div>
      ) : (
        /* --- Achievement Vault --- */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 lg:grid-cols-2"
        >
          {achievements.map((item) => (
            <motion.article
              key={item._id}
              variants={cardVariants}
              className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/40 p-8 backdrop-blur-2xl transition-all hover:border-cyan-400/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              {/* Top Accent Decoration */}
              <div className="absolute right-0 top-0 h-24 w-24 translate-x-12 translate-y-[-12px] rotate-45 bg-cyan-500/5 transition-all group-hover:bg-cyan-500/15" />

              <div className="relative z-10">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400/60">
                      {item.type || "Recognition"}
                    </p>
                    <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-cyan-100">
                      {item.title}
                    </h3>
                  </div>

                  {item.position && (
                    <div className="flex flex-col items-end">
                      <span className="rounded-full bg-cyan-400/10 border border-cyan-400/20 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                        {item.position}
                      </span>
                    </div>
                  )}
                </div>

                {item.description && (
                  <p className="mt-6 text-sm leading-7 text-white/50 line-clamp-3 group-hover:text-white/70 transition-colors">
                    {item.description}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-white/5 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-white/20" />
                    <p className="text-xs font-bold uppercase tracking-widest text-white/30">
                      {item.issuer || "Independent"}
                    </p>
                    {item.date && (
                        <p className="text-[10px] font-mono text-white/20 uppercase tracking-tighter">
                            // {new Date(item.date).getFullYear()}
                        </p>
                    )}
                  </div>

                  {item.certificateURL && (
                    <a
                      href={item.certificateURL}
                      target="_blank"
                      rel="noreferrer"
                      className="group/btn relative flex items-center gap-2 overflow-hidden rounded-xl bg-white/5 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-white hover:text-black active:scale-95"
                    >
                      <span className="relative z-10">View Artifact</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="h-3 w-3 relative z-10"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default Achievements;