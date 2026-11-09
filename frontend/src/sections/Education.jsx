import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
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

export default function Education() {
  const education = useStore((state) => state.education);

  return (
    <section id="education" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24">
      <SectionIntro
        eyebrow="Learning Journey"
        title="Education"
        accent="Path"
        body="Academic foundations, field of study, and the learning milestones that support the work on this portfolio."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        {education.length ? (
          education.map((item) => {
            const logo = resolveMediaUrl(
              item.institutionLogo,
              createLogoFallback(item.institutionName || item.degree || 'Study', 'sky')
            );

            return (
              <motion.article
                key={item._id}
                variants={fadeInUp}
                className="portfolio-panel group grid content-start gap-4 p-5 sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <SafeImage
                    src={logo}
                    fallbackSrc={createLogoFallback(item.institutionName || item.degree || 'Study', 'sky')}
                    alt={item.institutionName || item.degree}
                    className="h-12 w-12 rounded-none border border-white/10 object-cover sm:h-14 sm:w-14"
                  />
                  <div className="flex h-9 w-9 items-center justify-center border border-rose-300/20 bg-rose-400/[0.07] text-rose-200">
                    <GraduationCap size={17} />
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="portfolio-panel-label">Education<span className="px-2 text-rose-100/30">/</span>{item.institutionName}</p>
                  <h3 className="mt-2 text-xl font-bold tracking-tight text-white transition-colors group-hover:text-rose-100 sm:text-2xl">{item.degree}</h3>
                  {item.fieldOfStudy ? <p className="mt-1 text-sm text-slate-300/75">{item.fieldOfStudy}</p> : null}

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
                    {item.location ? <span>{item.location}</span> : null}
                    {item.grade ? <span className="border border-white/10 px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-orange-100/80">Grade: {item.grade}</span> : null}
                  </div>

                  {item.description ? <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300/75">{item.description}</p> : null}

                  {item.coursework?.length ? (
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                      {item.coursework.slice(0, 4).map((course) => (
                        <span key={`${item._id}-${course}`} className="border border-white/10 bg-white/[0.03] px-2 py-1 text-[9px] uppercase tracking-[0.14em] text-slate-300">{course}</span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <p className="text-[9px] font-mono uppercase tracking-[0.16em] text-slate-500">
                  {formatDate(item.startDate)}<span className="px-2 text-sky-100/25">/</span>{item.currentlyStudying ? 'Present' : formatDate(item.endDate)}
                </p>
              </motion.article>
            );
          })
        ) : (
          <EmptyStatePanel
            eyebrow="Education Path"
            title="Academic milestones will appear here once you add them."
            body="Add schools, degrees, dates, and coursework in the admin console to complete this section."
            ctaLabel="Add Education"
            ctaHref="/login"
            tone="red"
          />
        )}
      </motion.div>
    </section>
  );
}
