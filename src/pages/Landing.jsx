import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = [
  { icon: '🌷', title: 'Daily Affirmations', desc: 'Positive affirmations for focus, confidence.' },
  { icon: '🌬️', title: 'Breathing Exercises', desc: 'Box breathing and deep breathing techniques.' },
  { icon: '💌', title: 'Mood Journal', desc: 'Track how you feel each day with emoji check-ins.' },
  { icon: '🎧', title: 'Focus Timer', desc: 'Timer to help you study smarter.' },
  { icon: '🧸', title: 'Progress Streaks', desc: 'Stay consistent with daily session counts.' },
  { icon: '🐇', title: 'Made for Students', desc: 'Designed for exam seasons.' },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function Landing() {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '120px 24px 60px',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ position: 'fixed', top: '15%', left: '5%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(167,139,202,0.12)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'fixed', top: '30%', right: '8%', width: 250, height: 250, borderRadius: '50%', background: 'rgba(252,224,236,0.2)', filter: 'blur(70px)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>

          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '18%', left: '12%', fontSize: '1.8rem', opacity: 0.6, pointerEvents: 'none' }}>
            🐇
          </motion.div>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            style={{ position: 'absolute', top: '22%', right: '14%', fontSize: '1.6rem', opacity: 0.55, pointerEvents: 'none' }}>
            🌷
          </motion.div>
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            style={{ position: 'absolute', top: '60%', left: '8%', fontSize: '1.5rem', opacity: 0.5, pointerEvents: 'none' }}>
            🍓
          </motion.div>
          <motion.div animate={{ y: [0, -9, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            style={{ position: 'absolute', top: '55%', right: '10%', fontSize: '1.6rem', opacity: 0.5, pointerEvents: 'none' }}>
            ✮
          </motion.div>
          <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            style={{ position: 'absolute', top: '75%', left: '18%', fontSize: '1.4rem', opacity: 0.45, pointerEvents: 'none' }}>
            🍥
          </motion.div>
          <motion.div animate={{ y: [0, -11, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            style={{ position: 'absolute', top: '78%', right: '16%', fontSize: '1.4rem', opacity: 0.45, pointerEvents: 'none' }}>
            🧸
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ fontSize: '0.82rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a78bca', marginBottom: 28, fontWeight: 500 }}>
            ✮ SerenSpace ✮
          </motion.p>

          <h1 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 'clamp(3.2rem, 8vw, 6rem)',
            fontWeight: 300, lineHeight: 1.05,
            color: '#2d2538', letterSpacing: '-0.03em',
            marginBottom: 24,
          }}>
            Find your calm<br />
            <span style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #a78bca, #c4a0d8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>in the chaos 🌷</span>
          </h1>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/signup" className="btn-primary" style={{ padding: '14px 32px', fontSize: '0.95rem' }}>🌷 Begin your journey</Link>
            <Link to="/login" className="btn-secondary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>Sign in</Link>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            style={{ marginTop: 48, fontSize: '0.78rem', color: '#c0b4d0', letterSpacing: '0.1em' }}>
            ⋆ ˚｡⋆୨♡୧⋆ ˚｡⋆
          </motion.p>
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ padding: '0 24px 120px', maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 400,
            color: '#2d2538', lineHeight: 1.2, marginBottom: 12,
          }}>
            Everything you need to <em>feel better</em>
          </h2>
        </motion.div>

        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {features.map((f) => (
            <motion.div key={f.title} variants={item}
              whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(167,139,202,0.2)' }}
              style={{
                padding: '32px 28px', borderRadius: 20,
                background: 'rgba(255,255,255,0.35)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.6)',
                transition: 'all 0.2s',
              }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14, fontSize: '1.4rem',
                background: 'rgba(167,139,202,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 18,
              }}>{f.icon}</div>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.3rem', fontWeight: 600, color: '#2d2538', marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: '0.88rem', color: '#8c7fa0', lineHeight: 1.7 }}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginTop: 72 }}>
          <Link to="/signup" className="btn-primary" style={{ padding: '14px 36px', fontSize: '0.95rem' }}>
            Create your free account
          </Link>
          <p style={{ marginTop: 24, fontSize: '0.78rem', color: '#c0b4d0', letterSpacing: '0.1em' }}>
            🐇 free forever · 💌 no spam · 🧸 just calm
          </p>
        </motion.div>
      </section>
    </div>
  )
}