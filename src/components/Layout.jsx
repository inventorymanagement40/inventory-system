import { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className={`app-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <button
        className="mobile-sidebar-toggle"
        type="button"
        onClick={() => setIsSidebarOpen((prev) => !prev)}
        aria-label={isSidebarOpen ? 'Close sidebar menu' : 'Open sidebar menu'}
        aria-expanded={isSidebarOpen}
      >
        {isSidebarOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
      </button>
      {isSidebarOpen ? (
        <button
          className="mobile-sidebar-backdrop"
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : null}
      <Sidebar isMobileOpen={isSidebarOpen} onNavigate={() => setIsSidebarOpen(false)} />
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  )
}
