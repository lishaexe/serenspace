import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const MOCK_SESSIONS = [
  { _id: '1', title: 'Morning Clarity',    category: 'Focus',       duration: 10, emoji: '☀️', description: 'Start your day with a clear, focused mind. Gentle awareness meditation.' },
  { _id: '2', title: 'Exam Eve Calm',      category: 'Exam Stress', duration: 15, emoji: '📚', description: 'Settle pre-exam anxiety and build confidence for tomorrow.' },
  { _id: '3', title: 'Deep Sleep Drift',   category: 'Sleep',       duration: 20, emoji: '🌙', description: 'A slow, guided body scan to ease you gently into sleep.' },
  { _id: '4', title: 'Anxiety Release',    category: 'Anxiety',     duration: 12, emoji: '🌊', description: 'Progressive relaxation to loosen tension held in the body.' },
  { _id: '5', title: 'Study Focus',        category: 'Focus',       duration: 8,  emoji: '🎯', description: 'A short session to sharpen attention before a study sprint.' },
  { _id: '6', title: 'Stress Unwind',      category: 'Exam Stress', duration: 18, emoji: '🍃', description: 'Release the weight of the day and return to yourself.' },
  { _id: '7', title: 'Restful Night',      category: 'Sleep',       duration: 25, emoji: '⭐', description: "Slow breathing and visualisation for a full night's rest." },
  { _id: '8', title: 'Social Anxiety Ease',category: 'Anxiety',     duration: 10, emoji: '🕊️', description: 'Build inner steadiness before presentations or social events.' },
  { _id: '9', title: 'Present Moment',     category: 'Focus',       duration: 5,  emoji: '🔵', description: 'A quick reset to anchor you in the here and now.' },
]
const CATEGORIES = ['All', 'Focus', 'Sleep', 'Anxiety', 'Exam Stress']

export default function Library() {
  const { getAuthHeader } = useAuth()
  const [sessions, setSessions] = useState(MOCK_SESSIONS)
  const [filter, setFilter]     = useState('All')
  const [playing, setPlaying]   = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/sessions`, { headers: getAuthHeader() })
      .then(r => r.json()).then(data => { if (Array.isArray(data) && data.length) setSessions(data) })
      .catch(() => {}) // fallback to mock data
  }, [])

  const filtered = filter === 'All' ? sessions : sessions.filter(s => s.category === filter)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px 80px', position: 'relative', zIndex: 1 }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.2rem', fontWeight: 400, fontStyle: 'italic', color: '#2d2538' }}>Meditation Library</h2>
        <p style={{ color: '#8c7fa0', fontSize: '0.88rem', marginTop: 4 }}>Guided sessions to help you focus, sleep better, and ease anxiety.</p>
      </motion.div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {CATEGORIES.map(cat => (
          <button key={cat} className={`chip ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>{cat}</button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
        <AnimatePresence>
          {filtered.map((s, i) => (
            <motion.div key={s._id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card" style={{ padding: 24, cursor: 'pointer' }}
              onClick={() => { setPlaying(s); setIsPlaying(false) }}>
              <span style={{
                display: 'inline-block', fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.12em',
                textTransform: 'uppercase', padding: '4px 10px', borderRadius: 50,
                background: 'rgba(167,139,202,0.14)', color: '#8b6ab0', marginBottom: 12,
              }}>{s.category}</span>
              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.15rem', fontWeight: 600, color: '#2d2538', marginBottom: 6 }}>{s.title}</h3>
              <p style={{ fontSize: '0.82rem', color: '#8c7fa0', marginBottom: 16, lineHeight: 1.55 }}>{s.description}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: '#8c7fa0' }}>⏱ {s.duration} min</span>
                <button onClick={e => { e.stopPropagation(); setPlaying(s); setIsPlaying(false) }} style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a78bca, #c4a0d8)',
                  border: 'none', cursor: 'pointer', color: 'white', fontSize: '0.85rem',
                  boxShadow: '0 3px 12px rgba(167,139,202,0.35)', transition: 'transform 0.2s',
                }}>▶</button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Player overlay */}
      <AnimatePresence>
        {playing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => { if (e.target === e.currentTarget) { setPlaying(null); setIsPlaying(false) } }}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(45,37,56,0.55)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
            }}>
            <motion.div initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }}
              style={{
                width: '100%', maxWidth: 400, position: 'relative',
                background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(20px)',
                borderRadius: 24, padding: '44px 36px', textAlign: 'center',
                boxShadow: '0 20px 60px rgba(45,37,56,0.2)',
              }}>
              <button onClick={() => { setPlaying(null); setIsPlaying(false) }} style={{
                position: 'absolute', top: 16, right: 16,
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '1.1rem', color: '#8c7fa0', padding: 8,
              }}>✕</button>

              <motion.div animate={{ rotate: isPlaying ? 360 : 0 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
                style={{
                  width: 100, height: 100, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e8dff8, #fce0ec)',
                  margin: '0 auto 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.5rem', boxShadow: '0 4px 20px rgba(167,139,202,0.25)',
                }}>{playing.emoji}</motion.div>

              <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', color: '#2d2538', marginBottom: 4 }}>{playing.title}</h3>
              <p style={{ fontSize: '0.82rem', color: '#8c7fa0', marginBottom: 28 }}>{playing.category} · {playing.duration} min</p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                <button style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(167,139,202,0.12)', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#8c7fa0' }}>↩</button>
                <button onClick={() => setIsPlaying(p => !p)} style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #a78bca, #c4a0d8)',
                  border: 'none', cursor: 'pointer', color: 'white', fontSize: '1.2rem',
                  boxShadow: '0 6px 20px rgba(167,139,202,0.4)',
                }}>{isPlaying ? '⏸' : '▶'}</button>
                <button style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(167,139,202,0.12)', border: 'none', cursor: 'pointer', fontSize: '1rem', color: '#8c7fa0' }}>↪</button>
              </div>
              <p style={{ fontSize: '0.72rem', color: '#c0b4d0', marginTop: 20, letterSpacing: '0.05em' }}>Audio via GET /api/sessions/:id</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
