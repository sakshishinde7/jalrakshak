import './WaveDecoration.css'

export default function WaveDecoration({ color = 'var(--pale-aqua)', flip = false }) {
  return (
    <div className={`wave-decoration ${flip ? 'wave-flip' : ''}`} aria-hidden="true">
      <svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="wave-svg"
      >
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,100 L0,100 Z"
          fill={color}
        />
      </svg>
    </div>
  )
}
