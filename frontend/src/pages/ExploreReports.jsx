import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getReports } from '../services/api'
import ReportCard from '../components/ReportCard'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import './ExploreReports.css'

const CATEGORIES = [
  'All Categories',
  'Water Pollution',
  'Sewage Contamination',
  'Plastic Waste',
  'Water Leakage or Wastage',
  'Other',
]

const STATUSES = [
  'All Statuses',
  'Pending',
  'Under Investigation',
  'Resolved',
]

export default function ExploreReports() {
  const [reports, setReports] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchReports = useCallback(async (targetPage = 1) => {
    setIsLoading(true)
    setError(null)

    const params = {
      page: targetPage,
      limit: 9,
    }
    if (search.trim()) params.search = search.trim()
    if (category && category !== 'All Categories') params.category = category
    if (status && status !== 'All Statuses') params.status = status

    try {
      const res = await getReports(params)
      if (res.success && res.data) {
        setReports(res.data.reports || [])
        setTotal(res.data.total || 0)
        setPage(res.data.page || 1)
        setPages(res.data.pages || 1)
      } else {
        setError(res.error || 'Failed to load reports from database.')
      }
    } catch (err) {
      setError('Unable to reach backend service.')
    } finally {
      setIsLoading(false)
    }
  }, [search, category, status])

  useEffect(() => {
    fetchReports(1)
  }, [fetchReports])

  function handleSearchSubmit(e) {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  function handleCategoryChange(e) {
    setCategory(e.target.value)
    setPage(1)
  }

  function handleStatusChange(e) {
    setStatus(e.target.value)
    setPage(1)
  }

  function handleClearFilters() {
    setSearch('')
    setSearchInput('')
    setCategory('')
    setStatus('')
    setPage(1)
  }

  const hasActiveFilters = search || (category && category !== 'All Categories') || (status && status !== 'All Statuses')

  return (
    <div className="explore-page">
      <div className="container">
        <div className="explore-header">
          <div>
            <span className="explore-badge">Central Repository</span>
            <h1 className="explore-title">Explore Water Reports</h1>
            <p className="explore-subtitle">
              Browse submitted issues, check community reports, and track resolution status across water bodies.
            </p>
          </div>
          <Link to="/report" className="btn btn-primary new-report-btn">
            + Report New Issue
          </Link>
        </div>

        {/* Filters and Search Bar */}
        <div className="filters-card">
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by Report ID or Location name..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="search-input"
              />
              {searchInput && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => {
                    setSearchInput('')
                    setSearch('')
                  }}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-secondary search-btn">
              Search
            </button>
          </form>

          <div className="filter-dropdowns">
            <div className="filter-select-wrap">
              <label htmlFor="filter-category" className="filter-label">Category</label>
              <select
                id="filter-category"
                value={category}
                onChange={handleCategoryChange}
                className="filter-select"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c === 'All Categories' ? '' : c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-select-wrap">
              <label htmlFor="filter-status" className="filter-label">Status</label>
              <select
                id="filter-status"
                value={status}
                onChange={handleStatusChange}
                className="filter-select"
              >
                {STATUSES.map(s => (
                  <option key={s} value={s === 'All Statuses' ? '' : s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn-clear-filters"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Info */}
        <div className="results-meta">
          {!isLoading && !error && (
            <p className="results-count">
              Showing <strong>{reports.length}</strong> of <strong>{total}</strong> {total === 1 ? 'report' : 'reports'}
              {hasActiveFilters && ' (filtered)'}
            </p>
          )}
        </div>

        {/* Content Area */}
        {isLoading ? (
          <Loader text="Retrieving reports from database..." />
        ) : error ? (
          <div className="explore-error-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p>{error}</p>
            <button onClick={() => fetchReports(page)} className="btn btn-secondary">
              Retry Connection
            </button>
          </div>
        ) : reports.length === 0 ? (
          <EmptyState
            title={hasActiveFilters ? 'No matching reports found' : 'No water reports yet'}
            message={
              hasActiveFilters
                ? 'Try adjusting your search terms or filters to find what you are looking for.'
                : 'Be the first person in your community to log an issue and help protect our water resources.'
            }
            actionLabel={hasActiveFilters ? 'Clear Filters' : 'Submit First Report'}
            actionTo={hasActiveFilters ? undefined : '/report'}
          />
        ) : (
          <>
            <div className="reports-grid">
              {reports.map(report => (
                <ReportCard key={report.id || report.report_code} report={report} />
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => fetchReports(page - 1)}
                  disabled={page <= 1}
                  className="btn btn-secondary pagination-btn"
                >
                  ← Previous
                </button>
                <span className="pagination-info">
                  Page <strong>{page}</strong> of <strong>{pages}</strong>
                </span>
                <button
                  onClick={() => fetchReports(page + 1)}
                  disabled={page >= pages}
                  className="btn btn-secondary pagination-btn"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

