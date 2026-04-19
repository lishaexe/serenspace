import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const MOODS = [
  { emoji: '😌', label: 'Peaceful',  score: 5 },
  { emoji: '😊', label: 'Happy',     score: 4 },
  { emoji: '🤩', label: 'Energised', score: 5 },
  { emoji: '😐', label: 'Neutral',   score: 3 },
  { emoji: '😴', label: 'Tired',     score: 2 },
  { emoji: '😟', label: 'Worried',   score: 2 },
  { emoji: '😔', label: 'Low',       score: 1 },
  { emoji: '😤', label: 'Stressed',  score: 1 },
]

const MOOD_SUGGESTIONS = {
  'Peaceful':  { message: "You're in a great headspace 🌿 Keep it going!", action: 'Journal more', path: null, color: '#d4f0e4' },
  'Happy':     { message: "Amazing! Ride this energy 🔥 Start a focus session!", action: 'Start Focus', path: '/timer', color: '#fce0ec' },
  'Energised': { message: "Channel that energy! A Pomodoro session will maximize it ⚡", action: 'Start Focus', path: '/timer', color: '#fce0ec' },
  'Neutral':   { message: "A short breathing exercise can lift your mood 🌬️", action: 'Try Breathing', path: '/breathe', color: '#c8e8f8' },
  'Tired':     { message: "You seem tired 😴 Box breathing can restore your energy.", action: 'Try Breathing', path: '/breathe', color: '#c8e8f8' },
  'Worried':   { message: "Take a deep breath 🌿 4-7-8 breathing reduces anxiety fast.", action: 'Try Breathing', path: '/breathe', color: '#e8dff8' },
  'Low':       { message: "Daily affirmations can help shift your mindset 💜", action: 'View Affirmations', path: '/library', color: '#e8dff8' },
  'Stressed':  { message: "You seem stressed 😟 Box breathing for 2 minutes can really help.", action: 'Try Breathing', path: '/breathe', color: '#fce0ec' },
}
const MOCK_ENTRIES = []

const MOCK_CHART = [
  { day: 'Mon', mood: 0 }, { day: 'Tue', mood: 0 },
  { day: 'Wed', mood: 0 }, { day: 'Thu', mood: 0 },
  { day: 'Fri', mood: 0 }, { day: 'Sat', mood: 0 }, { day: 'Sun', mood: 0 },
]


const CustomDot = (props) => {
  const { cx, cy } = props
  return <circle cx={cx} cy={cy} r={5} fill="#a78bca" stroke="white" strokeWidth={2} />
}

