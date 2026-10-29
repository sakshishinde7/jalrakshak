import { Link } from 'react-router-dom'
import WaveDecoration from '../components/WaveDecoration'
import './About.css'

export default function About() {
  return (
    <div className="about-page">
      {/* Header */}
      <section className="about-header-section">
        <div className="container">
          <span className="about-badge">Project Background & Vision</span>
          <h1 className="about-title">About JALRAKSHAK</h1>
          <p className="about-tagline">"Every Drop Matters. Every Action Counts."</p>
        </div>
      </section>

      <WaveDecoration color="var(--pale-aqua)" />

      {/* Main Content */}
      <section className="about-content-section">
        <div className="container about-container">
          {/* Prototype Notice Box */}
          <div className="prototype-notice-box">
            <div className="notice-icon-box" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div className="notice-text-content">
              <h3>Prototype Status & Innovation Context</h3>
              <p>
                <strong>JALRAKSHAK is an early-stage prototype demonstrating a community-centered approach to identifying and tracking water-related concerns. Future versions may expand to include geographic visualization, verified water-quality information, and collaboration with relevant organizations.</strong>
              </p>
              <p className="non-gov-statement">
                Please note: This prototype is not an official government monitoring service, regulatory body, or emergency dispatch system. It is designed to demonstrate community-scale problem recording and transparent civic tracking.
              </p>
            </div>
          </div>

          {/* Section 1: Why JALRAKSHAK is Needed */}
          <article className="about-block">
            <h2 className="block-title">Why JALRAKSHAK is Needed</h2>
            <p>
              Freshwater ecosystems, municipal water networks, lakes, rivers, and community wells face continuous pressures from contamination, infrastructure decay, illegal dumping, and seasonal shortages. In many neighborhoods and rural belts, water-related issues persist simply because:
            </p>
            <ul className="about-list">
              <li>
                <strong>Early warnings go unshared:</strong> Individual residents notice unusual colors, foul smells, broken pipes, or accumulating debris days or weeks before any institutional response occurs.
              </li>
              <li>
                <strong>Fragmented reports:</strong> Concerns are often reported verbally or on disconnected channels with no centralized public tracking.
              </li>
              <li>
                <strong>Lack of community visibility:</strong> Without an open record, citizens cannot know whether their neighbors have encountered the same problem or whether any investigation has commenced.
              </li>
            </ul>
          </article>

          {/* Section 2: What Problem It Aims to Address */}
          <article className="about-block">
            <h2 className="block-title">The Problem We Address</h2>
            <p>
              JALRAKSHAK addresses the gap between localized community observation and centralized tracking. By removing the friction of account creation and complex paperwork, JALRAKSHAK allows anyone to log an incident in less than two minutes.
            </p>
            <p>
              By cataloging each submission with a permanent, human-readable reference code, the system establishes a transparent historical audit trail that belongs to the community.
            </p>
          </article>

          {/* Section 3: How the Reporting Process Works */}
          <article className="about-block">
            <h2 className="block-title">How the Reporting Process Works</h2>
            <div className="process-timeline">
              <div className="timeline-step">
                <div className="step-num">1</div>
                <div className="step-body">
                  <h3>Observation & Submission</h3>
                  <p>
                    A community member observes a water-related concern (such as untreated sewage, plastic dumping, pipe leaks, or industrial runoff) and enters the location, category, and an objective description.
                  </p>
                </div>
              </div>

              <div className="timeline-step">
                <div className="step-num">2</div>
                <div className="step-body">
                  <h3>Central Database Ingestion</h3>
                  <p>
                    The report is validated, assigned a unique human-friendly code (e.g. <code>JR-20261028-XXXX</code>), and securely stored in the PostgreSQL database.
                  </p>
                </div>
              </div>

              <div className="timeline-step">
                <div className="step-num">3</div>
                <div className="step-body">
                  <h3>Public Exploration & Tracking</h3>
                  <p>
                    Anyone can view the report on the public Explore Reports page, search by locality or report ID, and check current investigation status without exposing private reporter contact info.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Section 4: Future Roadmap */}
          <article className="about-block">
            <h2 className="block-title">Future Expansion Possibilities</h2>
            <p>
              As JALRAKSHAK matures from this functional prototype into a broader platform, several key extensions are planned:
            </p>
            <div className="roadmap-grid">
              <div className="roadmap-item">
                <h4>Interactive Geographic Maps</h4>
                <p>Visual heatmaps and cluster analysis showing problem density along water basins.</p>
              </div>
              <div className="roadmap-item">
                <h4>Verified Water Quality Testing</h4>
                <p>Integration of lab-verified test reports (pH, TDS, fecal coliform) linked to specific water bodies.</p>
              </div>
              <div className="roadmap-item">
                <h4>Institutional Collaboration</h4>
                <p>Secure administrative portals for municipalities, water boards, and environmental NGOs to coordinate resolution.</p>
              </div>
              <div className="roadmap-item">
                <h4>Community Action Circles</h4>
                <p>Enabling local volunteers to organize cleanup drives and conservation awareness initiatives.</p>
              </div>
            </div>
          </article>

          {/* Call to action */}
          <div className="about-cta-bar">
            <div>
              <h3>Ready to explore the platform?</h3>
              <p>Check ongoing reports or submit an observation from your locality.</p>
            </div>
            <div className="about-cta-btns">
              <Link to="/report" className="btn btn-primary">
                Report an Issue
              </Link>
              <Link to="/reports" className="btn btn-secondary">
                Explore Reports
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

