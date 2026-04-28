import { motion } from 'framer-motion';
import { Code2, Globe, Layers3, Sparkles } from 'lucide-react';
import SectionIntro from '../components/SectionIntro';
import { fadeInUp, staggerContainer } from '../lib/motion';
import { useStore } from '../store/useStore';

const SERVICE_ICONS = [Sparkles, Code2, Globe, Layers3];

void motion;

export default function About() {
  const profile = useStore((state) => state.profile);
  const skillsByCategory = useStore((state) => state.skillsByCategory);

  const categories = Object.entries(skillsByCategory).slice(0, 4);

  return (
    <section id="about" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
      <SectionIntro
        eyebrow="Introduction"
        title="Overview"
        accent="."
        body={
          profile?.about ||
          profile?.bio ||
          'I build refined digital products with a focus on strong engineering, high usability, and a presentation that feels memorable without losing clarity.'
        }
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
      >
        {categories.map(([category, items], index) => {
          const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];
          return (
            <motion.div
              key={category}
              variants={fadeInUp}
              className="group rounded-[28px] border border-white/10 bg-slate-900/55 p-[1px] shadow-[0_24px_60px_rgba(2,6,23,0.45)]"
            >
              <div className="flex h-full flex-col rounded-[27px] border border-white/5 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.18),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.95),rgba(15,23,42,0.72))] p-7 transition duration-300 group-hover:-translate-y-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-violet-200">
                  <Icon size={24} />
                </div>
                <h3 className="mt-6 text-xl font-bold capitalize text-white">{category}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">
                  {items.slice(0, 3).map((item) => item.name).join(' · ') || 'Core capability stack'}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {items.slice(0, 4).map((item) => (
                    <span
                      key={item._id}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-300"
                    >
                      {item.name}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
