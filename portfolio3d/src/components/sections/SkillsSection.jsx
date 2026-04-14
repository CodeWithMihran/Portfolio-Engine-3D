import { useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../store/store'

const up   = { hidden:{opacity:0,y:26}, show:{opacity:1,y:0,transition:{duration:.5,ease:[.16,1,.3,1]}} }
const stag = { hidden:{}, show:{transition:{staggerChildren:.06}} }

const CAT_ICONS = { frontend:'⬡', backend:'◆', database:'◎', programming:'△', tools:'✦', other:'◈' }
const CAT_COLS  = { frontend:'#00d4ff', backend:'#f5c842', database:'#00ffcc', programming:'#a070ff', tools:'#ff9040', other:'#ff4d8d' }

function SkillBar({ skill }) {
  return (
    <motion.div variants={up} className="skill-row">
      <div className="skill-row-top">
        <div className="skill-row-left">
          {skill.icon
            ? <img src={skill.icon} alt={skill.name} className="skill-ico-img" />
            : <span className="skill-ico-txt" style={{ color: skill.color || '#00d4ff' }}>
                {CAT_ICONS[skill.category] || '◈'}
              </span>
          }
          <span className="skill-name">{skill.name}</span>
        </div>
        <span className="skill-pct" style={{ color: skill.color || '#00d4ff' }}>{skill.proficiency}%</span>
      </div>
      <div className="skill-track">
        <motion.div
          className="skill-fill"
          style={{ background: skill.color || '#00d4ff', boxShadow: `0 0 10px ${skill.color || '#00d4ff'}55` }}
          initial={{ width: 0 }}
          animate={{ width: `${skill.proficiency}%` }}
          transition={{ duration: 1, delay: .2, ease: [.16,1,.3,1] }}
        />
      </div>
    </motion.div>
  )
}

export default function SkillsSection() {
  const { skills, navigate } = useStore()
  const [activeTab, setActiveTab] = useState('ALL')

  const cats = ['ALL', ...new Set(skills.map(s => s.category))]
  const filtered = activeTab === 'ALL' ? skills : skills.filter(s => s.category === activeTab)

  const grouped = filtered.reduce((acc, s) => {
    const k = s.category || 'other'
    if (!acc[k]) acc[k] = []
    acc[k].push(s)
    return acc
  }, {})

  return (
    <div className="sp">
      <div className="sp-inner">
        <motion.div variants={stag} initial="hidden" animate="show">
          <motion.button variants={up} className="sp-back" onClick={() => navigate(null)}>← BACK TO PLANET</motion.button>
          <motion.div variants={up}>
            <p className="sp-eyebrow" style={{'--sec-col':'#00ffcc'}}>◎ CAPABILITY MAP</p>
            <h1 className="sp-title grad-teal">SKILLS</h1>
          </motion.div>

          {/* Category tabs */}
          <motion.div variants={up} className="skills-tabs">
            {cats.map(c => (
              <button
                key={c}
                className={`skills-tab${activeTab===c?' active':''}`}
                style={{ '--tc': CAT_COLS[c] || '#00d4ff' }}
                onClick={() => setActiveTab(c)}
              >
                {CAT_ICONS[c] || '◈'} {c.toUpperCase()}
              </button>
            ))}
          </motion.div>

          {/* Skills display */}
          {activeTab === 'ALL' ? (
            <div className="skills-grouped">
              {Object.entries(grouped).map(([cat, items]) => (
                <motion.div key={cat} variants={up} className="gc skills-group">
                  <div className="skills-group-hd">
                    <span className="skills-group-ico" style={{ color: CAT_COLS[cat] || '#00d4ff' }}>
                      {CAT_ICONS[cat] || '◈'}
                    </span>
                    <span className="skills-group-name" style={{ color: CAT_COLS[cat] || '#00d4ff' }}>
                      {cat.toUpperCase()}
                    </span>
                    <span className="skills-group-count">{items.length}</span>
                  </div>
                  <motion.div variants={stag} className="skills-list">
                    {items.sort((a,b) => b.proficiency - a.proficiency).map(s => (
                      <SkillBar key={s._id} skill={s} />
                    ))}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div variants={stag} className="gc skills-single">
              <motion.div variants={stag} className="skills-list">
                {filtered.sort((a,b) => b.proficiency - a.proficiency).map(s => (
                  <SkillBar key={s._id} skill={s} />
                ))}
              </motion.div>
            </motion.div>
          )}

          {skills.length === 0 && <div className="empty"><span className="empty-ico">◎</span>No skills added yet</div>}
        </motion.div>
      </div>
      <style>{`
        .skills-tabs{display:flex;flex-wrap:wrap;gap:9px;margin-bottom:38px;}
        .skills-tab{font-family:var(--f-mono);font-size:.62rem;letter-spacing:.16em;color:var(--text-lo);background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);padding:7px 14px;border-radius:7px;transition:all .2s;display:flex;align-items:center;gap:7px;}
        .skills-tab.active,.skills-tab:hover{color:var(--tc);border-color:color-mix(in srgb, var(--tc) 40%, transparent);background:color-mix(in srgb, var(--tc) 8%, transparent);}
        .skills-grouped{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:20px;}
        .skills-group{padding:24px;}
        .skills-group-hd{display:flex;align-items:center;gap:10px;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid var(--border);}
        .skills-group-ico{font-size:1.1rem;}
        .skills-group-name{font-family:var(--f-display);font-size:.72rem;font-weight:700;letter-spacing:.18em;flex:1;}
        .skills-group-count{font-family:var(--f-mono);font-size:.65rem;color:var(--text-lo);background:rgba(255,255,255,.05);padding:3px 9px;border-radius:100px;}
        .skills-single{padding:28px;}
        .skills-list{display:flex;flex-direction:column;gap:16px;}
        .skill-row{}
        .skill-row-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:7px;}
        .skill-row-left{display:flex;align-items:center;gap:10px;}
        .skill-ico-img{width:20px;height:20px;object-fit:contain;filter:drop-shadow(0 0 4px currentColor);}
        .skill-ico-txt{font-size:1rem;}
        .skill-name{font-family:var(--f-body);font-size:.92rem;font-weight:600;color:var(--text-hi);letter-spacing:.04em;}
        .skill-pct{font-family:var(--f-mono);font-size:.7rem;letter-spacing:.1em;font-weight:700;}
        .skill-track{height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;}
        .skill-fill{height:100%;border-radius:2px;}
        @media(max-width:700px){.skills-grouped{grid-template-columns:1fr;}}
      `}</style>
    </div>
  )
}
