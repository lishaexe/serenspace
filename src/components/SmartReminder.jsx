import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SmartReminder() {
  const { getAuthHeader } = useAuth()
  const navigate = useNavigate()
  const [reminder, setReminder] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/journal`, { headers: getAuthHeader() })
        const data = await res.json()
        if (!Array.isArray(data)) return

        const today = new Date().toISOString().slice(0, 10)
        const todayEntry = data.find(e => e.createdAt?.slice(0, 10) === today)
        const hour = new Date().getHours()

        if (!todayEntry && hour >= 10) {
          setReminder({
            message: "You haven't checked in today — how are you feeling? 📔",
            action: 'Write Journal',
            path: '/journal',
            emoji: '📔',
          })
        }
      } catch (_) {}
    }
    check()
  }, [])

  if (dismissed || !reminder) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        style={{
          position: 'fixed', bottom: 100, left: 24,
          zIndex: 997, maxWidth: 320,
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: 20, padding: '16px 20px',
          boxShadow: '0 8px 32px rgba(45,37,56,0.12)',
          border: '1px solid rgba(167,139,202,0.2)',
        }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: '1.4rem' }}>{reminder.emoji}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.85rem', color: '#2d2538', fontWeight: 500, marginBottom: 10, lineHeight: 1.5 }}>
              {reminder.message}
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => navigate(reminder.path)} style={{
                background: 'linear-gradient(135deg, #a78bca, #c4a0d8)',
                border: 'none', borderRadius: 50,
                padding: '7px 14px', fontSize: '0.78rem',
                fontWeight: 600, color: 'white',
                cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
              }}>{reminder.action}</button>
              <button onClick={() => setDismissed(true)} style={{
                background: 'rgba(167,139,202,0.1)',
                border: 'none', borderRadius: 50,
                padding: '7px 14px', fontSize: '0.78rem',
                color: '#8c7fa0', cursor: 'pointer',
                fontFamily: '"DM Sans", sans-serif',
              }}>Later</button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}