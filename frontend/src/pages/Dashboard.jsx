import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStats } from '../services/api'
import StatCard from '../components/StatCard'
import Loader from '../components/Loader'
import './Dashboard.css'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    async function loadStats() {
      setIsLoading(true)
      setError(null)
      try {
        const res = await getStats()
        if (!isMounted) return
        if (res.success && res.data) {
          setStats(res.data)
        } else {
          setError(res.error || 'Failed to retrieve database statistics.')
        }
      } catch (err) {
        if (isMounted) setError('Network error communicating with backend.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    loadStats()
    return () => { isMounted = false }
  }, [])

  const categoryData = stats?.by_category || {}
  const totalReports = stats?.total || 0
  const categoriesList = Object.entries(categoryData)

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <span className="dashboard-badge">Live Platform Metrics</span>
            <h1 className="dashboard-title">Community Reports Dashboard</h1>
            <p className="dashboard-subtitle">
              Summary of all water-related incidents logged by community participants. All counts are computed dynamically from the central database.
            </p>
          </div>
          <Link to="/reports" className="btn btn-secondary">
            View All Reports →
          </Link>
        </div>

        {/* Clear Notice on Data Domain */}
        <div className="disclaimer-alert">
          <div className="disclaimer-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <div className="disclaimer-content">
            <strong>Important distinction:</strong> The figures shown below reflect incident reports logged by community observers. They are administrative record counts, not sensor-derived or laboratory-verified water quality measurements (e.g. pH, turbidity, or biological oxygen demand).
          </div>
        </div>

        {isLoading ? (
          <Loader text="Calculating statistics from PostgreSQL..." />
        ) : error ? (
          <div className="dashboard-error-card">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-secondary">
              Refresh
            </button>
          </div>
        ) : (
          <>
            {/* Primary KPI Stat Cards */}
            <div className="stats-kpi-grid">
              <StatCard
                value={stats?.total ?? 0}
                label="Total Reports Submitted"
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                }
              />
              <StatCard
                value={stats?.pending ?? 0}
                label="Pending Review"
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                }
              />
              <StatCard
                value={stats?.under_investigation ?? 0}
                label="Under Investigation"
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                }
              />
              <StatCard
                value={stats?.resolved ?? 0}
                label="Resolved"
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                }
              />
            </div>

            {/* Empty State Explanation if zero reports */}
            {totalReports === 0 ? (
              <div className="empty-dashboard-card">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted-teal)" strokeWidth="1.5">
                  <path d="M12 2C12 2 5 10 5 15a7 7 0 0 0 14 0C19 10 12 2 12 2z" />
                </svg>
                <h3>Database is Currently Empty</h3>
                <p>
                  No incidents have been submitted yet. Once community members file reports, distribution charts and category breakdowns will populate here automatically.
                </p>
                <Link to="/report" className="btn btn-primary">
                  Submit the First Report
                </Link>
              </div>
            ) : (
              /* Distribution by Category: Pure CSS Bar Chart */
              <div className="charts-section">
                <div className="chart-card">
                  <div className="chart-header">
                    <h2 className="chart-title">Reports by Issue Category</h2>
                    <span className="chart-subtitle">Distribution across reported problem types</span>
                  </div>

                  <div className="category-bars">
                    {categoriesList.map(([catName, count]) => {
                      const percentage = totalReports > 0 ? Math.round((count / totalReports) * 100) : 0
                      return (
                        <div key={catName} className="bar-row">
                          <div className="bar-info">
                            <span className="bar-label">{catName}</span>
                            <span className="bar-counts">
                              <strong>{count}</strong> ({percentage}%)
                            </span>
                          </div>
                          <div className="bar-track">
                            <div
                              className="bar-fill"
                              style={{ width: `${percentage}%` }}
                              aria-valuenow={percentage}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Status Resolution Ratio Card */}
                <div className="chart-card">
                  <div className="chart-header">
                    <h2 className="chart-title">Status Breakdown</h2>
                    <span className="chart-subtitle">Progression through tracking lifecycle</span>
                  </div>

                  <div className="status-progress-breakdown">
                    <div className="status-item-progress">
                      <div className="status-item-header">
                        <span className="status-dot dot-pending"></span>
                        <span className="status-item-label">Pending</span>
                        <span className="status-item-val">{stats?.pending || 0}</span>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill fill-pending"
                          style={{ width: `${totalReports > 0 ? (stats?.pending / totalReports) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="status-item-progress">
                      <div className="status-item-header">
                        <span className="status-dot dot-investigating"></span>
                        <span className="status-item-label">Under Investigation</span>
                        <span className="status-item-val">{stats?.under_investigation || 0}</span>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill fill-investigating"
                          style={{ width: `${totalReports > 0 ? (stats?.under_investigation / totalReports) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="status-item-progress">
                      <div className="status-item-header">
                        <span className="status-dot dot-resolved"></span>
                        <span className="status-item-label">Resolved</span>
                        <span className="status-item-val">{stats?.resolved || 0}</span>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill fill-resolved"
                          style={{ width: `${totalReports > 0 ? (stats?.resolved / totalReports) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

