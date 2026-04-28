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
          <motion.div key={achievement._id} variants={fadeInUp} className="group rounded-[30px] border border-orange-300/12 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.16),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.1),transparent_24%),linear-gradient(180deg,rgba(12,18,32,0.95),rgba(12,18,32,0.82))] p-6 shadow-[0_24px_65px_rgba(2,6,23,0.34)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-300/24 hover:shadow-[0_28px_75px_rgba(251,146,60,0.1)]">
            <Trophy className="mb-4 text-orange-300 transition-transform group-hover:scale-110" size={32} />
            <h3 className="mb-2 text-lg font-bold uppercase tracking-tight text-white">{achievement.title}</h3>
            <p className="mb-3 text-sm text-orange-100/80">{achievement.issuer || achievement.type}</p>
            {achievement.description ? <p className="text-sm leading-7 text-slate-300/80">{achievement.description}</p> : null}
            {achievement.position ? <p className="mt-4 inline-flex rounded-full border border-fuchsia-300/16 bg-fuchsia-400/10 px-3 py-1 text-xs font-mono uppercase tracking-[0.22em] text-fuchsia-100">{achievement.position}</p> : null}
            {achievement.certificateURL ? (
              <a href={achievement.certificateURL} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full border border-orange-300/14 bg-orange-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-orange-100 transition hover:bg-orange-400/15">
                View Proof <ExternalLink size={12} />
              </a>
            ) : null}
          </motion.div>
        )) : (
          <div className="rounded-[30px] border border-orange-300/12 bg-[linear-gradient(180deg,rgba(12,18,32,0.94),rgba(12,18,32,0.8))] p-6 text-slate-300/75 shadow-[0_20px_55px_rgba(2,6,23,0.28)] backdrop-blur-xl">No achievements found yet.</div>
        )}
      </motion.div>
    </section>
  );
}
