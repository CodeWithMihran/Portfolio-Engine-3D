import { motion } from 'framer-motion'
import { useStore } from '../../store/store'

const up   = { hidden:{opacity:0,y:28}, show:{opacity:1,y:0,transition:{duration:.55,ease:[.16,1,.3,1]}} }
const stag = { hidden:{}, show:{transition:{staggerChildren:.09}} }

export default function AboutSection() {
  const { profile, navigate } = useStore()
  if (!profile) return <Fallback navigate={navigate} />

  const sl = profile.socialLinks || {}

  return (
    <div className="sp">
      <div className="sp-inner">
        <motion.div variants={stag} initial="hidden" animate="show">

          <motion.button variants={up} className="sp-back" onClick={() => navigate(null)}>
            ← BACK TO PLANET
          </motion.button>

          <motion.div variants={up}>
            <p className="sp-eyebrow" style={{'--sec-col':'#00d4ff'}}>◈ IDENTITY CORE</p>
            <h1 className="sp-title grad-cyan">ABOUT ME</h1>
          </motion.div>

          <div className="about-layout">
            {/* Profile card */}
            <motion.div variants={up} className="gc about-card">
              <div className="about-avatar-wrap">
                {profile.profileImage
                  ? <img src={profile.profileImage} alt={profile.fullName} className="about-avatar" />
                  : <div className="about-avatar-ph">{profile.fullName?.charAt(0) || '?'}</div>
                }
                <div className="about-avatar-ring" />
              </div>

              <h2 className="about-name">{profile.fullName}</h2>
              <p className="about-role">{profile.title}</p>

              {profile.availability && (
                <div className="about-avail">
                  <span className="about-avail-dot" />
                  {profile.availability}
                </div>
              )}

              <div className="about-contacts">
                {profile.email    && <a href={`mailto:${profile.email}`} className="about-ci">✉ {profile.email}</a>}
                {profile.phone    && <div className="about-ci">☎ {profile.phone}</div>}
                {profile.location && <div className="about-ci">◎ {profile.location}</div>}
              </div>

              {Object.values(sl).some(Boolean) && (
                <div className="about-socs">
                  {Object.entries(sl).map(([k,v]) => v && (
                    <a key={k} href={v} target="_blank" rel="noopener noreferrer" className="about-soc">{k.toUpperCase()}</a>
                  ))}
                </div>
              )}

              {profile.resume && (
                <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="about-resume">
                  ↓ DOWNLOAD RÉSUMÉ
                </a>
              )}
            </motion.div>

            {/* Content */}
            <div className="about-content">
              {profile.bio && (
                <motion.div variants={up} className="gc about-bio-card">
                  <p className="sec-label">INTRODUCTION</p>
                  <p className="about-bio">{profile.bio}</p>
                </motion.div>
              )}
              {profile.about && (
                <motion.div variants={up} className="gc about-bio-card">
                  <p className="sec-label">FULL STORY</p>
                  <p className="about-bio">{profile.about}</p>
                </motion.div>
              )}
              <motion.div variants={up} className="about-stats-row">
                {[
                  { val: SECTIONS_COUNT, lbl: 'TERRITORIES', sub: 'sections' },
                  { val: 'OPEN',         lbl: 'STATUS',      sub: 'to opportunities' },
                ].map((s,i) => (
                  <div key={i} className="gc about-stat">
                    <div className="about-stat-val">{s.val}</div>
                    <div className="about-stat-lbl">{s.lbl}</div>
                    <div className="about-stat-sub">{s.sub}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <AboutStyles />
    </div>
  )
}

const SECTIONS_COUNT = 8

function Fallback({ navigate }) {
  return (
    <div className="sp"><div className="sp-inner">
      <button className="sp-back" onClick={() => navigate(null)}>← BACK</button>
      <div className="empty"><span className="empty-ico">◈</span>Profile loading...</div>
    </div></div>
  )
}

function AboutStyles() {
  return <style>{`
    .about-layout { display:grid; grid-template-columns:290px 1fr; gap:22px; align-items:start; }
    .about-card { padding:30px 22px; display:flex; flex-direction:column; align-items:center; gap:14px; text-align:center; position:sticky; top:100px; }
    .about-avatar-wrap { position:relative; width:118px; height:118px; }
    .about-avatar { width:118px; height:118px; border-radius:50%; object-fit:cover; border:2.5px solid var(--cyan); box-shadow:0 0 28px rgba(0,212,255,.3); display:block; }
    .about-avatar-ph { width:118px; height:118px; border-radius:50%; background:linear-gradient(135deg,var(--surface),var(--violet)); border:2.5px solid var(--cyan); display:flex; align-items:center; justify-content:center; font-family:var(--f-display); font-size:2.4rem; color:#fff; box-shadow:0 0 28px rgba(0,212,255,.3); }
    .about-avatar-ring { position:absolute; inset:-6px; border-radius:50%; border:1px solid rgba(0,212,255,.3); border-top-color:var(--cyan); animation:spin 8s linear infinite; }
    .about-name { font-family:var(--f-display); font-size:1.05rem; font-weight:700; letter-spacing:.1em; color:var(--text-hi); }
    .about-role { font-family:var(--f-body); font-size:.88rem; color:var(--cyan); letter-spacing:.06em; }
    .about-avail { display:flex; align-items:center; gap:7px; font-family:var(--f-mono); font-size:.66rem; color:var(--teal); letter-spacing:.15em; background:rgba(0,255,204,.06); padding:5px 13px; border-radius:100px; border:1px solid rgba(0,255,204,.18); }
    .about-avail-dot { width:6px; height:6px; border-radius:50%; background:var(--teal); box-shadow:0 0 6px var(--teal); animation:pulse 2s ease-in-out infinite; flex-shrink:0; }
    .about-contacts { width:100%; display:flex; flex-direction:column; gap:6px; }
    .about-ci { font-family:var(--f-mono); font-size:.68rem; color:var(--text-mid); display:flex; align-items:center; gap:8px; padding:6px 10px; border-radius:6px; background:rgba(255,255,255,.02); transition:color .2s; text-decoration:none; letter-spacing:.04em; }
    a.about-ci:hover { color:var(--cyan); }
    .about-socs { display:flex; flex-wrap:wrap; gap:7px; justify-content:center; }
    .about-soc { font-family:var(--f-mono); font-size:.58rem; letter-spacing:.15em; color:var(--text-lo); border:1px solid rgba(255,255,255,.1); padding:5px 11px; border-radius:5px; text-decoration:none; transition:all .2s; }
    .about-soc:hover { color:var(--cyan); border-color:rgba(0,212,255,.35); background:rgba(0,212,255,.05); }
    .about-resume { display:block; width:100%; text-align:center; font-family:var(--f-display); font-size:.65rem; font-weight:700; letter-spacing:.2em; color:#020408; background:linear-gradient(135deg,var(--cyan),var(--teal)); padding:11px; border-radius:7px; text-decoration:none; box-shadow:0 4px 18px rgba(0,212,255,.28); transition:opacity .2s,transform .2s; }
    .about-resume:hover { opacity:.9; transform:translateY(-2px); }
    .about-content { display:flex; flex-direction:column; gap:18px; }
    .about-bio-card { padding:26px; }
    .about-bio { font-family:var(--f-body); font-size:1rem; line-height:1.85; color:var(--text-mid); font-weight:400; }
    .about-stats-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    .about-stat { padding:24px; text-align:center; }
    .about-stat-val { font-family:var(--f-display); font-size:2rem; font-weight:900; background:linear-gradient(135deg,var(--cyan),var(--teal)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .about-stat-lbl { font-family:var(--f-mono); font-size:.58rem; letter-spacing:.3em; color:var(--text-lo); margin-top:4px; }
    .about-stat-sub { font-family:var(--f-body); font-size:.78rem; color:var(--text-mid); margin-top:2px; }
    @media(max-width:860px){ .about-layout{grid-template-columns:1fr;} .about-card{position:static;} }
  `}</style>
}
