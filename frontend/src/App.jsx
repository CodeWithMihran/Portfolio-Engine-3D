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
    <main className="min-h-screen bg-[#07111f] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6">
        <div className="max-w-md rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,17,31,0.95),rgba(9,17,31,0.72))] p-7 text-center shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-2xl">
          <p className="text-xs font-mono uppercase tracking-[0.35em] text-cyan-200/55">
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
    <main className="relative min-h-screen overflow-hidden bg-[#07111f] selection:bg-cyan-300/25 selection:text-white">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.15),transparent_28%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(251,146,60,0.1),transparent_26%),linear-gradient(180deg,#07111f_0%,#081121_45%,#091626_100%)]" />
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
              className="inline-flex items-center rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.32em] text-cyan-100 transition hover:border-cyan-200/40 hover:bg-cyan-400/15 hover:text-white"
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
