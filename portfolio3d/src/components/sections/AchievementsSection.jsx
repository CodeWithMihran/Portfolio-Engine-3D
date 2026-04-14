import { motion } from 'framer-motion'
import { useStore } from '../../store/store'

const up   = { hidden:{opacity:0,y:26}, show:{opacity:1,y:0,transition:{duration:.5,ease:[.16,1,.3,1]}} }
const stag = { hidden:{}, show:{transition:{staggerChildren:.08}} }

const TYPE_META = {
  award:       { icon:'🏆', color:'#f5c842', label:'AWARD'       },
  competition: { icon:'⚔️',  color:'#ff4d8d', label:'COMPETITION' },
  hackathon:   { icon:'⚡',  color:'#00ffcc', label:'HACKATHON'   },
  recognition: { icon:'★',  color:'#a070ff', label:'RECOGNITION' },
  other:       { icon:'◈',  color:'#00d4ff', label:'OTHER'       },
}

function AchCard({ ach, index }) {
  const meta  = TYPE_META[ach.type] || TYPE_META.other
  const color = meta.color

  return (
    <motion.div
      variants={up}
      className="gc ach-card"
      whileHover={{ y:-4, boxShadow:`0 20px 55px ${color}18` }}
      style={{ '--ac': color }}
    >
      {/* Rank badge */}
      {ach.position && (
        <div className="ach-rank" style={{ color, borderColor: color+'44', background: color+'11' }}>
          {ach.position}
        </div>
      )}

      {/* Featured star */}
      {ach.featured && <div className="ach-feat">★</div>}

      {/* Type badge */}
      <div className="ach-type-badge" style={{ color, borderColor: color+'33', background: color+'0d' }}>
        <span>{meta.icon}</span> {meta.label}
      </div>

      <h3 className="ach-title">{ach.title}</h3>

      {ach.issuer && (
        <div className="ach-issuer-row">
          {ach.issuerLogo && <img src={ach.issuerLogo} alt={ach.issuer} className="ach-issuer-logo" />}
          <span className="ach-issuer">{ach.issuer}</span>
        </div>
      )}

      {ach.description && <p className="ach-desc">{ach.description}</p>}

      <div className="ach-footer">
        {ach.date && (
          <span className="ach-date">
            {new Date(ach.date).toLocaleDateString('en-US',{ month:'short', year:'numeric' })}
          </span>
        )}
        {ach.certificateURL && (
          <a
            href={ach.certificateURL}
            target="_blank"
            rel="noopener noreferrer"
            className="ach-proof-btn"
            style={{ color, borderColor: color+'44', background: color+'0d' }}
          >
            VIEW PROOF →
          </a>
        )}
      </div>

      {/* Decorative number */}
      <div className="ach-bg-num" style={{ color }}>
        {String(index + 1).padStart(2,'0')}
      </div>
    </motion.div>
  )
}

export default function AchievementsSection() {
  const { achievements, navigate } = useStore()

  const byType = achievements.reduce((acc, a) => {
    const k = a.type || 'other'
    if (!acc[k]) acc[k] = []
    acc[k].push(a)
    return acc
  }, {})

  return (
    <div className="sp">
      <div className="sp-inner">
        <motion.div variants={stag} initial="hidden" animate="show">
          <motion.button variants={up} className="sp-back" onClick={() => navigate(null)}>← BACK TO PLANET</motion.button>

          <motion.div variants={up}>
            <p className="sp-eyebrow" style={{'--sec-col':'#ff3355'}}>★ HALL OF FAME</p>
            <h1 className="sp-title grad-rose">ACHIEVEMENTS</h1>
          </motion.div>

          {/* Stats strip */}
          {achievements.length > 0 && (
            <motion.div variants={up} className="ach-stats">
              {Object.entries(byType).map(([type, items]) => {
                const m = TYPE_META[type] || TYPE_META.other
                return (
                  <div key={type} className="ach-stat-pill" style={{ '--ac': m.color }}>
                    <span>{m.icon}</span>
                    <span className="ach-stat-count">{items.length}</span>
                    <span className="ach-stat-name">{m.label}</span>
                  </div>
                )
              })}
            </motion.div>
          )}

          {achievements.length > 0 ? (
            <motion.div className="ach-grid" variants={stag}>
              {achievements.map((a, i) => <AchCard key={a._id} ach={a} index={i} />)}
            </motion.div>
          ) : (
            <div className="empty"><span className="empty-ico">★</span>No achievements added yet</div>
          )}
        </motion.div>
      </div>

      <style>{`
        .ach-stats {
          display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 40px;
        }
        .ach-stat-pill {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--f-mono); font-size: .64rem; letter-spacing: .15em;
          padding: 8px 16px; border-radius: 100px;
          border: 1px solid color-mix(in srgb, var(--ac) 35%, transparent);
          background: color-mix(in srgb, var(--ac) 8%, transparent);
          color: var(--ac);
        }
        .ach-stat-count { font-size: .8rem; font-weight: 700; }
        .ach-stat-name  { color: var(--text-mid); }
        .ach-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .ach-card {
          padding: 24px; position: relative; overflow: hidden;
          transition: all .3s ease;
        }
        .ach-rank {
          display: inline-flex; align-items: center;
          font-family: var(--f-display); font-size: .65rem; font-weight: 700;
          letter-spacing: .18em; border: 1px solid; padding: 5px 12px; border-radius: 100px;
          margin-bottom: 12px; text-transform: uppercase;
        }
        .ach-feat {
          position: absolute; top: 14px; right: 14px;
          font-size: 1rem; color: var(--gold);
          filter: drop-shadow(0 0 6px var(--gold));
        }
        .ach-type-badge {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: var(--f-mono); font-size: .6rem; letter-spacing: .16em;
          border: 1px solid; padding: 4px 11px; border-radius: 6px; margin-bottom: 14px;
        }
        .ach-title {
          font-family: var(--f-display); font-size: .92rem; font-weight: 700;
          letter-spacing: .06em; color: var(--text-hi); margin-bottom: 10px;
          line-height: 1.4; text-transform: uppercase;
        }
        .ach-issuer-row {
          display: flex; align-items: center; gap: 8px; margin-bottom: 10px;
        }
        .ach-issuer-logo { width: 22px; height: 22px; object-fit: contain; border-radius: 4px; }
        .ach-issuer { font-family: var(--f-mono); font-size: .64rem; color: var(--text-mid); letter-spacing: .1em; }
        .ach-desc {
          font-family: var(--f-body); font-size: .86rem; line-height: 1.7;
          color: var(--text-mid); margin-bottom: 14px;
        }
        .ach-footer { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .ach-date {
          font-family: var(--f-mono); font-size: .62rem; color: var(--text-lo); letter-spacing: .12em;
        }
        .ach-proof-btn {
          font-family: var(--f-mono); font-size: .6rem; letter-spacing: .15em;
          text-decoration: none; padding: 5px 12px; border-radius: 6px;
          border: 1px solid; transition: all .2s;
        }
        .ach-proof-btn:hover { filter: brightness(1.2); transform: translateY(-1px); }
        .ach-bg-num {
          position: absolute; bottom: -10px; right: 16px;
          font-family: var(--f-display); font-size: 5rem; font-weight: 900;
          opacity: .04; pointer-events: none; line-height: 1;
          letter-spacing: -.02em;
        }
        @media(max-width:640px){ .ach-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
