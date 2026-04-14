import { motion } from 'framer-motion'
import { useStore } from '../../store/store'

const up   = { hidden:{opacity:0,y:26}, show:{opacity:1,y:0,transition:{duration:.5,ease:[.16,1,.3,1]}} }
const stag = { hidden:{}, show:{transition:{staggerChildren:.1}} }

function fmt(d) {
  if (!d) return 'Present'
  return new Date(d).toLocaleDateString('en-US',{ month:'short', year:'numeric' })
}

function EduCard({ edu }) {
  return (
    <motion.div variants={up} className="gc edu-card">
      <div className="edu-header">
        <div className="edu-logo-wrap">
          {edu.institutionLogo
            ? <img src={edu.institutionLogo} alt={edu.institutionName} className="edu-logo" />
            : <div className="edu-logo-ph">{edu.institutionName?.charAt(0)}</div>
          }
        </div>
        <div className="edu-meta">
          <h3 className="edu-inst">{edu.institutionName}</h3>
          <div className="edu-degree">{edu.degree} — <span className="edu-field">{edu.fieldOfStudy}</span></div>
          <div className="edu-row2">
            {edu.location && <span className="edu-loc">◎ {edu.location}</span>}
            {edu.grade    && <span className="chip chip-teal">CGPA / SCORE: {edu.grade}</span>}
          </div>
        </div>
        <div className="edu-dates">
          <span className="edu-date">{fmt(edu.startDate)}</span>
          <span className="edu-sep">—</span>
          <span className="edu-date" style={{ color: edu.currentlyStudying ? 'var(--teal)' : 'inherit' }}>
            {edu.currentlyStudying ? 'PRESENT' : fmt(edu.endDate)}
          </span>
        </div>
      </div>

      {edu.description && <p className="edu-desc">{edu.description}</p>}

      {edu.coursework?.length > 0 && (
        <div className="edu-section">
          <p className="sec-label">COURSEWORK</p>
          <div className="edu-tags">
            {edu.coursework.map((c,i) => <span key={i} className="chip chip-cyan">{c}</span>)}
          </div>
        </div>
      )}

      {edu.achievements?.length > 0 && (
        <div className="edu-section">
          <p className="sec-label">HIGHLIGHTS</p>
          <ul className="edu-ach">
            {edu.achievements.map((a,i) => <li key={i} className="edu-ach-item">{a}</li>)}
          </ul>
        </div>
      )}
    </motion.div>
  )
}

export default function EducationSection() {
  const { education, navigate } = useStore()
  return (
    <div className="sp">
      <div className="sp-inner">
        <motion.div variants={stag} initial="hidden" animate="show">
          <motion.button variants={up} className="sp-back" onClick={() => navigate(null)}>← BACK TO PLANET</motion.button>
          <motion.div variants={up}>
            <p className="sp-eyebrow" style={{'--sec-col':'#a070ff'}}>△ KNOWLEDGE BASE</p>
            <h1 className="sp-title grad-violet">EDUCATION</h1>
          </motion.div>
          <div className="edu-timeline">
            {education.length > 0
              ? education.map(e => <EduCard key={e._id} edu={e} />)
              : <div className="empty"><span className="empty-ico">△</span>No education added yet</div>
            }
          </div>
        </motion.div>
      </div>
      <style>{`
        .edu-timeline{display:flex;flex-direction:column;gap:20px;}
        .edu-card{padding:26px;}
        .edu-header{display:flex;gap:18px;align-items:flex-start;margin-bottom:16px;flex-wrap:wrap;}
        .edu-logo-wrap{flex-shrink:0;}
        .edu-logo{width:52px;height:52px;border-radius:10px;object-fit:contain;border:1px solid var(--border);}
        .edu-logo-ph{width:52px;height:52px;border-radius:10px;background:linear-gradient(135deg,rgba(160,112,255,.2),rgba(160,112,255,.08));border:1px solid rgba(160,112,255,.3);display:flex;align-items:center;justify-content:center;font-family:var(--f-display);font-size:1.3rem;color:var(--text-hi);}
        .edu-meta{flex:1;min-width:0;}
        .edu-inst{font-family:var(--f-display);font-size:.95rem;font-weight:700;letter-spacing:.06em;color:var(--text-hi);margin-bottom:5px;}
        .edu-degree{font-family:var(--f-body);font-size:.9rem;color:var(--text-mid);margin-bottom:9px;}
        .edu-field{color:var(--violet);}
        .edu-row2{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
        .edu-loc{font-family:var(--f-mono);font-size:.62rem;color:var(--text-lo);letter-spacing:.12em;}
        .edu-dates{display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0;}
        .edu-date{font-family:var(--f-mono);font-size:.66rem;color:var(--text-lo);letter-spacing:.1em;}
        .edu-sep{font-family:var(--f-mono);font-size:.6rem;color:var(--text-lo);opacity:.4;}
        .edu-desc{font-family:var(--f-body);font-size:.9rem;line-height:1.75;color:var(--text-mid);margin-bottom:14px;}
        .edu-section{margin-top:14px;}
        .edu-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;}
        .edu-ach{list-style:none;display:flex;flex-direction:column;gap:6px;margin-top:8px;}
        .edu-ach-item{font-family:var(--f-body);font-size:.88rem;color:var(--text-mid);padding-left:18px;position:relative;}
        .edu-ach-item::before{content:'★';position:absolute;left:0;color:var(--violet);font-size:.65rem;}
      `}</style>
    </div>
  )
}
