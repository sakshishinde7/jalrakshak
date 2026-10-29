import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import './ReportCard.css'

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function truncate(text, maxLength = 120) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trimEnd() + '…'
}

const CATEGORY_ICONS = {
  'Water Pollution': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C12 2 5 10 5 15a7 7 0 0 0 14 0C19 10 12 2 12 2z" />
      <line x1="8" y1="18" x2="16" y2="12" />
    </svg>
  ),
  'Sewage Contamination': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C12 2 5 10 5 15a7 7 0 0 0 14 0C19 10 12 2 12 2z" />
      <path d="M9 16c1 1 5 1 6 0" />
    </svg>
  ),
  'Plastic Waste': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="20" rx="2" />
      <path d="M8 6h8" />
      <path d="M8 18h8" />
    </svg>
  ),
  'Water Leakage or Wastage': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C12 2 5 10 5 15a7 7 0 0 0 14 0C19 10 12 2 12 2z" />
      <path d="M12 18v4" />
      <path d="M10 22h4" />
    </svg>
  ),
  'Other': (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" />
      <circle cx="12" cy="16" r="0.5" fill="currentColor" />
    </svg>
  ),
}

export default function ReportCard({ report }) {
  const icon = CATEGORY_ICONS[report.issue_category] || CATEGORY_ICONS['Other']

  return (
    <article className="report-card">
      <div className="report-card-header">
        <div className="report-card-category">
          <span className="report-card-category-icon">{icon}</span>
          <span className="report-card-category-text">{report.issue_category}</span>
        </div>
        <StatusBadge status={report.status} />
      </div>

      <div className="report-card-body">
        <h3 className="report-card-location">{report.location_name}</h3>
        <p className="report-card-description">
          {truncate(report.description)}
        </p>
      </div>

      <div className="report-card-footer">
        <div className="report-card-meta">
          <span className="report-card-code">{report.report_code}</span>
          <span className="report-card-date">{formatDate(report.created_at)}</span>
        </div>
        <Link to={`/reports/${report.report_code}`} className="report-card-link">
          View Details →
        </Link>
      </div>
    </article>
  )
}
