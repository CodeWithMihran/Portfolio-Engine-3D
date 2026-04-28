import Navbar from './components/Navbar';
import Contact from './sections/Contact';
import Credentials from './sections/Credentials';
import Hero from './sections/Hero';
import Journey from './sections/Journey';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import { useStore } from './store/useStore';

function LoadingShell() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
        <div className="bento-card max-w-md text-center">
          <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">
            Establishing uplink
          </p>
          <h1 className="mt-4 text-3xl font-bold text-white">Loading portfolio data...</h1>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  const loading = useStore((state) => state.loading);

  if (loading) {
    return <LoadingShell />;
  }

  return (
    <main className="relative min-h-screen bg-[#020617] selection:bg-blue-500/30">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.1),transparent_30%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] [background-image:linear-gradient(rgba(148,163,184,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.35)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Projects />
        <Skills />
        <Journey />
        <Credentials />
        <Contact />
        <footer className="px-6 py-12 text-center text-xs font-mono uppercase tracking-[0.3em] text-slate-500">
          &copy; {new Date().getFullYear()} Md Mihran Sohail. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
