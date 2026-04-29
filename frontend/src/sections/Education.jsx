import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import EmptyStatePanel from '../components/EmptyStatePanel';
import SectionIntro from '../components/SectionIntro';
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
        className="grid gap-6 md:grid-cols-2"
      >
        {education.length ? (
          education.map((item) => {
            const logo = resolveMediaUrl(
              item.institutionLogo,
              createLogoFallback(item.institutionName || item.degree || 'Study', 'sky')
            );

            return (
              <motion.div
                key={item._id}
                variants={fadeInUp}
                className="rounded-[30px] border border-sky-300/12 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(167,139,250,0.08),transparent_24%),linear-gradient(180deg,rgba(12,20,37,0.95),rgba(12,20,37,0.82))] p-6 shadow-[0_24px_65px_rgba(2,6,23,0.34)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-sky-300/24 hover:shadow-[0_28px_75px_rgba(56,189,248,0.12)]"
              >
                <div className="mb-5 flex items-center gap-4">
                  <img
                    src={logo}
                    alt={item.institutionName || item.degree}
                    className="h-14 w-14 rounded-2xl border border-white/10 object-cover"
                  />
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-400/12 text-sky-100">
                    <GraduationCap size={20} />
                  </div>
                </div>

                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{item.degree}</h3>
                    <p className="mt-1 text-sm text-sky-200">
                      {item.institutionName}
                      {item.fieldOfStudy ? `, ${item.fieldOfStudy}` : ''}
                    </p>
                  </div>
                  <p className="text-xs font-mono uppercase tracking-[0.25em] text-sky-100/45">
                    {formatDate(item.startDate)} - {item.currentlyStudying ? 'Present' : formatDate(item.endDate)}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {item.location ? (
                    <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-slate-300">
                      {item.location}
                    </span>
                  ) : null}
                  {item.grade ? (
                    <span className="rounded-full border border-emerald-300/18 bg-emerald-400/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-200">
                      Grade: {item.grade}
                    </span>
                  ) : null}
                </div>

                {item.description ? <p className="mt-4 leading-7 text-slate-300/80">{item.description}</p> : null}

                {item.coursework?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.coursework.slice(0, 4).map((course) => (
                      <span
                        key={`${item._id}-${course}`}
                        className="rounded-full border border-sky-300/10 bg-sky-400/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-sky-50"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                ) : null}
              </motion.div>
            );
          })
        ) : (
          <EmptyStatePanel
            eyebrow="Education Path"
            title="Academic milestones will appear here once you add them."
            body="Add schools, degrees, dates, and coursework in the admin console to complete this section with a stronger blue academic identity."
            ctaLabel="Add Education"
            ctaHref="/login"
            tone="blue"
          />
        )}
      </motion.div>
    </section>
  );
}
