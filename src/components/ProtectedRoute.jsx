import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="section-label" style={{ letterSpacing: '0.3em' }}>loading...</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return children
}
