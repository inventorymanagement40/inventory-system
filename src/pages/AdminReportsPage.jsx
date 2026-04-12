import { useEffect, useState } from 'react'
import { getReports } from '../services/reportsService'

export default function AdminReportsPage() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await getReports()
        setReport(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadReport()
  }, [])

  if (loading) return <p className="state-message">Loading report...</p>
  if (error) return <p className="error-text">{error}</p>
  if (!report) return <p className="state-message">No report data available.</p>

  const fulfillmentRate = report.totalOrders
    ? Math.round((report.completedOrders / report.totalOrders) * 100)
    : 0
  const lowStockCount = report.lowStock.length
  const stockHealthLabel =
    lowStockCount === 0 ? 'Healthy' : lowStockCount <= 3 ? 'Watch list' : 'Action needed'

  return (
    <section className="page-pale-cards">
      <h1>Reports</h1>
      {/* <p className="subtle-text">A quick snapshot of inventory and order performance.</p> */}
      <div className="stats-grid">
        <article className="card stat-card">
          <h3>Catalog Size</h3>
          <strong>{report.totalProducts}</strong>
          <p className="subtle-text">Active products in your catalog.</p>
        </article>
        <article className="card stat-card">
          <h3>Units in Stock</h3>
          <strong>{report.totalStock}</strong>
          <p className="subtle-text">Total sellable units across all products.</p>
        </article>
        <article className="card stat-card">
          <h3>Total Orders</h3>
          <strong>{report.totalOrders}</strong>
          <p className="subtle-text">All orders created in the system.</p>
        </article>
        <article className="card stat-card">
          <h3>Order Fulfillment</h3>
          <strong>{fulfillmentRate}%</strong>
          <p className="subtle-text">
            {report.completedOrders} completed / {report.totalOrders} total.
          </p>
        </article>
      </div>

      <div className="card report-health-card">
        <h3>Operations Health</h3>
        <div className="report-badges">
          <span className={`health-badge ${stockHealthLabel === 'Healthy' ? 'ok' : 'warning'}`}>
            Stock: {stockHealthLabel}
          </span>
          <span className={`health-badge ${report.pendingOrders === 0 ? 'ok' : 'warning'}`}>
            Pending Orders: {report.pendingOrders}
          </span>
          <span className="health-badge neutral">Low Stock Items: {lowStockCount}</span>
        </div>
        <ul className="simple-list">
          <li>
            {report.pendingOrders === 0
              ? 'Great: no pending orders need action right now.'
              : `${report.pendingOrders} order(s) are pending. Prioritize processing these today.`}
          </li>
          <li>
            {lowStockCount === 0
              ? 'All products are currently above the low-stock threshold.'
              : `${lowStockCount} product(s) are at or below 10 units and should be restocked soon.`}
          </li>
        </ul>
      </div>

      <div className="card">
        <h3>Low Stock Products ({'<= 10'})</h3>
        {lowStockCount === 0 ? (
          <p className="success-text">All products are sufficiently stocked.</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Units Left</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {report.lowStock
                  .slice()
                  .sort((a, b) => Number(a.stock) - Number(b.stock))
                  .map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.stock}</td>
                      <td>
                        <span
                          className={`status-pill ${Number(product.stock) <= 3 ? 'warning' : 'ok'}`}
                        >
                          {Number(product.stock) <= 3 ? 'Urgent restock' : 'Restock soon'}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
