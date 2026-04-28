import { motion } from 'framer-motion';
import SectionIntro from '../components/SectionIntro';
import { BallCanvas } from '../components/canvas';
import { fadeInUp, staggerContainer } from '../lib/motion';
import { createSkillIconFallback, resolveMediaUrl } from '../lib/media';
import { useStore } from '../store/useStore';

void motion;

export default function Skills() {
  const skills = useStore((state) => state.skills);

  return (
    <section id="skills" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
      <SectionIntro
        eyebrow="Technologies"
        title="Tech"
        accent="Stack"
        body="A 3D skill presentation inspired by the reference portfolio, now driven by your backend-managed skill data."
        align="center"
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="flex flex-row flex-wrap justify-center gap-10"
      >
        {skills.map((skill) => {
          const icon = resolveMediaUrl(skill.icon, createSkillIconFallback(skill.name));

          return (
            <motion.div
              key={skill._id}
              variants={fadeInUp}
              className="flex w-32 flex-col items-center gap-3"
            >
              <div className="h-28 w-28">
                <BallCanvas icon={icon} />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-white">{skill.name}</p>
                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500">
                  {skill.category}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
