import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'

const quotes = [
  { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: 'Dan Millman' },
  { text: "Almost everything will work again if you unplug it for a few minutes, including you.", author: 'Anne Lamott' },
  { text: "Rest when you're weary. Refresh and renew yourself, your body, your mind, your spirit.", author: 'Ralph Marston' },
  { text: "The present moment is the only time over which we have dominion.", author: 'Thich Nhat Hanh' },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const fadeItem  = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } }

function MindfulnessScore({ score }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
      className="glass-card" style={{ padding: '24px 28px', marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <p className="section-label" style={{ marginBottom: 4 }}>Mindfulness Score</p>
          <p style={{ fontSize: '0.82rem', color: '#8c7fa0' }}>Based on your journal, breathing & focus activity</p>
        </div>
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring' }}
          style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #a78bca, #c4a0d8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(167,139,202,0.4)',
          }}>
          <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', fontWeight: 700, color: 'white' }}>{score}</p>
        </motion.div>
      </div>
      <div style={{ background: 'rgba(167,139,202,0.12)', borderRadius: 50, height: 10, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }} animate={{ width: `${score}%` }}
          transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
          style={{
            height: '100%', borderRadius: 50,
            background: 'linear-gradient(90deg, #a78bca, #c4a0d8)',
          }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <p style={{ fontSize: '0.72rem', color: '#c0b4d0' }}>0</p>
        <p style={{ fontSize: '0.72rem', color: '#a78bca', fontWeight: 500 }}>
          {score < 30 ? 'Just getting started 🌱' : score < 60 ? 'Building momentum 🌿' : score < 80 ? 'Doing great! ✨' : 'Thriving! 🌟'}
        </p>
        <p style={{ fontSize: '0.72rem', color: '#c0b4d0' }}>100</p>
      </div>
    </motion.div>
  )
}

function SmartBanner({ message, emoji, color }) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      style={{
        background: color || 'linear-gradient(135deg, rgba(167,139,202,0.15), rgba(252,224,236,0.2))',
        border: '1px solid rgba(167,139,202,0.2)',
        borderRadius: 16, padding: '14px 20px', marginBottom: 28,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
      <span style={{ fontSize: '1.4rem' }}>{emoji}</span>
      <p style={{ fontSize: '0.9rem', color: '#2d2538', fontWeight: 500 }}>{message}</p>
    </motion.div>
  )
}

