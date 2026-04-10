import { useState } from "react";
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
        success: response.data.message || "Message sent successfully",
      });
      setForm(initialForm);
    } catch (error) {
      setStatus({
        loading: false,
        error: error.response?.data?.message || "Failed to send message",
        success: "",
      });
    }
  };

  return (
    <section id="contact" className="scroll-mt-28 py-24">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(160deg,rgba(34,211,238,0.14),rgba(255,255,255,0.05),rgba(16,185,129,0.08))] p-8">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/75">
            Contact
          </p>
          <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
            Let&apos;s build a portfolio experience people actually remember.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-white/70">
            Whether it&apos;s a developer portfolio, a product landing
            experience, or a dynamic admin-driven website, I care about
            building interfaces that feel intentional.
          </p>

          {profile?.email || profile?.location ? (
            <div className="mt-8 space-y-4">
              {profile?.email ? (
                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-5">
                  <p className="text-sm text-white/45">Email</p>
                  <p className="mt-2 text-lg font-semibold">{profile.email}</p>
                </div>
              ) : null}
              {profile?.location ? (
                <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-5">
                  <p className="text-sm text-white/45">Location</p>
                  <p className="mt-2 text-lg font-semibold">
                    {profile.location}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
          {status.success ? (
            <div className="mb-5 rounded-2xl bg-emerald-500/15 px-5 py-4 text-sm text-emerald-300">
              {status.success}
            </div>
          ) : null}

          {status.error ? (
            <div className="mb-5 rounded-2xl bg-red-500/15 px-5 py-4 text-sm text-red-300">
              {status.error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-4 outline-none transition focus:border-cyan-300"
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Your email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-4 outline-none transition focus:border-cyan-300"
                required
              />
            </div>

            <input
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-4 outline-none transition focus:border-cyan-300"
            />

            <textarea
              name="message"
              rows="6"
              placeholder="Tell me about your idea..."
              value={form.message}
              onChange={handleChange}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-4 outline-none transition focus:border-cyan-300"
              required
            />

            <button
              type="submit"
              disabled={status.loading}
              className="w-full rounded-full bg-cyan-400 px-6 py-4 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status.loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
