import { motion } from 'framer-motion';
import { BriefcaseBusiness, Globe2 } from 'lucide-react';
import SectionIntro from '../components/SectionIntro';
import { createLogoFallback, resolveMediaUrl } from '../lib/media';
import { fadeInUp, staggerContainer } from '../lib/motion';
import { useStore } from '../store/useStore';

void motion;

const formatDate = (value, fallback = 'Present') => {
  if (!value) return fallback;
  return new Date(value).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export default function Experience() {
  const experience = useStore((state) => state.experience);

  return (
    <section id="experience" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
      <SectionIntro
        eyebrow="What I’ve Done"
        title="Work"
        accent="Experience"
        body="A dedicated view of professional roles, responsibilities, and the technologies used in each chapter."
      />

      {experience.length ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="absolute left-[22px] top-0 bottom-0 w-px bg-gradient-to-b from-cyan-300/80 via-sky-300/35 to-orange-300/10 sm:left-1/2 sm:-translate-x-1/2" />
          <div className="space-y-8">
            {experience.map((item, index) => {
              const logo = resolveMediaUrl(
                item.companyLogo,
                createLogoFallback(item.companyName || item.role || 'Work', 'cyan')
              );

              return (
                <motion.div key={item._id} variants={fadeInUp} className="relative sm:grid sm:grid-cols-2 sm:gap-10">
                  <div
                    className={`relative pl-16 sm:pl-0 ${
                      index % 2 === 0 ? 'sm:pr-10' : 'sm:col-start-2 sm:pl-10'
                    }`}
                  >
                    <span className="absolute left-0 top-8 h-4 w-4 rounded-full border border-cyan-200/80 bg-[#07111f] shadow-[0_0_20px_rgba(34,211,238,0.35)] sm:left-auto sm:top-10 sm:h-5 sm:w-5" />
                    <div className="rounded-[30px] border border-cyan-300/12 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.09),transparent_28%),linear-gradient(180deg,rgba(10,18,32,0.95),rgba(10,18,32,0.82))] p-6 shadow-[0_24px_65px_rgba(2,6,23,0.36)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/22 hover:shadow-[0_30px_80px_rgba(34,211,238,0.1)]">
                      <div className="mb-5 flex items-center gap-4">
                        <img
                          src={logo}
                          alt={item.companyName || item.role}
                          className="h-14 w-14 rounded-2xl border border-white/10 object-cover"
                        />
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-100">
                          <BriefcaseBusiness size={20} />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-white">{item.role}</h3>
                          <p className="mt-1 text-sm text-cyan-200">{item.companyName}</p>
                        </div>
                        <p className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-100/45">
                          {formatDate(item.startDate)} - {item.currentlyWorking ? 'Present' : formatDate(item.endDate)}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {item.location ? (
                          <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-300">
                            {item.location}
                          </span>
                        ) : null}
                        {item.employmentType ? (
                          <span className="rounded-full border border-cyan-300/10 bg-cyan-400/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-50">
                            {item.employmentType}
                          </span>
                        ) : null}
                        {item.companyWebsite ? (
                          <a
                            href={item.companyWebsite}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-orange-300/14 bg-orange-400/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-orange-100 transition hover:bg-orange-400/15"
                          >
                            <Globe2 size={12} />
                            Website
                          </a>
                        ) : null}
                      </div>

                      {item.description ? <p className="mt-4 leading-7 text-slate-300/80">{item.description}</p> : null}

                      {item.responsibilities?.length ? (
                        <div className="mt-4 space-y-3">
                          {item.responsibilities.slice(0, 2).map((responsibility) => (
                            <div
                              key={responsibility}
                              className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-200"
                            >
                              {responsibility}
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {item.technologies?.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.technologies.map((tech) => (
                            <span
                              key={`${item._id}-${tech}`}
                              className="rounded-full border border-cyan-300/10 bg-cyan-400/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-cyan-50"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ) : (
        <div className="rounded-[30px] border border-cyan-300/12 bg-[linear-gradient(180deg,rgba(10,18,32,0.94),rgba(10,18,32,0.8))] p-6 text-slate-300/75 shadow-[0_20px_55px_rgba(2,6,23,0.28)] backdrop-blur-xl">
          No experience records yet.
        </div>
      )}
    </section>
  );
}
