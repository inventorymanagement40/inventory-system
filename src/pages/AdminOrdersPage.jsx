import { useEffect, useMemo, useState } from 'react'
import { useToast } from '../context/useToast'
import { getOrders, updateOrderStatus } from '../services/ordersService'
import { formatPhpCurrency } from '../utils/currency'

function getItemSubtotal(item) {
  const quantity = Number(item?.quantity ?? 0)
  const price = Number(item?.product?.price ?? 0)
  return quantity * price
}

function getOrderSubtotal(order) {
  return (order?.order_items ?? []).reduce((sum, item) => sum + getItemSubtotal(item), 0)
}

export default function AdminOrdersPage() {
  const { showToast } = useToast()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrderId, setSelectedOrderId] = useState(null)

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

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) ?? null,
    [orders, selectedOrderId],
  )

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
    <section className="page-pale-cards">
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
                <th>Subtotal</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="state-message">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const subtotal = getOrderSubtotal(order)

                  return (
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
                        <div className="order-items-preview">
                          {(order.order_items ?? []).slice(0, 2).map((item) => (
                            <span key={item.id}>
                              {item.product?.name ?? 'Unknown product'} x{item.quantity}
                            </span>
                          ))}
                          {(order.order_items ?? []).length > 2 ? (
                            <span className="subtle-text">
                              +{(order.order_items ?? []).length - 2} more item(s)
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="money-cell">{formatPhpCurrency(subtotal)}</td>
                      <td>{new Date(order.created_at).toLocaleString()}</td>
                      <td>
                        <button
                          className="btn btn-primary order-view-btn"
                          type="button"
                          onClick={() => setSelectedOrderId(order.id)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}
      {selectedOrder ? (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`Order #${selectedOrder.id} details`}
          onClick={() => setSelectedOrderId(null)}
        >
          <div className="modal-card order-details-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>Order #{selectedOrder.id} Details</h3>
              <button className="btn" type="button" onClick={() => setSelectedOrderId(null)}>
                Close
              </button>
            </div>
            <p className="subtle-text">
              Customer: {selectedOrder.profiles?.email ?? 'Unknown'} | Created:{' '}
              {new Date(selectedOrder.created_at).toLocaleString()}
            </p>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedOrder.order_items ?? []).map((item) => (
                    <tr key={item.id}>
                      <td>{item.product?.name ?? 'Unknown product'}</td>
                      <td>{item.quantity}</td>
                      <td>{formatPhpCurrency(item.product?.price)}</td>
                      <td className="money-cell">{formatPhpCurrency(getItemSubtotal(item))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="order-details-totals">
              <div>
                <span>Subtotal</span>
                <strong>{formatPhpCurrency(getOrderSubtotal(selectedOrder))}</strong>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
