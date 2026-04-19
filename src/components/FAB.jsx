import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const actions = [
  { icon: '📔', label: 'New Journal', path: '/journal' },
  { icon: '🌬️', label: 'Breathe', path: '/breathe' },
  { icon: '⏱️', label: 'Focus', path: '/timer' },
  { icon: '✨', label: 'Affirmations', path: '/library' },
]

export default function FAB() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleAction = (path) => {
    setOpen(false)
    navigate(path)
  }

  return (
    <div style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 999 }}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{ position: 'absolute', bottom: 70, right: 0, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}>
            {actions.map((a, i) => (
              <motion.button
                key={a.path}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleAction(a.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(167,139,202,0.25)',
                  borderRadius: 50, padding: '10px 18px',
                  cursor: 'pointer', boxShadow: '0 4px 20px rgba(45,37,56,0.12)',
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '0.88rem', fontWeight: 500, color: '#2d2538',
                  whiteSpace: 'nowrap',
                }}>
                <span>{a.icon}</span>
                <span>{a.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB button */}
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.08 }}
        onClick={() => setOpen(o => !o)}
        style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #a78bca, #c4a0d8)',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 6px 24px rgba(167,139,202,0.5)',
          fontSize: '1.4rem', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          ✦
        </motion.span>
      </motion.button>
    </div>
  )
}