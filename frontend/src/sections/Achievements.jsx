import { motion } from 'framer-motion';
import { ExternalLink, Trophy } from 'lucide-react';
import EmptyStatePanel from '../components/EmptyStatePanel';
import SectionIntro from '../components/SectionIntro';
import { fadeInUp, staggerContainer } from '../lib/motion';
import { useStore } from '../store/useStore';

void motion;

export default function Achievements() {
  const achievements = useStore((state) => state.achievements);

  return (
    <section id="achievements" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24">
      <SectionIntro
        eyebrow="Recognition"
        title="Achievements"
        accent="Highlights"
        body="Awards, milestones, competitions, and recognitions presented separately from certificates for a cleaner story."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {achievements.length ? (
          achievements.map((achievement) => (
            <motion.div
              key={achievement._id}
              variants={fadeInUp}
              className="portfolio-panel group p-5 sm:p-6"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <p className="portfolio-panel-label">{achievement.type || 'Recognition'}</p>
                <Trophy className="text-rose-300 transition-transform group-hover:scale-110" size={19} />
              </div>
              <h3 className="mb-2 text-lg font-bold tracking-tight text-white">{achievement.title}</h3>
              <p className="mb-3 text-sm text-slate-400">{achievement.issuer || achievement.type}</p>
              {achievement.description ? (
                <p className="text-sm leading-7 text-slate-300/80">{achievement.description}</p>
              ) : null}
              {achievement.position ? (
                <p className="mt-4 inline-flex border border-rose-300/25 bg-rose-400/[0.08] px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.2em] text-rose-100">
                  {achievement.position}
                </p>
              ) : null}
              {achievement.certificateURL ? (
                <a
                  href={achievement.certificateURL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 border border-white/10 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-rose-100 transition hover:border-rose-300/25 hover:bg-rose-400/[0.08]"
                >
                  View Proof <ExternalLink size={12} />
                </a>
              ) : null}
            </motion.div>
          ))
        ) : (
          <EmptyStatePanel
            eyebrow="Recognition Lane"
            title="Achievement highlights will appear here once you add them."
            body="Add awards, competitions, and recognitions in the admin console to complete this section with proof links and stronger visual identity."
            ctaLabel="Add Achievements"
            ctaHref="/login"
            tone="red"
          />
        )}
      </motion.div>
    </section>
  );
}
