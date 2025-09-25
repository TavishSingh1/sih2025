"use client"

import "./PumpStatus.css"

const PumpStatus = ({ pump }) => {
  const getStatusColor = (status) => {
    const colors = {
      running: "var(--success)",
      standby: "var(--warning)",
      stopped: "var(--error)",
      maintenance: "var(--info)",
    }
    return colors[status] || colors.stopped
  }

  const getStatusIcon = (status) => {
    const icons = {
      running: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <polygon points="10,8 16,12 10,16" fill="currentColor" />
        </svg>
      ),
      standby: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <rect x="9" y="9" width="6" height="6" fill="currentColor" />
        </svg>
      ),
      stopped: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <rect x="9" y="9" width="6" height="6" fill="currentColor" />
        </svg>
      ),
    }
    return icons[status] || icons.stopped
  }

  return (
    <div className="pump-status">
      <div className="pump-header">
        <div className="pump-info">
          <h4>{pump.name}</h4>
          <div className="pump-status-indicator" style={{ color: getStatusColor(pump.status) }}>
            {getStatusIcon(pump.status)}
            <span>{pump.status.charAt(0).toUpperCase() + pump.status.slice(1)}</span>
          </div>
        </div>
        {pump.status === "running" && <div className="pump-pulse"></div>}
      </div>

      <div className="pump-metrics">
        <div className="metric-row">
          <div className="metric-item">
            <span className="metric-label">Pressure</span>
            <span className="metric-value">{pump.pressure.toFixed(1)} bar</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Flow Rate</span>
            <span className="metric-value">{pump.flowRate.toFixed(1)} L/min</span>
          </div>
        </div>
        <div className="metric-row">
          <div className="metric-item">
            <span className="metric-label">Power</span>
            <span className="metric-value">{pump.power} W</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Efficiency</span>
            <span
              className="metric-value"
              style={{ color: pump.efficiency > 80 ? "var(--success)" : "var(--warning)" }}
            >
              {pump.efficiency}%
            </span>
          </div>
        </div>
      </div>

      {pump.status === "running" && (
        <div className="pump-controls">
          <button className="btn btn-secondary btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="6" y="4" width="4" height="16" fill="currentColor" />
              <rect x="14" y="4" width="4" height="16" fill="currentColor" />
            </svg>
            Pause
          </button>
          <button className="btn btn-outline btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
              <path
                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            Settings
          </button>
        </div>
      )}
    </div>
  )
}

export default PumpStatus
