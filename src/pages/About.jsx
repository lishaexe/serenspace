import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const stack = [
  { name: 'React', desc: 'Frontend UI library', icon: '⚛️' },
  { name: 'Node.js', desc: 'Backend runtime', icon: '🟢' },
  { name: 'Express', desc: 'Web framework', icon: '🚂' },
  { name: 'MongoDB Atlas', desc: 'Cloud database', icon: '🍃' },
  { name: 'JWT', desc: 'Authentication', icon: '🔐' },
  { name: 'Vercel', desc: 'Frontend deployment', icon: '▲' },
  { name: 'Render', desc: 'Backend deployment', icon: '🚀' },
]

export default function About() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '120px 24px 80px', position: 'relative', zIndex: 1 }}>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p style={{ fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a78bca', marginBottom: 12 }}>About</p>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 400, fontStyle: 'italic', color: '#2d2538', marginBottom: 24 }}>
          SerenSpace
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#8c7fa0', lineHeight: 1.8, marginBottom: 48 }}>
          SerenSpace is a mental wellness and productivity platform designed to help college students manage stress, improve focus, and build healthy habits — through breathing exercises, daily affirmations, mood journaling, and focus sessions.
        </p>

        {/* Why we built it */}
        <div className="glass-card" style={{ padding: '32px', marginBottom: 32 }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', color: '#2d2538', marginBottom: 16 }}>Why we built it</h2>
          <p style={{ color: '#8c7fa0', lineHeight: 1.8 }}>
            College life comes with exam pressure, sleepless nights, and constant stress. Most wellness apps are built for working professionals — not students. SerenSpace was built specifically for the chaos of college life, offering simple and effective tools to help students breathe, reflect, and refocus.
          </p>
        </div>

        {/* Tech stack */}
        <div className="glass-card" style={{ padding: '32px', marginBottom: 32 }}>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', color: '#2d2538', marginBottom: 24 }}>Technology Stack</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            {stack.map(s => (
              <div key={s.name} style={{ background: 'rgba(167,139,202,0.08)', borderRadius: 12, padding: '16px 20px' }}>
                <p style={{ fontSize: '1.4rem', marginBottom: 8 }}>{s.icon}</p>
                <p style={{ fontWeight: 600, color: '#2d2538', marginBottom: 4 }}>{s.name}</p>
                <p style={{ fontSize: '0.8rem', color: '#8c7fa0' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        
        <Link to="/" className="btn-primary">← Back to Home</Link>
      </motion.div>
    </div>
  )
}