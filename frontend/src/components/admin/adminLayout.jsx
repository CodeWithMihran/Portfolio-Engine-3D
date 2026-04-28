import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import {
  Award,
  FolderKanban,
  House,
  LogOut,
  MessageSquare,
  Route,
  Settings,
  Sparkles,
  Trophy,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/skills', label: 'Skills', icon: Sparkles },
  { to: '/admin/journey', label: 'Journey', icon: Route },
  { to: '/admin/credentials', label: 'Credentials', icon: Award },
  { to: '/admin/achievements', label: 'Achievements', icon: Trophy },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/profile', label: 'Profile', icon: Settings },
];

export default function AdminLayout() {
  const logout = useStore((state) => state.logout);
  const profile = useStore((state) => state.profile);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07111f] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_bottom,rgba(249,115,22,0.1),transparent_26%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.16)_1px,transparent_1px)] [background-size:30px_30px]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-6 py-6 lg:flex-row">
        <aside className="h-fit w-full rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,15,30,0.94),rgba(8,15,30,0.76))] p-6 shadow-[0_28px_80px_rgba(2,6,23,0.45)] backdrop-blur-2xl lg:sticky lg:top-6 lg:w-80">
          <Link to="/" className="block">
            <p className="text-xs font-mono uppercase tracking-[0.35em] text-cyan-200/60">
              Command center
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white">Admin Console</h1>
            <p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
              Manage the live portfolio experience, timeline data, credentials, and incoming messages from one place.
            </p>
          </Link>

          <div className="mt-6 rounded-[28px] border border-cyan-300/10 bg-cyan-400/10 p-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-100/70">Active Identity</p>
            <p className="mt-2 text-lg font-semibold text-white">{profile?.fullName || 'Portfolio Admin'}</p>
            <p className="mt-1 text-sm text-slate-300">{profile?.title || 'Administrator'}</p>
          </div>

          <nav className="mt-8 space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${
                    active
                      ? 'border-cyan-300/25 bg-[linear-gradient(90deg,rgba(34,211,238,0.18),rgba(14,165,233,0.08))] text-white shadow-[0_12px_30px_rgba(34,211,238,0.12)]'
                      : 'border-transparent text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 space-y-3">
            <Link
              to="/"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/15"
            >
              <House size={18} />
              View Portfolio
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/15"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(6,12,24,0.86),rgba(8,16,32,0.7))] p-5 shadow-[0_32px_90px_rgba(2,6,23,0.38)] backdrop-blur-2xl lg:p-7">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
