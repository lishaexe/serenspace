import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import NavBar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'
import Landing   from './pages/Landing'
import Login     from './pages/Login'
import Signup    from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Library   from './pages/Library'
import Breathe   from './pages/Breathe'
import Journal   from './pages/Journal'
import Timer     from './pages/Timer'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="aurora-bg">
          <NavBar />
          <Routes>
            <Route path="/"          element={<Landing />} />
            <Route path="/login"     element={<Login />} />
            <Route path="/signup"    element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/library"   element={<ProtectedRoute><Library /></ProtectedRoute>} />
            <Route path="/breathe"   element={<ProtectedRoute><Breathe /></ProtectedRoute>} />
            <Route path="/journal"   element={<ProtectedRoute><Journal /></ProtectedRoute>} />
            <Route path="/timer"     element={<ProtectedRoute><Timer /></ProtectedRoute>} />
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
