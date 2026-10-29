import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

function WaterDropIcon() {
  return (
    <svg
      className="navbar-logo-icon"
      width="22"
      height="22"
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16 2C16 2 6 14 6 20a10 10 0 0 0 20 0C26 14 16 2 16 2z" />
      <ellipse cx="12" cy="20" rx="2.5" ry="3" fill="rgba(255,255,255,0.3)" />
    </svg>
  )
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/reports', label: 'Explore Reports' },
    { to: '/report', label: 'Report an Issue' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/about', label: 'About' },
  ]

  const toggleMenu = () => setMenuOpen(prev => !prev)
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="navbar">
      <nav className="navbar-inner container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <WaterDropIcon />
          <span className="navbar-logo-text">JALRAKSHAK</span>
        </Link>

        <button
          className={`navbar-hamburger ${menuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `navbar-link ${isActive ? 'active' : ''}`
                }
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
