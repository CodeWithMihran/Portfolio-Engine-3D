import React from "react";
import { motion } from "framer-motion";

const socialItems = [
  { key: "github", label: "GitHub", icon: "01" },
  { key: "linkedin", label: "LinkedIn", icon: "02" },
  { key: "twitter", label: "Twitter", icon: "03" },
  { key: "instagram", label: "Instagram", icon: "04" },
  { key: "website", label: "Portfolio", icon: "05" },
];

const About = ({ profile, socialLinks }) => {
  const links = profile?.socialLinks || {};
  const visibleLinks =
    socialLinks ||
    socialItems
      .map((item) => ({ ...item, value: links[item.key] }))
      .filter((item) => item.value && item.value.trim());

  // Animation variants for staggered reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id="about" className="relative scroll-mt-32 py-24">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid gap-8 lg:grid-cols-[1fr_0.8fr]"
      >
        
        {/* --- LEFT COLUMN: CORE STORY --- */}
        <motion.div 
          variants={itemVariants}
          className="group relative overflow-hidden rounded-[3rem] border border-white/10 bg-slate-950/40 p-10 backdrop-blur-2xl transition-all hover:border-cyan-400/20"
        >
          {/* Subtle Background Glow */}
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/5 blur-[80px] transition-all group-hover:bg-cyan-500/10" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-cyan-400/50" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400">
                Identity Profile
              </p>
            </div>
            
            <h2 className="mt-6 text-4xl font-black leading-tight tracking-tighter text-white sm:text-6xl">
              Architecting <span className="text-cyan-400">Digital</span> Realities.
            </h2>

            {profile?.about ? (
              <p className="mt-8 text-lg leading-relaxed text-white/60">
                {profile.about}
              </p>
            ) : (
              <p className="mt-8 text-lg leading-relaxed text-white/60 italic">
                A visual-first developer merging high-performance logic with cinematic 3D experiences.
              </p>
            )}

            {/* Stats/Info HUD */}
            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {profile?.location && (
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 transition-all hover:bg-white/[0.06]">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Current Base</p>
                  <p className="mt-2 font-mono text-sm font-semibold text-cyan-200">{profile.location}</p>
                </div>
              )}
              {profile?.availability && (
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 transition-all hover:bg-white/[0.06]">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">System Status</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                    <p className="text-sm font-bold text-white/90">{profile.availability}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* --- RIGHT COLUMN: POSITIONING & CONNECT --- */}
        <div className="flex flex-col gap-8">
          
          {/* Tagline/Bio Card */}
          {profile?.bio && (
            <motion.div 
              variants={itemVariants}
              className="rounded-[2.5rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/10 to-transparent p-8 backdrop-blur-xl"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-[10px] font-black text-cyan-400">
                TAG
              </div>
              <p className="text-2xl font-bold leading-snug tracking-tight text-white/90 italic">
                "{profile.bio}"
              </p>
            </motion.div>
          )}

          {/* Social Network Card */}
          {visibleLinks.length > 0 && (
            <motion.div 
              variants={itemVariants}
              className="flex-1 rounded-[2.5rem] border border-white/10 bg-slate-950/40 p-8 backdrop-blur-2xl"
            >
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Frequency</p>
                  <h3 className="mt-1 text-2xl font-bold text-white">Social Nodes</h3>
                </div>
                <div className="font-mono text-[10px] text-cyan-400/40">LINKED_STABLE</div>
              </div>

              <div className="grid gap-3">
                {visibleLinks.map((item) => (
                  <a
                    key={item.key}
                    href={item.value}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-5 py-4 transition-all hover:border-cyan-400/30 hover:bg-cyan-500/[0.05]"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[10px] text-white/20 group-hover:text-cyan-400">
                        {item.icon}
                      </span>
                      <p className="text-xs font-black uppercase tracking-widest text-white/60 group-hover:text-white">
                        {item.label}
                      </p>
                    </div>
                    <svg className="h-4 w-4 -rotate-45 text-white/20 transition-all group-hover:rotate-0 group-hover:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default About;