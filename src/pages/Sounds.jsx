import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SOUNDS = [
  {
    category: 'White Noise',
    emoji: '🌫️',
    color: 'rgba(200,232,248,0.4)',
    tracks: [
      { name: 'Pure White Noise', emoji: '⬜', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { name: 'Pink Noise', emoji: '🌸', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
      { name: 'Brown Noise', emoji: '🟫', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    ]
  },
  {
    category: 'Rain & Water',
    emoji: '🌧️',
    color: 'rgba(167,139,202,0.15)',
    tracks: [
      { name: 'Gentle Rain', emoji: '🌦️', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
      { name: 'Heavy Rain', emoji: '⛈️', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
      { name: 'Ocean Waves', emoji: '🌊', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
      { name: 'River Stream', emoji: '🏞️', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
    ]
  },
  {
    category: 'Nature',
    emoji: '🌿',
    color: 'rgba(212,240,228,0.4)',
    tracks: [
      { name: 'Forest Birds', emoji: '🐦', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
      { name: 'Crickets Night', emoji: '🦗', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3' },
      { name: 'Wind in Trees', emoji: '🍃', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3' },
    ]
  },
  {
    category: 'Lo-fi & Music',
    emoji: '🎵',
    color: 'rgba(252,224,236,0.4)',
    tracks: [
      { name: 'Lo-fi Beats', emoji: '🎧', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3' },
      { name: 'Calm Piano', emoji: '🎹', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3' },
      { name: 'Deep Focus', emoji: '🔮', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3' },
      { name: 'Ambient Chill', emoji: '✨', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3' },
    ]
  },
  {
    category: 'Cafe & Urban',
    emoji: '☕',
    color: 'rgba(232,223,248,0.4)',
    tracks: [
      { name: 'Coffee Shop', emoji: '☕', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3' },
      { name: 'Library Ambience', emoji: '📚', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
      { name: 'Fireplace', emoji: '🔥', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    ]
  },
]

export default function Sounds() {
  const [playing, setPlaying] = useState(null)
  const [volume, setVolume] = useState(0.5)
  const [activeCategory, setActiveCategory] = useState('All')
  const audioRef = useRef(null)

  useEffect(() => {
    return () => { audioRef.current?.pause() }
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const playTrack = (track) => {
    if (playing?.name === track.name) {
      audioRef.current?.pause()
      setPlaying(null)
      return
    }
    if (audioRef.current) audioRef.current.pause()
    const audio = new Audio(track.url)
    audio.loop = true
    audio.volume = volume
    audio.play()
    audioRef.current = audio
    setPlaying(track)
  }

  const categories = ['All', ...SOUNDS.map(s => s.category)]
  const filtered = activeCategory === 'All' ? SOUNDS : SOUNDS.filter(s => s.category === activeCategory)

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '100px 24px 80px', position: 'relative', zIndex: 1 }}>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <p style={{ fontSize: '0.78rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a78bca', marginBottom: 8 }}>Focus Better</p>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.5rem', fontWeight: 400, fontStyle: 'italic', color: '#2d2538', marginBottom: 8 }}>
          Calm Sounds
        </h2>
        <p style={{ color: '#8c7fa0', fontSize: '0.9rem' }}>Background sounds to help you focus, relax, and sleep better.</p>
      </motion.div>

      {/* Now playing bar */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: 'linear-gradient(135deg, #a78bca, #c4a0d8)',
              borderRadius: 16, padding: '14px 20px', marginBottom: 24,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: 12,
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ fontSize: '1.4rem' }}>
                {playing.emoji}
              </motion.span>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>Now Playing</p>
                <p style={{ fontSize: '0.92rem', fontWeight: 600, color: 'white' }}>{playing.name}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>Vol</span>
              <input
                type="range" min="0" max="1" step="0.05"
                value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                style={{ width: 80, accentColor: 'white', cursor: 'pointer' }}
              />
              <button
                onClick={() => { audioRef.current?.pause(); setPlaying(null) }}
                style={{
                  background: 'rgba(255,255,255,0.2)', border: 'none',
                  borderRadius: 50, padding: '6px 14px',
                  color: 'white', cursor: 'pointer', fontSize: '0.8rem',
                  fontFamily: '"DM Sans", sans-serif', fontWeight: 500,
                }}>Stop</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            padding: '8px 18px', borderRadius: 50, border: 'none',
            background: activeCategory === cat ? 'linear-gradient(135deg, #a78bca, #c4a0d8)' : 'rgba(255,255,255,0.6)',
            color: activeCategory === cat ? 'white' : '#8c7fa0',
            fontSize: '0.82rem', fontWeight: activeCategory === cat ? 600 : 400,
            cursor: 'pointer', fontFamily: '"DM Sans", sans-serif',
            backdropFilter: 'blur(8px)',
            boxShadow: activeCategory === cat ? '0 4px 16px rgba(167,139,202,0.3)' : 'none',
            transition: 'all 0.2s',
          }}>{cat}</button>
        ))}
      </div>

      {/* Sound categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {filtered.map((section, si) => (
          <motion.div
            key={section.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.08 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: '1.3rem' }}>{section.emoji}</span>
              <p style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.3rem', fontWeight: 600, color: '#2d2538' }}>{section.category}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {section.tracks.map((track, ti) => {
                const isPlaying = playing?.name === track.name
                return (
                  <motion.button
                    key={track.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: si * 0.08 + ti * 0.05 }}
                    whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(167,139,202,0.2)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => playTrack(track)}
                    style={{
                      padding: '20px 16px', borderRadius: 18,
                      border: `2px solid ${isPlaying ? '#a78bca' : 'transparent'}`,
                      background: isPlaying ? 'rgba(167,139,202,0.15)' : section.color,
                      cursor: 'pointer', textAlign: 'center',
                      backdropFilter: 'blur(12px)',
                      transition: 'all 0.2s',
                    }}>
                    <motion.div
                      animate={isPlaying ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                      transition={{ repeat: isPlaying ? Infinity : 0, duration: 1.2 }}
                      style={{ fontSize: '2rem', marginBottom: 10 }}>
                      {track.emoji}
                    </motion.div>
                    <p style={{
                      fontSize: '0.82rem', fontWeight: isPlaying ? 600 : 500,
                      color: isPlaying ? '#a78bca' : '#2d2538',
                      fontFamily: '"DM Sans", sans-serif',
                      marginBottom: 8,
                    }}>{track.name}</p>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', margin: '0 auto',
                      background: isPlaying ? 'linear-gradient(135deg, #a78bca, #c4a0d8)' : 'rgba(167,139,202,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.85rem', color: isPlaying ? 'white' : '#a78bca',
                      transition: 'all 0.2s',
                    }}>
                      {isPlaying ? '⏸' : '▶'}
                    </div>
                    {isPlaying && (
                      <motion.div
                        style={{ display: 'flex', justifyContent: 'center', gap: 3, marginTop: 8 }}>
                        {[0,1,2,3].map(i => (
                          <motion.div key={i}
                            animate={{ height: ['4px', '14px', '4px'] }}
                            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                            style={{ width: 3, background: '#a78bca', borderRadius: 2 }}
                          />
                        ))}
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}