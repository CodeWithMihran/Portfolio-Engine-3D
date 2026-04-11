import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import API from "../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🛡️ Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await API.post("/auth/login", form);

      // Store Auth Data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("admin", JSON.stringify(response.data.admin));

      // Professional delay for transition feel
      setTimeout(() => {
        navigate("/admin");
      }, 500);
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError("Network Error: Verification server unreachable.");
      } else {
        setError("Authorization Failed: Check credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#020617] flex items-center justify-center px-6 overflow-hidden">
      
      {/* 🌌 Background Space Canvas */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Canvas>
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/40 p-10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
          
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_25px_rgba(34,211,238,0.4)]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-slate-950">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white">ACCESS PORTAL</h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.4em] text-white/30">System Authorization Required</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-xs font-bold uppercase tracking-widest text-red-400"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/40">Credentials</label>
              <input
                name="email"
                type="email"
                placeholder="Admin Email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-5 py-4 text-sm text-white outline-none transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 placeholder:text-white/20"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 text-[10px] font-black uppercase tracking-widest text-white/40">Access Key</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-5 py-4 text-sm text-white outline-none transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 placeholder:text-white/20"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative mt-4 w-full overflow-hidden rounded-xl bg-cyan-500 py-4 text-sm font-black uppercase tracking-[0.3em] text-slate-950 transition-all hover:bg-cyan-400 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <span className="relative z-10">
                {loading ? "Decrypting..." : "Initialize Session"}
              </span>
              <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-10 text-center">
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/20">
              Encrypted Tunnel v3.0.1 • {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;