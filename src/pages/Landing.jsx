import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = [
  { icon: '🧘', title: 'Guided Meditations', desc: 'Curated sessions for focus, sleep, and exam anxiety. From 5 to 30 minutes — fit into any schedule.' },
  { icon: '🌬️', title: 'Breathing Exercises', desc: 'Box breathing, 4-7-8, and deep breathing techniques. Visualised with smooth, calming animations.' },
  { icon: '📔', title: 'Mood Journal', desc: 'Track how you feel each day with emoji check-ins and brief reflections. Spot patterns over time.' },
  { icon: '⏱️', title: 'Focus Timer', desc: 'Pomodoro-style timer to help you study smarter. Work in focused sprints, rest with intention.' },
  { icon: '📈', title: 'Progress Streaks', desc: 'Stay consistent with daily streaks and session counts. Small habits compound into lasting calm.' },
  { icon: '🎓', title: 'Student-Focused', desc: 'Designed specifically around exam seasons, late nights, and the very real pressure of college stress.' },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function Landing() {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      {/* ── Hero ── */}
      <section style={{
        minHeight: 'calc(100vh - 72px)', paddingTop: 72,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '72px 24px 80px',
      }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span style={{
            display: 'inline-block',
            fontSize: '0.73rem', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#8c7fa0',
            background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(167,139,202,0.25)',
            padding: '6px 18px', borderRadius: 50, marginBottom: 32,
            backdropFilter: 'blur(8px)',
          }}>✦ For students, by students</span>

          <h1 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 'clamp(3rem, 7vw, 5.5rem)',
            fontWeight: 400, fontStyle: 'italic',
            lineHeight: 1.1, color: '#2d2538',
            letterSpacing: '-0.02em', marginBottom: 20,
          }}>
            Your space to<br /><span style={{ color: '#a78bca' }}>breathe & reset</span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: '#8c7fa0', marginBottom: 44, fontWeight: 300, letterSpacing: '0.02em' }}>
            Breathe. Be still. Begin again.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/signup" className="btn-primary">✦ Start for free</Link>
            <Link to="/login"  className="btn-secondary">Sign in →</Link>
          </div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '80px 24px 100px', maxWidth: 1100, margin: '0 auto' }}>
        <p className="section-label" style={{ textAlign: 'center', marginBottom: 10 }}>Why SerenSpace</p>
        <h2 style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400,
          textAlign: 'center', color: '#2d2538', marginBottom: 56, lineHeight: 1.2,
        }}>
          Built for the chaos of <em>college life</em>
        </h2>

        <motion.div
          variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={item} className="glass-card" style={{ padding: '32px 28px' }}>
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
      </section>
    </div>
  )
}
