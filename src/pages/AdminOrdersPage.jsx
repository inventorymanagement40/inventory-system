import { useEffect, useState } from 'react'
import { useToast } from '../context/useToast'
import { getOrders, updateOrderStatus } from '../services/ordersService'

export default function AdminOrdersPage() {
  const { showToast } = useToast()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadOrders = async () => {
    setLoading(true)
    try {
      const data = await getOrders()
      setOrders(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleStatusChange = async (orderId, status) => {
    setError('')
    try {
      await updateOrderStatus(orderId, status)
      await loadOrders()
      showToast(`Order #${orderId} status changed to ${status}.`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section>
      <h1>Orders</h1>
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p className="state-message">Loading orders...</p>
      ) : (
        <div className="card table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Status</th>
                <th>Items</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.profiles?.email ?? 'Unknown'}</td>
                  <td>
                    <select
                      className="input"
                      value={order.status}
                      onChange={(event) =>
                        handleStatusChange(order.id, event.target.value)
                      }
                    >
                      <option value="pending">pending</option>
                      <option value="completed">completed</option>
                    </select>
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
