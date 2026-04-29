import { ArrowDown, ArrowUp } from 'lucide-react';

export default function OrderControls({ index, total, onMove }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
      <button
        type="button"
        onClick={() => onMove(index, -1)}
        disabled={index === 0}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
      >
        <ArrowUp size={14} />
      </button>
      <button
        type="button"
        onClick={() => onMove(index, 1)}
        disabled={index === total - 1}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
      >
        <ArrowDown size={14} />
      </button>
    </div>
  );
}
