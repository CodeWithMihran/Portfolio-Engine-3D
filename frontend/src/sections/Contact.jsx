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
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.sendMessage(form);
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch {
      window.alert('Transmission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
      <SectionIntro
        eyebrow="Contact"
        title="Let&apos;s Build"
        accent="Something Great"
        body="If you have an idea, role, collaboration, or product challenge in mind, I’d love to hear about it."
      />

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="rounded-3xl border border-white/10 bg-slate-900/55 p-8 backdrop-blur-xl"
        >
          <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">Communication Hub</p>
          <h3 className="mt-4 text-3xl font-black text-white">Secure Uplink</h3>
          <p className="mt-5 max-w-md leading-8 text-slate-400">
            {profile?.about?.slice(0, 180) ||
              'Open to strong product work, meaningful collaborations, and opportunities where engineering quality and thoughtful UI both matter.'}
          </p>

          <div className="mt-10 space-y-4">
            {profile?.email ? (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-200 transition hover:bg-white/10"
              >
                <Mail className="text-violet-300" size={18} />
                <span>{profile.email}</span>
              </a>
            ) : null}
            {profile?.location ? (
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-slate-200">
                <MapPin className="text-sky-300" size={18} />
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
          className="rounded-3xl border border-blue-500/20 bg-slate-900/50 p-8 backdrop-blur-md transition-all duration-300 hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10"
        >
        {!sent ? (
          <>
            <h3 className="text-3xl font-black text-white">
              Message <span className="bg-gradient-to-r from-violet-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">Terminal</span>
            </h3>
            <p className="mb-10 mt-4 text-slate-400">
              Have a project in mind? Let&apos;s build something extraordinary.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition-all focus:border-blue-500"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition-all focus:border-blue-500"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <textarea
                placeholder="Your Message"
                rows={5}
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none transition-all focus:border-blue-500"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white transition-all active:scale-95 disabled:opacity-50 hover:bg-blue-500"
              >
                {loading ? 'TRANSMITTING...' : <>TRANSMIT MESSAGE <Send size={18} /></>}
              </button>
            </form>
          </>
        ) : (
          <div className="py-12">
            <CheckCircle2 size={64} className="mx-auto mb-6 text-emerald-500" />
            <h3 className="mb-2 text-2xl font-bold text-white">Message Transmitted</h3>
            <p className="text-slate-400">I&apos;ll get back to you shortly.</p>
            <button
              onClick={() => setSent(false)}
              className="mt-8 text-xs uppercase tracking-widest text-blue-400 underline"
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
