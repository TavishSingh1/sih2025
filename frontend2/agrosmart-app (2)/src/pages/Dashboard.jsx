"use client"

import { useState, useEffect } from "react"
import "./Dashboard.css"

const Dashboard = () => {
  const [zones, setZones] = useState([
    {
      id: 1,
      name: "Zone A1",
      moisture: 65.2,
      temperature: 28.5,
      humidity: 72.3,
      status: "online",
      espId: "ESP32_001",
      lastUpdate: new Date().toLocaleTimeString(),
      soilPh: 6.8,
      lightIntensity: 850,
    },
    {
      id: 2,
      name: "Zone A2",
      moisture: 72.1,
      temperature: 29.1,
      humidity: 68.7,
      status: "online",
      espId: "ESP32_002",
      lastUpdate: new Date().toLocaleTimeString(),
      soilPh: 7.1,
      lightIntensity: 920,
    },
    {
      id: 3,
      name: "Zone A3",
      moisture: 58.9,
      temperature: 27.8,
      humidity: 75.2,
      status: "online",
      espId: "ESP32_003",
      lastUpdate: new Date().toLocaleTimeString(),
      soilPh: 6.5,
      lightIntensity: 780,
    },
    {
      id: 4,
      name: "Zone B1",
      moisture: 45.3,
      temperature: 30.2,
      humidity: 65.1,
      status: "warning",
      espId: "ESP32_004",
      lastUpdate: new Date().toLocaleTimeString(),
      soilPh: 7.3,
      lightIntensity: 1050,
    },
    {
      id: 5,
      name: "Zone B2",
      moisture: 78.4,
      temperature: 26.9,
      humidity: 80.5,
      status: "online",
      espId: "ESP32_005",
      lastUpdate: new Date().toLocaleTimeString(),
      soilPh: 6.9,
      lightIntensity: 890,
    },
    {
      id: 6,
      name: "Zone B3",
      moisture: 62.7,
      temperature: 28.7,
      humidity: 71.8,
      status: "online",
      espId: "ESP32_006",
      lastUpdate: new Date().toLocaleTimeString(),
      soilPh: 7.0,
      lightIntensity: 940,
    },
    {
      id: 7,
      name: "Zone C1",
      moisture: 35.2,
      temperature: 31.5,
      humidity: 58.3,
      status: "critical",
      espId: "ESP32_007",
      lastUpdate: new Date().toLocaleTimeString(),
      soilPh: 7.5,
      lightIntensity: 1200,
    },
    {
      id: 8,
      name: "Zone C2",
      moisture: 68.1,
      temperature: 27.3,
      humidity: 76.9,
      status: "online",
      espId: "ESP32_008",
      lastUpdate: new Date().toLocaleTimeString(),
      soilPh: 6.7,
      lightIntensity: 820,
    },
    {
      id: 9,
      name: "Zone C3",
      moisture: 71.5,
      temperature: 28.9,
      humidity: 73.4,
      status: "online",
      espId: "ESP32_009",
      lastUpdate: new Date().toLocaleTimeString(),
      soilPh: 6.8,
      lightIntensity: 880,
    },
  ])

  const [selectedZone, setSelectedZone] = useState(null)
  const [fieldStats, setFieldStats] = useState({
    totalZones: 9,
    activeDevices: 9,
    avgMoisture: 0,
    avgTemperature: 0,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setZones((prevZones) =>
        prevZones.map((zone) => {
          const newMoisture = Math.max(20, Math.min(90, zone.moisture + (Math.random() - 0.5) * 2))
          const newTemperature = Math.max(20, Math.min(35, zone.temperature + (Math.random() - 0.5) * 0.8))
          const newHumidity = Math.max(40, Math.min(95, zone.humidity + (Math.random() - 0.5) * 2))

          let status = "online"
          if (newMoisture < 40 || newTemperature > 32) status = "warning"
          if (newMoisture < 30 || newTemperature > 34) status = "critical"

          return {
            ...zone,
            moisture: newMoisture,
            temperature: newTemperature,
            humidity: newHumidity,
            status,
            lastUpdate: new Date().toLocaleTimeString(),
          }
        }),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const avgMoisture = zones.reduce((sum, zone) => sum + zone.moisture, 0) / zones.length
    const avgTemperature = zones.reduce((sum, zone) => sum + zone.temperature, 0) / zones.length
    const activeDevices = zones.filter((zone) => zone.status !== "offline").length

    setFieldStats({
      totalZones: zones.length,
      activeDevices,
      avgMoisture,
      avgTemperature,
    })
  }, [zones])

  const getZoneStatusColor = (status) => {
    switch (status) {
      case "online":
        return "var(--success-green)"
      case "warning":
        return "var(--warning-yellow)"
      case "critical":
        return "var(--error-red)"
      default:
        return "var(--text-secondary)"
    }
  }

  const handleZoneClick = (zone) => {
    setSelectedZone(zone)
  }

  const closeModal = () => {
    setSelectedZone(null)
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h1>Smart Field Monitor</h1>
          <p>Real-time ESP32 DHT sensor monitoring across 9 agricultural zones</p>
        </div>
        <div className="dashboard-stats">
          <div className="stat-card">
            <span className="stat-label">Active ESP32</span>
            <span className="stat-value">
              {fieldStats.activeDevices}/{fieldStats.totalZones}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Avg Moisture</span>
            <span className="stat-value">{fieldStats.avgMoisture.toFixed(1)}%</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Avg Temperature</span>
            <span className="stat-value">{fieldStats.avgTemperature.toFixed(1)}°C</span>
          </div>
        </div>
      </div>

      <div className="field-container">
        <div className="field-header">
          <h2>Agricultural Field Layout</h2>
          <p className="field-subtitle">Click on any zone to view detailed DHT sensor readings</p>
        </div>

        <div className="field-grid">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="zone-card clickable"
              style={{ borderColor: getZoneStatusColor(zone.status) }}
              onClick={() => handleZoneClick(zone)}
            >
              <div className="zone-header">
                <h3>{zone.name}</h3>
                <div className="zone-status" style={{ backgroundColor: getZoneStatusColor(zone.status) }}></div>
              </div>

              <div className="zone-preview">
                <div className="preview-item">
                  <span className="preview-label">Moisture</span>
                  <span className="preview-value">{zone.moisture.toFixed(1)}%</span>
                </div>
                <div className="preview-item">
                  <span className="preview-label">Temperature</span>
                  <span className="preview-value">{zone.temperature.toFixed(1)}°C</span>
                </div>
              </div>

              <div className="zone-footer">
                <span className="esp-id">{zone.espId}</span>
                <span className={`zone-status-text ${zone.status}`}>{zone.status.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedZone && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedZone.name} - DHT Sensor Data</h2>
              <button className="close-button" onClick={closeModal}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="sensor-grid">
                <div className="sensor-card primary">
                  <div className="sensor-icon moisture">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="sensor-details">
                    <span className="sensor-title">Soil Moisture</span>
                    <span className="sensor-big-value">{selectedZone.moisture.toFixed(2)}%</span>
                    <span className="sensor-status">DHT22 Sensor</span>
                  </div>
                </div>

                <div className="sensor-card primary">
                  <div className="sensor-icon temperature">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className="sensor-details">
                    <span className="sensor-title">Temperature</span>
                    <span className="sensor-big-value">{selectedZone.temperature.toFixed(2)}°C</span>
                    <span className="sensor-status">DHT22 Sensor</span>
                  </div>
                </div>

                <div className="sensor-card secondary">
                  <div className="sensor-icon humidity">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="sensor-details">
                    <span className="sensor-title">Air Humidity</span>
                    <span className="sensor-big-value">{selectedZone.humidity.toFixed(2)}%</span>
                    <span className="sensor-status">DHT22 Sensor</span>
                  </div>
                </div>

                <div className="sensor-card secondary">
                  <div className="sensor-icon ph">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M8 12h8" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 8v8" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="sensor-details">
                    <span className="sensor-title">Soil pH</span>
                    <span className="sensor-big-value">{selectedZone.soilPh}</span>
                    <span className="sensor-status">pH Sensor</span>
                  </div>
                </div>

                <div className="sensor-card secondary">
                  <div className="sensor-icon light">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                      <path
                        d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className="sensor-details">
                    <span className="sensor-title">Light Intensity</span>
                    <span className="sensor-big-value">{selectedZone.lightIntensity}</span>
                    <span className="sensor-status">LDR Sensor</span>
                  </div>
                </div>

                <div className="sensor-card info">
                  <div className="sensor-icon esp">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                      <circle cx="7" cy="12" r="1" fill="currentColor" />
                      <circle cx="12" cy="12" r="1" fill="currentColor" />
                      <circle cx="17" cy="12" r="1" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="sensor-details">
                    <span className="sensor-title">ESP32 Device</span>
                    <span className="sensor-big-value">{selectedZone.espId}</span>
                    <span className="sensor-status">Last Update: {selectedZone.lastUpdate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
