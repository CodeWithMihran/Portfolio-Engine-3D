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
          className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,18,32,0.95),rgba(10,18,32,0.78))] p-6 shadow-[0_24px_70px_rgba(2,6,23,0.34)] backdrop-blur-xl sm:rounded-[30px] sm:p-8"
        >
          <p className="text-xs font-mono uppercase tracking-[0.35em] text-cyan-200/55">Communication Hub</p>
          <h3 className="mt-4 text-3xl font-black text-white">Secure Uplink</h3>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
            {profile?.about?.slice(0, 180) ||
              'Open to strong product work, meaningful collaborations, and opportunities where engineering quality and thoughtful UI both matter.'}
          </p>

          <div className="mt-8 space-y-4 sm:mt-10">
            {profile?.email ? (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-4 rounded-2xl border border-cyan-300/12 bg-white/5 px-4 py-4 text-slate-200 transition hover:bg-white/10 sm:px-5"
              >
                <Mail className="text-cyan-300" size={18} />
                <span className="break-all">{profile.email}</span>
              </a>
            ) : null}
            {profile?.location ? (
              <div className="flex items-center gap-4 rounded-2xl border border-orange-300/12 bg-white/5 px-4 py-4 text-slate-200 sm:px-5">
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
          className="rounded-[28px] border border-cyan-300/16 bg-[linear-gradient(180deg,rgba(8,17,31,0.94),rgba(10,18,32,0.74))] p-6 shadow-[0_24px_70px_rgba(2,6,23,0.34)] backdrop-blur-xl transition-all duration-300 hover:border-cyan-300/24 hover:shadow-[0_28px_80px_rgba(34,211,238,0.08)] sm:rounded-[30px] sm:p-8"
        >
          {!sent ? (
            <>
              <h3 className="text-3xl font-black text-white">
                Message{' '}
                <span className="bg-gradient-to-r from-cyan-200 via-sky-300 to-orange-200 bg-clip-text text-transparent">
                  Terminal
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
                    className="rounded-xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-white outline-none transition-all focus:border-cyan-400"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    className="rounded-xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-white outline-none transition-all focus:border-cyan-400"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-white outline-none transition-all focus:border-cyan-400"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                />
                <textarea
                  placeholder="Your Message"
                  rows={5}
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/90 px-4 py-3 text-white outline-none transition-all focus:border-cyan-400"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#06b6d4,#0ea5e9)] py-4 font-bold text-white shadow-[0_18px_45px_rgba(14,165,233,0.25)] transition-all active:scale-95 disabled:opacity-50 hover:brightness-110"
                >
                  {loading ? 'TRANSMITTING...' : <>TRANSMIT MESSAGE <Send size={18} /></>}
                </button>
              </form>
            </>
          ) : (
            <div className="py-8 sm:py-12">
              <CheckCircle2 size={64} className="mx-auto mb-6 text-emerald-500" />
              <h3 className="mb-2 text-2xl font-bold text-white">Message Transmitted</h3>
              <p className="text-slate-400">I&apos;ll get back to you shortly.</p>
              <button
                onClick={() => setSent(false)}
                className="mt-8 text-xs uppercase tracking-widest text-cyan-300 underline"
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
