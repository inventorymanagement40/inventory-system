export default function DashboardBarChart({ title, items = [] }) {
  const safeItems = items.filter((item) => Number.isFinite(Number(item.value)))
  const maxValue = Math.max(...safeItems.map((item) => Number(item.value)), 1)

  return (
    <article className="card">
      <h3>{title}</h3>
      <div className="dashboard-chart">
        {safeItems.map((item) => {
          const value = Number(item.value)
          const heightPercent = Math.max((value / maxValue) * 100, value > 0 ? 8 : 2)

          return (
            <div className="dashboard-chart-item" key={item.label}>
              <span className="dashboard-chart-value">{value}</span>
              <div className="dashboard-chart-track">
                <div
                  className="dashboard-chart-bar"
                  style={{ height: `${heightPercent}%` }}
                  aria-hidden="true"
                />
              </div>
              <span className="dashboard-chart-label">{item.label}</span>
            </div>
          )
        })}
      </div>
    </article>
  )
}
