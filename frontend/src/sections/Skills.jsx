import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
        {skills.length ? (
          skills.map((skill) => {
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
          })
        ) : (
          <motion.div
            variants={fadeInUp}
            className="mx-auto max-w-2xl rounded-[32px] border border-white/10 bg-white/5 px-8 py-10 text-center shadow-[0_24px_60px_rgba(2,6,23,0.35)] backdrop-blur-xl"
          >
            <p className="text-xs font-mono uppercase tracking-[0.34em] text-slate-500">Awaiting Skill Data</p>
            <h3 className="mt-4 text-2xl font-bold text-white">Your 3D skill spheres need backend entries first.</h3>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              Right now the section only shows the title because no skills are coming from your database. Once you add skills in the admin console, they will appear here automatically in the same 3D presentation.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex rounded-full border border-cyan-300/20 bg-cyan-400/10 px-5 py-3 text-xs font-mono uppercase tracking-[0.28em] text-cyan-200 transition hover:bg-cyan-400/15"
            >
              Add Skills From Admin
            </Link>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
