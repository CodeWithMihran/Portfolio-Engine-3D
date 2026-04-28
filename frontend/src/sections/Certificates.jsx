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
          <motion.div key={certificate._id} variants={fadeInUp} className="group rounded-[30px] border border-cyan-300/12 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.12),transparent_24%),linear-gradient(180deg,rgba(10,18,32,0.95),rgba(10,18,32,0.82))] p-6 shadow-[0_24px_65px_rgba(2,6,23,0.34)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/24 hover:shadow-[0_28px_75px_rgba(34,211,238,0.1)]">
            <Award className="mb-4 text-cyan-300 transition-transform group-hover:scale-110" size={32} />
            <h3 className="mb-2 text-lg font-bold uppercase tracking-tight text-white">{certificate.title}</h3>
            <p className="mb-3 text-sm text-cyan-100/80">Issued by {certificate.issuer}</p>
            <div className="space-y-1 text-[11px] font-mono uppercase tracking-[0.2em] text-cyan-100/45">
              <p>Issued: {formatDate(certificate.issueDate)}</p>
              {certificate.expiryDate ? <p>Expires: {formatDate(certificate.expiryDate)}</p> : null}
            </div>
            {certificate.description ? <p className="mt-4 text-sm leading-7 text-slate-300/80">{certificate.description}</p> : null}
            {certificate.credentialURL ? (
              <a href={certificate.credentialURL} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/14 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100 transition hover:bg-cyan-400/15">
                Verify Credential <ExternalLink size={12} />
              </a>
            ) : null}
          </motion.div>
        )) : (
          <div className="rounded-[30px] border border-cyan-300/12 bg-[linear-gradient(180deg,rgba(10,18,32,0.94),rgba(10,18,32,0.8))] p-6 text-slate-300/75 shadow-[0_20px_55px_rgba(2,6,23,0.28)] backdrop-blur-xl">No certificates found yet.</div>
        )}
      </motion.div>
    </section>
  );
}
