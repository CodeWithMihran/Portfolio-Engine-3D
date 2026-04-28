import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import SectionIntro from '../components/SectionIntro';
import { fadeInUp, staggerContainer } from '../lib/motion';
import { useStore } from '../store/useStore';

void motion;

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A');

export default function Certificates() {
  const certificates = useStore((state) => state.certificates);

  return (
    <section id="certificates" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
      <SectionIntro
        eyebrow="Verified Learning"
        title="Certificates"
        accent="Collection"
        body="Dedicated certificate cards pulled from your backend, separated from achievements so each category gets its own visual space."
      />

      <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {certificates.length ? certificates.map((certificate) => (
          <motion.div key={certificate._id} variants={fadeInUp} className="group rounded-3xl border border-blue-500/10 bg-slate-900/50 p-6 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10">
            <Award className="mb-4 text-blue-500 transition-transform group-hover:scale-110" size={32} />
            <h3 className="mb-2 text-lg font-bold uppercase tracking-tight text-white">{certificate.title}</h3>
            <p className="mb-3 text-sm text-slate-400">Issued by {certificate.issuer}</p>
            <div className="space-y-1 text-[11px] font-mono uppercase tracking-[0.2em] text-slate-500">
              <p>Issued: {formatDate(certificate.issueDate)}</p>
              {certificate.expiryDate ? <p>Expires: {formatDate(certificate.expiryDate)}</p> : null}
            </div>
            {certificate.description ? <p className="mt-4 text-sm leading-7 text-slate-400">{certificate.description}</p> : null}
            {certificate.credentialURL ? (
              <a href={certificate.credentialURL} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:underline">
                Verify Credential <ExternalLink size={12} />
              </a>
            ) : null}
          </motion.div>
        )) : (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 text-slate-400 backdrop-blur-md">No certificates found yet.</div>
        )}
      </motion.div>
    </section>
  );
}
