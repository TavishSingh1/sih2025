"use client"

import { useState, useEffect } from "react"
import "./IrrigationControl.css"

const IrrigationControl = () => {
  const [zones, setZones] = useState([
    {
      id: 1,
      name: "Zone 1 - North Field",
      espId: "ESP32_001",
      soilMoisture: 45,
      temperature: 24.5,
      status: "idle",
      valveStatus: "closed",
      cropType: "tomatoes",
      lastWatered: "3 hours ago",
    },
    {
      id: 2,
      name: "Zone 2 - East Field",
      espId: "ESP32_002",
      soilMoisture: 25,
      temperature: 26.2,
      status: "idle",
      valveStatus: "closed",
      cropType: "peppers",
      lastWatered: "6 hours ago",
    },
    {
      id: 3,
      name: "Zone 3 - South Field",
      espId: "ESP32_003",
      soilMoisture: 65,
      temperature: 23.8,
      status: "idle",
      valveStatus: "closed",
      cropType: "lettuce",
      lastWatered: "1 hour ago",
    },
    {
      id: 4,
      name: "Zone 4 - West Field",
      espId: "ESP32_004",
      soilMoisture: 18,
      temperature: 25.1,
      status: "idle",
      valveStatus: "closed",
      cropType: "carrots",
      lastWatered: "8 hours ago",
    },
    {
      id: 5,
      name: "Zone 5 - Center Field",
      espId: "ESP32_005",
      soilMoisture: 52,
      temperature: 24.9,
      status: "active",
      valveStatus: "open",
      cropType: "beans",
      lastWatered: "30 min ago",
    },
    {
      id: 6,
      name: "Zone 6 - Northwest",
      espId: "ESP32_006",
      soilMoisture: 28,
      temperature: 23.5,
      status: "idle",
      valveStatus: "closed",
      cropType: "cabbage",
      lastWatered: "5 hours ago",
    },
    {
      id: 7,
      name: "Zone 7 - Northeast",
      espId: "ESP32_007",
      soilMoisture: 72,
      temperature: 25.8,
      status: "idle",
      valveStatus: "closed",
      cropType: "spinach",
      lastWatered: "45 min ago",
    },
    {
      id: 8,
      name: "Zone 8 - Southwest",
      espId: "ESP32_008",
      soilMoisture: 22,
      temperature: 26.5,
      status: "idle",
      valveStatus: "closed",
      cropType: "radish",
      lastWatered: "7 hours ago",
    },
    {
      id: 9,
      name: "Zone 9 - Southeast",
      espId: "ESP32_009",
      soilMoisture: 38,
      temperature: 24.2,
      status: "idle",
      valveStatus: "closed",
      cropType: "onions",
      lastWatered: "4 hours ago",
    },
  ])

  const [emergencyMode, setEmergencyMode] = useState(false)

  const handleIrrigate = (zoneId) => {
    setZones((prev) =>
      prev.map((zone) => {
        if (zone.id === zoneId) {
          return {
            ...zone,
            status: "active",
            valveStatus: "open",
            lastWatered: "Now",
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
              soilMoisture: Math.min(zone.soilMoisture + 25, 80),
              lastWatered: "Just completed",
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
        status: "idle",
        valveStatus: "closed",
      })),
    )

    setTimeout(() => {
      setEmergencyMode(false)
    }, 5000)
  }

  // Simulate real-time ESP32 data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setZones((prev) =>
        prev.map((zone) => ({
          ...zone,
          soilMoisture: Math.max(0, zone.soilMoisture + (Math.random() - 0.7) * 2),
          temperature: zone.temperature + (Math.random() - 0.5) * 0.5,
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getMoistureStatus = (moisture) => {
    if (moisture < 30) return "critical"
    if (moisture < 50) return "low"
    if (moisture < 70) return "good"
    return "excellent"
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "critical":
        return "#ef4444"
      case "low":
        return "#f59e0b"
      case "good":
        return "#22c55e"
      case "excellent":
        return "#3b82f6"
      default:
        return "#6b7280"
    }
  }

  return (
    <div className="irrigation-control">
      <div className="irrigation-header">
        <div className="irrigation-title">
          <h1>Irrigation Control System</h1>
          <p>Monitor and control 9 field zones with ESP32 sensors and 4/3 DCV valves</p>
        </div>
        <div className="irrigation-actions">
          <div className="system-status">
            <span className="status-label">Active Zones</span>
            <span className="status-value">{zones.filter((z) => z.status === "active").length}/9</span>
          </div>
          <button
            className={`btn btn-emergency ${emergencyMode ? "emergency-active" : ""}`}
            onClick={handleEmergencyStop}
            disabled={emergencyMode}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="2" />
            </svg>
            {emergencyMode ? "Emergency Active" : "Emergency Stop"}
          </button>
        </div>
      </div>

      <div className="zones-field-grid">
        {zones.map((zone) => {
          const moistureStatus = getMoistureStatus(zone.soilMoisture)
          const needsIrrigation = zone.soilMoisture < 30

          return (
            <div key={zone.id} className={`zone-card ${zone.status} ${moistureStatus}`}>
              <div className="zone-header">
                <h3>{zone.name}</h3>
                <div className="esp-id">{zone.espId}</div>
              </div>

              <div className="zone-sensors">
                <div className="sensor-reading">
                  <div className="sensor-icon">💧</div>
                  <div className="sensor-data">
                    <span className="sensor-label">Soil Moisture</span>
                    <span className="sensor-value">{zone.soilMoisture.toFixed(1)}%</span>
                  </div>
                </div>

                <div className="sensor-reading">
                  <div className="sensor-icon">🌡️</div>
                  <div className="sensor-data">
                    <span className="sensor-label">Temperature</span>
                    <span className="sensor-value">{zone.temperature.toFixed(1)}°C</span>
                  </div>
                </div>
              </div>

              <div className="moisture-bar">
                <div
                  className="moisture-fill"
                  style={{
                    width: `${zone.soilMoisture}%`,
                    backgroundColor: getStatusColor(moistureStatus),
                  }}
                ></div>
              </div>

              <div className="zone-info">
                <div className="crop-type">🌱 {zone.cropType}</div>
                <div className="last-watered">Last: {zone.lastWatered}</div>
                <div className={`valve-status ${zone.valveStatus}`}>4/3 DCV: {zone.valveStatus.toUpperCase()}</div>
              </div>

              {needsIrrigation && zone.status === "idle" && (
                <button className="irrigate-btn" onClick={() => handleIrrigate(zone.id)}>
                  💧 Irrigate Now
                </button>
              )}

              {zone.status === "active" && (
                <div className="irrigation-active">
                  <div className="irrigation-spinner"></div>
                  <span>Irrigating...</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="field-summary">
        <div className="summary-stats">
          <div className="stat-item critical">
            <span className="stat-label">Critical Zones</span>
            <span className="stat-value">{zones.filter((z) => z.soilMoisture < 30).length}</span>
          </div>
          <div className="stat-item low">
            <span className="stat-label">Low Moisture</span>
            <span className="stat-value">
              {zones.filter((z) => z.soilMoisture >= 30 && z.soilMoisture < 50).length}
            </span>
          </div>
          <div className="stat-item good">
            <span className="stat-label">Optimal Zones</span>
            <span className="stat-value">{zones.filter((z) => z.soilMoisture >= 50).length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IrrigationControl
