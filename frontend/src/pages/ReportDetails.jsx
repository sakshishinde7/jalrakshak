import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getReport } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import Loader from '../components/Loader'
import './ReportDetails.css'

function formatDate(dateString) {
  if (!dateString) return 'Unknown'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ReportDetails() {
  const { reportCode } = useParams()
  const [report, setReport] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadReport() {
      setIsLoading(true)
      setError(null)
      try {
        const res = await getReport(reportCode)
        if (!isMounted) return
        if (res.success && res.data) {
          setReport(res.data)
        } else {
          setError(res.error || 'Report not found.')
        }
      } catch (err) {
        if (isMounted) setError('Unable to reach server.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    if (reportCode) {
      loadReport()
    }
    return () => { isMounted = false }
  }, [reportCode])

  return (
    <div className="report-details-page">
      <div className="container details-container">
        {/* Navigation Breadcrumb */}
        <div className="details-nav">
          <Link to="/reports" className="back-link">
            ← Back to Explore Reports
          </Link>
        </div>

        {isLoading ? (
          <Loader text={`Loading details for ${reportCode}...`} />
        ) : error || !report ? (
          <div className="not-found-card">
            <div className="not-found-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2>Report Not Found</h2>
            <p>
              We couldn't find a report matching the code <strong>{reportCode}</strong>. It may have been removed, or the code was mistyped.
            </p>
            <div className="not-found-actions">
              <Link to="/reports" className="btn btn-primary">
                Browse All Reports
              </Link>
              <Link to="/report" className="btn btn-secondary">
                Submit a Report
              </Link>
            </div>
          </div>
        ) : (
          <article className="details-card">
            <header className="details-header">
              <div className="header-meta">
                <span className="code-pill">{report.report_code}</span>
                <span className="header-date">Submitted on {formatDate(report.created_at)}</span>
              </div>
              <StatusBadge status={report.status} />
            </header>

            <h1 className="details-title">{report.location_name}</h1>

            <div className="details-grid">
              <div className="details-main">
                <section className="details-section">
                  <h2 className="section-label">Incident Description</h2>
                  <div className="description-text">
                    {report.description}
                  </div>
                </section>

                {(report.latitude != null || report.longitude != null) && (
                  <section className="details-section">
                    <h2 className="section-label">Geographic Coordinates</h2>
                    <div className="coords-box">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>
                        Latitude: <strong>{report.latitude ?? 'N/A'}</strong>, Longitude: <strong>{report.longitude ?? 'N/A'}</strong>
                      </span>
                    </div>
                  </section>
                )}
              </div>

              <aside className="details-sidebar">
                <div className="sidebar-card">
                  <h3 className="sidebar-heading">Report Summary</h3>
                  <div className="summary-list">
                    <div className="summary-item">
                      <span className="item-key">Category</span>
                      <span className="item-val">{report.issue_category}</span>
                    </div>
                    <div className="summary-item">
                      <span className="item-key">Current Status</span>
                      <span className="item-val">
                        <StatusBadge status={report.status} />
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="item-key">Last Updated</span>
                      <span className="item-val">{formatDate(report.updated_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="sidebar-card notice-card">
                  <h3 className="sidebar-heading">Public Record Notice</h3>
                  <p className="notice-text">
                    This report was submitted by a community member to help monitor water resource health. Personal identity and contact details remain protected.
                  </p>
                </div>
              </aside>
            </div>
          </article>
        )}
      </div>
    </div>
  )
}

