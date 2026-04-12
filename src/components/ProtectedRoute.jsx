import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function roleHome(role) {
  return role === 'admin' ? '/admin/dashboard' : '/dashboard'
}

export default function ProtectedRoute({ allowedRoles }) {
  const { user, role, loading } = useAuth()

  if (loading) {
    return <div className="state-message">Loading access...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={roleHome(role)} replace />
  }

  return <Outlet />
}
