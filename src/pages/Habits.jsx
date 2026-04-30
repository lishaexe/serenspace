import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const HABITS = [
  { id: 'water', icon: '💧', label: 'Drink 8 glasses of water', category: 'Health' },
  { id: 'sleep', icon: '😴', label: 'Sleep 8 hours', category: 'Health' },
  { id: 'exercise', icon: '🏃', label: 'Exercise or walk', category: 'Fitness' },
  { id: 'meditate', icon: '🧘', label: 'Meditate or breathe', category: 'Mindfulness' },
  { id: 'noPhone', icon: '📵', label: 'No phone 1hr before bed', category: 'Mindfulness' },
  { id: 'journal', icon: '📔', label: 'Write a journal entry', category: 'Mindfulness' },
  { id: 'study', icon: '📚', label: 'Study for 2+ hours', category: 'Productivity' },
  { id: 'gratitude', icon: '🌷', label: 'Write 3 things grateful for', category: 'Mindfulness' },
]

const categoryColors = {
  Health: 'rgba(212,240,228,0.6)',
  Fitness: 'rgba(200,232,248,0.6)',
  Mindfulness: 'rgba(232,223,248,0.6)',
  Productivity: 'rgba(252,224,236,0.6)',
}

export default function Habits() {
  const { getAuthHeader } = useAuth()
  const [checked, setChecked] = useState({})
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [streaks, setStreaks] = useState({})

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const [todayRes, historyRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/habits`, { headers: getAuthHeader() }),
          fetch(`${import.meta.env.VITE_API_URL}/api/habits/history`, { headers: getAuthHeader() }),
        ])
        const todayData = await todayRes.json()
        const historyData = await historyRes.json()

        if (todayData.habits) setChecked(todayData.habits)
        if (Array.isArray(historyData)) {
          setHistory(historyData)
          // Calculate streaks per habit
          const s = {}
          HABITS.forEach(h => {
            let streak = 0
            const today = new Date(); today.setHours(0,0,0,0)
            let current = today.getTime()
            for (const day of historyData) {
              const dayDate = new Date(day.date); dayDate.setHours(0,0,0,0)
              if (dayDate.getTime() === current && day.habits?.[h.id]) {
                streak++
                current -= 86400000
              } else if (dayDate.getTime() < current) break
            }
            s[h.id] = streak
          })
          setStreaks(s)
        }
      } catch (_) {}
      finally { setLoading(false) }
    }
    fetchHabits()
  }, [])

  const toggleHabit = async (id) => {
    const updated = { ...checked, [id]: !checked[id] }
    setChecked(updated)
    if (!checked[id]) showToast('Habit completed! 🌷')
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/habits`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify({ habits: updated }),
      })
    } catch (_) {}
  }

  const completed = Object.values(checked).filter(Boolean).length
  const total = HABITS.length
  const percentage = Math.round((completed / total) * 100)

  const grouped = HABITS.reduce((acc, h) => {
    if (!acc[h.category]) acc[h.category] = []
    acc[h.category].push(h)
    return acc
  }, {})

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '100px 24px 80px', position: 'relative', zIndex: 1 }}>

      {toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', background: 'rgba(45,37,56,0.85)', color: 'white', padding: '12px 24px', borderRadius: 50, fontSize: '0.85rem', zIndex: 500, backdropFilter: 'blur(12px)', whiteSpace: 'nowrap' }}>
          {toast}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <p style={{ fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a78bca', marginBottom: 8 }}>Daily Routine</p>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', fontWeight: 400, fontStyle: 'italic', color: '#2d2538', marginBottom: 8 }}>
          Habit Tracker
        </h2>
        <p style={{ color: '#8c7fa0', fontSize: '0.9rem' }}>Small habits done consistently create big changes.</p>
      </motion.div>

      {/* Progress ring */}
      {!loading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="glass-card" style={{ padding: '28px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: 100, height: 100, flexShrink: 0 }}>
            <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(167,139,202,0.12)" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none"
                stroke="url(#habitGrad)" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - percentage / 100) }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
              <defs>
                <linearGradient id="habitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a78bca" />
                  <stop offset="100%" stopColor="#c4a0d8" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', fontWeight: 700, color: '#2d2538', lineHeight: 1 }}>{percentage}%</p>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', fontWeight: 600, color: '#2d2538', marginBottom: 4 }}>
              {completed}/{total} habits done today
            </p>
            <p style={{ fontSize: '0.85rem', color: '#8c7fa0', marginBottom: 12 }}>
              {percentage === 100 ? 'Perfect day! You completed all habits! 🌟' :
               percentage >= 75 ? 'Almost there! Keep going! 💪' :
               percentage >= 50 ? 'Halfway through — great progress! 🌿' :
               percentage > 0 ? 'Good start! Keep building momentum 🌱' :
               'Start your day — tick off your first habit! 🌷'}
            </p>
            <div style={{ background: 'rgba(167,139,202,0.12)', borderRadius: 50, height: 8, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                style={{ height: '100%', borderRadius: 50, background: 'linear-gradient(90deg, #a78bca, #c4a0d8)' }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Habits by category */}
      {Object.entries(grouped).map(([category, habits], ci) => (
        <motion.div key={category}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: ci * 0.1 }}
          style={{ marginBottom: 24 }}>
          <p style={{ fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a78bca', marginBottom: 12, fontWeight: 600 }}>{category}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {habits.map((habit, hi) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: ci * 0.1 + hi * 0.05 }}
                onClick={() => toggleHabit(habit.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '16px 20px', borderRadius: 16,
                  background: checked[habit.id] ? categoryColors[habit.category] : 'rgba(255,255,255,0.5)',
                  border: `1.5px solid ${checked[habit.id] ? 'rgba(167,139,202,0.3)' : 'rgba(255,255,255,0.7)'}`,
                  backdropFilter: 'blur(12px)',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>

                {/* Checkbox */}
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  style={{
                    width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                    border: `2px solid ${checked[habit.id] ? '#a78bca' : 'rgba(167,139,202,0.3)'}`,
                    background: checked[habit.id] ? 'linear-gradient(135deg, #a78bca, #c4a0d8)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}>
                  <AnimatePresence>
                    {checked[habit.id] && (
                      <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        style={{ color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>
                        ✓
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                <span style={{ fontSize: '1.3rem' }}>{habit.icon}</span>

                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: '0.9rem', fontWeight: 500,
                    color: checked[habit.id] ? '#2d2538' : '#2d2538',
                    textDecoration: checked[habit.id] ? 'line-through' : 'none',
                    opacity: checked[habit.id] ? 0.6 : 1,
                    transition: 'all 0.2s',
                  }}>{habit.label}</p>
                  {streaks[habit.id] > 0 && (
                    <p style={{ fontSize: '0.72rem', color: '#a78bca', marginTop: 2 }}>
                      {streaks[habit.id]} day streak 🔥
                    </p>
                  )}
                </div>

                {checked[habit.id] && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ fontSize: '1.1rem' }}>
                    🌷
                  </motion.span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Weekly summary */}
      {history.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="glass-card" style={{ padding: '24px 28px', marginTop: 12 }}>
          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', fontWeight: 600, color: '#2d2538', marginBottom: 16 }}>
            Last 7 Days
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {history.slice(0, 7).map((day, i) => {
              const done = Object.values(day.habits || {}).filter(Boolean).length
              const pct = Math.round((done / total) * 100)
              const date = new Date(day.date)
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
              return (
                <div key={i} style={{ textAlign: 'center', flex: 1, minWidth: 36 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', margin: '0 auto 4px',
                    background: pct === 100 ? 'linear-gradient(135deg, #a78bca, #c4a0d8)' :
                                pct >= 50 ? 'rgba(167,139,202,0.3)' : 'rgba(167,139,202,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.72rem', fontWeight: 600,
                    color: pct === 100 ? 'white' : '#a78bca',
                  }}>{pct}%</div>
                  <p style={{ fontSize: '0.65rem', color: '#8c7fa0' }}>{dayName}</p>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </div>
  )
}