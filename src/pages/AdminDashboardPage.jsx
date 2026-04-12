import { useEffect, useMemo, useState } from 'react'
import { FiBell, FiSearch } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import {
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useAuth } from '../context/useAuth'
import { getOrders } from '../services/ordersService'
import { getProducts } from '../services/productsService'
import { formatPhpCurrency } from '../utils/currency'

export default function AdminDashboardPage() {
  const { profile, logout } = useAuth()
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [dashboardSearch, setDashboardSearch] = useState('')
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const getOrderSubtotal = (order) =>
    (order?.order_items ?? []).reduce((sum, item) => {
      const price = Number(item.product?.price ?? 0)
      const quantity = Number(item.quantity ?? 0)
      return sum + price * quantity
    }, 0)

  const monthlySalesData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const totals = Array.from({ length: 12 }, (_, idx) => ({
      month: monthNames[idx],
      sales: 0,
    }))

    for (const order of orders) {
      if (!order?.created_at) continue
      const date = new Date(order.created_at)
      if (Number.isNaN(date.getTime())) continue
      const monthIndex = date.getMonth()
      totals[monthIndex].sales += getOrderSubtotal(order)
    }

    return totals.map((item) => ({
      ...item,
      sales: Number(item.sales.toFixed(2)),
    }))
  }, [orders])

  const metrics = useMemo(() => {
    const pendingOrders = orders.filter((order) => order.status === 'pending')
    const completedOrders = orders.filter((order) => order.status === 'completed')
    const today = new Date().toDateString()

    return {
      totalProducts: products.length,
      lowStockItems: products.filter((product) => Number(product.stock) > 0 && Number(product.stock) <= 10).length,
      ordersToday: orders.filter((order) => new Date(order.created_at).toDateString() === today).length,
      revenue: completedOrders.reduce((sum, order) => sum + getOrderSubtotal(order), 0),
      inStock: products.filter((product) => Number(product.stock) > 10).length,
      lowStockCount: products.filter((product) => Number(product.stock) > 0 && Number(product.stock) <= 10).length,
      outOfStock: products.filter((product) => Number(product.stock) === 0).length,
      pendingOrders: pendingOrders.length,
    }
  }, [orders, products])

  const filteredProducts = useMemo(() => {
    const keyword = dashboardSearch.trim().toLowerCase()
    if (!keyword) return products.slice(0, 5)

    return products
      .filter((product) => {
        const name = (product.name ?? '').toLowerCase()
        const description = (product.description ?? '').toLowerCase()
        return name.includes(keyword) || description.includes(keyword)
      })
      .slice(0, 5)
  }, [dashboardSearch, products])

  const latestOrders = useMemo(() => orders.slice(0, 4), [orders])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productData, orderData] = await Promise.all([getProducts(), getOrders()])
        setProducts(productData)
        setOrders(orderData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleLogout = async () => {
    setError('')
    try {
      await logout()
      setIsUserMenuOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <p className="state-message">Loading dashboard...</p>
  if (error) return <p className="error-text">{error}</p>

  const displayName = profile?.email?.split('@')?.[0] ?? 'Admin'
  const displayInitial = displayName.charAt(0).toUpperCase() || 'A'

  return (
    <section className="admin-dashboard">
      <div className="admin-dashboard-topbar card">
        <label className="admin-dashboard-search">
          <FiSearch aria-hidden="true" />
          <input
            type="search"
            placeholder="Search products..."
            value={dashboardSearch}
            onChange={(event) => setDashboardSearch(event.target.value)}
            aria-label="Search products"
          />
        </label>
        <div className="admin-dashboard-userbox">
          <FiBell aria-hidden="true" />
          <span>Welcome {displayName}</span>
          <div className="admin-user-menu">
            <button
              className="admin-dashboard-avatar-btn"
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={isUserMenuOpen}
              aria-label="User menu"
            >
              <span className="admin-dashboard-avatar">{displayInitial}</span>
            </button>
            {isUserMenuOpen ? (
              <div className="admin-user-dropdown" role="menu">
                <button className="admin-user-dropdown-item" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="stats-grid dashboard-stats-grid admin-kpi-grid">
        <article className="card stat-card">
          <h3>Total Products</h3>
          <strong>{metrics.totalProducts}</strong>
        </article>
        <article className="card stat-card">
          <h3>Low Stock Items</h3>
          <strong>{metrics.lowStockItems}</strong>
        </article>
        <article className="card stat-card">
          <h3>Orders Today</h3>
          <strong>{metrics.ordersToday}</strong>
        </article>
        <article className="card stat-card">
          <h3>Revenue</h3>
          <strong>{formatPhpCurrency(metrics.revenue)}</strong>
        </article>
      </div>

      <article className="card admin-sales-card">
        <h3>Sales Overview</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlySalesData} margin={{ top: 8, right: 10, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => formatPhpCurrency(value)} />
              <Tooltip formatter={(value) => formatPhpCurrency(value)} />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#334155"
                strokeWidth={2.5}
                dot={{ r: 5 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </article>

      <div className="admin-dashboard-panels">
        <div className="admin-dashboard-left">
          <article className="card">
            <div className="admin-widget-header">
              <h3>Products</h3>
              <Link className="btn btn-primary" to="/admin/products">
                + Add Product
              </Link>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Description</th>
                    <th>Stock</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="state-message">
                        No products found for "{dashboardSearch}".
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.description || '-'}</td>
                        <td>{product.stock}</td>
                        <td>{formatPhpCurrency(product.price)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>

          <article className="card">
            <h3>Orders</h3>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {latestOrders.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="state-message">
                        No orders yet.
                      </td>
                    </tr>
                  ) : (
                    latestOrders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.profiles?.email ?? 'Unknown'}</td>
                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>
        </div>

        <div className="admin-dashboard-right">
          <article className="card">
            <h3>Inventory</h3>
            <div className="admin-inventory-cards">
              <div className="admin-inventory-pill ok">
                <span>In Stock</span>
                <strong>{metrics.inStock}</strong>
              </div>
              <div className="admin-inventory-pill warning">
                <span>Low Stock</span>
                <strong>{metrics.lowStockCount}</strong>
              </div>
              <div className="admin-inventory-pill danger">
                <span>Out of Stock</span>
                <strong>{metrics.outOfStock}</strong>
              </div>
            </div>
          </article>

          <article className="card">
            <h3>Orders</h3>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {latestOrders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="state-message">
                        No orders yet.
                      </td>
                    </tr>
                  ) : (
                    latestOrders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.profiles?.email ?? 'Unknown'}</td>
                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td>
                          <span
                            className={`status-pill ${
                              order.status === 'completed'
                                ? 'ok'
                                : order.status === 'cancelled'
                                  ? 'danger'
                                  : 'warning'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
