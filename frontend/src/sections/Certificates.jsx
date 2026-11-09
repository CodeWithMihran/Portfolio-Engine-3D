import { motion } from 'framer-motion';
import { Award, ExternalLink } from 'lucide-react';
import EmptyStatePanel from '../components/EmptyStatePanel';
import SectionIntro from '../components/SectionIntro';
import SafeImage from '../components/SafeImage';
import { createLogoFallback, createProjectImageFallback, resolveMediaUrl } from '../lib/media';
import { fadeInUp, staggerContainer } from '../lib/motion';
import { useStore } from '../store/useStore';

void motion;

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A';

export default function Certificates() {
  const certificates = useStore((state) => state.certificates);

  return (
    <section id="certificates" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24">
      <SectionIntro
        eyebrow="Verified Learning"
        title="Certificates"
        accent="Collection"
        body="Dedicated certificate cards pulled from your backend, separated from achievements so each category gets its own visual space."
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {certificates.length ? (
          certificates.map((certificate) => {
            const logo = resolveMediaUrl(
              certificate.issuerLogo,
              createLogoFallback(certificate.issuer || certificate.title || 'Issuer', 'cyan')
            );
            const cover = certificate.certificateImage
              ? resolveMediaUrl(
                  certificate.certificateImage,
                  createProjectImageFallback(certificate.title)
                )
              : null;

            return (
              <motion.div
                key={certificate._id}
                variants={fadeInUp}
                className="portfolio-panel group"
              >
                {cover ? (
                  <div className="relative h-40 overflow-hidden border-b border-white/10">
                    <SafeImage
                      src={cover}
                      fallbackSrc={createProjectImageFallback(certificate.title)}
                      alt={certificate.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,17,31,0.08),rgba(7,17,31,0.76))]" />
                  </div>
                ) : null}

                <div className="space-y-4 p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <SafeImage
                      src={logo}
                      fallbackSrc={createLogoFallback(certificate.issuer || certificate.title || 'Issuer', 'cyan')}
                      alt={certificate.issuer || certificate.title}
                      className="h-12 w-12 border border-white/10 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <Award className="text-rose-300" size={18} />
                        <h3 className="text-lg font-bold tracking-tight text-white">
                          {certificate.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-xs text-slate-400">Issued by {certificate.issuer}</p>
                    </div>
                  </div>

                  <div className="space-y-1 border-t border-white/10 pt-3 text-[9px] font-mono uppercase tracking-[0.18em] text-rose-200/65">
                    <p>Issued: {formatDate(certificate.issueDate)}</p>
                    {certificate.expiryDate ? <p>Expires: {formatDate(certificate.expiryDate)}</p> : null}
                  </div>

                  {certificate.description ? (
                    <p className="text-sm leading-7 text-slate-300/80">{certificate.description}</p>
                  ) : null}

                  {certificate.credentialURL ? (
                    <a
                      href={certificate.credentialURL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 border border-rose-300/25 bg-rose-400/[0.08] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-rose-100 transition hover:bg-rose-400/15"
                    >
                      Verify Credential <ExternalLink size={12} />
                    </a>
                  ) : null}
                </div>
              </motion.div>
            );
          })
        ) : (
          <EmptyStatePanel
            eyebrow="Verified Learning"
            title="Certificate cards will appear here once they are published."
            body="Add certificate records in the admin console to show issuer logos, cover images, dates, and verification links."
            ctaLabel="Add Certificates"
            ctaHref="/login"
            tone="gold"
          />
        )}
      </motion.div>
    </section>
  );
}
