import { Code2, Cpu, Database, Layout, Terminal, Wrench } from 'lucide-react';
import { useStore } from '../store/useStore';

const ICON_MAP = {
  frontend: <Layout className="text-blue-400" />,
  backend: <Terminal className="text-emerald-400" />,
  database: <Database className="text-amber-400" />,
  programming: <Code2 className="text-violet-400" />,
  tools: <Wrench className="text-rose-400" />,
  other: <Cpu className="text-slate-400" />,
};

export default function Skills() {
  const skillsByCategory = useStore((state) => state.skillsByCategory);

  return (
    <section id="skills" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16">
        <h2 className="text-4xl font-bold text-white">
          Technical <span className="text-gradient">Arsenal</span>
        </h2>
        <p className="mt-4 text-slate-400">Software and technologies I use to bring ideas to life.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(skillsByCategory).map(([category, items]) => (
          <div key={category} className="bento-card">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                {ICON_MAP[category] || ICON_MAP.other}
              </div>
              <h3 className="text-lg font-bold uppercase tracking-widest text-slate-200">{category}</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <div
                  key={skill._id}
                  className="group relative rounded-full border border-slate-800 bg-slate-950 px-3 py-1.5 transition-colors hover:border-blue-500/50"
                >
                  <span className="text-sm text-slate-300 transition-colors group-hover:text-white">
                    {skill.name}
                  </span>
                  <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-blue-600 px-2 py-1 text-[10px] font-bold opacity-0 transition-opacity group-hover:opacity-100">
                    {skill.proficiency}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
