import React from "react";
import { motion } from "framer-motion";

const Certificates = ({ certificates, loading }) => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section id="certificates" className="relative scroll-mt-32 py-24">
      {/* --- Section Header --- */}
      <div className="mb-16">
        <div className="flex items-center gap-4">
          <div className="h-[1px] w-12 bg-cyan-400/50" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400">
            Verified.Credentials
          </p>
        </div>
        <h2 className="mt-6 text-4xl font-black leading-tight tracking-tighter text-white sm:text-6xl">
          Professional <span className="text-cyan-400">Logbook</span>.
        </h2>
      </div>

      {loading ? (
        /* --- Cinematic Loading State --- */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-[2.5rem] border border-white/5 bg-white/[0.02]"
            />
          ))}
        </div>
      ) : (
        /* --- Certificate Grid --- */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {certificates.map((item) => (
            <motion.article
              key={item._id}
              variants={cardVariants}
              className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/40 backdrop-blur-2xl transition-all duration-500 hover:border-cyan-400/40 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]"
            >
              {/* Image Header (if exists) */}
              {item.certificateImage && (
                <div className="relative h-44 w-full overflow-hidden border-b border-white/5">
                  <img
                    src={item.certificateImage}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                </div>
              )}

              <div className="flex flex-1 flex-col p-8">
                {/* Status Indicator */}
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400/60">
                    {item.issuer}
                  </p>
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
                    <div className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]" />
                    <span className="text-[8px] font-black uppercase text-emerald-400">Verified</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold leading-snug text-white group-hover:text-cyan-100 transition-colors">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="mt-4 text-xs leading-relaxed text-white/40 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {/* Metadata & Actions */}
                <div className="mt-auto pt-6">
                  {item.credentialId && (
                    <div className="mb-4 rounded-lg bg-white/[0.03] px-3 py-2 border border-white/5">
                      <p className="text-[9px] font-mono text-white/30 uppercase tracking-tighter">
                        Log_ID: {item.credentialId}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    {item.credentialURL && (
                      <a
                        href={item.credentialURL}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 text-center rounded-xl bg-cyan-500 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 transition-all hover:bg-cyan-400 active:scale-95 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                      >
                        Verify Record
                      </a>
                    )}
                    
                    {/* Date Tooltip-style display */}
                    {item.issueDate && (
                      <div className="rounded-xl border border-white/10 px-4 py-3">
                         <p className="text-[10px] font-mono text-white/40">
                           {new Date(item.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                         </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Corner Accent */}
              <div className="absolute bottom-0 right-0 h-1 w-1 bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.article>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default Certificates;