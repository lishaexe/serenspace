import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import { useAuth } from '../context/AuthContext'

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

const MOCK_ENTRIES = [
  { mood: '😌', moodLabel: 'Peaceful',  reflection: 'Felt calm after the morning meditation. Exam prep going okay.', createdAt: '2026-02-27' },
  { mood: '😤', moodLabel: 'Stressed',  reflection: 'Stressed about the upcoming test but did box breathing — helped.', createdAt: '2026-02-26' },
  { mood: '😊', moodLabel: 'Happy',     reflection: 'Really good day overall. 25 min focus session felt great.',          createdAt: '2026-02-25' },
]

const MOCK_CHART = [
  { day: 'Mon', mood: 3 }, { day: 'Tue', mood: 4 },
  { day: 'Wed', mood: 2 }, { day: 'Thu', mood: 5 },
  { day: 'Fri', mood: 3 }, { day: 'Sat', mood: 4 }, { day: 'Sun', mood: 5 },
]

const CustomDot = (props) => {
  const { cx, cy } = props
  return <circle cx={cx} cy={cy} r={5} fill="#a78bca" stroke="white" strokeWidth={2} />
}

export default function Journal() {
  const { getAuthHeader } = useAuth()
  const [selected, setSelected]   = useState(null)
  const [text, setText]           = useState('')
  const [entries, setEntries]     = useState(MOCK_ENTRIES)
  const [chartData]               = useState(MOCK_CHART)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast]         = useState('')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/journal`, { headers: getAuthHeader() })
      .then(r => r.json()).then(d => { if (Array.isArray(d) && d.length) setEntries(d) })
      .catch(() => {})
  }, [])

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

      {/* Entry form */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card-static" style={{ padding: '30px 28px 32px', marginBottom: 28 }}>

        <p className="section-label" style={{ marginBottom: 14 }}>Select your mood</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 26 }}>
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
          {entries.map((e, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              className="glass-card" style={{ padding: '14px 18px', marginBottom: 10, display: 'flex', alignItems: 'flex-start', gap: 14, cursor: 'default' }}>
              <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{e.mood}</span>
              <div>
                <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8c7fa0', marginBottom: 3 }}>{formatDate(e.createdAt)}</p>
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
