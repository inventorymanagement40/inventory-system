import { NavLink } from 'react-router-dom'
import {
  FiBarChart2,
  FiBox,
  FiClipboard,
  FiHome,
  FiLogOut,
  FiPackage,
  FiShoppingCart,
  FiUsers,
} from 'react-icons/fi'
import { useAuth } from '../context/useAuth'

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/admin/products', label: 'Products', icon: FiBox },
  { to: '/admin/inventory', label: 'Inventory', icon: FiPackage },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingCart },
  { to: '/admin/reports', label: 'Reports', icon: FiBarChart2 },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
]

const staffLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/products', label: 'Products', icon: FiBox },
  { to: '/create-order', label: 'Create Order', icon: FiShoppingCart },
  { to: '/my-orders', label: 'My Orders', icon: FiClipboard },
]

export default function Sidebar({ isMobileOpen = false, onNavigate }) {
  const { role, profile, logout } = useAuth()
  const links = role === 'admin' ? adminLinks : staffLinks

  const handleLogout = async () => {
    try {
      await logout()
      onNavigate?.()
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
      <div>
        <div className="sidebar-brand">
          <img src="/logo.png" alt="Inventory IMS" className="sidebar-brand-logo" />
        </div>
        <p className="subtle-text" style={{ color: 'white' }}>{profile?.email ?? 'Signed in'}{role === 'admin' ? ' (admin)' : ''}</p>
      </div>

      <nav className="nav-links">
        {links.map((link) => {
          const Icon = link.icon

          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              onClick={onNavigate}
            >
              <Icon aria-hidden="true" />
              <span>{link.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <button className="btn btn-danger sidebar-logout-btn" type="button" onClick={handleLogout}>
        <FiLogOut aria-hidden="true" />
        <span>Logout</span>
      </button>
    </aside>
  )
}
