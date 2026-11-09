import { motion } from 'framer-motion';
import { Code2, Globe, Layers3, Sparkles } from 'lucide-react';
import EmptyStatePanel from '../components/EmptyStatePanel';
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
    <section id="about" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6 sm:py-24">
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
        {categories.length ? (
          categories.map(([category, items], index) => {
            const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];

            return (
              <motion.div
                key={category}
                variants={fadeInUp}
                className="portfolio-panel group"
              >
                <div className="flex h-full flex-col p-5 sm:p-6">
                  <p className="portfolio-panel-label">Capability / 0{index + 1}</p>
                  <div className="mt-5 flex h-11 w-11 items-center justify-center border border-rose-300/20 bg-rose-400/[0.08] text-rose-100">
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
                        className="border border-white/10 bg-white/[0.03] px-2 py-1 text-[9px] font-medium uppercase tracking-[0.16em] text-slate-300"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <motion.div variants={fadeInUp} className="md:col-span-2 xl:col-span-4">
            <EmptyStatePanel
              eyebrow="Overview Modules"
              title="This section becomes richer once your skill groups are added."
              body="Add skills in the admin console and this overview area will automatically turn into a cleaner category-based capability snapshot."
              ctaLabel="Add Skills"
              ctaHref="/login"
              tone="red"
            />
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
