import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/store'

const up   = { hidden:{opacity:0,y:26}, show:{opacity:1,y:0,transition:{duration:.5,ease:[.16,1,.3,1]}} }
const stag = { hidden:{}, show:{transition:{staggerChildren:.07}} }

function ProjectCard({ p }) {
  const [open, setOpen] = useState(false)
  const sc = { completed:'#00ffcc', 'in-progress':'#f5c842', archived:'#555' }[p.status] || '#555'

  return (
    <motion.div variants={up} className="gc proj-card" whileHover={{ y:-5, boxShadow:'0 20px 55px rgba(0,212,255,.1)' }}>
      <div className="proj-thumb">
        {p.thumbnail
          ? <img src={p.thumbnail} alt={p.title} />
          : <div className="proj-thumb-ph"><span>⬡</span></div>
        }
        <div className="proj-status" style={{ color:sc, borderColor:sc+'44', background:sc+'11' }}>
          {p.status?.replace('-',' ').toUpperCase()}
        </div>
        {p.featured && <div className="proj-feat">★ FEATURED</div>}
      </div>

      <div className="proj-body">
        <h3 className="proj-title">{p.title}</h3>
        <p className="proj-desc">{p.shortDescription || p.description?.slice(0,130)}{p.description?.length > 130 ? '…' : ''}</p>

        {p.technologies?.length > 0 && (
          <div className="proj-techs">
            {p.technologies.slice(0,5).map((t,i) => <span key={i} className="chip chip-cyan">{t}</span>)}
            {p.technologies.length > 5 && <span className="chip chip-cyan">+{p.technologies.length-5}</span>}
          </div>
        )}

        <AnimatePresence>
          {open && (
            <motion.div
              className="proj-more"
              initial={{ height:0, opacity:0 }}
              animate={{ height:'auto', opacity:1 }}
              exit={{ height:0, opacity:0 }}
              transition={{ duration:.28 }}
            >
              {p.description && p.shortDescription && (
                <p style={{ fontSize:'.86rem', lineHeight:'1.75', color:'var(--text-mid)', marginBottom:'12px' }}>{p.description}</p>
              )}
              {p.role && <div className="proj-meta"><span className="proj-mlbl">ROLE</span><span>{p.role}</span></div>}
              {p.challenges && <div className="proj-meta"><span className="proj-mlbl">CHALLENGES</span><span>{p.challenges}</span></div>}
              {p.learnings  && <div className="proj-meta"><span className="proj-mlbl">LEARNINGS</span><span>{p.learnings}</span></div>}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="proj-actions">
          <button className="proj-toggle" onClick={() => setOpen(!open)}>
            {open ? '↑ LESS' : '↓ MORE'}
          </button>
          <div className="proj-links">
            {p.githubLink && <a href={p.githubLink} target="_blank" rel="noopener noreferrer" className="proj-lnk">GITHUB →</a>}
            {p.liveLink   && <a href={p.liveLink}   target="_blank" rel="noopener noreferrer" className="proj-lnk live">LIVE →</a>}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function ProjectsSection() {
  const { projects, navigate } = useStore()
  const [tag, setTag] = useState('ALL')
  const tags = ['ALL', ...new Set(projects.flatMap(p => p.tags||[]))]
  const list = tag === 'ALL' ? projects : projects.filter(p => p.tags?.includes(tag))

  return (
    <div className="sp">
      <div className="sp-inner">
        <motion.div variants={stag} initial="hidden" animate="show">
          <motion.button variants={up} className="sp-back" onClick={() => navigate(null)}>← BACK TO PLANET</motion.button>
          <motion.div variants={up}>
            <p className="sp-eyebrow" style={{'--sec-col':'#f5c842'}}>⬡ CREATION TERRITORY</p>
            <h1 className="sp-title grad-gold">PROJECTS</h1>
          </motion.div>
          {tags.length > 1 && (
            <motion.div variants={up} className="proj-filters">
              {tags.map(t => (
                <button key={t} className={`filter-btn${tag===t?' active':''}`} onClick={() => setTag(t)}>{t}</button>
              ))}
            </motion.div>
          )}
          <motion.div className="proj-grid" variants={stag}>
            {list.length > 0
              ? list.map(p => <ProjectCard key={p._id} p={p} />)
              : <div className="empty"><span className="empty-ico">⬡</span>No projects yet</div>
            }
          </motion.div>
        </motion.div>
      </div>
      <style>{`
        .proj-filters{display:flex;flex-wrap:wrap;gap:9px;margin-bottom:38px;}
        .filter-btn{font-family:var(--f-mono);font-size:.64rem;letter-spacing:.2em;color:var(--text-lo);background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);padding:7px 15px;border-radius:100px;transition:all .2s;}
        .filter-btn.active,.filter-btn:hover{color:var(--gold);border-color:rgba(245,200,66,.38);background:rgba(245,200,66,.07);}
        .proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:22px;}
        .proj-card{overflow:hidden;}
        .proj-thumb{position:relative;height:196px;overflow:hidden;background:linear-gradient(135deg,#071428,#0a1f3d);}
        .proj-thumb img{width:100%;height:100%;object-fit:cover;transition:transform .4s ease;}
        .proj-card:hover .proj-thumb img{transform:scale(1.05);}
        .proj-thumb-ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;}
        .proj-thumb-ph span{font-size:4rem;color:rgba(0,212,255,.15);}
        .proj-status{position:absolute;top:11px;left:11px;font-family:var(--f-mono);font-size:.56rem;letter-spacing:.18em;border:1px solid;padding:4px 9px;border-radius:100px;}
        .proj-feat{position:absolute;top:11px;right:11px;font-family:var(--f-mono);font-size:.56rem;letter-spacing:.14em;color:var(--gold);background:rgba(245,200,66,.1);border:1px solid rgba(245,200,66,.28);padding:4px 9px;border-radius:100px;}
        .proj-body{padding:22px;}
        .proj-title{font-family:var(--f-display);font-size:.95rem;font-weight:700;letter-spacing:.08em;color:var(--text-hi);margin-bottom:9px;text-transform:uppercase;}
        .proj-desc{font-family:var(--f-body);font-size:.88rem;line-height:1.72;color:var(--text-mid);margin-bottom:14px;}
        .proj-techs{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px;}
        .proj-more{overflow:hidden;}
        .proj-meta{display:flex;gap:11px;margin-bottom:8px;font-size:.82rem;color:var(--text-mid);}
        .proj-mlbl{font-family:var(--f-mono);font-size:.58rem;letter-spacing:.14em;color:var(--cyan);min-width:80px;flex-shrink:0;margin-top:2px;}
        .proj-actions{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:9px;margin-top:14px;}
        .proj-toggle{font-family:var(--f-mono);font-size:.62rem;letter-spacing:.18em;color:var(--text-lo);border:1px solid rgba(255,255,255,.07);padding:6px 13px;border-radius:5px;transition:all .2s;}
        .proj-toggle:hover{color:var(--text-hi);border-color:rgba(255,255,255,.18);}
        .proj-links{display:flex;gap:9px;}
        .proj-lnk{font-family:var(--f-mono);font-size:.62rem;letter-spacing:.14em;text-decoration:none;padding:6px 13px;border-radius:5px;color:var(--text-mid);border:1px solid rgba(255,255,255,.09);transition:all .2s;}
        .proj-lnk:hover{color:var(--text-hi);border-color:rgba(255,255,255,.25);}
        .proj-lnk.live{color:var(--gold);border-color:rgba(245,200,66,.28);background:rgba(245,200,66,.05);}
        .proj-lnk.live:hover{background:rgba(245,200,66,.1);border-color:var(--gold);}
        @media(max-width:700px){.proj-grid{grid-template-columns:1fr;}}
      `}</style>
    </div>
  )
}
