import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const RESPONSES = {
  Stressed: [
    { text: "You seem stressed 😟 Try a 2-minute box breathing session right now.", action: { label: 'Breathe now 🌿', path: '/breathe' } },
    { text: "Stress is temporary. A short breathing break can reset your mind completely.", action: { label: 'Try breathing', path: '/breathe' } },
    { text: "You've logged stress recently. Even 5 deep breaths can help 🌬️", action: { label: 'Open Breathe', path: '/breathe' } },
  ],
  Worried: [
    { text: "Feeling worried is okay. Try 4-7-8 breathing to calm your nervous system 💙", action: { label: 'Try 4-7-8', path: '/breathe' } },
    { text: "Write down what's worrying you — journaling helps release mental weight 📔", action: { label: 'Open Journal', path: '/journal' } },
  ],
  Tired: [
    { text: "You seem tired 😴 A short 5-min break and some affirmations might help ✨", action: { label: 'View Affirmations', path: '/library' } },
    { text: "Rest is productive too. Try a 5-minute break timer before your next session.", action: { label: 'Start Break', path: '/timer' } },
  ],
  Low: [
    { text: "Feeling low happens. Read today's affirmations — they're written for moments like this 💜", action: { label: 'View Affirmations', path: '/library' } },
    { text: "Be gentle with yourself today 🌷 Writing how you feel often helps lift the weight.", action: { label: 'Journal now', path: '/journal' } },
  ],
  Happy: [
    { text: "You're in a great mood! Channel this energy into a focus session 🔥", action: { label: 'Start Focus', path: '/timer' } },
    { text: "Love seeing you happy! Keep your streak going — journal today too 📔", action: { label: 'Add Entry', path: '/journal' } },
  ],
  Peaceful: [
    { text: "Beautiful! You're feeling peaceful 🌿 This is a perfect time to focus deeply.", action: { label: 'Start Focus', path: '/timer' } },
    { text: "Peaceful energy is rare — use it! A focus session now will feel effortless ✨", action: { label: 'Start Timer', path: '/timer' } },
  ],
  Energised: [
    { text: "You're energised! 🤩 Don't waste it — start a Pomodoro session right now.", action: { label: 'Start Focus', path: '/timer' } },
    { text: "High energy = perfect study time ⚡ Make the most of it!", action: { label: 'Focus now', path: '/timer' } },
  ],
  Neutral: [
    { text: "Feeling neutral? A quick affirmation can shift your mindset positively ✨", action: { label: 'View Affirmations', path: '/library' } },
    { text: "Neutral days are great for focused work 🎯 Try a Pomodoro session.", action: { label: 'Start Focus', path: '/timer' } },
  ],
  default: [
    { text: "Welcome back! 🌿 How are you feeling today? Start with a journal entry.", action: { label: 'Open Journal', path: '/journal' } },
    { text: "Ready to focus? Start a Pomodoro session or check today's affirmations ✨", action: { label: 'Start Focus', path: '/timer' } },
    { text: "Consistency is key 💜 Keep logging your mood daily for better insights.", action: { label: 'Add Entry', path: '/journal' } },
  ]
}

const getResponse = (mood, streak, journalCount) => {
  const pool = RESPONSES[mood] || RESPONSES.default
  const base = pool[Math.floor(Math.random() * pool.length)]
  if (streak >= 3) return { ...base, text: base.text + ` (${streak} day streak! 🔥)` }
  if (journalCount === 0) return { text: "Start your journey! Write your first journal entry today 🌱", action: { label: 'Start Journaling', path: '/journal' } }
  return base
}

const TypingDots = () => (
  <div style={{ display: 'flex', gap: 4, padding: '12px 16px', alignItems: 'center' }}>
    {[0,1,2].map(i => (
      <motion.div key={i}
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
        style={{ width: 7, height: 7, borderRadius: '50%', background: '#a78bca' }}
      />
    ))}
  </div>
)

