import { useEffect, useState } from 'react';
import { Activity, ArrowUpRight, Check, CircleAlert, LoaderCircle, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useStore } from '../../store/useStore';

function hasMedia(project) {
  return Boolean(project?.thumbnail || project?.images?.some(Boolean));
}

function hasCaseStudy(project) {
  return Boolean(
    project?.featured &&
    hasMedia(project) &&
    project.technologies?.length &&
    (project.challenges || project.problem) &&
    project.approach &&
    project.outcome
  );
}

export default function PortfolioReadiness() {
  const profile = useStore((state) => state.profile);
  const projects = useStore((state) => state.projects);
  const skills = useStore((state) => state.skills);
  const experience = useStore((state) => state.experience);
  const education = useStore((state) => state.education);
  const certificates = useStore((state) => state.certificates);
  const achievements = useStore((state) => state.achievements);
  const loading = useStore((state) => state.loading);
  const [health, setHealth] = useState({ state: 'checking' });
  const [checkVersion, setCheckVersion] = useState(0);

  useEffect(() => {
    let active = true;

    api.getHealth()
      .then(({ data }) => {
        if (active) setHealth({ state: 'ready', ...data });
      })
      .catch((error) => {
        if (!active) return;
        setHealth({
          state: 'unreachable',
          database: error.response?.data?.database || 'unreachable',
          mediaStorage: error.response?.data?.mediaStorage || 'unknown',
        });
      });

    return () => {
      active = false;
    };
  }, [checkVersion]);

  const featuredProject = projects.find((project) => project.featured);
  const checks = [
    {
      title: 'Profile essentials',
      detail: 'Name, role, short bio, and contact email',
      href: '/admin/profile',
      ready: Boolean(profile?.fullName && profile?.title && profile?.bio && profile?.email),
    },
    {
      title: 'Featured case study',
      detail: 'Feature one project with media, stack, context, approach, and outcome',
      href: featuredProject ? `/admin/projects/edit/${featuredProject._id}` : '/admin/projects',
      ready: projects.some(hasCaseStudy),
    },
    {
      title: 'Skill logos',
      detail: skills.length ? `${skills.filter((skill) => skill.icon).length} of ${skills.length} skills have icons` : 'Add the technologies you want to showcase',
      href: '/admin/skills',
      ready: skills.length > 0 && skills.every((skill) => Boolean(skill.icon)),
    },
  ];
  const readyCount = checks.filter((check) => check.ready).length;
  const readinessPercent = Math.round((readyCount / checks.length) * 100);
  const optionalSections = [
    { title: 'Resume / CV', detail: profile?.resume ? 'A document URL is saved' : 'Upload your PDF from Profile', href: '/admin/profile' },
    { title: 'Experience & education', detail: `${experience.length} roles · ${education.length} education entries`, href: '/admin/journey' },
    { title: 'Certificates', detail: `${certificates.length} entries`, href: '/admin/credentials' },
    { title: 'Achievements', detail: `${achievements.length} entries`, href: '/admin/achievements' },
  ];
  const mediaStorageLabel = {
    'cloudinary-configured': 'Cloudinary credentials configured; test an upload',
    local: 'Local storage only (development)',
    'not-configured': 'Persistent storage not configured',
    unknown: 'Storage status unavailable',
  }[health.mediaStorage] || 'Storage status unavailable';

  return (
    <section className="mb-8 overflow-hidden rounded-[30px] border border-rose-200/10 bg-[radial-gradient(circle_at_top_right,rgba(190,45,55,0.13),transparent_34%),linear-gradient(150deg,rgba(27,18,22,0.95),rgba(12,13,17,0.96))] p-5 shadow-[0_22px_60px_rgba(0,0,0,0.25)] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-rose-200/65">Launch readiness</p>
          <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">Make the portfolio yours</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            These checks confirm fields and assets exist; review the wording and accuracy yourself before sharing the site.
          </p>
        </div>
        <div className="min-w-36 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-right">
          <p className="text-xs text-slate-400">Core setup</p>
          <p className="mt-1 text-lg font-bold text-white">{loading ? 'Loading' : `${readyCount} / ${checks.length}`}</p>
        </div>
      </div>

      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10" aria-label={`Core portfolio setup ${readinessPercent}% complete`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={loading ? 0 : readinessPercent}>
        <div className="h-full rounded-full bg-gradient-to-r from-rose-400 to-orange-300 transition-[width] duration-500" style={{ width: `${loading ? 0 : readinessPercent}%` }} />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        {checks.map((check) => (
          <Link
            key={check.title}
            to={check.href}
            className="group flex min-w-0 items-start gap-3 rounded-2xl border border-white/[0.07] bg-black/15 p-4 transition hover:border-rose-200/20 hover:bg-white/[0.035]"
          >
            <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${check.ready ? 'bg-emerald-400/10 text-emerald-200' : 'bg-orange-300/10 text-orange-100'}`}>
              {check.ready ? <Check size={16} /> : <CircleAlert size={16} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2 text-sm font-semibold text-white">
                {check.title}<ArrowUpRight size={14} className="shrink-0 text-slate-500 transition group-hover:text-rose-200" />
              </span>
              <span className="mt-1 block text-xs leading-5 text-slate-400">{loading ? 'Checking saved content...' : check.detail}</span>
              <span className={`mt-2 block text-[10px] font-mono uppercase tracking-[0.18em] ${check.ready ? 'text-emerald-200/70' : 'text-orange-100/70'}`}>
                {check.ready ? 'Fields present' : 'Needs your details'}
              </span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-5">
        <p className="text-[10px] font-mono uppercase tracking-[0.24em] text-slate-500">Optional, if relevant to your story</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {optionalSections.map((item) => (
            <Link key={item.title} to={item.href} className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition hover:border-white/15 hover:bg-white/[0.04]">
              <span className="block text-xs font-semibold text-slate-200">{item.title}</span>
              <span className="mt-1 block text-[11px] leading-5 text-slate-500">{item.detail}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.07] bg-black/15 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          {health.state === 'checking' ? <LoaderCircle size={17} className="shrink-0 animate-spin text-slate-400" /> : health.state === 'ready' && health.database === 'connected' ? <Activity size={17} className="shrink-0 text-emerald-200" /> : <CircleAlert size={17} className="shrink-0 text-orange-200" />}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">Live service check</p>
            <p className="mt-0.5 text-xs text-slate-400">
              {health.state === 'checking'
                ? 'Checking the API and database...'
                : health.state !== 'ready'
                  ? 'API unavailable. Check the backend URL, CORS, and Render logs.'
                  : `API and database ${health.database}. ${mediaStorageLabel}.`}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setHealth({ state: 'checking' });
            setCheckVersion((version) => version + 1);
          }}
          disabled={health.state === 'checking'}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-rose-200/20 hover:text-white disabled:cursor-wait disabled:opacity-50"
        >
          <RefreshCw size={13} /> Check again
        </button>
      </div>
    </section>
  );
}
