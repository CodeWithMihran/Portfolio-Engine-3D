import React from "react";
import { motion } from "framer-motion";

const Experience = ({ experiences, loading }) => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { x: 30, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section id="experience" className="relative scroll-mt-32 py-24">
      {/* --- Section Header --- */}
      <div className="mb-16">
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-12 bg-emerald-400/50" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-400">
            Professional.Missions
          </p>
        </div>
        <h2 className="mt-6 text-4xl font-black leading-tight tracking-tighter text-white sm:text-6xl">
          Carrier <span className="text-emerald-400">Logbook</span>.
        </h2>
      </div>

      {loading ? (
        /* --- Cinematic Loading State --- */
        <div className="space-y-8">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-[3rem] border border-white/5 bg-white/[0.02]"
            />
          ))}
        </div>
      ) : (
        /* --- Experience Track --- */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative space-y-8"
        >
          {/* Vertical Mission Line */}
          <div className="absolute left-0 top-4 bottom-4 w-[2px] bg-gradient-to-b from-emerald-500/50 via-white/5 to-transparent hidden md:block" />

          {experiences.map((item) => (
            <motion.article
              key={item._id}
              variants={itemVariants}
              className="group relative ml-0 md:ml-12 flex flex-col rounded-[2.5rem] border border-white/10 bg-slate-950/40 p-8 backdrop-blur-2xl transition-all duration-500 hover:border-emerald-400/30 hover:bg-slate-950/60"
            >
              {/* Timeline Connector Dot */}
              <div className="absolute -left-[57px] top-10 hidden md:block">
                <div className="h-4 w-4 rounded-full bg-slate-950 border-2 border-emerald-400 shadow-[0_0_15px_#10b981] group-hover:scale-125 transition-transform" />
              </div>

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60">
                      {item.employmentType || "Contract"}
                    </p>
                    {item.currentlyWorking && (
                      <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
                        <span className="h-1 w-1 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[8px] font-black uppercase text-emerald-400">Active Duty</span>
                      </span>
                    )}
                  </div>
                  
                  <h3 className="mt-2 text-3xl font-bold tracking-tight text-white group-hover:text-emerald-50 transition-colors">
                    {item.role}
                  </h3>
                  <p className="mt-1 text-lg font-medium text-white/50">
                    {item.companyName}
                  </p>
                </div>

                <div className="text-left md:text-right space-y-1">
                  <div className="flex items-center md:justify-end gap-2 text-white/30 font-mono text-[10px] uppercase tracking-tighter">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(item.startDate)} — {item.currentlyWorking ? "Present" : formatDate(item.endDate)}
                  </div>
                  {item.location && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 italic">
                      {item.location}
                    </p>
                  )}
                </div>
              </div>

              {item.description && (
                <div className="mt-8 relative">
                   <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-emerald-400/20" />
                   <p className="pl-6 text-sm leading-8 text-white/60 group-hover:text-white/80 transition-colors max-w-4xl">
                    {item.description}
                  </p>
                </div>
              )}

              {/* Responsibilities Shards */}
              {item.responsibilities?.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {item.responsibilities.map((task, index) => (
                    <span
                      key={index}
                      className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/40 transition-all hover:border-emerald-400/30 hover:text-emerald-300"
                    >
                      {task}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Background HUD Scanline Effect */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:100%_4px] opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.article>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default Experience;