import React from "react";
import { motion } from "framer-motion";

const Education = ({ educations, loading }) => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <section id="education" className="relative scroll-mt-32 py-24">
      {/* --- Section Header --- */}
      <div className="mb-16">
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-12 bg-cyan-400/50" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400">
            Neural.Foundations
          </p>
        </div>
        <h2 className="mt-6 text-4xl font-black leading-tight tracking-tighter text-white sm:text-6xl">
          Academic <span className="text-cyan-400">Timeline</span>.
        </h2>
      </div>

      {loading ? (
        /* --- Cinematic Loading State --- */
        <div className="space-y-8">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-[2.5rem] border border-white/5 bg-white/[0.02]"
            />
          ))}
        </div>
      ) : (
        /* --- Education Timeline --- */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative space-y-8"
        >
          {/* Vertical Path Line */}
          <div className="absolute left-[39px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-cyan-500/50 via-white/10 to-transparent hidden md:block" />

          {educations.map((item) => (
            <motion.article
              key={item._id}
              variants={itemVariants}
              className="group relative flex flex-col md:flex-row gap-8 rounded-[2.5rem] border border-white/10 bg-slate-950/40 p-8 backdrop-blur-2xl transition-all duration-500 hover:border-cyan-400/40 hover:bg-slate-950/60"
            >
              {/* Chrono Indicator (Data Node) */}
              <div className="relative z-10 hidden md:flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/40 shadow-inner group-hover:border-cyan-400/50 transition-colors">
                 <div className="text-center">
                    <p className="text-[10px] font-black text-cyan-400 uppercase leading-none">Year</p>
                    <p className="mt-1 font-mono text-xs font-bold text-white/70">
                        {item.startDate ? new Date(item.startDate).getFullYear() : '??'}
                    </p>
                 </div>
                 {/* Glowing Center Dot */}
                 <div className="absolute -left-[45px] h-3 w-3 rounded-full bg-slate-950 border-2 border-cyan-400 shadow-[0_0_10px_#22d3ee] z-20" />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400/60">
                      {item.institutionName}
                    </p>
                    <h3 className="mt-1 text-2xl font-bold tracking-tight text-white group-hover:text-cyan-50 transition-colors">
                      {item.degree}
                    </h3>
                    <p className="mt-1 font-medium text-white/50">{item.fieldOfStudy}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {item.currentlyStudying ? (
                      <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 border border-emerald-500/20 text-[10px] font-black uppercase text-emerald-400 tracking-widest animate-pulse">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        In Progress
                      </span>
                    ) : (
                      <span className="rounded-full bg-white/5 px-3 py-1 border border-white/10 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        Completed
                      </span>
                    )}
                    <p className="font-mono text-[10px] text-white/30 uppercase tracking-tighter">
                       {formatDate(item.startDate)} — {item.currentlyStudying ? "Present" : formatDate(item.endDate)}
                    </p>
                  </div>
                </div>

                {item.description && (
                  <p className="mt-6 text-sm leading-8 text-white/60 group-hover:text-white/80 transition-colors max-w-3xl">
                    {item.description}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  {item.location && (
                    <div className="flex items-center gap-2 rounded-xl bg-white/[0.03] px-4 py-2 border border-white/5 transition-colors group-hover:bg-white/[0.05]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-cyan-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white/60">{item.location}</span>
                    </div>
                  )}
                  {item.grade && (
                    <div className="flex items-center gap-2 rounded-xl bg-cyan-500/5 px-4 py-2 border border-cyan-500/10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Performance:</span>
                      <span className="text-[10px] font-mono font-bold text-white/80">{item.grade}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Corner Visual Decoration */}
              <div className="absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl from-cyan-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-tr-[2.5rem]" />
            </motion.article>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default Education;