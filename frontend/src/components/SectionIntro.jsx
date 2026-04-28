import { motion } from 'framer-motion';
import { fadeInUp } from '../lib/motion';

void motion;

export default function SectionIntro({ eyebrow, title, accent, body, align = 'left' }) {
  const centered = align === 'center';

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className={centered ? 'mx-auto mb-16 max-w-3xl text-center' : 'mb-16 max-w-3xl'}
    >
      <p className="text-xs font-mono uppercase tracking-[0.35em] text-slate-500">{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-black tracking-tight text-white md:text-5xl">
        {title}{' '}
        {accent ? (
          <span className="bg-gradient-to-r from-violet-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
            {accent}
          </span>
        ) : null}
      </h2>
      {body ? <p className="mt-5 text-base leading-8 text-slate-400">{body}</p> : null}
    </motion.div>
  );
}
