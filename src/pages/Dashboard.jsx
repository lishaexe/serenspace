import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const quotes = [
  { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: 'Dan Millman' },
  { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: 'Anne Lamott' },
  { text: "Rest when you're weary. Refresh and renew yourself, your body, your mind, your spirit.", author: 'Ralph Marston' },
  { text: "The present moment is the only time over which we have dominion.", author: 'Thich Nhat Hanh' },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const fadeItem  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.name?.split(' ')[0] || 'friend'
  const quote = quotes[new Date().getDate() % quotes.length]

  const features = [
    { icon: '🎵', title: 'Meditation Library', desc: 'Browse guided sessions for focus, sleep, and anxiety.', path: '/library' },
    { icon: '🌬️', title: 'Breathe',           desc: 'Calm your nervous system with guided breathing.',       path: '/breathe' },
    { icon: '📔', title: 'Mood Journal',       desc: 'Check in with how you\'re feeling today.',              path: '/journal' },
    { icon: '⏱️', title: 'Focus Timer',        desc: 'Study smarter with Pomodoro sprints.',                  path: '/timer'   },
  ]

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px 80px', position: 'relative', zIndex: 1 }}>
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 40 }}>
        <p className="section-label" style={{ marginBottom: 6 }}>{greeting}</p>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 400, fontStyle: 'italic', color: '#2d2538', lineHeight: 1.2 }}>
          Welcome back, {firstName} 🌿
        </h2>
      </motion.div>

      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Current Streak', value: '7', unit: 'days 🔥' },
          { label: 'Total Sessions', value: '34', unit: 'meditations' },
          { label: 'Time Practiced', value: '4.2', unit: 'hours total' },
          { label: 'Focus Sessions', value: '18', unit: 'pomodoros' },
        ].map(s => (
          <motion.div key={s.label} variants={fadeItem} className="glass-card" style={{ padding: '24px 22px' }}>
            <p className="section-label" style={{ marginBottom: 8 }}>{s.label}</p>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.4rem', fontWeight: 600, color: '#2d2538', lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: '0.8rem', color: '#8c7fa0', marginTop: 4 }}>{s.unit}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Quote */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="glass-card" style={{ padding: '26px 30px', marginBottom: 32, borderLeft: '3px solid rgba(167,139,202,0.4)' }}>
        <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.15rem', fontStyle: 'italic', color: '#2d2538', lineHeight: 1.7, marginBottom: 8 }}>"{quote.text}"</p>
        <p className="section-label">— {quote.author}</p>
      </motion.div>

      {/* Feature cards */}
      <p className="section-label" style={{ marginBottom: 16 }}>Your space</p>
      <motion.div variants={container} initial="hidden" animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {features.map(f => (
          <motion.div key={f.title} variants={fadeItem} className="glass-card"
            style={{ padding: '26px 24px', cursor: 'pointer' }}
            onClick={() => navigate(f.path)}>
            <div style={{ fontSize: '1.7rem', marginBottom: 12 }}>{f.icon}</div>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.15rem', fontWeight: 600, color: '#2d2538', marginBottom: 6 }}>{f.title}</h3>
            <p style={{ fontSize: '0.83rem', color: '#8c7fa0', lineHeight: 1.55, marginBottom: 12 }}>{f.desc}</p>
            <p style={{ fontSize: '0.82rem', color: '#a78bca', fontWeight: 500 }}>Open →</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
