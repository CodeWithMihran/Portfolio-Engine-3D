import { motion } from 'framer-motion';
import { BriefcaseBusiness, GraduationCap } from 'lucide-react';
import SectionIntro from '../components/SectionIntro';
import { fadeInUp, staggerContainer } from '../lib/motion';
import { useStore } from '../store/useStore';

void motion;

const formatDate = (value, fallback = 'Present') => {
  if (!value) {
    return fallback;
  }

  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
};

function TimelineCard({ title, subtitle, date, description, extra, icon: Icon, accent }) {
  const TimelineIcon = Icon;
  return (
    <div className="relative rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10">
      <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}>
        <TimelineIcon size={20} />
      </div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="mt-1 text-sm text-blue-300">{subtitle}</p>
        </div>
        <p className="text-xs font-mono uppercase tracking-[0.25em] text-slate-500">{date}</p>
      </div>
      {description && <p className="mt-4 leading-7 text-slate-400">{description}</p>}
      {extra}
    </div>
  );
}

export default function Journey() {
  const experience = useStore((state) => state.experience);
  const education = useStore((state) => state.education);
  const timeline = [
    ...experience.map((item) => ({
      ...item,
      kind: 'experience',
      title: item.role,
      subtitle: item.companyName,
      date: `${formatDate(item.startDate)} - ${item.currentlyWorking ? 'Present' : formatDate(item.endDate)}`,
      icon: BriefcaseBusiness,
      accent: 'border border-violet-300/20 bg-violet-400/10 text-violet-100',
      extra:
        item.technologies?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.technologies.map((tech) => (
              <span
                key={`${item._id}-${tech}`}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wider text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        ) : null,
    })),
    ...education.map((item) => ({
      ...item,
      kind: 'education',
      title: item.degree,
      subtitle: `${item.institutionName}${item.fieldOfStudy ? `, ${item.fieldOfStudy}` : ''}`,
      date: `${formatDate(item.startDate)} - ${item.currentlyStudying ? 'Present' : formatDate(item.endDate)}`,
      icon: GraduationCap,
      accent: 'border border-sky-300/20 bg-sky-400/10 text-sky-100',
      extra: item.grade ? <p className="mt-4 text-sm font-medium text-emerald-300">Grade: {item.grade}</p> : null,
    })),
  ].sort((a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0));

  return (
    <section id="journey" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
      <SectionIntro
        eyebrow="Journey So Far"
        title="Experience"
        accent="Timeline"
        body="A compact timeline of the work and education milestones that shaped my development path."
        align="center"
      />

      {timeline.length ? (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="absolute left-[22px] top-0 bottom-0 w-px bg-gradient-to-b from-violet-300/70 via-sky-300/30 to-transparent sm:left-1/2 sm:-translate-x-1/2" />
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={`${item.kind}-${item._id}`}
                variants={fadeInUp}
                className={`relative sm:grid sm:grid-cols-2 sm:gap-10 ${
                  index % 2 === 0 ? '' : ''
                }`}
              >
                <div className={`relative pl-16 sm:pl-0 ${index % 2 === 0 ? 'sm:pr-10' : 'sm:col-start-2 sm:pl-10'}`}>
                  <span className="absolute left-0 top-8 h-4 w-4 rounded-full border border-violet-200/70 bg-[#050816] sm:left-auto sm:top-10 sm:h-5 sm:w-5" />
                  <TimelineCard
                    title={item.title}
                    subtitle={item.subtitle}
                    date={item.date}
                    description={item.description}
                    extra={item.extra}
                    icon={item.icon}
                    accent={item.accent}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 text-slate-400 backdrop-blur-md">No journey records yet.</div>
      )}
    </section>
  );
}
