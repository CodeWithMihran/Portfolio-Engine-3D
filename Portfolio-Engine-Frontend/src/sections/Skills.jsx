import React, { useMemo } from "react";
import { motion } from "framer-motion";

const categoryTitles = {
  frontend: "Frontend Architecture",
  backend: "Logic Engines",
  database: "Data Clusters",
  programming: "Core Synthetics",
  tools: "Workflow Modules",
  other: "Auxiliary Systems",
};

const Skills = ({ skills, loading }) => {
  // Memoize grouped skills for performance
  const groupedSkills = useMemo(() => {
    return skills.reduce((acc, skill) => {
      const category = skill.category || "other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    }, {});
  }, [skills]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section id="skills" className="relative scroll-mt-32 py-24">
      {/* --- Section Header --- */}
      <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-cyan-400/50" />
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400">
              Technical.Capacities
            </p>
          </div>
          <h2 className="mt-6 text-4xl font-black leading-tight tracking-tighter text-white sm:text-6xl">
            Integrated <span className="text-cyan-400">Stacks</span>.
          </h2>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-md text-sm font-medium leading-relaxed text-white/40"
        >
          Dynamic technical grouping managed through the MERN engine, 
          optimizing for real-time performance and scalability.
        </motion.p>
      </div>

      {loading ? (
        /* --- Cinematic Loading HUD --- */
        <div className="grid gap-8 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-[2.5rem] border border-white/5 bg-white/[0.02]"
            />
          ))}
        </div>
      ) : Object.keys(groupedSkills).length === 0 ? (
        /* --- Empty State --- */
        <div className="rounded-[3rem] border border-dashed border-white/10 bg-white/[0.02] p-20 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/30">
            No technical nodes detected in primary database.
          </p>
        </div>
      ) : (
        /* --- Skill Clusters --- */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 lg:grid-cols-2"
        >
          {Object.entries(groupedSkills).map(([category, items]) => (
            <motion.div
              key={category}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/40 p-8 backdrop-blur-2xl transition-all duration-500 hover:border-cyan-400/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              {/* Category Header */}
              <div className="mb-10 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
                      Module Cluster
                    </p>
                  </div>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-white group-hover:text-cyan-100 transition-colors">
                    {categoryTitles[category] || category}
                  </h3>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 font-mono text-[10px] font-bold text-cyan-400/60 transition-colors group-hover:bg-cyan-400/10 group-hover:text-cyan-400">
                  {items.length} ACTIVE_NODES
                </div>
              </div>

              {/* Skills Progress Grid */}
              <div className="space-y-6">
                {items.map((skill) => (
                  <div key={skill._id} className="group/skill">
                    <div className="mb-3 flex items-end justify-between">
                      <p className="text-xs font-black uppercase tracking-widest text-white/70 group-hover/skill:text-white transition-colors">
                        {skill.name}
                      </p>
                      <span className="font-mono text-[10px] text-white/30 group-hover/skill:text-cyan-400 transition-colors">
                        {skill.proficiency || 0}%
                      </span>
                    </div>

                    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                      {/* Animated Skill Meter */}
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.proficiency || 0}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
                        className="relative h-full rounded-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-emerald-400"
                      >
                        {/* Meter Pulse Effect */}
                        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)] animate-shine" />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Background HUD Accent */}
              <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-cyan-500/5 blur-[60px] transition-all group-hover:bg-cyan-500/10" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default Skills;