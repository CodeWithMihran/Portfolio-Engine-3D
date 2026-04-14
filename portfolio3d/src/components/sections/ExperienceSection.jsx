import { motion } from 'framer-motion'
import { useStore } from '../../store/store'

const up   = { hidden:{opacity:0,y:26}, show:{opacity:1,y:0,transition:{duration:.5,ease:[.16,1,.3,1]}} }
const stag = { hidden:{}, show:{transition:{staggerChildren:.1}} }

const TYPE_COL = { 'full-time':'#00ffcc', 'part-time':'#f5c842', internship:'#a070ff', freelance:'#ff9040' }

function fmt(d) {
  if (!d) return 'Present'
  return new Date(d).toLocaleDateString('en-US',{ month:'short', year:'numeric' })
}

function ExpCard({ exp }) {
  const col = TYPE_COL[exp.employmentType] || '#00d4ff'
  return (
    <motion.div variants={up} className="gc exp-card">
      <div className="exp-header">
        <div className="exp-logo-wrap">
          {exp.companyLogo
            ? <img src={exp.companyLogo} alt={exp.companyName} className="exp-logo" />
            : <div className="exp-logo-ph" style={{ background:`linear-gradient(135deg,${col}22,${col}11)`, border:`1px solid ${col}44` }}>{exp.companyName?.charAt(0)}</div>
          }
        </div>
        <div className="exp-meta">
          <h3 className="exp-role">{exp.role}</h3>
          <div className="exp-company">
            {exp.companyWebsite
              ? <a href={exp.companyWebsite} target="_blank" rel="noopener noreferrer" className="exp-company-lnk">{exp.companyName}</a>
              : <span>{exp.companyName}</span>
            }
          </div>
          <div className="exp-details-row">
            <span className="chip" style={{ color:col, borderColor:col+'44', background:col+'11' }}>
              {exp.employmentType?.replace('-',' ').toUpperCase()}
            </span>
            {exp.location && <span className="exp-loc">◎ {exp.location}</span>}
          </div>
        </div>
        <div className="exp-dates">
          <span className="exp-date">{fmt(exp.startDate)}</span>
          <span className="exp-date-sep">—</span>
          <span className="exp-date" style={{ color:exp.currentlyWorking?'var(--teal)':'inherit' }}>
            {exp.currentlyWorking ? 'PRESENT' : fmt(exp.endDate)}
          </span>
        </div>
      </div>

      {exp.description && <p className="exp-desc">{exp.description}</p>}

      {exp.responsibilities?.length > 0 && (
        <ul className="exp-resp">
          {exp.responsibilities.map((r, i) => <li key={i} className="exp-resp-item">{r}</li>)}
        </ul>
      )}

      {exp.technologies?.length > 0 && (
        <div className="exp-techs">
          {exp.technologies.map((t,i) => <span key={i} className="chip chip-violet">{t}</span>)}
        </div>
      )}
    </motion.div>
  )
}

export default function ExperienceSection() {
  const { experience, navigate } = useStore()
  return (
    <div className="sp">
      <div className="sp-inner">
        <motion.div variants={stag} initial="hidden" animate="show">
          <motion.button variants={up} className="sp-back" onClick={() => navigate(null)}>← BACK TO PLANET</motion.button>
          <motion.div variants={up}>
            <p className="sp-eyebrow" style={{'--sec-col':'#ff4d8d'}}>◆ BATTLE RECORD</p>
            <h1 className="sp-title grad-rose">EXPERIENCE</h1>
          </motion.div>
          <div className="exp-timeline">
            {experience.length > 0
              ? experience.map(e => <ExpCard key={e._id} exp={e} />)
              : <div className="empty"><span className="empty-ico">◆</span>No experience added yet</div>
            }
          </div>
        </motion.div>
      </div>
      <style>{`
        .exp-timeline{display:flex;flex-direction:column;gap:20px;}
        .exp-card{padding:26px;}
        .exp-header{display:flex;gap:18px;align-items:flex-start;margin-bottom:16px;flex-wrap:wrap;}
        .exp-logo-wrap{flex-shrink:0;}
        .exp-logo{width:52px;height:52px;border-radius:10px;object-fit:contain;border:1px solid var(--border);}
        .exp-logo-ph{width:52px;height:52px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:var(--f-display);font-size:1.3rem;color:var(--text-hi);}
        .exp-meta{flex:1;min-width:0;}
        .exp-role{font-family:var(--f-display);font-size:.95rem;font-weight:700;letter-spacing:.06em;color:var(--text-hi);margin-bottom:5px;}
        .exp-company{font-family:var(--f-body);font-size:.9rem;color:var(--text-mid);margin-bottom:9px;}
        .exp-company-lnk{color:var(--cyan);text-decoration:none;}
        .exp-company-lnk:hover{text-decoration:underline;}
        .exp-details-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
        .exp-loc{font-family:var(--f-mono);font-size:.62rem;color:var(--text-lo);letter-spacing:.12em;}
        .exp-dates{display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0;}
        .exp-date{font-family:var(--f-mono);font-size:.66rem;color:var(--text-lo);letter-spacing:.1em;}
        .exp-date-sep{font-family:var(--f-mono);font-size:.6rem;color:var(--text-lo);opacity:.4;}
        .exp-desc{font-family:var(--f-body);font-size:.9rem;line-height:1.75;color:var(--text-mid);margin-bottom:14px;}
        .exp-resp{list-style:none;display:flex;flex-direction:column;gap:7px;margin-bottom:16px;}
        .exp-resp-item{font-family:var(--f-body);font-size:.88rem;line-height:1.65;color:var(--text-mid);padding-left:18px;position:relative;}
        .exp-resp-item::before{content:'▸';position:absolute;left:0;color:var(--rose);font-size:.7rem;}
        .exp-techs{display:flex;flex-wrap:wrap;gap:6px;}
      `}</style>
    </div>
  )
}
