import { ArrowRight, Download, Mail, MapPin } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Hero() {
  const profile = useStore((state) => state.profile);
  const featuredProjects = useStore((state) => state.featuredProjects);
  const skills = useStore((state) => state.skills);

  return (
    <section className="mx-auto flex min-h-screen max-w-7xl items-center px-6 pt-28 pb-20">
      <div className="grid w-full gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-mono uppercase tracking-[0.3em] text-blue-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {profile?.availability || 'Open to opportunities'}
          </div>

          <div className="space-y-4">
            <p className="text-sm font-mono uppercase tracking-[0.35em] text-slate-500">
              Portfolio showcase
            </p>
            <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white md:text-6xl">
              {profile?.fullName || 'Md Mihran Sohail'}
            </h1>
            <p className="max-w-2xl text-xl text-blue-300">
              {profile?.title || 'Full Stack Developer'}
            </p>
            <p className="max-w-3xl text-base leading-8 text-slate-400">
              {profile?.bio ||
                'Building polished products, practical systems, and thoughtful web experiences with a strong engineering core.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500"
            >
              View Projects
              <ArrowRight size={18} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/70 px-6 py-3 font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800/80"
            >
              Contact Me
              <Mail size={18} />
            </a>
            {profile?.resume && (
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-6 py-3 font-semibold text-emerald-300 transition hover:bg-emerald-500/15"
              >
                Resume
                <Download size={18} />
              </a>
            )}
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-slate-400">
            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="transition hover:text-white">
                {profile.email}
              </a>
            )}
            {profile?.location && (
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} />
                {profile.location}
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
          <div className="bento-card">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-slate-500">
              Featured Projects
            </p>
            <p className="mt-4 text-4xl font-black text-white">{featuredProjects.length}</p>
          </div>
          <div className="bento-card">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-slate-500">
              Skills Catalog
            </p>
            <p className="mt-4 text-4xl font-black text-white">{skills.length}</p>
          </div>
          <div className="bento-card">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-slate-500">
              Current Focus
            </p>
            <p className="mt-4 text-lg font-semibold text-white">
              {profile?.tagline || 'Clean interfaces, solid backend systems, and practical products.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
