import { Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './sections/About';
import Achievements from './sections/Achievements';
import Certificates from './sections/Certificates';
import Contact from './sections/Contact';
import Education from './sections/Education';
import Experience from './sections/Experience';
import Hero from './sections/Hero';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import { StarsCanvas } from './components/canvas';
import { useStore } from './store/useStore';

function LoadingShell() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
        <div className="max-w-md rounded-3xl border border-slate-800 bg-slate-900/50 p-6 text-center backdrop-blur-md transition-all duration-300 hover:scale-[1.01] hover:border-slate-700 hover:bg-slate-800/50 hover:shadow-2xl hover:shadow-blue-500/10">
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
  const profile = useStore((state) => state.profile);

  const sectionVisibility = profile?.sectionVisibility || {};

  if (loading) {
    return <LoadingShell />;
  }

  return (
    <main className="relative min-h-screen bg-[#050816] selection:bg-violet-400/30 selection:text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.14),transparent_30%),radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.08),transparent_26%)]" />
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.06] [background-image:linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px)] [background-size:34px_34px]" />
      <StarsCanvas />

      <div className="relative z-10">
        <Navbar />
        <Hero />
        {sectionVisibility.about !== false && <About />}
        {sectionVisibility.projects !== false && <Projects />}
        {sectionVisibility.skills !== false && <Skills />}
        {sectionVisibility.experience !== false && <Experience />}
        {sectionVisibility.education !== false && <Education />}
        {sectionVisibility.certificates !== false && <Certificates />}
        {sectionVisibility.achievements !== false && <Achievements />}
        {sectionVisibility.contact !== false && <Contact />}
        <footer className="px-6 py-14">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 border-t border-white/10 pt-10 text-center">
            <Link
              to="/login"
              className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.32em] text-slate-300 transition hover:border-violet-300/30 hover:bg-violet-400/10 hover:text-white"
            >
              Admin Login
            </Link>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-slate-500">
              &copy; {new Date().getFullYear()} Md Mihran Sohail. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
