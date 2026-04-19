import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CONFETTI_COLORS = ['#a78bca', '#fce0ec', '#c8e8f8', '#d4f0e4', '#f9e4b7']

function Confetti() {
  const pieces = [...Array(40)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: Math.random() * 8 + 6,
    rotation: Math.random() * 360,
  }))

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {pieces.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: [1, 1, 0], rotate: p.rotation + 360 }}
          transition={{ duration: 2.5, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute', top: 0,
            width: p.size, height: p.size,
            borderRadius: Math.random() > 0.5 ? '50%' : 2,
            background: p.color,
          }}
        />
      ))}
    </div>
  )
}

export default function StreakCelebration({ streak, show, onDone }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show && streak > 0) {
      setVisible(true)
      const t = setTimeout(() => { setVisible(false); onDone?.() }, 3500)
      return () => clearTimeout(t)
    }
  }, [show, streak])

  return (
    <AnimatePresence>
      {visible && (
        <>
          <Confetti />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            style={{
              position: 'fixed', bottom: 100, left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 24, padding: '24px 40px',
              textAlign: 'center', zIndex: 9998,
              boxShadow: '0 12px 48px rgba(167,139,202,0.3)',
              border: '1px solid rgba(167,139,202,0.3)',
            }}>
            <motion.p
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: 2, duration: 0.4 }}
              style={{ fontSize: '2.5rem', marginBottom: 8 }}>🔥</motion.p>
            <p style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '1.8rem', fontWeight: 600,
              color: '#2d2538', marginBottom: 4,
            }}>{streak} Day Streak!</p>
            <p style={{ fontSize: '0.88rem', color: '#8c7fa0' }}>
              Amazing consistency! Keep it up 🌿
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}