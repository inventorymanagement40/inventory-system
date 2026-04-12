import { useEffect, useState } from 'react'
import { useAuth } from '../context/useAuth'
import { getMyOrders } from '../services/ordersService'

export default function MyOrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getMyOrders(user.id)
        setOrders(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) loadOrders()
  }, [user?.id])

  return (
    <section>
      <h1>My Orders</h1>
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p className="state-message">Loading your orders...</p>
      ) : (
        <div className="card table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Items</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    <span
                      className={
                        order.status === 'completed'
                          ? 'status-pill ok'
                          : 'status-pill warning'
                      }
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {(order.order_items ?? [])
                      .map((item) => `${item.product?.name} x${item.quantity}`)
                      .join(', ')}
                  </td>
                  <td>{new Date(order.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
