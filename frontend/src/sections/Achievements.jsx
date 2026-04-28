import { motion } from 'framer-motion';
import { ExternalLink, Trophy } from 'lucide-react';
import SectionIntro from '../components/SectionIntro';
import { fadeInUp, staggerContainer } from '../lib/motion';
import { useStore } from '../store/useStore';

void motion;

export default function Achievements() {
  const achievements = useStore((state) => state.achievements);

  return (
    <section id="achievements" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
      <SectionIntro
        eyebrow="Recognition"
        title="Achievements"
        accent="Highlights"
        body="Awards, milestones, competitions, and recognitions presented separately from certificates for a cleaner story."
      />

      <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {achievements.length ? achievements.map((achievement) => (
          <motion.div key={achievement._id} variants={fadeInUp} className="group rounded-3xl border border-amber-500/10 bg-slate-900/50 p-6 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10">
            <Trophy className="mb-4 text-amber-500 transition-transform group-hover:scale-110" size={32} />
            <h3 className="mb-2 text-lg font-bold uppercase tracking-tight text-white">{achievement.title}</h3>
            <p className="mb-3 text-sm text-slate-400">{achievement.issuer || achievement.type}</p>
            {achievement.description ? <p className="text-sm leading-7 text-slate-400">{achievement.description}</p> : null}
            {achievement.position ? <p className="mt-4 text-xs font-mono uppercase tracking-[0.22em] text-violet-200">{achievement.position}</p> : null}
            {achievement.certificateURL ? (
              <a href={achievement.certificateURL} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:underline">
                View Proof <ExternalLink size={12} />
              </a>
            ) : null}
          </motion.div>
        )) : (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 text-slate-400 backdrop-blur-md">No achievements found yet.</div>
        )}
      </motion.div>
    </section>
  );
}
