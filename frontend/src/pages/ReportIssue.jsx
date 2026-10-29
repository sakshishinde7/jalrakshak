import { useState } from 'react'
import { Link } from 'react-router-dom'
import { submitReport } from '../services/api'
import './ReportIssue.css'

const CATEGORIES = [
  'Water Pollution',
  'Sewage Contamination',
  'Plastic Waste',
  'Water Leakage or Wastage',
  'Other',
]

export default function ReportIssue() {
  const [formData, setFormData] = useState({
    reporter_name: '',
    reporter_email: '',
    location_name: '',
    issue_category: 'Water Pollution',
    description: '',
    latitude: '',
    longitude: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)
  const [submittedReport, setSubmittedReport] = useState(null)

  function validate() {
    const errs = {}

    if (!formData.reporter_name.trim()) {
      errs.reporter_name = 'Please provide your name.'
    } else if (formData.reporter_name.length > 100) {
      errs.reporter_name = 'Name must be 100 characters or fewer.'
    }

    if (!formData.location_name.trim()) {
      errs.location_name = 'Please provide the location or water body name.'
    } else if (formData.location_name.length > 300) {
      errs.location_name = 'Location must be 300 characters or fewer.'
    }

    if (!formData.issue_category) {
      errs.issue_category = 'Please select a category.'
    }

    if (!formData.description.trim()) {
      errs.description = 'Please describe the observed water issue.'
    } else if (formData.description.length > 2000) {
      errs.description = 'Description cannot exceed 2000 characters.'
    }

    if (formData.reporter_email.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(formData.reporter_email.trim())) {
        errs.reporter_email = 'Please enter a valid email address.'
      }
    }

    if (formData.latitude !== '') {
      const lat = parseFloat(formData.latitude)
      if (isNaN(lat) || lat < -90 || lat > 90) {
        errs.latitude = 'Latitude must be a number between -90 and 90.'
      }
    }

    if (formData.longitude !== '') {
      const lon = parseFloat(formData.longitude)
      if (isNaN(lon) || lon < -180 || lon > 180) {
        errs.longitude = 'Longitude must be a number between -180 and 180.'
      }
    }

    return errs
  }

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear field-specific error as user edits
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
    if (serverError) setServerError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setServerError(null)

    // Prepare payload
    const payload = {
      reporter_name: formData.reporter_name.trim(),
      location_name: formData.location_name.trim(),
      issue_category: formData.issue_category,
      description: formData.description.trim(),
    }

    if (formData.reporter_email.trim()) {
      payload.reporter_email = formData.reporter_email.trim()
    }
    if (formData.latitude !== '') {
      payload.latitude = parseFloat(formData.latitude)
    }
    if (formData.longitude !== '') {
      payload.longitude = parseFloat(formData.longitude)
    }

    try {
      const result = await submitReport(payload)
      if (result.success && result.data) {
        setSubmittedReport(result.data)
      } else {
        setServerError(result.error || 'Failed to submit report. Please check the backend connection.')
      }
    } catch (err) {
      setServerError('An unexpected network error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleReset() {
    setFormData({
      reporter_name: '',
      reporter_email: '',
      location_name: '',
      issue_category: 'Water Pollution',
      description: '',
      latitude: '',
      longitude: '',
    })
    setErrors({})
    setServerError(null)
    setSubmittedReport(null)
  }

  return (
    <div className="report-issue-page">
      <div className="container form-container">
        <div className="form-header">
          <span className="form-badge">Community Incident Form</span>
          <h1 className="form-title">Report a Water Issue</h1>
          <p className="form-description">
            Help us track and document water problems in your community. Every report is stored centrally to improve visibility and accountability.
          </p>
        </div>

        {submittedReport ? (
          <div className="success-banner-card">
            <div className="success-icon-wrap" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h2 className="success-title">Report Submitted Successfully</h2>
            <p className="success-message">
              Thank you for contributing to water protection. Your report has been saved to the central database and assigned a unique reference code.
            </p>

            <div className="report-code-box">
              <span className="code-label">Unique Report ID</span>
              <strong className="code-value">{submittedReport.report_code}</strong>
              <span className="code-hint">Keep this code to track progress on the Explore Reports page</span>
            </div>

            <div className="submitted-summary">
              <div className="summary-row">
                <span className="summary-label">Location:</span>
                <span className="summary-val">{submittedReport.location_name}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Category:</span>
                <span className="summary-val">{submittedReport.issue_category}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Status:</span>
                <span className="summary-val status-pill">{submittedReport.status}</span>
              </div>
            </div>

            <div className="success-actions">
              <Link to={`/reports/${submittedReport.report_code}`} className="btn btn-primary">
                View Report Details
              </Link>
              <button onClick={handleReset} className="btn btn-secondary">
                Submit Another Report
              </button>
              <Link to="/reports" className="btn btn-outline">
                Back to All Reports
              </Link>
            </div>
          </div>
        ) : (
          <form className="report-form" onSubmit={handleSubmit} noValidate>
            {serverError && (
              <div className="alert-error" role="alert">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{serverError}</span>
              </div>
            )}

            <div className="form-section">
              <h2 className="form-section-title">Reporter Information</h2>
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="reporter_name" className="form-label">
                    Your Name <span className="required-asterisk">*</span>
                  </label>
                  <input
                    id="reporter_name"
                    name="reporter_name"
                    type="text"
                    maxLength={100}
                    value={formData.reporter_name}
                    onChange={handleChange}
                    placeholder="e.g., Anita Sharma"
                    className={`form-input ${errors.reporter_name ? 'input-error' : ''}`}
                    disabled={isSubmitting}
                  />
                  {errors.reporter_name && (
                    <span className="field-error">{errors.reporter_name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="reporter_email" className="form-label">
                    Email Address <span className="optional-tag">(Optional)</span>
                  </label>
                  <input
                    id="reporter_email"
                    name="reporter_email"
                    type="email"
                    maxLength={200}
                    value={formData.reporter_email}
                    onChange={handleChange}
                    placeholder="e.g., anita@example.org"
                    className={`form-input ${errors.reporter_email ? 'input-error' : ''}`}
                    disabled={isSubmitting}
                  />
                  <span className="field-hint">Never shared publicly on the website.</span>
                  {errors.reporter_email && (
                    <span className="field-error">{errors.reporter_email}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="form-section-title">Issue Details</h2>

              <div className="form-group">
                <label htmlFor="location_name" className="form-label">
                  Location or Water Body Name <span className="required-asterisk">*</span>
                </label>
                <input
                  id="location_name"
                  name="location_name"
                  type="text"
                  maxLength={300}
                  value={formData.location_name}
                  onChange={handleChange}
                  placeholder="e.g., Kaveri Canal near Sector 4 Bridge, Mysore"
                  className={`form-input ${errors.location_name ? 'input-error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.location_name && (
                  <span className="field-error">{errors.location_name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="issue_category" className="form-label">
                  Issue Category <span className="required-asterisk">*</span>
                </label>
                <select
                  id="issue_category"
                  name="issue_category"
                  value={formData.issue_category}
                  onChange={handleChange}
                  className={`form-select ${errors.issue_category ? 'input-error' : ''}`}
                  disabled={isSubmitting}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.issue_category && (
                  <span className="field-error">{errors.issue_category}</span>
                )}
              </div>

              <div className="form-group">
                <div className="label-with-counter">
                  <label htmlFor="description" className="form-label">
                    Detailed Description <span className="required-asterisk">*</span>
                  </label>
                  <span className="char-counter">
                    {formData.description.length} / 2000
                  </span>
                </div>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  maxLength={2000}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the nature of the problem, estimated extent, visible effects on water color/odor, and any nearby potential sources..."
                  className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <span className="field-error">{errors.description}</span>
                )}
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="latitude" className="form-label">
                    Latitude <span className="optional-tag">(Optional, -90 to 90)</span>
                  </label>
                  <input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="e.g., 12.9716"
                    className={`form-input ${errors.latitude ? 'input-error' : ''}`}
                    disabled={isSubmitting}
                  />
                  {errors.latitude && (
                    <span className="field-error">{errors.latitude}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="longitude" className="form-label">
                    Longitude <span className="optional-tag">(Optional, -180 to 180)</span>
                  </label>
                  <input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="e.g., 77.5946"
                    className={`form-input ${errors.longitude ? 'input-error' : ''}`}
                    disabled={isSubmitting}
                  />
                  {errors.longitude && (
                    <span className="field-error">{errors.longitude}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="form-footer">
              <p className="privacy-note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Your report will be publicly visible to support community tracking. Personal contact information remains confidential.
              </p>

              <button
                type="submit"
                className="btn btn-primary btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="submit-spinner"></span>
                    Submitting Report...
                  </>
                ) : (
                  'Submit Report'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

