import { Link } from 'react-router-dom'
import './EmptyState.css'

export default function EmptyState({ title, message, actionLabel, actionTo }) {
  return (
    <div className="empty-state">
      <svg
        className="empty-state-illustration"
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="60" cy="70" r="40" fill="var(--pale-aqua)" />
        <path
          d="M60 20C60 20 40 45 40 60a20 20 0 0 0 40 0C80 45 60 20 60 20z"
          fill="var(--primary-blue)"
          opacity="0.2"
        />
        <path
          d="M60 25C60 25 44 47 44 59a16 16 0 0 0 32 0C76 47 60 25 60 25z"
          fill="none"
          stroke="var(--primary-blue)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <ellipse cx="53" cy="58" rx="3" ry="4" fill="var(--primary-blue)" opacity="0.15" />
        <line x1="50" y1="85" x2="70" y2="85" stroke="var(--border-color)" strokeWidth="2" strokeLinecap="round" />
        <line x1="45" y1="90" x2="75" y2="90" stroke="var(--border-color)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      <h3 className="empty-state-title">{title || 'Nothing here yet'}</h3>
      <p className="empty-state-message">
        {message || 'There is no data to display at the moment.'}
      </p>

      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn btn-primary empty-state-action">
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
