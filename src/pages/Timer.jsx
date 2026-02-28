import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const WORK_SECS  = 25 * 60
const BREAK_SECS = 5 * 60
const CIRCUM     = 2 * Math.PI * 110   // r=110 → 691.15

export default function Timer() {
  const { getAuthHeader } = useAuth()
  const [mode, setMode]         = useState('work')       // 'work' | 'break'
  const [timeLeft, setTimeLeft] = useState(WORK_SECS)
  const [running, setRunning]   = useState(false)
  const [sessions, setSessions] = useState([])
  const [toast, setToast]       = useState('')
  const intervalRef             = useRef(null)
  const total                   = mode === 'work' ? WORK_SECS : BREAK_SECS

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2800) }

  const tick = () => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(intervalRef.current)
        setRunning(false)
        return 0
      }
      return prev - 1
    })
  }

  useEffect(() => {
    if (timeLeft === 0) {
      if (mode === 'work') {
        showToast('Focus session done! Take a break 🌿')
        logSession()
      } else {
        showToast('Break over. Back to focus! ✦')
      }
    }
  }, [timeLeft])

  const toggle = () => {
    if (running) {
      clearInterval(intervalRef.current)
      setRunning(false)
    } else {
      setRunning(true)
      intervalRef.current = setInterval(tick, 1000)
    }
  }

  const reset = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setTimeLeft(mode === 'work' ? WORK_SECS : BREAK_SECS)
  }

  const switchMode = (m) => {
    clearInterval(intervalRef.current)
    setRunning(false)
    setMode(m)
    setTimeLeft(m === 'work' ? WORK_SECS : BREAK_SECS)
  }

  const logSession = async () => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    setSessions(prev => [{ label: 'Focus session completed', time: timeStr }, ...prev])
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/sessions/log`, {
        method: 'POST', headers: getAuthHeader(),
        body: JSON.stringify({ type: 'focus', duration: 25, completedAt: now.toISOString() }),
      })
    } catch (_) {}
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0')
  const secs = (timeLeft % 60).toString().padStart(2, '0')
  const progress = (timeLeft / total) * CIRCUM
  const offset   = CIRCUM - progress

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '100px 24px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>

      {toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', background: 'rgba(45,37,56,0.85)', color: 'white', padding: '12px 24px', borderRadius: 50, fontSize: '0.85rem', zIndex: 500, backdropFilter: 'blur(12px)', whiteSpace: 'nowrap' }}>
          {toast}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 28, width: '100%' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.2rem', fontWeight: 400, fontStyle: 'italic', color: '#2d2538' }}>Focus Timer</h2>
        <p style={{ color: '#8c7fa0', fontSize: '0.88rem', marginTop: 4 }}>Work in focused sprints, rest with intention.</p>
      </motion.div>

      {/* Mode toggle */}
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.55)', borderRadius: 50, padding: 4, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.7)', marginBottom: 8 }}>
        {[['work', 'Focus (25 min)'], ['break', 'Break (5 min)']].map(([m, label]) => (
          <button key={m} onClick={() => switchMode(m)} style={{
            padding: '9px 22px', borderRadius: 50, border: 'none', cursor: 'pointer',
            fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem', fontWeight: 500,
            background: mode === m ? 'linear-gradient(135deg, #a78bca, #c4a0d8)' : 'none',
            color: mode === m ? 'white' : '#8c7fa0',
            transition: 'all 0.25s',
          }}>{label}</button>
        ))}
      </div>

      {/* Timer circle */}
      <div style={{ position: 'relative', width: 260, height: 260, margin: '24px 0' }}>
        <svg width="260" height="260" style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#a78bca" />
              <stop offset="100%" stopColor="#c4a0d8" />
            </linearGradient>
          </defs>
          <circle cx="130" cy="130" r="110" fill="none" stroke="rgba(167,139,202,0.12)" strokeWidth="8" />
          <motion.circle
            cx="130" cy="130" r="110"
            fill="none"
            stroke="url(#timerGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUM}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.9, ease: 'linear' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '3.4rem', fontWeight: 600, color: '#2d2538', lineHeight: 1 }}>
            {mins}:{secs}
          </span>
          <span className="section-label" style={{ marginTop: 8 }}>{mode === 'work' ? 'Focus' : 'Break'}</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 44 }}>
        <button onClick={toggle} className="btn-primary">
          {running ? 'Pause' : timeLeft === total ? 'Start' : 'Resume'}
        </button>
        <button onClick={reset} className="btn-secondary">Reset</button>
      </div>

      {/* Session log */}
      <div style={{ width: '100%' }}>
        <p className="section-label" style={{ marginBottom: 12 }}>Today's sessions</p>
        {sessions.length === 0 && (
          <p style={{ fontSize: '0.85rem', color: '#c0b4d0', textAlign: 'center', padding: '20px 0' }}>No sessions yet. Start focusing!</p>
        )}
        {sessions.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            className="glass-card" style={{ padding: '14px 18px', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: '#2d2538' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#a78bca', flexShrink: 0 }} />
              {s.label}
            </div>
            <span style={{ fontSize: '0.78rem', color: '#8c7fa0' }}>{s.time}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
