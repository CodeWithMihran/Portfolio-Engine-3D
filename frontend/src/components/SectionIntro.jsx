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
      className={centered ? 'mx-auto mb-14 max-w-3xl text-center sm:mb-16' : 'mb-14 max-w-3xl sm:mb-16'}
    >
      <motion.div
        variants={fadeInUpSoft}
        className={centered ? 'mx-auto mb-5 flex w-fit items-center justify-center gap-3' : 'mb-5 flex items-center gap-3'}
      >
        <span className="h-px w-10 bg-gradient-to-r from-rose-400/90 to-transparent" />
        <p className="text-[10px] font-mono uppercase tracking-[0.38em] text-rose-200/65">{eyebrow}</p>
      </motion.div>
      <motion.h2 variants={fadeInUpSoft} className="text-4xl font-black tracking-[-0.045em] text-white md:text-6xl">
        {title}{' '}
        {accent ? (
          <span className="bg-gradient-to-r from-rose-200 via-red-300 to-orange-200 bg-clip-text text-transparent">
            {accent}
          </span>
        ) : null}
      </motion.h2>
      {body ? (
        <motion.p variants={fadeInUpSoft} className="mt-5 max-w-2xl text-base leading-8 text-slate-400">
          {body}
        </motion.p>
      ) : null}
    </motion.div>
  );
}
