import { useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import { api } from '../services/api';

export default function Contact() {
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
    <section id="contact" className="mx-auto max-w-4xl px-6 py-24 text-center">
      <div className="bento-card border-blue-500/20 p-12">
        {!sent ? (
          <>
            <h2 className="text-4xl font-bold text-white">
              Secure <span className="text-gradient">Uplink</span>
            </h2>
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
      </div>
    </section>
  );
}
