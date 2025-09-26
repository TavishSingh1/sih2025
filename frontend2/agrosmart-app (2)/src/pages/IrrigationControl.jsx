"use client"

import { useState, useEffect } from "react"
import "./IrrigationControl.css"

const IrrigationControl = () => {
  const [zones, setZones] = useState([
    {
      id: 1,
      name: "Zone 1",
      espId: "ESP32_001",
      soilMoisture: 45,
      temperature: 24.5,
      humidity: 68,
      ph: 6.8,
      lightIntensity: 850,
      status: "idle",
      valveStatus: "closed",
      cropType: "Tomatoes",
      lastWatered: "3 hours ago",
      waterFlow: 0,
    },
    {
      id: 2,
      name: "Zone 2",
      espId: "ESP32_002",
      soilMoisture: 25,
      temperature: 26.2,
      humidity: 55,
      ph: 7.1,
      lightIntensity: 920,
      status: "idle",
      valveStatus: "closed",
      cropType: "Bell Peppers",
      lastWatered: "6 hours ago",
      waterFlow: 0,
    },
    {
      id: 3,
      name: "Zone 3",
      espId: "ESP32_003",
      soilMoisture: 65,
      temperature: 23.8,
      humidity: 72,
      ph: 6.5,
      lightIntensity: 780,
      status: "idle",
      valveStatus: "closed",
      cropType: "Lettuce",
      lastWatered: "1 hour ago",
      waterFlow: 0,
    },
    {
      id: 4,
      name: "Zone 4",
      espId: "ESP32_004",
      soilMoisture: 18,
      temperature: 25.1,
      humidity: 45,
      ph: 7.3,
      lightIntensity: 890,
      status: "idle",
      valveStatus: "closed",
      cropType: "Carrots",
      lastWatered: "8 hours ago",
      waterFlow: 0,
    },
    {
      id: 5,
      name: "Zone 5",
      espId: "ESP32_005",
      soilMoisture: 52,
      temperature: 24.9,
      humidity: 65,
      ph: 6.9,
      lightIntensity: 810,
      status: "active",
      valveStatus: "open",
      cropType: "Green Beans",
      lastWatered: "30 min ago",
      waterFlow: 2.5,
    },
    {
      id: 6,
      name: "Zone 6",
      espId: "ESP32_006",
      soilMoisture: 28,
      temperature: 23.5,
      humidity: 58,
      ph: 7.0,
      lightIntensity: 760,
      status: "idle",
      valveStatus: "closed",
      cropType: "Cabbage",
      lastWatered: "5 hours ago",
      waterFlow: 0,
    },
    {
      id: 7,
      name: "Zone 7",
      espId: "ESP32_007",
      soilMoisture: 72,
      temperature: 25.8,
      humidity: 75,
      ph: 6.6,
      lightIntensity: 820,
      status: "idle",
      valveStatus: "closed",
      cropType: "Spinach",
      lastWatered: "45 min ago",
      waterFlow: 0,
    },
    {
      id: 8,
      name: "Zone 8",
      espId: "ESP32_008",
      soilMoisture: 22,
      temperature: 26.5,
      humidity: 48,
      ph: 7.2,
      lightIntensity: 900,
      status: "idle",
      valveStatus: "closed",
      cropType: "Radish",
      lastWatered: "7 hours ago",
      waterFlow: 0,
    },
    {
      id: 9,
      name: "Zone 9",
      espId: "ESP32_009",
      soilMoisture: 38,
      temperature: 24.2,
      humidity: 62,
      ph: 6.7,
      lightIntensity: 840,
      status: "idle",
      valveStatus: "closed",
      cropType: "Onions",
      lastWatered: "4 hours ago",
      waterFlow: 0,
    },
  ])

  const [expandedZone, setExpandedZone] = useState(null)
  const [emergencyMode, setEmergencyMode] = useState(false)
  const [systemStats, setSystemStats] = useState({
    totalWaterUsed: 0,
    avgMoisture: 0,
    avgTemperature: 0,
  })

  const handleIrrigate = (zoneId) => {
    setZones((prev) =>
      prev.map((zone) => {
        if (zone.id === zoneId) {
          return {
            ...zone,
            status: "active",
            valveStatus: "open",
            lastWatered: "Irrigating now...",
            waterFlow: 2.5,
          }
        }
        return zone
      }),
    )

    // Simulate irrigation completion after 30 seconds
    setTimeout(() => {
      setZones((prev) =>
        prev.map((zone) => {
          if (zone.id === zoneId) {
            return {
              ...zone,
              status: "idle",
              valveStatus: "closed",
              soilMoisture: Math.min(zone.soilMoisture + 25, 85),
              lastWatered: "Just completed",
              waterFlow: 0,
            }
          }
          return zone
        }),
      )
    }, 30000)
  }

  const handleEmergencyStop = () => {
    setEmergencyMode(true)
    setZones((prev) =>
      prev.map((zone) => ({
        ...zone,
        status: "emergency",
        valveStatus: "closed",
        waterFlow: 0,
      })),
    )

    setTimeout(() => {
      setEmergencyMode(false)
      setZones((prev) =>
        prev.map((zone) => ({
          ...zone,
          status: "idle",
        })),
      )
    }, 5000)
  }

  const handleZoneClick = (zoneId) => {
    setExpandedZone(expandedZone === zoneId ? null : zoneId)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setZones((prev) => {
        const updatedZones = prev.map((zone) => ({
          ...zone,
          soilMoisture: Math.max(0, Math.min(100, zone.soilMoisture + (Math.random() - 0.7) * 1.5)),
          temperature: Math.max(15, Math.min(35, zone.temperature + (Math.random() - 0.5) * 0.3)),
          humidity: Math.max(30, Math.min(90, zone.humidity + (Math.random() - 0.5) * 2)),
          lightIntensity: Math.max(200, Math.min(1000, zone.lightIntensity + (Math.random() - 0.5) * 20)),
        }))

        // Calculate system stats
        const avgMoisture = updatedZones.reduce((sum, zone) => sum + zone.soilMoisture, 0) / updatedZones.length
        const avgTemperature = updatedZones.reduce((sum, zone) => sum + zone.temperature, 0) / updatedZones.length
        const totalWaterUsed = updatedZones.reduce((sum, zone) => sum + zone.waterFlow, 0)

        setSystemStats({
          avgMoisture: avgMoisture.toFixed(1),
          avgTemperature: avgTemperature.toFixed(1),
          totalWaterUsed: totalWaterUsed.toFixed(1),
        })

        return updatedZones
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getMoistureStatus = (moisture) => {
    if (moisture < 25) return "critical"
    if (moisture < 40) return "low"
    if (moisture < 65) return "good"
    return "excellent"
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "critical":
        return "#dc2626"
      case "low":
        return "#ea580c"
      case "good":
        return "#16a34a"
      case "excellent":
        return "#2563eb"
      default:
        return "#6b7280"
    }
  }

  const getCropIcon = (cropType) => {
    const icons = {
      Tomatoes: "🍅",
      "Bell Peppers": "🫑",
      Lettuce: "🥬",
      Carrots: "🥕",
      "Green Beans": "🫘",
      Cabbage: "🥬",
      Spinach: "🥬",
      Radish: "🌶️",
      Onions: "🧅",
    }
    return icons[cropType] || "🌱"
  }

  return (
    <div className="irrigation-control">
      <div className="irrigation-header">
        <div className="header-content">
          <div className="irrigation-title">
            <div className="title-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div>
              <h1 className="main-title">Smart Irrigation Control</h1>
              <p className="main-subtitle">Advanced ESP32-powered field monitoring and irrigation management</p>
            </div>
          </div>

          <div className="system-overview">
            <div className="stat-card moisture">
              <div className="stat-icon">💧</div>
              <div className="stat-info">
                <span className="stat-value">{systemStats.avgMoisture}%</span>
                <span className="stat-label">Avg Moisture</span>
              </div>
            </div>
            <div className="stat-card temperature">
              <div className="stat-icon">🌡️</div>
              <div className="stat-info">
                <span className="stat-value">{systemStats.avgTemperature}°C</span>
                <span className="stat-label">Avg Temp</span>
              </div>
            </div>
            <div className="stat-card flow">
              <div className="stat-icon">🚿</div>
              <div className="stat-info">
                <span className="stat-value">{systemStats.totalWaterUsed}L/h</span>
                <span className="stat-label">Water Flow</span>
              </div>
            </div>
          </div>
        </div>

        <div className="irrigation-actions">
          <div className="system-status">
            <div className="status-indicator">
              <span className="status-dot active"></span>
              <span className="status-text">{zones.filter((z) => z.status === "active").length} Active Zones</span>
            </div>
          </div>
          <button
            className={`btn-emergency ${emergencyMode ? "emergency-active" : ""}`}
            onClick={handleEmergencyStop}
            disabled={emergencyMode}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <rect x="9" y="9" width="6" height="6" />
            </svg>
            {emergencyMode ? "Emergency Active" : "Emergency Stop"}
          </button>
        </div>
      </div>

      <div className="field-container">
        <div className="field-header">
          <div className="field-title">
            <h2 className="field-main-title">Smart Field Matrix</h2>
            <p className="field-subtitle">Click any zone for detailed sensor readings and irrigation control</p>
          </div>
          <div className="field-legend">
            <div className="legend-item">
              <div className="legend-color critical"></div>
              <span className="legend-text">Critical (&lt;25%)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color low"></div>
              <span className="legend-text">Low (25-40%)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color good"></div>
              <span className="legend-text">Good (40-65%)</span>
            </div>
            <div className="legend-item">
              <div className="legend-color excellent"></div>
              <span className="legend-text">Excellent (&gt;65%)</span>
            </div>
          </div>
        </div>

        <div className="zones-matrix">
          {zones.map((zone) => {
            const moistureStatus = getMoistureStatus(zone.soilMoisture)
            const needsIrrigation = zone.soilMoisture < 30
            const isExpanded = expandedZone === zone.id

            return (
              <div
                key={zone.id}
                className={`zone-card ${zone.status} ${moistureStatus} ${isExpanded ? "expanded" : ""}`}
                onClick={() => handleZoneClick(zone.id)}
              >
                <div className="zone-header">
                  <div className="zone-title">
                    <span className="crop-icon">{getCropIcon(zone.cropType)}</span>
                    <h3 className="zone-name">{zone.name}</h3>
                  </div>
                  <div className={`zone-status-indicator ${zone.status}`}>
                    {zone.status === "active" && <div className="pulse-ring"></div>}
                    <div className="status-dot"></div>
                  </div>
                </div>

                <div className="zone-preview">
                  <div className="sensor-preview moisture">
                    <div className="sensor-icon">💧</div>
                    <div className="sensor-data">
                      <span className="sensor-value">{zone.soilMoisture.toFixed(0)}%</span>
                      <span className="sensor-label">Moisture</span>
                    </div>
                  </div>
                  <div className="sensor-preview temperature">
                    <div className="sensor-icon">🌡️</div>
                    <div className="sensor-data">
                      <span className="sensor-value">{zone.temperature.toFixed(1)}°C</span>
                      <span className="sensor-label">Temperature</span>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="zone-expanded-content">
                    <div className="expanded-header">
                      <h4 className="expanded-title">Detailed Sensor Readings</h4>
                      <div className="esp-badge">
                        <span className="esp-icon">📡</span>
                        <span className="esp-id">{zone.espId}</span>
                      </div>
                    </div>

                    <div className="sensor-grid">
                      <div className="sensor-detail">
                        <div className="sensor-icon">💧</div>
                        <div className="sensor-info">
                          <span className="sensor-name">Soil Moisture</span>
                          <span className="sensor-reading">{zone.soilMoisture.toFixed(1)}%</span>
                        </div>
                        <div className="sensor-trend">
                          {zone.soilMoisture < 30 ? "📉" : zone.soilMoisture > 70 ? "📈" : "➡️"}
                        </div>
                      </div>

                      <div className="sensor-detail">
                        <div className="sensor-icon">🌡️</div>
                        <div className="sensor-info">
                          <span className="sensor-name">Temperature</span>
                          <span className="sensor-reading">{zone.temperature.toFixed(1)}°C</span>
                        </div>
                        <div className="sensor-trend">
                          {zone.temperature > 28 ? "🔥" : zone.temperature < 20 ? "❄️" : "🌤️"}
                        </div>
                      </div>

                      <div className="sensor-detail">
                        <div className="sensor-icon">💨</div>
                        <div className="sensor-info">
                          <span className="sensor-name">Air Humidity</span>
                          <span className="sensor-reading">{zone.humidity.toFixed(0)}%</span>
                        </div>
                        <div className="sensor-trend">
                          {zone.humidity > 70 ? "💧" : zone.humidity < 50 ? "🏜️" : "🌿"}
                        </div>
                      </div>

                      <div className="sensor-detail">
                        <div className="sensor-icon">⚗️</div>
                        <div className="sensor-info">
                          <span className="sensor-name">Soil pH</span>
                          <span className="sensor-reading">{zone.ph.toFixed(1)}</span>
                        </div>
                        <div className="sensor-trend">{zone.ph < 6.5 ? "🔴" : zone.ph > 7.5 ? "🔵" : "🟢"}</div>
                      </div>

                      <div className="sensor-detail">
                        <div className="sensor-icon">☀️</div>
                        <div className="sensor-info">
                          <span className="sensor-name">Light Intensity</span>
                          <span className="sensor-reading">{zone.lightIntensity} lux</span>
                        </div>
                        <div className="sensor-trend">
                          {zone.lightIntensity > 800 ? "🌞" : zone.lightIntensity < 400 ? "🌙" : "⛅"}
                        </div>
                      </div>

                      <div className="sensor-detail">
                        <div className="sensor-icon">🚿</div>
                        <div className="sensor-info">
                          <span className="sensor-name">Water Flow</span>
                          <span className="sensor-reading">{zone.waterFlow.toFixed(1)} L/h</span>
                        </div>
                        <div className="sensor-trend">{zone.waterFlow > 0 ? "💧" : "⏸️"}</div>
                      </div>
                    </div>

                    <div className="zone-info">
                      <div className="crop-info">
                        <span className="crop-icon-large">{getCropIcon(zone.cropType)}</span>
                        <div>
                          <span className="crop-name">{zone.cropType}</span>
                          <span className="last-watered">Last watered: {zone.lastWatered}</span>
                        </div>
                      </div>

                      <div className="valve-status">
                        <span className="valve-label">4/3 DCV Valve:</span>
                        <span className={`valve-indicator ${zone.valveStatus}`}>
                          {zone.valveStatus === "open" ? "🟢 OPEN" : "🔴 CLOSED"}
                        </span>
                      </div>
                    </div>

                    <div className="zone-controls">
                      {needsIrrigation && zone.status === "idle" && (
                        <button
                          className="irrigate-btn-red"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleIrrigate(zone.id)
                          }}
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                          </svg>
                          IRRIGATE NOW
                        </button>
                      )}

                      {zone.status === "active" && (
                        <div className="irrigation-active">
                          <div className="irrigation-spinner"></div>
                          <span className="irrigation-text">💧 Irrigating Zone - {zone.waterFlow}L/h</span>
                        </div>
                      )}

                      {zone.status === "emergency" && (
                        <div className="emergency-status">
                          <span className="emergency-text">🚨 Emergency Stop Active</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="moisture-bar">
                  <div
                    className={`moisture-fill ${moistureStatus}`}
                    style={{
                      width: `${Math.max(5, zone.soilMoisture)}%`,
                    }}
                  >
                    <div className="moisture-shine"></div>
                  </div>
                  <div className="moisture-percentage">{zone.soilMoisture.toFixed(0)}%</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default IrrigationControl
