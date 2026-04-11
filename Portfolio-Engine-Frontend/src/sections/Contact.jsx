import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../services/api";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const Contact = ({ profile }) => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({
    loading: false,
    error: "",
    success: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    try {
      const response = await API.post("/contact", form);
      setStatus({
        loading: false,
        error: "",
        success: response.data.message || "Uplink Established: Message Received.",
      });
      setForm(initialForm);
    } catch (error) {
      setStatus({
        loading: false,
        error: error.response?.data?.message || "Signal Lost: Failed to send message.",
        success: "",
      });
    }
  };

  const inputStyles = "w-full rounded-2xl border border-white/10 bg-slate-950/50 px-6 py-4 text-white outline-none transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 placeholder:text-white/20";

  return (
    <section id="contact" className="relative scroll-mt-32 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]"
      >
        {/* --- LEFT SIDE: THE PITCH --- */}
        <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-br from-cyan-500/10 via-slate-950/40 to-emerald-500/5 p-10 backdrop-blur-xl">
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-12 bg-cyan-400/50" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400">
                Contact.Uplink
              </p>
            </div>

            <h2 className="mt-8 text-4xl font-black leading-tight tracking-tighter text-white sm:text-6xl">
              Let&apos;s Build <span className="text-cyan-400">Something</span> Memorable.
            </h2>
            
            <p className="mt-8 text-lg leading-relaxed text-white/60">
              Whether you're looking to launch a 3D experience, a dynamic MERN application, or just want to discuss the future of the web—my inbox is open.
            </p>

            <div className="mt-12 space-y-4">
              {profile?.email && (
                <div className="group rounded-2xl border border-white/5 bg-white/[0.03] p-6 transition-all hover:border-cyan-400/20 hover:bg-white/[0.06]">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 group-hover:text-cyan-400 transition-colors">Direct Frequency</p>
                  <p className="mt-2 font-mono text-lg font-semibold text-white/90 group-hover:text-white">{profile.email}</p>
                </div>
              )}
              {profile?.location && (
                <div className="group rounded-2xl border border-white/5 bg-white/[0.03] p-6 transition-all hover:border-cyan-400/20 hover:bg-white/[0.06]">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 group-hover:text-cyan-400 transition-colors">Coordinate Origin</p>
                  <p className="mt-2 text-lg font-semibold text-white/90 group-hover:text-white">{profile.location}</p>
                </div>
              )}
            </div>
          </div>

          {/* Decorative radial glow */}
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />
        </div>

        {/* --- RIGHT SIDE: THE FORM --- */}
        <div className="relative rounded-[3rem] border border-white/10 bg-slate-950/40 p-10 backdrop-blur-2xl">
          <AnimatePresence mode="wait">
            {status.success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mb-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center text-sm font-bold uppercase tracking-widest text-emerald-400"
              >
                {status.success}
              </motion.div>
            )}

            {status.error && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center text-sm font-bold uppercase tracking-widest text-red-400"
              >
                {status.error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/40">Identification</label>
                <input
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  className={inputStyles}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/40">Return Frequency</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className={inputStyles}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/40">Transmission Subject</label>
              <input
                name="subject"
                placeholder="Topic of Inquiry"
                value={form.subject}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/40">Data Packet</label>
              <textarea
                name="message"
                rows="5"
                placeholder="Tell me about your project or vision..."
                value={form.message}
                onChange={handleChange}
                className={`${inputStyles} resize-none`}
                required
              />
            </div>

            <button
              type="submit"
              disabled={status.loading}
              className="group relative mt-4 w-full overflow-hidden rounded-2xl bg-cyan-500 py-5 text-sm font-black uppercase tracking-[0.4em] text-slate-950 transition-all hover:bg-cyan-400 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {status.loading ? "Transmitting..." : "Initialize Uplink"}
                {!status.loading && (
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </span>
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;