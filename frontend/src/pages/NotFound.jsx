import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="container not-found-container">
        <div className="not-found-illustration">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
            <circle cx="60" cy="60" r="50" fill="var(--pale-aqua)" />
            <path
              d="M60 25C60 25 40 50 40 68a20 20 0 0 0 40 0C80 50 60 25 60 25z"
              stroke="var(--primary-blue)"
              strokeWidth="2.5"
              fill="none"
              strokeDasharray="4 4"
            />
            <path d="M50 60l20 20" stroke="var(--danger)" strokeWidth="3" strokeLinecap="round" />
            <path d="M70 60l-20 20" stroke="var(--danger)" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <span className="not-found-code">404</span>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-message">
          The page you are looking for doesn't exist or has moved. Return to the home page or browse submitted reports.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            Return to Home
          </Link>
          <Link to="/reports" className="btn btn-secondary">
            Explore Reports
          </Link>
        </div>
      </div>
    </div>
  )
}

