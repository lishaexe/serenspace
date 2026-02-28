import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const TECHNIQUES = {
  box:  { name: 'Box Breathing', phases: ['Inhale','Hold','Exhale','Hold'], durations: [4,4,4,4], hint: 'Equal counts of 4. Calms the nervous system.' },
  '478':{ name: '4-7-8',        phases: ['Inhale','Hold','Exhale'],          durations: [4,7,8],   hint: 'Powerful for anxiety and sleep onset.' },
  deep: { name: 'Deep Breathing',phases: ['Inhale','Exhale'],                durations: [5,5],     hint: 'Slow diaphragmatic breathing for instant calm.' },
}

const SCALES  = { Inhale: 1.32, Hold: 1.13, Exhale: 0.8 }
const HINTS   = { Inhale: 'Breathe in slowly through your nose...', Exhale: 'Release gently through your mouth...', Hold: 'Hold softly, stay still...' }
const COLORS  = { Inhale: ['rgba(167,139,202,0.55)', 'rgba(196,160,216,0.5)'], Hold: ['rgba(150,170,220,0.55)', 'rgba(180,200,240,0.5)'], Exhale: ['rgba(140,195,180,0.5)', 'rgba(160,215,200,0.45)'] }

export default function Breathe() {
  const [tech, setTech]         = useState('box')
  const [running, setRunning]   = useState(false)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [countdown, setCount]   = useState(null)
  const [cycles, setCycles]     = useState(0)
  const intervalRef             = useRef(null)
  const phaseIdxRef             = useRef(0)

  const currentTech = TECHNIQUES[tech]
  const phase       = currentTech.phases[phaseIdx]
  const scale       = running ? (SCALES[phase] || 1) : 1
  const [c1, c2]   = running ? (COLORS[phase] || COLORS.Inhale) : ['rgba(167,139,202,0.4)', 'rgba(196,160,216,0.35)']

  const clearTimer = () => { clearInterval(intervalRef.current); intervalRef.current = null }

  const startCycle = (idx, techKey) => {
    const t = TECHNIQUES[techKey || tech]
    phaseIdxRef.current = idx
    setPhaseIdx(idx)
    setCount(t.durations[idx])
    let secs = t.durations[idx]

    clearTimer()
    intervalRef.current = setInterval(() => {
      secs -= 1
      setCount(secs)
      if (secs <= 0) {
        const nextIdx = (phaseIdxRef.current + 1) % t.phases.length
        if (nextIdx === 0) setCycles(c => c + 1)
        startCycle(nextIdx, techKey || tech)
      }
    }, 1000)
  }

  const toggle = () => {
    if (running) {
      clearTimer()
      setRunning(false)
    } else {
      setRunning(true)
      startCycle(phaseIdx)
    }
  }

  const reset = () => {
    clearTimer()
    setRunning(false)
    setPhaseIdx(0)
    setCount(null)
    setCycles(0)
    phaseIdxRef.current = 0
  }

  const changeTech = (key) => {
    reset()
    setTech(key)
  }

  useEffect(() => () => clearTimer(), [])

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', paddingTop: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px', position: 'relative', zIndex: 1 }}>

      {/* Title */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.2rem', fontWeight: 400, fontStyle: 'italic', color: '#2d2538' }}>Breathing Space</h2>
        <p style={{ color: '#8c7fa0', fontSize: '0.88rem', marginTop: 4 }}>Choose a technique and breathe with the circle</p>
      </motion.div>

      {/* Technique selector */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {Object.entries(TECHNIQUES).map(([key, t]) => (
          <button key={key} onClick={() => changeTech(key)} style={{
            padding: '9px 22px', borderRadius: 50,
            border: `1.5px solid ${tech === key ? 'rgba(167,139,202,0.5)' : 'rgba(167,139,202,0.22)'}`,
            background: tech === key ? 'rgba(167,139,202,0.2)' : 'rgba(255,255,255,0.55)',
            color: tech === key ? '#6b4f8a' : '#8c7fa0',
            fontFamily: '"DM Sans", sans-serif', fontSize: '0.83rem', fontWeight: 500,
            cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'all 0.2s',
          }}>{t.name}</button>
        ))}
      </div>

      <p style={{ fontSize: '0.75rem', color: '#8c7fa0', marginBottom: 32, letterSpacing: '0.04em' }}>
        {TECHNIQUES[tech].hint}
      </p>

      {/* Phase hint text */}
      <motion.p
        key={phase + running}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{ fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8c7fa0', marginBottom: 40, minHeight: 20, textAlign: 'center' }}>
        {running ? HINTS[phase] : 'Press start to begin'}
      </motion.p>

      {/* Outer pulse rings */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 44 }}>
        {running && (
          <>
            <motion.div animate={{ scale: [1, 1.18, 1], opacity: [0.3, 0.08, 0.3] }} transition={{ duration: currentTech.durations[phaseIdx], repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', border: '1px solid rgba(167,139,202,0.3)', pointerEvents: 'none' }} />
            <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.06, 0.2] }} transition={{ duration: currentTech.durations[phaseIdx], repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', border: '1px solid rgba(167,139,202,0.25)', pointerEvents: 'none' }} />
          </>
        )}

        {/* Main breathing circle */}
        <motion.div
          animate={{ scale, background: `radial-gradient(circle at 40% 40%, ${c1}, ${c2})` }}
          transition={{ duration: running ? currentTech.durations[phaseIdx] : 0.6, ease: 'easeInOut' }}
          style={{
            width: 220, height: 220, borderRadius: '50%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,0.85)',
            boxShadow: '0 0 60px rgba(167,139,202,0.28), inset 0 0 40px rgba(255,255,255,0.3)',
          }}>
          <motion.span key={phase} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.05rem', fontStyle: 'italic', color: 'white', textShadow: '0 1px 10px rgba(80,50,110,0.5)', letterSpacing: '0.02em' }}>
            {running ? phase : 'Ready'}
          </motion.span>
          <motion.span key={countdown}
            style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.8rem', fontWeight: 600, color: 'white', textShadow: '0 2px 14px rgba(80,50,110,0.4)', lineHeight: 1, marginTop: 4 }}>
            {running && countdown !== null ? countdown : '–'}
          </motion.span>
        </motion.div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <button onClick={toggle} className="btn-primary" style={{ padding: '13px 36px', minWidth: 110 }}>
          {running ? 'Pause' : (countdown !== null ? 'Resume' : 'Start')}
        </button>
        <button onClick={reset} className="btn-secondary">Reset</button>
      </div>

      <p style={{ marginTop: 22, fontSize: '0.8rem', color: '#8c7fa0', letterSpacing: '0.06em' }}>
        Cycles completed: {cycles}
      </p>
    </div>
  )
}
