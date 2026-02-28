import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverErr, setServerErr] = useState('')

  const validate = () => {
    const e = {}
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email address.'
    if (pass.length < 6) e.pass = 'Password must be at least 6 characters.'
    return e
  }

  const handleSubmit = async (evt) => {
    evt.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setLoading(true)
    setServerErr('')
    try {
      await login(email, pass)
      navigate('/dashboard')
    } catch (err) {
      setServerErr(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', paddingTop: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 40px', position: 'relative', zIndex: 1 }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="glass-card-static" style={{ width: '100%', maxWidth: 440, padding: '44px 40px' }}>

        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.2rem', fontWeight: 400, fontStyle: 'italic', color: '#2d2538', marginBottom: 4 }}>
          Welcome back
        </h2>
        <p style={{ color: '#8c7fa0', fontSize: '0.88rem', marginBottom: 36 }}>Sign in to continue your practice</p>

        {serverErr && (
          <div style={{ background: 'rgba(224,112,144,0.1)', border: '1px solid rgba(224,112,144,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: '0.84rem', color: '#c05070', marginBottom: 18 }}>
            {serverErr}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label className="section-label" style={{ display: 'block', marginBottom: 8 }}>Email</label>
            <input className="seren-input" type="email" placeholder="you@college.edu"
              value={email} onChange={e => setEmail(e.target.value)} />
            {errors.email && <p style={{ fontSize: '0.8rem', color: '#e07090', marginTop: 5 }}>{errors.email}</p>}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="section-label" style={{ display: 'block', marginBottom: 8 }}>Password</label>
            <input className="seren-input" type="password" placeholder="Your password"
              value={pass} onChange={e => setPass(e.target.value)} />
            {errors.pass && <p style={{ fontSize: '0.8rem', color: '#e07090', marginTop: 5 }}>{errors.pass}</p>}
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 22, fontSize: '0.85rem', color: '#8c7fa0' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#a78bca', textDecoration: 'none', fontWeight: 500 }}>Sign up</Link>
        </p>
      </motion.div>
    </div>
  )
}
