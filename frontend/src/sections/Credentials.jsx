import { motion } from 'framer-motion';
import { Award, ExternalLink, Trophy } from 'lucide-react';
import SectionIntro from '../components/SectionIntro';
import { fadeInUp, staggerContainer } from '../lib/motion';
import { useStore } from '../store/useStore';

void motion;

export default function Credentials() {
  const certificates = useStore((state) => state.certificates);
  const achievements = useStore((state) => state.achievements);

  return (
    <section id="credentials" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
      <SectionIntro
        eyebrow="Recognition"
        title="Credentials"
        accent="& Milestones"
        body="Certifications and achievement markers that support the practical work showcased across this portfolio."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {achievements.map((achievement) => (
          <motion.div key={achievement._id} variants={fadeInUp} className="group rounded-3xl border border-amber-500/10 bg-slate-900/50 p-6 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10">
            <Trophy className="mb-4 text-amber-500 transition-transform group-hover:scale-110" size={32} />
            <h3 className="mb-2 text-lg font-bold uppercase tracking-tight">{achievement.title}</h3>
            <p className="mb-4 text-sm text-slate-400">{achievement.issuer}</p>
            {achievement.certificateURL && (
              <a
                href={achievement.certificateURL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-500 hover:underline"
              >
                View Proof <ExternalLink size={12} />
              </a>
            )}
          </motion.div>
        ))}

        {certificates.map((certificate) => (
          <motion.div key={certificate._id} variants={fadeInUp} className="group rounded-3xl border border-blue-500/10 bg-slate-900/50 p-6 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10">
            <Award className="mb-4 text-blue-500 transition-transform group-hover:scale-110" size={32} />
            <h3 className="mb-2 text-lg font-bold uppercase tracking-tight">{certificate.title}</h3>
            <p className="mb-4 text-sm text-slate-400">Issued by {certificate.issuer}</p>
            <div className="mb-4 text-[10px] font-mono text-slate-500">ID: {certificate.credentialId}</div>
            {certificate.credentialURL && (
              <a
                href={certificate.credentialURL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-blue-500 hover:underline"
              >
                Verify Credential <ExternalLink size={12} />
              </a>
            )}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
