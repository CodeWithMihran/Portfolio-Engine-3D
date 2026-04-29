import { motion } from 'framer-motion';
import { fadeInUpSoft, staggerContainerDense } from '../lib/motion';

void motion;

export default function SectionIntro({ eyebrow, title, accent, body, align = 'left' }) {
  const centered = align === 'center';

  return (
    <motion.div
      variants={staggerContainerDense}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className={centered ? 'mx-auto mb-16 max-w-3xl text-center' : 'mb-16 max-w-3xl'}
    >
      <motion.div
        variants={fadeInUpSoft}
        className={centered ? 'mx-auto mb-5 flex w-fit items-center justify-center gap-3' : 'mb-5 flex items-center gap-3'}
      >
        <span className="h-px w-10 bg-gradient-to-r from-cyan-300/80 to-transparent" />
        <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">{eyebrow}</p>
      </motion.div>
      <motion.h2 variants={fadeInUpSoft} className="text-4xl font-black tracking-tight text-white md:text-5xl">
        {title}{' '}
        {accent ? (
          <span className="bg-gradient-to-r from-violet-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
            {accent}
          </span>
        ) : null}
      </motion.h2>
      {body ? (
        <motion.p variants={fadeInUpSoft} className="mt-5 text-base leading-8 text-slate-400">
          {body}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
