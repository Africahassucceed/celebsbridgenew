import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { SupabaseProvider } from './contexts/SupabaseContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

// Pages
import LandingPage from './pages/LandingPage'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Dashboard from './pages/user/Dashboard'
import BrowseCelebrities from './pages/user/BrowseCelebrities'
import RequestShoutout from './pages/user/RequestShoutout'
import MyBookings from './pages/user/MyBookings'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminCelebrities from './pages/admin/AdminCelebrities'
import AdminRequests from './pages/admin/AdminRequests'
import AdminUsers from './pages/admin/AdminUsers'

function App() {
  return (
    <SupabaseProvider>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected User Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/browse" element={
            <ProtectedRoute>
              <BrowseCelebrities />
            </ProtectedRoute>
          } />
          <Route path="/request-shoutout" element={
            <ProtectedRoute>
              <RequestShoutout />
            </ProtectedRoute>
          } />
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/celebrities" element={
            <AdminRoute>
              <AdminCelebrities />
            </AdminRoute>
          } />
          <Route path="/admin/requests" element={
            <AdminRoute>
              <AdminRequests />
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } />
        </Routes>
      </AuthProvider>
    </SupabaseProvider>
  )
}

export default App 