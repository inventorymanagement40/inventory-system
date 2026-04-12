import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getOrders } from '../services/ordersService'
import { getProducts } from '../services/productsService'
import { formatPhpCurrency } from '../utils/currency'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    pendingOrders: 0,
    completedOrders: 0,
    lowStock: 0,
    pendingValue: 0,
    completedValue: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const getOrderTotal = (order) =>
    (order.order_items ?? []).reduce((sum, item) => {
      const price = Number(item.product?.price ?? 0)
      const quantity = Number(item.quantity ?? 0)
      return sum + price * quantity
    }, 0)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [products, orders] = await Promise.all([getProducts(), getOrders()])
        const pendingOrders = orders.filter((o) => o.status === 'pending')
        const completedOrders = orders.filter((o) => o.status === 'completed')

        setStats({
          products: products.length,
          pendingOrders: pendingOrders.length,
          completedOrders: completedOrders.length,
          lowStock: products.filter((p) => Number(p.stock) <= 10).length,
          pendingValue: pendingOrders.reduce((sum, order) => sum + getOrderTotal(order), 0),
          completedValue: completedOrders.reduce((sum, order) => sum + getOrderTotal(order), 0),
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) return <p className="state-message">Loading dashboard...</p>
  if (error) return <p className="error-text">{error}</p>

  const orderValueData = [
    {
      status: 'Pending',
      orders: stats.pendingOrders,
      value: Number(stats.pendingValue.toFixed(2)),
    },
    {
      status: 'Completed',
      orders: stats.completedOrders,
      value: Number(stats.completedValue.toFixed(2)),
    },
  ]

  return (
    <section>
      <h1>Admin Dashboard</h1>
      <div className="stats-grid dashboard-stats-grid">
        <article className="card stat-card">
          <h3>Total Products</h3>
          <strong>{stats.products}</strong>
        </article>
        <article className="card stat-card">
          <h3>Pending Orders</h3>
          <strong>{stats.pendingOrders}</strong>
        </article>
        <article className="card stat-card">
          <h3>Completed Orders</h3>
          <strong>{stats.completedOrders}</strong>
        </article>
        <article className="card stat-card">
          <h3>Low Stock Items</h3>
          <strong>{stats.lowStock}</strong>
        </article>
        <article className="card stat-card">
          <h3>Pending Order Value</h3>
          <strong>{formatPhpCurrency(stats.pendingValue)}</strong>
        </article>
        <article className="card stat-card">
          <h3>Completed Order Value</h3>
          <strong>{formatPhpCurrency(stats.completedValue)}</strong>
        </article>
      </div>
      <article className="card">
        <h3>Pending vs Completed Orders</h3>
        <p className="subtle-text">Bar = order count, line = total value (PHP).</p>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={orderValueData} margin={{ top: 20, right: 12, left: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis yAxisId="left" allowDecimals={false} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => formatPhpCurrency(value)}
              />
              <Tooltip
                formatter={(value, name) =>
                  name === 'Value' ? formatPhpCurrency(value) : Number(value)
                }
              />
              <Legend />
              <Bar yAxisId="left" dataKey="orders" name="Orders" fill="#2563eb" radius={[6, 6, 0, 0]} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="value"
                name="Value"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  )
}
