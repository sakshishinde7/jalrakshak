import './StatCard.css'

export default function StatCard({ value, label, icon }) {
  return (
    <div className="stat-card">
      {icon && <div className="stat-card-icon">{icon}</div>}
      <div className="stat-card-content">
        <span className="stat-card-value">{value ?? 0}</span>
        <span className="stat-card-label">{label}</span>
      </div>
    </div>
  )
}
