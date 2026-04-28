import { Award, ExternalLink, Trophy } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Credentials() {
  const certificates = useStore((state) => state.certificates);
  const achievements = useStore((state) => state.achievements);

  return (
    <section id="credentials" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-white">
          Credentials & <span className="text-gradient">Milestones</span>
        </h2>
        <p className="mt-4 text-slate-400">Recognitions and verified skillsets.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <div key={achievement._id} className="bento-card border-amber-500/10 group">
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
          </div>
        ))}

        {certificates.map((certificate) => (
          <div key={certificate._id} className="bento-card border-blue-500/10 group">
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
          </div>
        ))}
      </div>
    </section>
  );
}
