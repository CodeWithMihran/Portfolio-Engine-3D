import { motion } from 'framer-motion';
import { Globe2 } from 'lucide-react';
import EmptyStatePanel from '../components/EmptyStatePanel';
import SectionIntro from '../components/SectionIntro';
import SafeImage from '../components/SafeImage';
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
    <section id="experience" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24">
      <SectionIntro
        eyebrow="What I've Done"
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
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
            {experience.map((item) => {
              const logo = resolveMediaUrl(
                item.companyLogo,
                createLogoFallback(item.companyName || item.role || 'Work', 'emerald')
              );

              return (
                <motion.article
                  key={item._id}
                  variants={fadeInUp}
                  className="portfolio-panel group grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)] sm:p-6"
                >
                  <div className="min-w-0">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="portfolio-panel-label">{item.employmentType || 'Professional experience'}</p>
                      <p className="text-[9px] font-mono uppercase tracking-[0.16em] text-slate-500">{formatDate(item.startDate)}<span className="px-2 text-rose-200/30">/</span>{item.currentlyWorking ? 'Present' : formatDate(item.endDate)}</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <SafeImage
                        src={logo}
                        fallbackSrc={createLogoFallback(item.companyName || item.role || 'Work', 'emerald')}
                        alt={item.companyName || item.role}
                        className="h-12 w-12 shrink-0 rounded-full border border-white/10 object-cover sm:h-14 sm:w-14"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-rose-100 sm:text-2xl">{item.role}</h3>
                        <p className="mt-1 text-sm font-medium text-rose-100/75">{item.companyName}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        {item.location ? <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-slate-500">{item.location}</span> : null}
                        {item.companyWebsite ? (
                          <a
                            href={item.companyWebsite}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.16em] text-orange-100/75 transition hover:text-orange-100"
                          >
                            <Globe2 size={12} />
                            Website
                          </a>
                        ) : null}
                    </div>

                    {item.description ? (
                        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300/80">{item.description}</p>
                    ) : null}

                    {item.responsibilities?.length ? (
                        <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                          {item.responsibilities.slice(0, 2).map((responsibility) => (
                            <li
                              key={responsibility}
                              className="flex gap-3 py-1 text-sm leading-6 text-slate-300/85"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-200/75" />
                              {responsibility}
                            </li>
                          ))}
                        </ul>
                    ) : null}

                    {item.technologies?.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.technologies.map((tech) => (
                            <span
                              key={`${item._id}-${tech}`}
                              className="border border-white/10 bg-white/[0.03] px-2 py-1 text-[9px] uppercase tracking-[0.16em] text-slate-300"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                    ) : null}
                  </div>
                </motion.article>
              );
            })}
        </motion.div>
      ) : (
        <EmptyStatePanel
          eyebrow="Experience Timeline"
          title="Professional milestones will appear here once you add them."
          body="Add experience in the admin console to populate this section with company identity, responsibilities, and timeline detail."
          ctaLabel="Add Experience"
          ctaHref="/login"
          tone="red"
        />
      )}
    </section>
  );
}
