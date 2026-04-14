import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/store'

const up   = { hidden:{opacity:0,y:26}, show:{opacity:1,y:0,transition:{duration:.5,ease:[.16,1,.3,1]}} }
const stag = { hidden:{}, show:{transition:{staggerChildren:.08}} }

function fmt(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US',{ month:'short', year:'numeric' })
}

function CertCard({ cert }) {
  const [flipped, setFlipped] = useState(false)
  const expired = cert.expiryDate && new Date(cert.expiryDate) < new Date()

  return (
    <motion.div
      variants={up}
      className="cert-card-wrap"
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        className="cert-card-inner"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: .55, ease:[.16,1,.3,1] }}
        style={{ transformStyle:'preserve-3d' }}
      >
        {/* Front */}
        <div className="cert-face cert-front gc">
          {cert.featured && <div className="cert-feat">✦ FEATURED</div>}
          {expired       && <div className="cert-expired">EXPIRED</div>}

          <div className="cert-issuer-row">
            {cert.issuerLogo
              ? <img src={cert.issuerLogo} alt={cert.issuer} className="cert-issuer-logo" />
              : <div className="cert-issuer-ph">{cert.issuer?.charAt(0)}</div>
            }
            <span className="cert-issuer">{cert.issuer}</span>
          </div>

          <h3 className="cert-title">{cert.title}</h3>

          <div className="cert-dates-row">
            <div className="cert-date-item">
              <span className="cert-date-lbl">ISSUED</span>
              <span className="cert-date-val">{fmt(cert.issueDate)}</span>
            </div>
            {cert.expiryDate && (
              <div className="cert-date-item">
                <span className="cert-date-lbl">EXPIRES</span>
                <span className="cert-date-val" style={{ color: expired ? 'var(--rose)':'var(--teal)' }}>
                  {fmt(cert.expiryDate)}
                </span>
              </div>
            )}
          </div>

          {cert.credentialId && (
            <div className="cert-cid">
              <span className="cert-cid-lbl">ID</span>
              <span className="cert-cid-val">{cert.credentialId}</span>
            </div>
          )}

          <div className="cert-flip-hint">CLICK TO FLIP →</div>
        </div>

        {/* Back */}
        <div className="cert-face cert-back gc" style={{ transform:'rotateY(180deg)' }}>
          <h3 className="cert-back-title">{cert.title}</h3>

          {cert.description && <p className="cert-back-desc">{cert.description}</p>}

          <div className="cert-back-actions">
            {cert.credentialURL && (
              <a
                href={cert.credentialURL}
                target="_blank"
                rel="noopener noreferrer"
                className="cert-verify-btn"
                onClick={e => e.stopPropagation()}
              >
                ✓ VERIFY CERTIFICATE
              </a>
            )}
            {cert.certificateImage && (
              <a
                href={cert.certificateImage}
                target="_blank"
                rel="noopener noreferrer"
                className="cert-view-btn"
                onClick={e => e.stopPropagation()}
              >
                ↗ VIEW IMAGE
              </a>
            )}
          </div>

          <div className="cert-flip-hint">CLICK TO FLIP BACK ←</div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function CertificatesSection() {
  const { certificates, navigate } = useStore()
  const [showAll, setShowAll] = useState(false)
  const featured = certificates.filter(c => c.featured)
  const display  = showAll ? certificates : (featured.length ? featured : certificates.slice(0,6))

  return (
    <div className="sp">
      <div className="sp-inner">
        <motion.div variants={stag} initial="hidden" animate="show">
          <motion.button variants={up} className="sp-back" onClick={() => navigate(null)}>← BACK TO PLANET</motion.button>

          <motion.div variants={up}>
            <p className="sp-eyebrow" style={{'--sec-col':'#ff9040'}}>✦ CREDENTIAL VAULT</p>
            <h1 className="sp-title" style={{ background:'linear-gradient(135deg,#fff 0%,#ff9040 55%,#ff5500 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              CERTIFICATES
            </h1>
          </motion.div>

          {certificates.length > 0 ? (
            <>
              <motion.div className="cert-grid" variants={stag}>
                {display.map(c => <CertCard key={c._id} cert={c} />)}
              </motion.div>

              {certificates.length > 6 && (
                <motion.div variants={up} className="cert-show-more">
                  <button className="cert-toggle-btn" onClick={() => setShowAll(!showAll)}>
                    {showAll ? '↑ SHOW LESS' : `↓ SHOW ALL ${certificates.length} CERTIFICATES`}
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            <div className="empty"><span className="empty-ico">✦</span>No certificates added yet</div>
          )}
        </motion.div>
      </div>

      <style>{`
        .cert-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 22px;
          perspective: 1200px;
        }
        .cert-card-wrap {
          height: 240px;
          cursor: none;
          perspective: 1000px;
        }
        .cert-card-inner {
          width: 100%; height: 100%;
          position: relative;
        }
        .cert-face {
          position: absolute; inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          padding: 22px;
          display: flex; flex-direction: column;
          border-radius: 14px;
          overflow: hidden;
        }
        .cert-front { background: var(--glass); }
        .cert-back  {
          background: linear-gradient(135deg, rgba(255,144,64,.1) 0%, rgba(4,18,44,.95) 100%);
          border-color: rgba(255,144,64,.3);
        }
        .cert-feat {
          position: absolute; top: 12px; right: 12px;
          font-family: var(--f-mono); font-size: .56rem; letter-spacing: .15em;
          color: var(--gold); background: rgba(245,200,66,.1);
          border: 1px solid rgba(245,200,66,.3); padding: 3px 9px; border-radius: 100px;
        }
        .cert-expired {
          position: absolute; top: 12px; left: 12px;
          font-family: var(--f-mono); font-size: .56rem; letter-spacing: .15em;
          color: var(--rose); background: rgba(255,77,141,.1);
          border: 1px solid rgba(255,77,141,.3); padding: 3px 9px; border-radius: 100px;
        }
        .cert-issuer-row {
          display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
        }
        .cert-issuer-logo { width: 28px; height: 28px; object-fit: contain; border-radius: 6px; }
        .cert-issuer-ph {
          width: 28px; height: 28px; border-radius: 6px;
          background: linear-gradient(135deg, rgba(255,144,64,.3), rgba(255,144,64,.1));
          border: 1px solid rgba(255,144,64,.3);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--f-display); font-size: .75rem; color: #ff9040;
        }
        .cert-issuer { font-family: var(--f-mono); font-size: .68rem; color: #ff9040; letter-spacing: .12em; }
        .cert-title {
          font-family: var(--f-display); font-size: .85rem; font-weight: 700;
          letter-spacing: .06em; color: var(--text-hi); flex: 1;
          line-height: 1.4; text-transform: uppercase;
        }
        .cert-dates-row { display: flex; gap: 18px; margin-top: 12px; }
        .cert-date-item { display: flex; flex-direction: column; gap: 2px; }
        .cert-date-lbl { font-family: var(--f-mono); font-size: .54rem; color: var(--text-lo); letter-spacing: .2em; }
        .cert-date-val { font-family: var(--f-mono); font-size: .68rem; color: var(--text-mid); letter-spacing: .08em; }
        .cert-cid {
          display: flex; align-items: center; gap: 8px; margin-top: 8px;
          font-family: var(--f-mono); font-size: .62rem; color: var(--text-lo);
        }
        .cert-cid-lbl { color: var(--text-lo); }
        .cert-cid-val { color: var(--text-mid); }
        .cert-flip-hint {
          margin-top: auto; padding-top: 10px;
          font-family: var(--f-mono); font-size: .56rem; color: var(--text-lo);
          letter-spacing: .2em; text-align: right; opacity: .6;
        }
        .cert-back-title {
          font-family: var(--f-display); font-size: .88rem; font-weight: 700;
          color: var(--text-hi); margin-bottom: 12px; letter-spacing: .06em;
        }
        .cert-back-desc {
          font-family: var(--f-body); font-size: .86rem; line-height: 1.72;
          color: var(--text-mid); flex: 1;
        }
        .cert-back-actions { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
        .cert-verify-btn, .cert-view-btn {
          font-family: var(--f-mono); font-size: .64rem; letter-spacing: .18em;
          text-decoration: none; padding: 9px 16px; border-radius: 7px;
          text-align: center; transition: all .2s; display: block;
        }
        .cert-verify-btn {
          color: var(--void); background: linear-gradient(135deg, #ff9040, #ff5500);
          box-shadow: 0 4px 16px rgba(255,144,64,.3);
        }
        .cert-verify-btn:hover { opacity: .9; transform: translateY(-1px); }
        .cert-view-btn {
          color: #ff9040; border: 1px solid rgba(255,144,64,.3); background: rgba(255,144,64,.06);
        }
        .cert-view-btn:hover { background: rgba(255,144,64,.12); }
        .cert-show-more { text-align: center; margin-top: 36px; }
        .cert-toggle-btn {
          font-family: var(--f-display); font-size: .68rem; font-weight: 600;
          letter-spacing: .2em; color: #ff9040;
          border: 1px solid rgba(255,144,64,.35); background: rgba(255,144,64,.06);
          padding: 12px 28px; border-radius: 8px; transition: all .2s;
        }
        .cert-toggle-btn:hover { background: rgba(255,144,64,.12); box-shadow: 0 0 24px rgba(255,144,64,.15); }
        @media(max-width:640px){ .cert-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
