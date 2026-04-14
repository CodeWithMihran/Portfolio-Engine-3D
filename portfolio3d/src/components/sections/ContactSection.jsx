import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/store'
import { api } from '../../services/api'

const up   = { hidden:{opacity:0,y:26}, show:{opacity:1,y:0,transition:{duration:.5,ease:[.16,1,.3,1]}} }
const stag = { hidden:{}, show:{transition:{staggerChildren:.09}} }

const FIELDS = [
  { name:'name',    label:'YOUR NAME',    type:'text',     placeholder:'John Doe',              required:true  },
  { name:'email',   label:'EMAIL ADDRESS',type:'email',    placeholder:'john@example.com',      required:true  },
  { name:'subject', label:'SUBJECT',      type:'text',     placeholder:'Project Collaboration', required:false },
]

export default function ContactSection() {
  const { profile, navigate } = useStore()

  const [form,    setForm]    = useState({ name:'', email:'', subject:'', message:'' })
  const [errors,  setErrors]  = useState({})
  const [status,  setStatus]  = useState('idle') // idle | loading | success | error
  const [errMsg,  setErrMsg]  = useState('')
  const [focused, setFocused] = useState(null)

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.email.trim())   e.email   = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStatus('loading')
    try {
      await api.contact.send(form)
      setStatus('success')
      setForm({ name:'', email:'', subject:'', message:'' })
    } catch (err) {
      setStatus('error')
      setErrMsg(err?.response?.data?.message || 'Failed to send. Please try again.')
    }
  }

  const socials = profile?.socialLinks || {}

  return (
    <div className="sp">
      <div className="sp-inner">
        <motion.div variants={stag} initial="hidden" animate="show">
          <motion.button variants={up} className="sp-back" onClick={() => navigate(null)}>← BACK TO PLANET</motion.button>

          <motion.div variants={up}>
            <p className="sp-eyebrow" style={{'--sec-col':'#39ff90'}}>⊕ COMMUNICATION HUB</p>
            <h1 className="sp-title grad-green">CONTACT</h1>
          </motion.div>

          <div className="contact-layout">
            {/* Left — info */}
            <motion.div variants={up} className="contact-info">
              <div className="gc contact-info-card">
                <div className="contact-orb">
                  <div className="contact-orb-core" />
                  <div className="contact-orb-ring r1" />
                  <div className="contact-orb-ring r2" />
                  <div className="contact-orb-ring r3" />
                </div>

                <h3 className="contact-info-title">LET'S BUILD<br/>SOMETHING GREAT</h3>
                <p className="contact-info-sub">
                  {profile?.bio
                    ? `I'm ${profile.fullName} — ${profile.bio.slice(0,100)}${profile.bio.length > 100 ? '…':''}`
                    : "Have a project in mind? Let's connect and create something extraordinary together."
                  }
                </p>

                <div className="contact-channels">
                  {profile?.email && (
                    <a href={`mailto:${profile.email}`} className="contact-channel">
                      <span className="contact-ch-icon">✉</span>
                      <div>
                        <div className="contact-ch-lbl">EMAIL</div>
                        <div className="contact-ch-val">{profile.email}</div>
                      </div>
                    </a>
                  )}
                  {profile?.phone && (
                    <div className="contact-channel">
                      <span className="contact-ch-icon">☎</span>
                      <div>
                        <div className="contact-ch-lbl">PHONE</div>
                        <div className="contact-ch-val">{profile.phone}</div>
                      </div>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="contact-channel">
                      <span className="contact-ch-icon">◎</span>
                      <div>
                        <div className="contact-ch-lbl">LOCATION</div>
                        <div className="contact-ch-val">{profile.location}</div>
                      </div>
                    </div>
                  )}
                </div>

                {Object.values(socials).some(Boolean) && (
                  <div className="contact-socials">
                    {Object.entries(socials).map(([k,v]) => v && (
                      <a key={k} href={v} target="_blank" rel="noopener noreferrer" className="contact-soc">
                        {k.toUpperCase()}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div variants={up} className="contact-form-wrap">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    className="gc contact-success"
                    initial={{ opacity:0, scale:.92 }}
                    animate={{ opacity:1, scale:1 }}
                    transition={{ duration:.5, ease:[.16,1,.3,1] }}
                  >
                    <div className="cs-icon">
                      <div className="cs-ring" />
                      <span>✓</span>
                    </div>
                    <h3 className="cs-title">MESSAGE TRANSMITTED</h3>
                    <p className="cs-msg">Your message has been received. I'll get back to you as soon as possible.</p>
                    <button className="cs-again" onClick={() => setStatus('idle')}>SEND ANOTHER →</button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    className="gc contact-form"
                    onSubmit={handleSubmit}
                    initial={{ opacity:0 }}
                    animate={{ opacity:1 }}
                  >
                    <p className="contact-form-title">SEND A MESSAGE</p>

                    <div className="contact-fields">
                      {FIELDS.map(f => (
                        <div key={f.name} className={`cf-group${errors[f.name]?' has-error':''}`}>
                          <label className="cf-label">{f.label}{f.required && <span className="cf-req">*</span>}</label>
                          <div className={`cf-input-wrap${focused===f.name?' focused':''}`}>
                            <input
                              type={f.type}
                              name={f.name}
                              value={form[f.name]}
                              placeholder={f.placeholder}
                              className="cf-input"
                              onChange={e => setForm(p => ({...p, [f.name]:e.target.value}))}
                              onFocus={() => setFocused(f.name)}
                              onBlur={() => setFocused(null)}
                            />
                          </div>
                          {errors[f.name] && <span className="cf-error">{errors[f.name]}</span>}
                        </div>
                      ))}

                      {/* Message textarea */}
                      <div className={`cf-group${errors.message?' has-error':''}`}>
                        <label className="cf-label">MESSAGE<span className="cf-req">*</span></label>
                        <div className={`cf-input-wrap cf-textarea-wrap${focused==='message'?' focused':''}`}>
                          <textarea
                            name="message"
                            value={form.message}
                            placeholder="Tell me about your project, idea, or just say hello..."
                            className="cf-input cf-textarea"
                            rows={5}
                            onChange={e => setForm(p => ({...p, message:e.target.value}))}
                            onFocus={() => setFocused('message')}
                            onBlur={() => setFocused(null)}
                          />
                        </div>
                        {errors.message && <span className="cf-error">{errors.message}</span>}
                      </div>
                    </div>

                    {status === 'error' && (
                      <div className="cf-server-error">{errMsg}</div>
                    )}

                    <button
                      type="submit"
                      className="cf-submit"
                      disabled={status === 'loading'}
                    >
                      {status === 'loading' ? (
                        <span className="cf-loading">
                          <span className="cf-spinner" /> TRANSMITTING...
                        </span>
                      ) : (
                        'TRANSMIT MESSAGE →'
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .contact-layout {
          display: grid; grid-template-columns: 340px 1fr; gap: 24px; align-items: start;
        }
        .contact-info { position: sticky; top: 100px; }
        .contact-info-card { padding: 30px; display: flex; flex-direction: column; gap: 20px; }
        .contact-orb {
          position: relative; width: 72px; height: 72px;
          display: flex; align-items: center; justify-content: center;
        }
        .contact-orb-core {
          width: 20px; height: 20px; border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, var(--green), #003322);
          box-shadow: 0 0 20px rgba(57,255,144,.7);
        }
        .contact-orb-ring {
          position: absolute; border-radius: 50%; border: 1px solid transparent;
        }
        .r1 { width:36px; height:36px; border-top-color:var(--green); animation:spin 2s linear infinite; }
        .r2 { width:52px; height:52px; border-right-color:var(--teal); animation:spin 3.5s linear infinite reverse; }
        .r3 { width:70px; height:70px; border-bottom-color:rgba(57,255,144,.3); animation:spin 5s linear infinite; }
        .contact-info-title {
          font-family: var(--f-display); font-size: 1.15rem; font-weight: 800;
          letter-spacing: .06em; line-height: 1.25; color: var(--text-hi);
          text-transform: uppercase;
        }
        .contact-info-sub {
          font-family: var(--f-body); font-size: .88rem; line-height: 1.75; color: var(--text-mid);
        }
        .contact-channels { display: flex; flex-direction: column; gap: 12px; }
        .contact-channel {
          display: flex; align-items: center; gap: 13px;
          padding: 11px 14px; border-radius: 9px;
          background: rgba(255,255,255,.025);
          border: 1px solid rgba(255,255,255,.06);
          text-decoration: none; transition: all .2s;
        }
        a.contact-channel:hover { background: rgba(57,255,144,.05); border-color: rgba(57,255,144,.2); }
        .contact-ch-icon {
          font-size: 1.1rem; color: var(--green); width: 24px; text-align: center; flex-shrink: 0;
        }
        .contact-ch-lbl {
          font-family: var(--f-mono); font-size: .54rem; letter-spacing: .25em; color: var(--text-lo); margin-bottom: 3px;
        }
        .contact-ch-val { font-family: var(--f-body); font-size: .84rem; color: var(--text-hi); }
        .contact-socials { display: flex; flex-wrap: wrap; gap: 7px; }
        .contact-soc {
          font-family: var(--f-mono); font-size: .58rem; letter-spacing: .15em;
          color: var(--text-lo); border: 1px solid rgba(255,255,255,.09);
          padding: 5px 11px; border-radius: 5px; text-decoration: none; transition: all .2s;
        }
        .contact-soc:hover { color: var(--green); border-color: rgba(57,255,144,.3); background: rgba(57,255,144,.05); }

        /* Form */
        .contact-form { padding: 30px; display: flex; flex-direction: column; gap: 22px; }
        .contact-form-title {
          font-family: var(--f-display); font-size: .78rem; font-weight: 700; letter-spacing: .28em;
          color: var(--green); text-transform: uppercase;
          padding-bottom: 16px; border-bottom: 1px solid var(--border);
        }
        .contact-fields { display: flex; flex-direction: column; gap: 16px; }
        .cf-group { display: flex; flex-direction: column; gap: 7px; }
        .cf-label {
          font-family: var(--f-mono); font-size: .6rem; letter-spacing: .25em;
          color: var(--text-lo); text-transform: uppercase;
        }
        .cf-req { color: var(--rose); margin-left: 4px; }
        .cf-input-wrap {
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 8px; background: rgba(255,255,255,.025);
          transition: border-color .22s ease, box-shadow .22s ease;
        }
        .cf-input-wrap.focused {
          border-color: rgba(57,255,144,.45);
          box-shadow: 0 0 0 3px rgba(57,255,144,.06);
        }
        .has-error .cf-input-wrap { border-color: rgba(255,77,141,.5); }
        .cf-input {
          width: 100%; background: none; border: none; outline: none;
          font-family: var(--f-body); font-size: .92rem; color: var(--text-hi);
          padding: 12px 16px; letter-spacing: .02em;
        }
        .cf-input::placeholder { color: var(--text-lo); }
        .cf-textarea { resize: vertical; min-height: 110px; }
        .cf-textarea-wrap { overflow: hidden; }
        .cf-error {
          font-family: var(--f-mono); font-size: .6rem; color: var(--rose); letter-spacing: .1em;
        }
        .cf-server-error {
          font-family: var(--f-mono); font-size: .66rem; color: var(--rose);
          background: rgba(255,77,141,.08); border: 1px solid rgba(255,77,141,.25);
          padding: 10px 16px; border-radius: 7px; letter-spacing: .08em;
        }
        .cf-submit {
          font-family: var(--f-display); font-size: .72rem; font-weight: 700;
          letter-spacing: .22em; color: #020408;
          background: linear-gradient(135deg, var(--green), var(--teal));
          border: none; padding: 14px 28px; border-radius: 8px;
          box-shadow: 0 4px 22px rgba(57,255,144,.28); transition: all .22s;
        }
        .cf-submit:hover:not(:disabled) { opacity: .9; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(57,255,144,.35); }
        .cf-submit:disabled { opacity: .6; cursor: not-allowed; }
        .cf-loading { display: flex; align-items: center; gap: 10px; }
        .cf-spinner {
          display: inline-block; width: 14px; height: 14px; border-radius: 50%;
          border: 2px solid rgba(0,0,0,.3); border-top-color: #020408;
          animation: spin .8s linear infinite;
        }

        /* Success state */
        .contact-success {
          padding: 60px 30px; display: flex; flex-direction: column;
          align-items: center; text-align: center; gap: 18px;
        }
        .cs-icon {
          position: relative; width: 80px; height: 80px;
          display: flex; align-items: center; justify-content: center;
          font-size: 2.2rem; color: var(--green);
        }
        .cs-ring {
          position: absolute; inset: 0; border-radius: 50%;
          border: 2px solid var(--green); opacity: .4;
          animation: pulse 2s ease-in-out infinite;
        }
        .cs-title {
          font-family: var(--f-display); font-size: 1.1rem; font-weight: 800;
          letter-spacing: .1em; color: var(--text-hi);
        }
        .cs-msg { font-family: var(--f-body); font-size: .9rem; color: var(--text-mid); max-width: 340px; line-height: 1.75; }
        .cs-again {
          font-family: var(--f-mono); font-size: .66rem; letter-spacing: .2em;
          color: var(--green); border: 1px solid rgba(57,255,144,.35);
          background: rgba(57,255,144,.06); padding: 10px 22px; border-radius: 7px;
          margin-top: 8px; transition: all .2s;
        }
        .cs-again:hover { background: rgba(57,255,144,.12); }

        @media(max-width:900px){
          .contact-layout { grid-template-columns: 1fr; }
          .contact-info { position: static; }
        }
      `}</style>
    </div>
  )
}
