import './StatusBadge.css'

const STATUS_MAP = {
  'Pending': {
    label: 'Pending',
    className: 'status-pending',
  },
  'Under Investigation': {
    label: 'Under Investigation',
    className: 'status-investigating',
  },
  'Resolved': {
    label: 'Resolved',
    className: 'status-resolved',
  },
}

export default function StatusBadge({ status }) {
  const config = STATUS_MAP[status] || STATUS_MAP['Pending']

  return (
    <span className={`status-badge ${config.className}`}>
      {config.label}
    </span>
  )
}
