import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import FAB from './components/FAB'
import SmartReminder from './components/SmartReminder'
import MindfulnessAssistant from './components/MindfulnessAssistant'
import ProtectedRoute from './components/ProtectedRoute'
import Landing   from './pages/Landing'
import Login     from './pages/Login'
import Signup    from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Library   from './pages/Library'
import Breathe   from './pages/Breathe'
import Journal   from './pages/Journal'
import Timer     from './pages/Timer'
import About     from './pages/About'

function AppContent() {
  const { user } = useAuth()
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/"          element={<Landing />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/signup"    element={<Signup />} />
        <Route path="/about"     element={<About />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/library"   element={<ProtectedRoute><Library /></ProtectedRoute>} />
        <Route path="/breathe"   element={<ProtectedRoute><Breathe /></ProtectedRoute>} />
        <Route path="/journal"   element={<ProtectedRoute><Journal /></ProtectedRoute>} />
        <Route path="/timer"     element={<ProtectedRoute><Timer /></ProtectedRoute>} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      {user && <FAB />}
      {user && <SmartReminder />}
      {user && <MindfulnessAssistant />}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}