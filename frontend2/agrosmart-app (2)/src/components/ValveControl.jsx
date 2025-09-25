"use client"

import "./ValveControl.css"

const ValveControl = ({ zone, onToggle }) => {
  const getStatusColor = (status) => {
    const colors = {
      active: "var(--success)",
      idle: "var(--text-muted)",
      scheduled: "var(--warning)",
      error: "var(--error)",
    }
    return colors[status] || colors.idle
  }

  const getStatusIcon = (status) => {
    const icons = {
      active: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      idle: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" />
          <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      scheduled: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    }
    return icons[status] || icons.idle
  }

  const getMoistureStatus = (moisture) => {
    if (moisture > 60) return "good"
    if (moisture > 30) return "warning"
    return "critical"
  }

  return (
    <div className="valve-control">
      <div className="valve-header">
        <div className="valve-info">
          <h4>{zone.name}</h4>
          <div className="valve-status" style={{ color: getStatusColor(zone.status) }}>
            {getStatusIcon(zone.status)}
            <span>{zone.status.charAt(0).toUpperCase() + zone.status.slice(1)}</span>
          </div>
        </div>
        <button
          className={`valve-toggle ${zone.status === "active" ? "valve-active" : ""}`}
          onClick={onToggle}
          disabled={zone.status === "scheduled"}
        >
          <div className="toggle-switch">
            <div className="toggle-slider"></div>
          </div>
        </button>
      </div>

      <div className="valve-metrics">
        <div className="metric-item">
          <span className="metric-label">Flow Rate</span>
          <span className="metric-value">{zone.flowRate.toFixed(1)} L/min</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Soil Moisture</span>
          <span
            className="metric-value"
            style={{
              color: `var(--${getMoistureStatus(zone.soilMoisture) === "good" ? "success" : getMoistureStatus(zone.soilMoisture) === "warning" ? "warning" : "error"})`,
            }}
          >
            {zone.soilMoisture}%
          </span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Last Watered</span>
          <span className="metric-value">{zone.lastWatered}</span>
        </div>
      </div>

      {zone.status === "active" && (
        <div className="valve-progress">
          <div className="progress-header">
            <span>Duration: {zone.duration} min</span>
            <span>Remaining: {Math.max(0, zone.duration - 15)} min</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min(100, (15 / zone.duration) * 100)}%` }}></div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ValveControl
