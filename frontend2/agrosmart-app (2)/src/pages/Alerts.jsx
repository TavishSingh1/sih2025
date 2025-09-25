"use client"

import { useState, useEffect } from "react"
import "./Alerts.css"

const Alerts = () => {
  const [alerts, setAlerts] = useState([])
  const [alertSettings, setAlertSettings] = useState({
    soilMoisture: { enabled: true, min: 20, max: 80 },
    temperature: { enabled: true, min: 15, max: 35 },
    humidity: { enabled: true, min: 40, max: 90 },
    waterLevel: { enabled: true, min: 10 },
    pumpStatus: { enabled: true },
    systemHealth: { enabled: true },
  })
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    // Simulate real-time alerts
    const generateAlerts = () => {
      const alertTypes = [
        {
          type: "critical",
          category: "water",
          title: "Low Water Level",
          message: "Water tank level below 15%. Refill required.",
          time: new Date(Date.now() - 300000),
        },
        {
          type: "warning",
          category: "soil",
          title: "Soil Moisture Low",
          message: "Zone 2 soil moisture at 18%. Consider irrigation.",
          time: new Date(Date.now() - 600000),
        },
        {
          type: "info",
          category: "system",
          title: "Irrigation Complete",
          message: "Zone 1 irrigation cycle completed successfully.",
          time: new Date(Date.now() - 900000),
        },
        {
          type: "warning",
          category: "temperature",
          title: "High Temperature",
          message: "Temperature reached 38°C. Monitor crop stress.",
          time: new Date(Date.now() - 1200000),
        },
        {
          type: "critical",
          category: "pump",
          title: "Pump Malfunction",
          message: "Pump 1 showing irregular pressure readings.",
          time: new Date(Date.now() - 1800000),
        },
        {
          type: "info",
          category: "weather",
          title: "Rain Forecast",
          message: "Rain expected in 2 hours. Auto-irrigation paused.",
          time: new Date(Date.now() - 2400000),
        },
      ]

      setAlerts(alertTypes.map((alert, index) => ({ ...alert, id: index, acknowledged: index > 2 })))
    }

    generateAlerts()
    const interval = setInterval(generateAlerts, 30000)
    return () => clearInterval(interval)
  }, [])

  const acknowledgeAlert = (id) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, acknowledged: true } : alert)))
  }

  const updateAlertSetting = (category, setting, value) => {
    setAlertSettings((prev) => ({
      ...prev,
      [category]: { ...prev[category], [setting]: value },
    }))
  }

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true
    if (filter === "unread") return !alert.acknowledged
    return alert.type === filter
  })

  const getAlertIcon = (category) => {
    const icons = {
      water: "💧",
      soil: "🌱",
      system: "⚙️",
      temperature: "🌡️",
      pump: "🔧",
      weather: "🌤️",
    }
    return icons[category] || "📢"
  }

  const getAlertColor = (type) => {
    const colors = {
      critical: "#ef4444",
      warning: "#f59e0b",
      info: "#3b82f6",
    }
    return colors[type] || "#6b7280"
  }

  return (
    <div className="alerts">
      <div className="alerts-header">
        <h1>Smart Alerts</h1>
        <div className="alert-filters">
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>
            All ({alerts.length})
          </button>
          <button className={filter === "unread" ? "active" : ""} onClick={() => setFilter("unread")}>
            Unread ({alerts.filter((a) => !a.acknowledged).length})
          </button>
          <button className={filter === "critical" ? "active" : ""} onClick={() => setFilter("critical")}>
            Critical ({alerts.filter((a) => a.type === "critical").length})
          </button>
          <button className={filter === "warning" ? "active" : ""} onClick={() => setFilter("warning")}>
            Warning ({alerts.filter((a) => a.type === "warning").length})
          </button>
        </div>
      </div>

      <div className="alerts-content">
        <div className="alerts-list">
          <h2>Recent Alerts</h2>
          {filteredAlerts.length === 0 ? (
            <div className="no-alerts">
              <div className="no-alerts-icon">✅</div>
              <p>No alerts matching your filter</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div key={alert.id} className={`alert-item ${alert.type} ${alert.acknowledged ? "acknowledged" : ""}`}>
                <div className="alert-icon">{getAlertIcon(alert.category)}</div>
                <div className="alert-content">
                  <div className="alert-header">
                    <h3>{alert.title}</h3>
                    <span className="alert-time">{alert.time.toLocaleTimeString()}</span>
                  </div>
                  <p>{alert.message}</p>
                  <div className="alert-actions">
                    {!alert.acknowledged && (
                      <button className="acknowledge-btn" onClick={() => acknowledgeAlert(alert.id)}>
                        Acknowledge
                      </button>
                    )}
                    <span className={`alert-badge ${alert.type}`}>{alert.type.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="alert-settings">
          <h2>Alert Settings</h2>

          <div className="setting-group">
            <h3>Soil Moisture Alerts</h3>
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={alertSettings.soilMoisture.enabled}
                  onChange={(e) => updateAlertSetting("soilMoisture", "enabled", e.target.checked)}
                />
                Enable soil moisture alerts
              </label>
            </div>
            <div className="setting-range">
              <label>
                Min Level (%):
                <input
                  type="number"
                  value={alertSettings.soilMoisture.min}
                  onChange={(e) => updateAlertSetting("soilMoisture", "min", Number.parseInt(e.target.value))}
                  min="0"
                  max="100"
                />
              </label>
              <label>
                Max Level (%):
                <input
                  type="number"
                  value={alertSettings.soilMoisture.max}
                  onChange={(e) => updateAlertSetting("soilMoisture", "max", Number.parseInt(e.target.value))}
                  min="0"
                  max="100"
                />
              </label>
            </div>
          </div>

          <div className="setting-group">
            <h3>Temperature Alerts</h3>
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={alertSettings.temperature.enabled}
                  onChange={(e) => updateAlertSetting("temperature", "enabled", e.target.checked)}
                />
                Enable temperature alerts
              </label>
            </div>
            <div className="setting-range">
              <label>
                Min Temp (°C):
                <input
                  type="number"
                  value={alertSettings.temperature.min}
                  onChange={(e) => updateAlertSetting("temperature", "min", Number.parseInt(e.target.value))}
                  min="-10"
                  max="50"
                />
              </label>
              <label>
                Max Temp (°C):
                <input
                  type="number"
                  value={alertSettings.temperature.max}
                  onChange={(e) => updateAlertSetting("temperature", "max", Number.parseInt(e.target.value))}
                  min="-10"
                  max="50"
                />
              </label>
            </div>
          </div>

          <div className="setting-group">
            <h3>Water Level Alerts</h3>
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={alertSettings.waterLevel.enabled}
                  onChange={(e) => updateAlertSetting("waterLevel", "enabled", e.target.checked)}
                />
                Enable water level alerts
              </label>
            </div>
            <div className="setting-range">
              <label>
                Min Level (%):
                <input
                  type="number"
                  value={alertSettings.waterLevel.min}
                  onChange={(e) => updateAlertSetting("waterLevel", "min", Number.parseInt(e.target.value))}
                  min="0"
                  max="100"
                />
              </label>
            </div>
          </div>

          <div className="setting-group">
            <h3>System Alerts</h3>
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={alertSettings.pumpStatus.enabled}
                  onChange={(e) => updateAlertSetting("pumpStatus", "enabled", e.target.checked)}
                />
                Enable pump status alerts
              </label>
            </div>
            <div className="setting-item">
              <label>
                <input
                  type="checkbox"
                  checked={alertSettings.systemHealth.enabled}
                  onChange={(e) => updateAlertSetting("systemHealth", "enabled", e.target.checked)}
                />
                Enable system health alerts
              </label>
            </div>
          </div>

          <button className="save-settings-btn">Save Alert Settings</button>
        </div>
      </div>
    </div>
  )
}

export default Alerts
