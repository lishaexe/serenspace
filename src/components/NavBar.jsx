import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import ThemeSelector from './ThemeSelector'

export default function NavBar() {
  const { user, logout } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 40px',
      background: 'rgba(255,255,255,0.55)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      borderBottom: `1px solid ${theme.border}`,
    }}>
      <Link to={user ? '/dashboard' : '/'} style={{
        fontFamily: '"Cormorant Garamond", serif',
        fontSize: '1.5rem', fontWeight: 600,
        color: theme.text, textDecoration: 'none', letterSpacing: '-0.02em',
      }}>
        Seren<span style={{ color: theme.primary }}>Space</span>
      </Link>

      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {user ? (
          <>
            {[
              { path: '/dashboard', label: 'Dashboard' },
              { path: '/library',   label: 'Affirmations' },
              { path: '/breathe',   label: 'Breathe' },
              { path: '/journal',   label: 'Journal' },
              { path: '/timer',  label: 'Focus' },
              { path: '/sounds', label: 'Sounds' },
            ].map(({ path, label }) => (
              <Link key={path} to={path} style={{
                padding: '7px 14px', borderRadius: 50,
                background: isActive(path) ? theme.primaryLight : 'transparent',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '0.85rem', fontWeight: isActive(path) ? 600 : 400,
                color: isActive(path) ? theme.primary : theme.muted,
                textDecoration: 'none', transition: 'all 0.2s',
              }}>{label}</Link>
            ))}
            <ThemeSelector />
            <button onClick={handleLogout} style={{
              marginLeft: 4,
              padding: '8px 18px', borderRadius: 50,
              background: theme.primaryLight,
              border: 'none', cursor: 'pointer',
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.85rem', fontWeight: 500,
              color: theme.primary,
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/about" style={{
              padding: '8px 18px', borderRadius: 50,
              background: theme.primaryLight,
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.85rem', fontWeight: 500,
              color: theme.primary, textDecoration: 'none',
            }}>About</Link>
            <ThemeSelector />
            <Link to="/login" style={{
              padding: '8px 18px', borderRadius: 50,
              background: theme.primaryLight,
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.85rem', fontWeight: 500,
              color: theme.primary, textDecoration: 'none',
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