export default function Journal() {
  const { getAuthHeader } = useAuth()
  const navigate = useNavigate()
  const [selected, setSelected]   = useState(null)
  const [text, setText]           = useState('')
  const [entries, setEntries]     = useState(MOCK_ENTRIES)
  const [chartData, setChartData] = useState(MOCK_CHART)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast]         = useState('')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/journal`, { headers: getAuthHeader() })
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d) && d.length) {
          setEntries(d)
          // Build real chart from entries
          const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
          const last7 = [...Array(7)].map((_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (6 - i))
            return { day: days[date.getDay()], date: date.toISOString().slice(0,10), mood: 0, count: 0 }
          })
          d.forEach(entry => {
            const idx = last7.findIndex(x => x.date === entry.createdAt?.slice(0,10))
            if (idx !== -1) {
              last7[idx].mood += entry.moodScore || 3
              last7[idx].count += 1
            }
          })
          setChartData(last7.map(x => ({ day: x.day, mood: x.count ? Math.round(x.mood / x.count) : 0 })))
        }
      })
      .catch(() => {})
  }, [])

  // Insight from entries
  const getMoodInsight = () => {
    if (entries.length < 2) return null
    const real = entries.filter(e => e.moodLabel)
    if (!real.length) return null
    const counts = {}
    real.forEach(e => { counts[e.moodLabel] = (counts[e.moodLabel] || 0) + 1 })
    const top = Object.entries(counts).sort((a,b) => b[1]-a[1])[0]
    const stressCount = (counts['Stressed'] || 0) + (counts['Worried'] || 0) + (counts['Low'] || 0)
    if (stressCount >= 2) return `You've felt stressed or low ${stressCount} times recently. Try a breathing session 🌿`
    return `Your most common mood is "${top[0]}" — ${top[1]} times this week.`
  }

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const submit = async () => {
    if (!selected) { showToast('Please select a mood first 😊'); return }
    setSubmitting(true)
    const payload = { mood: selected.emoji, moodLabel: selected.label, moodScore: selected.score, reflection: text }
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/journal`, {
        method: 'POST', headers: getAuthHeader(), body: JSON.stringify(payload),
      })
    } catch (_) {}
    setEntries(prev => [{ ...payload, createdAt: new Date().toISOString().slice(0,10) }, ...prev])
    setSelected(null); setText('')
    showToast('Entry saved ✦')
    setSubmitting(false)
  }

  const formatDate = (d) => {
    try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
    catch { return d }
  }

  const suggestion = selected ? MOOD_SUGGESTIONS[selected.label] : null
  const insight = getMoodInsight()

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '100px 24px 80px', position: 'relative', zIndex: 1 }}>
      {/* Toast */}
      {toast && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', background: 'rgba(45,37,56,0.85)', color: 'white', padding: '12px 24px', borderRadius: 50, fontSize: '0.85rem', zIndex: 500, backdropFilter: 'blur(12px)', whiteSpace: 'nowrap' }}>
          {toast}
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.2rem', fontWeight: 400, fontStyle: 'italic', color: '#2d2538' }}>Mood Journal</h2>
        <p style={{ color: '#8c7fa0', fontSize: '0.88rem', marginTop: 4 }}>How are you feeling today?</p>
      </motion.div>

      {/* Insight banner */}
      {insight && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'linear-gradient(135deg, rgba(167,139,202,0.15), rgba(252,224,236,0.2))', border: '1px solid rgba(167,139,202,0.2)', borderRadius: 16, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.3rem' }}>🧠</span>
          <p style={{ fontSize: '0.88rem', color: '#6b4f8a', fontWeight: 500 }}>{insight}</p>
        </motion.div>
      )}

      {/* Entry form */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card-static" style={{ padding: '30px 28px 32px', marginBottom: 28 }}>

        <p className="section-label" style={{ marginBottom: 14 }}>Select your mood</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
          {MOODS.map(m => (
            <div key={m.emoji} style={{ textAlign: 'center' }}>
              <button onClick={() => setSelected(m)} style={{
                width: 60, height: 60, borderRadius: 16,
                border: `2px solid ${selected?.emoji === m.emoji ? '#a78bca' : 'transparent'}`,
                background: selected?.emoji === m.emoji ? 'rgba(167,139,202,0.15)' : 'rgba(255,255,255,0.6)',
                fontSize: '1.75rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
                transform: selected?.emoji === m.emoji ? 'scale(1.08)' : 'scale(1)',
                backdropFilter: 'blur(8px)',
              }}>{m.emoji}</button>
              <p style={{ fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8c7fa0', marginTop: 4 }}>{m.label}</p>
            </div>
          ))}
        </div>

        {/* Mood Suggestion */}
        <AnimatePresence>
          {suggestion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginBottom: 20 }}>
              <div style={{
                background: suggestion.color,
                borderRadius: 14, padding: '14px 18px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
              }}>
                <p style={{ fontSize: '0.88rem', color: '#2d2538', fontWeight: 500 }}>💡 {suggestion.message}</p>
                {suggestion.path && (
                  <button onClick={() => navigate(suggestion.path)} style={{
                    background: 'rgba(167,139,202,0.3)', border: 'none', borderRadius: 50,
                    padding: '7px 16px', fontSize: '0.82rem', fontWeight: 600,
                    color: '#6b4f8a', cursor: 'pointer', whiteSpace: 'nowrap',
                    fontFamily: '"DM Sans", sans-serif',
                  }}>{suggestion.action} →</button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="section-label" style={{ marginBottom: 10 }}>Write a reflection</p>
        <textarea
          value={text} onChange={e => setText(e.target.value)}
          placeholder="What's on your mind? How did today feel? Even a sentence helps..."
          style={{
            width: '100%', minHeight: 110, padding: '14px 16px',
            border: '1.5px solid rgba(167,139,202,0.25)', borderRadius: 14,
            fontFamily: '"DM Sans", sans-serif', fontSize: '0.9rem', color: '#2d2538',
            background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(8px)',
            resize: 'vertical', outline: 'none', lineHeight: 1.65,
            transition: 'all 0.2s',
          }}
          onFocus={e => { e.target.style.borderColor = '#a78bca'; e.target.style.boxShadow = '0 0 0 3px rgba(167,139,202,0.15)' }}
          onBlur={e => { e.target.style.borderColor = 'rgba(167,139,202,0.25)'; e.target.style.boxShadow = 'none' }}
        />
        <button onClick={submit} className="btn-primary" style={{ marginTop: 18 }} disabled={submitting}>
          {submitting ? 'Saving...' : 'Save entry →'}
        </button>
      </motion.div>

      {/* Two column: entries + chart */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>

        {/* Past entries */}
        <div>
          <p className="section-label" style={{ marginBottom: 14 }}>Past entries</p>
          {entries.length === 0 ? (
            <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.5rem', marginBottom: 8 }}>📔</p>
              <p style={{ color: '#8c7fa0', fontSize: '0.88rem' }}>No entries yet. Write your first reflection!</p>
            </div>
          ) : entries.map((e, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              className="glass-card" style={{ padding: '14px 18px', marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
              <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{e.mood}</span>
              <div>
                <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8c7fa0', marginBottom: 3 }}>{formatDate(e.createdAt)}</p>
                <p style={{ fontSize: '0.78rem', fontWeight: 500, color: '#a78bca', marginBottom: 3 }}>{e.moodLabel}</p>
                <p style={{ fontSize: '0.85rem', color: '#2d2538', lineHeight: 1.45 }}>{e.reflection || 'No reflection added.'}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        <div>
          <p className="section-label" style={{ marginBottom: 14 }}>This week's mood</p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="glass-card-static" style={{ padding: '24px 16px 16px' }}>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(167,139,202,0.1)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8c7fa0', fontFamily: '"DM Sans", sans-serif' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 10, fill: '#8c7fa0' }} axisLine={false} tickLine={false} ticks={[1,2,3,4,5]} />
                <Tooltip
                  contentStyle={{ background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: 12, fontSize: 12, fontFamily: '"DM Sans", sans-serif', boxShadow: '0 4px 16px rgba(167,139,202,0.2)' }}
                  formatter={(v) => [['😔','😔','😐','😊','😌'][v-1] + ' ' + v, 'Mood']}
                />
                <Line type="monotone" dataKey="mood" stroke="#a78bca" strokeWidth={2.5} dot={<CustomDot />} activeDot={{ r: 7, fill: '#a78bca' }} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 4px 0', fontSize: '0.68rem', color: '#c0b4d0' }}>
              <span>😔 Low</span><span>😐 Neutral</span><span>😌 Good</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}