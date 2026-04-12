import { useEffect, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { getMyOrders } from '../services/ordersService'
import { getProducts } from '../services/productsService'

export default function StaffDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    products: 0,
    myOrders: 0,
    pendingOrders: 0,
    availableProducts: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [products, orders] = await Promise.all([
          getProducts(),
          getMyOrders(user.id),
        ])

        setStats({
          products: products.length,
          myOrders: orders.length,
          pendingOrders: orders.filter((o) => o.status === 'pending').length,
          availableProducts: products.filter((p) => Number(p.stock) > 0).length,
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) loadData()
  }, [user?.id])

  if (loading) return <p className="state-message">Loading dashboard...</p>
  if (error) return <p className="error-text">{error}</p>

  return (
    <section>
      <h1>Staff Dashboard</h1>
      <div className="stats-grid">
        <article className="card stat-card">
          <h3>Products</h3>
          <strong>{stats.products}</strong>
        </article>
        <article className="card stat-card">
          <h3>My Orders</h3>
          <strong>{stats.myOrders}</strong>
        </article>
        <article className="card stat-card">
          <h3>Pending Orders</h3>
          <strong>{stats.pendingOrders}</strong>
        </article>
        <article className="card stat-card">
          <h3>In Stock</h3>
          <strong>{stats.availableProducts}</strong>
        </article>
      </div>
    </section>
  )
}
