import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link'

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 40px',
      background: 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      borderBottom: '1px solid rgba(255,255,255,0.65)',
    }}>
      <Link to={user ? '/dashboard' : '/'} style={{
        fontFamily: '"Cormorant Garamond", serif',
        fontSize: '1.5rem', fontWeight: 600,
        color: '#2d2538', textDecoration: 'none', letterSpacing: '-0.02em',
      }}>
        Seren<span style={{ color: '#a78bca' }}>Space</span>
      </Link>

      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
            <Link to="/library"   className={isActive('/library')}>Meditate</Link>
            <Link to="/breathe"   className={isActive('/breathe')}>Breathe</Link>
            <Link to="/journal"   className={isActive('/journal')}>Journal</Link>
            <Link to="/timer"     className={isActive('/timer')}>Focus</Link>
            <button onClick={handleLogout} style={{
              marginLeft: 6,
              padding: '8px 18px', borderRadius: 50,
              background: 'rgba(167,139,202,0.15)',
              border: 'none', cursor: 'pointer',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.85rem', fontWeight: 500,
              color: '#6b4f8a',
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              padding: '8px 18px', borderRadius: 50,
              background: 'rgba(167,139,202,0.15)',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.85rem', fontWeight: 500,
              color: '#6b4f8a', textDecoration: 'none',
            }}>Login</Link>
            <Link to="/signup" className="btn-primary" style={{ padding: '9px 22px', fontSize: '0.85rem' }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
