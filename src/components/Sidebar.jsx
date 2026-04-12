import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/inventory', label: 'Inventory' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/users', label: 'Users' },
]

const staffLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/products', label: 'Products' },
  { to: '/create-order', label: 'Create Order' },
  { to: '/my-orders', label: 'My Orders' },
]

export default function Sidebar() {
  const { role, profile, logout } = useAuth()
  const links = role === 'admin' ? adminLinks : staffLinks

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error(error.message)
    }
  }

  return (
    <aside className="sidebar">
      <div>
        <h2 className="brand">Inventory IMS</h2>
        <p className="subtle-text">{profile?.email ?? 'Signed in'}{role === 'admin' ? ' (admin)' : ''}</p>
      </div>

      <nav className="nav-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button className="btn btn-danger sidebar-logout-btn" type="button" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  )
}
