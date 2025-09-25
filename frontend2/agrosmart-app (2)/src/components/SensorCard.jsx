"use client"

import "./SensorCard.css"

const SensorCard = ({ title, value, status, icon, trend }) => {
  const getIcon = (iconName) => {
    const icons = {
      moisture: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      ),
      temperature: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      humidity: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M2 12h20M2 12a10 10 0 0 0 20 0M2 12a10 10 0 0 1 20 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      water: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="14" r="4" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    }
    return icons[iconName] || icons.moisture
  }

  const getTrendIcon = (trendType) => {
    const trends = {
      up: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" stroke="currentColor" strokeWidth="2" />
          <polyline points="17 6 23 6 23 12" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      down: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" stroke="currentColor" strokeWidth="2" />
          <polyline points="17 18 23 18 23 12" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      stable: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <line x1="1" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    }
    return trends[trendType] || trends.stable
  }

  const getStatusColor = (statusType) => {
    const colors = {
      good: "var(--success)",
      warning: "var(--warning)",
      critical: "var(--error)",
    }
    return colors[statusType] || colors.good
  }

  return (
    <div className="sensor-card">
      <div className="sensor-card-header">
        <div className="sensor-icon" style={{ color: getStatusColor(status) }}>
          {getIcon(icon)}
        </div>
        <div className="sensor-trend" style={{ color: getStatusColor(status) }}>
          {getTrendIcon(trend)}
        </div>
      </div>

      <div className="sensor-content">
        <div className="sensor-title">{title}</div>
        <div className="sensor-value" style={{ color: getStatusColor(status) }}>
          {value}
        </div>
        <div className="sensor-status">
          <div className={`status-dot status-${status}`}></div>
          <span className="status-text">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
        </div>
      </div>
    </div>
  )
}

export default SensorCard