export default function Dashboard() {
  const { user, getAuthHeader } = useAuth()
  const navigate = useNavigate()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.name?.split(' ')[0] || 'friend'
  const quote = quotes[new Date().getDate() % quotes.length]

  const [stats, setStats] = useState({ streak: 0, totalSessions: 0, timePracticed: 0, journalEntries: 0 })
  const [loading, setLoading] = useState(true)
  const [smartMessage, setSmartMessage] = useState(null)
  const [mindfulnessScore, setMindfulnessScore] = useState(0)
  const [topMood, setTopMood] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const journalRes = await fetch(`${import.meta.env.VITE_API_URL}/api/journal`, { headers: getAuthHeader() })
        const journalData = await journalRes.json()
        const journalCount = Array.isArray(journalData) ? journalData.length : 0

        // Streak
        let streak = 0
        if (Array.isArray(journalData) && journalData.length > 0) {
          const today = new Date(); today.setHours(0,0,0,0)
          const dates = journalData
            .map(e => { const d = new Date(e.createdAt); d.setHours(0,0,0,0); return d.getTime() })
            .filter((v,i,a) => a.indexOf(v) === i).sort((a,b) => b-a)
          let current = today.getTime()
          for (const date of dates) {
            if (date === current) { streak++; current -= 86400000 }
            else if (date === current + 86400000) { streak++; current = date - 86400000 }
            else break
          }
        }

        // Top mood
        if (Array.isArray(journalData) && journalData.length > 0) {
          const counts = {}
          journalData.forEach(e => { if (e.moodLabel) counts[e.moodLabel] = (counts[e.moodLabel] || 0) + 1 })
          const sorted = Object.entries(counts).sort((a,b) => b[1]-a[1])
          if (sorted.length) setTopMood({ label: sorted[0][0], count: sorted[0][1] })

          // Smart message based on recent moods
          const recent = journalData.slice(0, 5)
          const stressCount = recent.filter(e => ['Stressed','Worried','Low'].includes(e.moodLabel)).length
          const happyCount = recent.filter(e => ['Happy','Peaceful','Energised'].includes(e.moodLabel)).length
          if (stressCount >= 2) {
            setSmartMessage({ message: `You've been feeling stressed lately, ${firstName}. A breathing session might help 🌿`, emoji: '💙', action: '/breathe' })
          } else if (happyCount >= 3) {
            setSmartMessage({ message: `You've been in a great mood lately, ${firstName}! Keep the momentum going 🔥`, emoji: '🌟', action: null })
          } else if (journalCount === 0) {
            setSmartMessage({ message: `Start your wellness journey today, ${firstName}! Write your first journal entry 📔`, emoji: '🌱', action: '/journal' })
          }
        } else {
          setSmartMessage({ message: `Welcome to SerenSpace, ${firstName}! Start by writing your first journal entry 🌱`, emoji: '🌿', action: '/journal' })
        }

        const sessions = user?.totalSessions || 0

        // Mindfulness score (0-100)
        const journalScore = Math.min(journalCount * 10, 40)
        const sessionScore = Math.min(sessions * 5, 30)
        const streakScore  = Math.min(streak * 5, 30)
        setMindfulnessScore(Math.min(journalScore + sessionScore + streakScore, 100))

        setStats({
          streak,
          totalSessions: sessions,
          timePracticed: (sessions * 10 / 60).toFixed(1),
          journalEntries: journalCount,
        })
      } catch (err) {
        console.error('Failed to fetch stats', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const features = [
    { icon: '✨', title: 'Affirmations', desc: 'Daily affirmations to boost confidence and calm.', path: '/library', color: 'rgba(232,223,248,0.6)' },
    { icon: '🌬️', title: 'Breathe',      desc: 'Calm your nervous system with guided breathing.',  path: '/breathe', color: 'rgba(200,232,248,0.6)' },
    { icon: '📔', title: 'Mood Journal', desc: "Check in with how you're feeling today.",           path: '/journal', color: 'rgba(212,240,228,0.6)' },
    { icon: '⏱️', title: 'Focus Timer',  desc: 'Study smarter with Pomodoro sprints.',              path: '/timer',   color: 'rgba(252,224,236,0.6)' },
  ]

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '100px 24px 80px', position: 'relative', zIndex: 1 }}>

      {/* Smart greeting */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <p className="section-label" style={{ marginBottom: 6 }}>{greeting}</p>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 400, fontStyle: 'italic', color: '#2d2538', lineHeight: 1.2 }}>
          Welcome back, {firstName} 🌿
        </h2>
        {topMood && (
          <p style={{ fontSize: '0.88rem', color: '#8c7fa0', marginTop: 8 }}>
            Your most common mood: <span style={{ color: '#a78bca', fontWeight: 600 }}>{topMood.label}</span> · logged {topMood.count} {topMood.count === 1 ? 'time' : 'times'}
          </p>
        )}
      </motion.div>

      {/* Smart banner */}
      {smartMessage && (
        <SmartBanner message={smartMessage.message} emoji={smartMessage.emoji} />
      )}

      {/* Mindfulness score */}
      {!loading && <MindfulnessScore score={mindfulnessScore} />}

      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="show"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Current Streak',  value: loading ? '...' : stats.streak,        unit: stats.streak ? 'days 🔥' : 'Start journaling! 📔', color: '#fce0ec' },
          { label: 'Focus Sessions',  value: loading ? '...' : stats.totalSessions,  unit: stats.totalSessions ? 'pomodoros ⏱️' : 'Try a session!', color: '#e8dff8' },
          { label: 'Time Practiced',  value: loading ? '...' : stats.timePracticed,  unit: stats.timePracticed > 0 ? 'hours total' : 'Start breathing! 🌿', color: '#c8e8f8' },
          { label: 'Journal Entries', value: loading ? '...' : stats.journalEntries, unit: stats.journalEntries ? 'check-ins 📔' : 'Write today! 🌷', color: '#d4f0e4' },
        ].map(s => (
          <motion.div key={s.label} variants={fadeItem} className="glass-card"
            style={{ padding: '24px 22px', borderTop: `3px solid ${s.color}` }}>
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
          <motion.div key={f.title} variants={fadeItem}
            whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(167,139,202,0.2)' }}
            className="glass-card"
            style={{ padding: '26px 24px', cursor: 'pointer', background: f.color, transition: 'all 0.2s' }}
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