import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, Terminal as TerminalIcon } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { api } from '../../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const setAuth = useStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.login({ email, password });
      setAuth(res.data.token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'ACCESS_DENIED: Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617] px-6">
      <div className="absolute h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />

      <div className="z-10 w-full max-w-md">
        <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-slate-900/50 p-8 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10">
          <div className="mb-8 flex items-center gap-2 border-b border-slate-800 pb-4">
            <TerminalIcon size={18} className="text-blue-500" />
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500">
              System Authentication
            </span>
          </div>

          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-blue-400">
              <Lock size={32} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">ADMIN_ACCESS</h1>
            <p className="mt-2 text-sm text-slate-500">
              Identity verification required to modify core.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-2 ml-2 block text-[10px] font-mono uppercase text-slate-500">
                Uplink Identifier
              </label>
              <input
                type="email"
                required
                placeholder="admin@universe.com"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-white outline-none transition-all focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 ml-2 block text-[10px] font-mono uppercase text-slate-500">
                Security Cipher
              </label>
              <input
                type="password"
                required
                placeholder="Enter password"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-white outline-none transition-all focus:border-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-center text-xs font-mono text-rose-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 py-4 font-bold text-white transition-all active:scale-[0.98] hover:bg-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-pulse">VERIFYING...</span>
              ) : (
                <>INITIATE_SESSION <ShieldCheck size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-8 flex justify-between border-t border-slate-800 pt-4 text-[8px] font-mono text-slate-600">
            <span>SECURE_CONNECTION: ESTABLISHED</span>
            <span>ENCRYPTION: AES_256</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-6 w-full text-xs uppercase tracking-widest text-slate-500 transition-colors hover:text-white"
        >
          Return to Public Terminal
        </button>
      </div>
    </div>
  );
}
