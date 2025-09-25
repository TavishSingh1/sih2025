"use client"

import "./WaterTankIndicator.css"

const WaterTankIndicator = ({ label, level, capacity }) => {
  const getStatusColor = (level) => {
    if (level > 70) return "var(--success)"
    if (level > 30) return "var(--warning)"
    return "var(--error)"
  }

  const getStatusText = (level) => {
    if (level > 70) return "Good"
    if (level > 30) return "Low"
    return "Critical"
  }

  return (
    <div className="water-tank">
      <div className="tank-header">
        <h4>{label}</h4>
        <span className="tank-capacity">{capacity}</span>
      </div>

      <div className="tank-visual">
        <div className="tank-container">
          <div className="tank-body">
            <div
              className="tank-water"
              style={{
                height: `${level}%`,
                backgroundColor: getStatusColor(level),
              }}
            >
              <div className="water-surface"></div>
            </div>
          </div>
          <div className="tank-cap"></div>
        </div>

        <div className="tank-scale">
          {[100, 75, 50, 25, 0].map((mark) => (
            <div key={mark} className="scale-mark">
              <div className="scale-line"></div>
              <span className="scale-label">{mark}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="tank-info">
        <div className="tank-level">
          <span className="level-value" style={{ color: getStatusColor(level) }}>
            {level.toFixed(1)}%
          </span>
          <span className="level-status" style={{ color: getStatusColor(level) }}>
            {getStatusText(level)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default WaterTankIndicator
