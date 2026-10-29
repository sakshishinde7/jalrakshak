import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
              <path d="M16 2C16 2 6 14 6 20a10 10 0 0 0 20 0C26 14 16 2 16 2z" />
            </svg>
            <span className="footer-logo-text">JALRAKSHAK</span>
          </div>
          <p className="footer-tagline">
            Empowering communities to protect and preserve water resources, one report at a time.
          </p>
        </div>

        <div className="footer-links-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/reports">Explore Reports</Link></li>
            <li><Link to="/report">Report an Issue</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>

        <div className="footer-links-section">
          <h4 className="footer-heading">Information</h4>
          <ul className="footer-links">
            <li><Link to="/about">How It Works</Link></li>
            <li><Link to="/about">Our Mission</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-disclaimer">
            Prototype — This is a community reporting tool and is not affiliated with any government monitoring service.
          </p>
          <p className="footer-copyright">
            © {new Date().getFullYear()} JALRAKSHAK. Built for communities that care about water.
          </p>
        </div>
      </div>
    </footer>
  )
}
