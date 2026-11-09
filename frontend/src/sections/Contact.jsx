import { motion } from 'framer-motion';
import { useState } from 'react';
import { CheckCircle2, Mail, MapPin, Send } from 'lucide-react';
import SectionIntro from '../components/SectionIntro';
import { fadeInLeft, fadeInRight } from '../lib/motion';
import { api } from '../services/api';
import { useStore } from '../store/useStore';

void motion;

export default function Contact() {
  const profile = useStore((state) => state.profile);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await api.sendMessage(form);
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      window.alert('Transmission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24">
      <SectionIntro
        eyebrow="Contact"
        title="Let&apos;s Build"
        accent="Something Great"
        body="If you have an idea, role, collaboration, or product challenge in mind, I’d love to hear about it."
      />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="portfolio-panel p-6 sm:p-8"
        >
          <p className="text-xs font-mono uppercase tracking-[0.35em] text-rose-200/65">Get in touch</p>
          <h3 className="mt-4 text-3xl font-black text-white">Let&apos;s talk.</h3>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
            {profile?.about?.slice(0, 180) ||
              'Open to strong product work, meaningful collaborations, and opportunities where engineering quality and thoughtful UI both matter.'}
          </p>

          <div className="mt-8 space-y-4 sm:mt-10">
            {profile?.email ? (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-4 border border-white/10 bg-black/30 px-4 py-4 text-slate-200 transition hover:border-rose-300/25 hover:bg-white/[0.04] sm:px-5"
              >
                <Mail className="text-cyan-300" size={18} />
                <span className="break-all">{profile.email}</span>
              </a>
            ) : null}
            {profile?.location ? (
              <div className="flex items-center gap-4 border border-white/10 bg-black/30 px-4 py-4 text-slate-200 sm:px-5">
                <MapPin className="text-orange-200" size={18} />
                <span>{profile.location}</span>
              </div>
            ) : null}
          </div>
        </motion.div>

        <motion.div
          variants={fadeInRight}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="portfolio-panel p-6 sm:p-8"
        >
          {!sent ? (
            <>
              <h3 className="text-3xl font-black text-white">
                Message{' '}
                <span className="bg-gradient-to-r from-rose-200 via-red-300 to-orange-200 bg-clip-text text-transparent">
                  anytime
                </span>
              </h3>
              <p className="mb-8 mt-4 text-sm leading-7 text-slate-400 sm:mb-10 sm:text-base">
                Have a project in mind? Let&apos;s build something extraordinary.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    className="border border-white/10 bg-[#0b0b0f] px-4 py-3 text-white outline-none transition-all focus:border-rose-400"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    className="border border-white/10 bg-[#0b0b0f] px-4 py-3 text-white outline-none transition-all focus:border-rose-400"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full border border-white/10 bg-[#0b0b0f] px-4 py-3 text-white outline-none transition-all focus:border-rose-400"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
                <textarea
                  placeholder="Your Message"
                  rows={5}
                  required
                  className="w-full border border-white/10 bg-[#0b0b0f] px-4 py-3 text-white outline-none transition-all focus:border-rose-400"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 border border-rose-300/25 bg-rose-500/15 py-4 font-bold text-white transition-all active:scale-[0.99] disabled:opacity-50 hover:bg-rose-500/25"
                >
                  {loading ? 'TRANSMITTING...' : <>TRANSMIT MESSAGE <Send size={18} /></>}
                </button>
              </form>
            </>
          ) : (
            <div className="py-8 sm:py-12">
              <CheckCircle2 size={64} className="mx-auto mb-6 text-rose-300" />
              <h3 className="mb-2 text-2xl font-bold text-white">Message sent</h3>
              <p className="text-slate-400">I&apos;ll get back to you shortly.</p>
              <button
                onClick={() => setSent(false)}
                className="mt-8 text-xs uppercase tracking-widest text-rose-200 underline"
              >
                Send another message
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
