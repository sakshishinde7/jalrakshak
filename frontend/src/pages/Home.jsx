import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStats } from '../services/api'
import StatCard from '../components/StatCard'
import WaveDecoration from '../components/WaveDecoration'
import Loader from '../components/Loader'
import './Home.css'

export default function Home() {
  const [stats, setStats] = useState(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [statsError, setStatsError] = useState(null)

  useEffect(() => {
    let isMounted = true
    async function fetchStats() {
      try {
        const response = await getStats()
        if (!isMounted) return
        if (response.success && response.data) {
          setStats(response.data)
        } else {
          setStatsError(response.error || 'Unable to load statistics')
        }
      } catch (err) {
        if (isMounted) setStatsError('Failed to connect to backend service')
      } finally {
        if (isMounted) setLoadingStats(false)
      }
    }
    fetchStats()
    return () => { isMounted = false }
  }, [])

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-tag">Community-Driven Conservation</span>
            <h1 className="hero-title">Protecting Water Starts With Us.</h1>
            <p className="hero-subtitle">
              JALRAKSHAK is a community-focused initiative that makes it easier to report water-related problems, track their progress, and encourage collective responsibility for our water resources.
            </p>
            <div className="hero-actions">
              <Link to="/report" className="btn btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C12 2 5 10 5 15a7 7 0 0 0 14 0C19 10 12 2 12 2z" />
                  <path d="M12 9v6" />
                  <path d="M9 12h6" />
                </svg>
                Report a Water Issue
              </Link>
              <Link to="/reports" className="btn btn-secondary">
                Explore Reports
              </Link>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="water-motif-card">
              <svg className="water-motif-svg" viewBox="0 0 240 240" fill="none">
                <circle cx="120" cy="120" r="100" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="4 4" />
                <circle cx="120" cy="120" r="75" stroke="var(--pale-aqua)" strokeWidth="2" />
                <circle cx="120" cy="120" r="50" fill="var(--pale-aqua)" opacity="0.6" />
                {/* Main Droplet */}
                <path
                  d="M120 40C120 40 85 95 85 130a35 35 0 0 0 70 0C155 95 120 40 120 40z"
                  fill="var(--primary-blue)"
                />
                <ellipse cx="108" cy="125" rx="8" ry="14" fill="var(--white)" opacity="0.25" />
                {/* Subtle ripple rings */}
                <ellipse cx="120" cy="180" rx="60" ry="10" stroke="var(--muted-teal)" strokeWidth="1.5" opacity="0.4" />
                <ellipse cx="120" cy="195" rx="80" ry="12" stroke="var(--muted-teal)" strokeWidth="1" opacity="0.2" />
              </svg>
              <div className="water-motif-caption">
                <strong>Every Drop Matters</strong>
                <span>Every Action Counts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveDecoration color="var(--pale-aqua)" />

      {/* Problem Statement Section */}
      <section className="problem-section">
        <div className="container">
          <div className="problem-card">
            <div className="problem-icon" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="problem-text">
              <h2 className="problem-heading">Why Timely Reporting Matters</h2>
              <p>
                Small problems can become serious when they go unnoticed. JALRAKSHAK creates a shared space where communities can report water-related concerns and make those issues easier to track.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars / Features Section */}
      <section className="section-padding features-section">
        <div className="container">
          <h2 className="section-title">How JALRAKSHAK Works</h2>
          <p className="section-subtitle">
            A straightforward three-step model connecting grassroots observations with transparent record keeping.
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C12 2 5 10 5 15a7 7 0 0 0 14 0C19 10 12 2 12 2z" />
                  <path d="M12 9v6" />
                  <path d="M9 12h6" />
                </svg>
              </div>
              <span className="feature-step">01</span>
              <h3 className="feature-title">Report</h3>
              <p className="feature-desc">
                Submit a water-related concern with its location and description.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <span className="feature-step">02</span>
              <h3 className="feature-title">Track</h3>
              <p className="feature-desc">
                View reports and check their current status.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span className="feature-step">03</span>
              <h3 className="feature-title">Participate</h3>
              <p className="feature-desc">
                Encourage community awareness and responsible water use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Dashboard Preview */}
      <section className="section-padding dashboard-preview-section">
        <div className="container">
          <div className="dashboard-preview-header">
            <div>
              <h2 className="section-title text-left">Platform Overview</h2>
              <p className="dashboard-preview-sub">
                Real-time totals recorded directly in the central database.
              </p>
            </div>
            <Link to="/dashboard" className="btn btn-outline preview-link">
              View Detailed Dashboard →
            </Link>
          </div>

          {loadingStats ? (
            <Loader text="Loading live platform statistics..." />
          ) : statsError ? (
            <div className="stats-fallback-card">
              <p>{statsError}</p>
              <small>Showing zero counts until backend is reachable</small>
              <div className="stats-preview-grid">
                <StatCard value={0} label="Total Reports" />
                <StatCard value={0} label="Pending Review" />
                <StatCard value={0} label="Under Investigation" />
                <StatCard value={0} label="Resolved" />
              </div>
            </div>
          ) : (
            <div className="stats-preview-grid">
              <StatCard
                value={stats?.total ?? 0}
                label="Total Reports"
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                }
              />
              <StatCard
                value={stats?.pending ?? 0}
                label="Pending Review"
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                }
              />
              <StatCard
                value={stats?.under_investigation ?? 0}
                label="Under Investigation"
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                }
              />
              <StatCard
                value={stats?.resolved ?? 0}
                label="Resolved"
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                }
              />
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-heading">Spot a water issue in your area?</h2>
            <p className="cta-sub">
              Your report helps build a transparent picture of local water challenges and encourages collective action.
            </p>
            <div className="cta-buttons">
              <Link to="/report" className="btn btn-primary">
                File a Report Now
              </Link>
              <Link to="/about" className="btn btn-secondary">
                Learn About the Initiative
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

