import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/useAuth'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminInventoryPage from './pages/AdminInventoryPage'
import AdminOrdersPage from './pages/AdminOrdersPage'
import AdminProductsPage from './pages/AdminProductsPage'
import AdminReportsPage from './pages/AdminReportsPage'
import AdminUsersPage from './pages/AdminUsersPage'
import CreateOrderPage from './pages/CreateOrderPage'
import LoginPage from './pages/LoginPage'
import MyOrdersPage from './pages/MyOrdersPage'
import NotFoundPage from './pages/NotFoundPage'
import StaffDashboardPage from './pages/StaffDashboardPage'
import StaffProductsPage from './pages/StaffProductsPage'
import SignupPage from './pages/SignupPage'

function RoleHomeRedirect() {
  const { user, role, loading } = useAuth()

  if (loading) {
    return <div className="state-message">Loading session...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return role === 'admin'
    ? <Navigate to="/admin/dashboard" replace />
    : <Navigate to="/dashboard" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={<RoleHomeRedirect />} />

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<Layout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/inventory" element={<AdminInventoryPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<StaffDashboardPage />} />
          <Route path="/products" element={<StaffProductsPage />} />
          <Route path="/create-order" element={<CreateOrderPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
