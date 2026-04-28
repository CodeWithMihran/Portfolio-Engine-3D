import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import SectionIntro from '../components/SectionIntro';
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
    <section id="education" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
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
        {education.length ? education.map((item) => (
          <motion.div key={item._id} variants={fadeInUp} className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-300/20 bg-sky-400/10 text-sky-100">
              <GraduationCap size={20} />
            </div>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">{item.degree}</h3>
                <p className="mt-1 text-sm text-blue-300">
                  {item.institutionName}{item.fieldOfStudy ? `, ${item.fieldOfStudy}` : ''}
                </p>
              </div>
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-slate-500">
                {formatDate(item.startDate)} - {item.currentlyStudying ? 'Present' : formatDate(item.endDate)}
              </p>
            </div>
            {item.description ? <p className="mt-4 leading-7 text-slate-400">{item.description}</p> : null}
            {item.grade ? <p className="mt-4 text-sm font-medium text-emerald-300">Grade: {item.grade}</p> : null}
          </motion.div>
        )) : (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 text-slate-400 backdrop-blur-md">No education records yet.</div>
        )}
      </motion.div>
    </section>
  );
}
