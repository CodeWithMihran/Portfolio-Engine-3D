import { Link } from 'react-router-dom';

export default function EmptyStatePanel({
  eyebrow = 'Coming Soon',
  title,
  body,
  ctaLabel,
  ctaHref = '/login',
  tone = 'cyan',
}) {
  const tones = {
    red: {
      border: 'border-rose-300/14',
      bg: 'bg-[radial-gradient(circle_at_top_left,rgba(145,34,49,0.18),transparent_30%),linear-gradient(155deg,rgba(25,18,21,0.97),rgba(12,13,17,0.95))]',
      pill: 'border-rose-300/18 bg-rose-400/10 text-rose-100',
      button: 'border-rose-300/20 bg-rose-400/10 text-rose-100 hover:bg-rose-400/15',
    },
    cyan: {
      border: 'border-cyan-300/12',
      bg: 'bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),linear-gradient(180deg,rgba(10,18,32,0.94),rgba(10,18,32,0.8))]',
      pill: 'border-cyan-300/18 bg-cyan-400/10 text-cyan-100',
      button: 'border-cyan-300/20 bg-cyan-400/10 text-cyan-200 hover:bg-cyan-400/15',
    },
    blue: {
      border: 'border-sky-300/12',
      bg: 'bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_28%),linear-gradient(180deg,rgba(12,20,37,0.94),rgba(12,20,37,0.8))]',
      pill: 'border-sky-300/18 bg-sky-400/10 text-sky-100',
      button: 'border-sky-300/20 bg-sky-400/10 text-sky-200 hover:bg-sky-400/15',
    },
    teal: {
      border: 'border-emerald-300/12',
      bg: 'bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.16),transparent_28%),linear-gradient(180deg,rgba(10,18,32,0.94),rgba(10,18,32,0.8))]',
      pill: 'border-emerald-300/18 bg-emerald-400/10 text-emerald-100',
      button: 'border-emerald-300/20 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/15',
    },
    gold: {
      border: 'border-amber-300/12',
      bg: 'bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.18),transparent_28%),linear-gradient(180deg,rgba(12,20,37,0.94),rgba(12,20,37,0.8))]',
      pill: 'border-amber-300/18 bg-amber-400/10 text-amber-100',
      button: 'border-amber-300/20 bg-amber-400/10 text-amber-200 hover:bg-amber-400/15',
    },
    orange: {
      border: 'border-orange-300/12',
      bg: 'bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.16),transparent_28%),linear-gradient(180deg,rgba(12,18,32,0.94),rgba(12,18,32,0.8))]',
      pill: 'border-orange-300/18 bg-orange-400/10 text-orange-100',
      button: 'border-orange-300/20 bg-orange-400/10 text-orange-200 hover:bg-orange-400/15',
    },
  };

  const style = tones[tone] || tones.red;

  return (
    <div
      className={`portfolio-panel border ${style.border} ${style.bg} p-6 text-left shadow-none sm:p-8`}
    >
      <div
        className={`inline-flex border px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.24em] ${style.pill}`}
      >
        {eyebrow}
      </div>
      <h3 className="mt-5 text-2xl font-bold text-white">{title}</h3>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">{body}</p>
      {ctaLabel ? (
        <Link
          to={ctaHref}
          className={`mt-6 inline-flex border px-4 py-3 text-[10px] font-mono uppercase tracking-[0.22em] transition ${style.button}`}
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
