import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import {
  FolderKanban,
  LogOut,
  MessageSquare,
  Route,
  Settings,
  Sparkles,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/skills', label: 'Skills', icon: Sparkles },
  { to: '/admin/journey', label: 'Journey', icon: Route },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/profile', label: 'Profile', icon: Settings },
];

export default function AdminLayout() {
  const logout = useStore((state) => state.logout);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-6 py-6 lg:flex-row">
        <aside className="h-fit w-full rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10 lg:sticky lg:top-6 lg:w-72">
          <Link to="/" className="block">
            <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">
              Command pane
            </p>
            <h1 className="mt-3 text-2xl font-bold text-white">Admin Console</h1>
          </Link>

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
                      ? 'border-blue-500/30 bg-blue-500/10 text-white'
                      : 'border-transparent text-slate-400 hover:border-slate-800 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300 transition-all hover:bg-rose-500/15"
          >
            <LogOut size={18} />
            Logout
          </button>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