export default function MindfulnessAssistant() {
  const { getAuthHeader } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [mood, setMood] = useState(null)
  const [streak, setStreak] = useState(0)
  const [journalCount, setJournalCount] = useState(0)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/journal`, { headers: getAuthHeader() })
        const data = await res.json()
        if (!Array.isArray(data)) return

        setJournalCount(data.length)

        // Latest mood
        if (data.length > 0) setMood(data[0].moodLabel)

        // Streak
        let s = 0
        const today = new Date(); today.setHours(0,0,0,0)
        const dates = data
          .map(e => { const d = new Date(e.createdAt); d.setHours(0,0,0,0); return d.getTime() })
          .filter((v,i,a) => a.indexOf(v) === i).sort((a,b) => b-a)
        let current = today.getTime()
        for (const date of dates) {
          if (date === current) { s++; current -= 86400000 }
          else if (date === current + 86400000) { s++; current = date - 86400000 }
          else break
        }
        setStreak(s)
        setLoaded(true)
      } catch (_) {}
    }
    fetchData()
  }, [])

  const openAssistant = () => {
    setOpen(true)
    if (messages.length === 0 && loaded) sendGreeting()
  }

  const sendGreeting = () => {
    const hour = new Date().getHours()
    const timeGreet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
    const greet = {
      id: Date.now(),
      text: `${timeGreet}! 🌿 I'm your mindfulness assistant. Let me check how you're doing...`,
      type: 'assistant',
    }
    setMessages([greet])
    setTyping(true)
    setTimeout(() => {
      const response = getResponse(mood, streak, journalCount)
      setTyping(false)
      setMessages(prev => [...prev, { id: Date.now(), ...response, type: 'assistant' }])
    }, 1800)
  }

  const askMore = () => {
    const questions = [
      "Would you like a breathing exercise or a focus session?",
      "How has your energy been today?",
      "Have you taken a break recently? Rest is important too 🌿",
    ]
    const q = questions[Math.floor(Math.random() * questions.length)]
    setMessages(prev => [...prev, { id: Date.now(), text: q, type: 'assistant' }])
  }

  const handleUserReply = (reply) => {
    setMessages(prev => [...prev, { id: Date.now(), text: reply, type: 'user' }])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const keywords = reply.toLowerCase()
      let response
      if (keywords.includes('stress') || keywords.includes('anxious') || keywords.includes('worried')) {
        response = RESPONSES.Stressed[0]
      } else if (keywords.includes('tired') || keywords.includes('exhausted')) {
        response = RESPONSES.Tired[0]
      } else if (keywords.includes('happy') || keywords.includes('good') || keywords.includes('great')) {
        response = RESPONSES.Happy[0]
      } else if (keywords.includes('focus') || keywords.includes('study')) {
        response = { text: "Perfect! A 25-min Pomodoro session with study music is the best way to focus 🎯", action: { label: 'Start Focus', path: '/timer' } }
      } else if (keywords.includes('breath') || keywords.includes('calm')) {
        response = { text: "Let's do some breathing 🌬️ Box breathing for 2 minutes works really well.", action: { label: 'Open Breathe', path: '/breathe' } }
      } else {
        response = getResponse(mood, streak, journalCount)
      }
      setMessages(prev => [...prev, { id: Date.now(), ...response, type: 'assistant' }])
    }, 1200)
  }

  const QUICK_REPLIES = ['I feel stressed', 'I need to focus', 'I feel tired', 'I feel good!']

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={openAssistant}
        style={{
          position: 'fixed', bottom: 32, left: 32, zIndex: 998,
          width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg, #c4a0d8, #a78bca)',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 6px 24px rgba(167,139,202,0.45)',
          fontSize: '1.3rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
        🧘
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: 'fixed', bottom: 96, left: 32, zIndex: 998,
              width: 320, maxHeight: 480,
              background: 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(24px)',
              borderRadius: 24,
              boxShadow: '0 12px 48px rgba(45,37,56,0.15)',
              border: '1px solid rgba(167,139,202,0.2)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}>

            {/* Header */}
            <div style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #a78bca, #c4a0d8)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '1.3rem' }}>🧘</span>
                <div>
                  <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'white' }}>Mindfulness Assistant</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a8e6cf' }} />
                    <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.8)' }}>
                      {mood ? `Last mood: ${mood}` : 'Ready to help'}
                    </p>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{
                background: 'rgba(255,255,255,0.2)', border: 'none',
                borderRadius: '50%', width: 28, height: 28,
                cursor: 'pointer', color: 'white', fontSize: '0.85rem',
              }}>✕</button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.map(msg => (
                <motion.div key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '85%', padding: '10px 14px', borderRadius: msg.type === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.type === 'user' ? 'linear-gradient(135deg, #a78bca, #c4a0d8)' : 'rgba(167,139,202,0.08)',
                    color: msg.type === 'user' ? 'white' : '#2d2538',
                    fontSize: '0.84rem', lineHeight: 1.5,
                  }}>
                    {msg.text}
                  </div>
                  {msg.action && msg.type === 'assistant' && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      onClick={() => { navigate(msg.action.path); setOpen(false) }}
                      style={{
                        marginTop: 6, padding: '6px 14px',
                        background: 'linear-gradient(135deg, #a78bca, #c4a0d8)',
                        border: 'none', borderRadius: 50,
                        fontSize: '0.78rem', fontWeight: 600, color: 'white',
                        cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
                      }}>{msg.action.label} →</button>
                  )}
                </motion.div>
              ))}
              {typing && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ background: 'rgba(167,139,202,0.08)', borderRadius: '18px 18px 18px 4px', width: 'fit-content' }}>
                  <TypingDots />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(167,139,202,0.1)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {QUICK_REPLIES.map(r => (
                  <button key={r} onClick={() => handleUserReply(r)} style={{
                    padding: '5px 12px', borderRadius: 50, fontSize: '0.75rem',
                    background: 'rgba(167,139,202,0.1)',
                    border: '1px solid rgba(167,139,202,0.2)',
                    color: '#6b4f8a', cursor: 'pointer',
                    fontFamily: '"DM Sans", sans-serif',
                  }}>{r}</button>
                ))}
              </div>
              <button onClick={askMore} style={{
                width: '100%', padding: '9px', borderRadius: 12,
                background: 'rgba(167,139,202,0.08)',
                border: '1px solid rgba(167,139,202,0.15)',
                fontSize: '0.8rem', color: '#8c7fa0',
                cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
              }}>Ask me something else 💬</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}