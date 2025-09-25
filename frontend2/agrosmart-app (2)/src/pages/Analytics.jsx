"use client"

import { useState, useEffect } from "react"
import "./Analytics.css"

const Analytics = () => {
  const [espDevices, setEspDevices] = useState([
    {
      id: "ESP32_001",
      zone: "Zone 1 - North Field",
      temperature: 24.5,
      humidity: 65.2,
      soilMoisture: 45.8,
      lightIntensity: 850,
      soilPH: 6.8,
      status: "online",
      lastUpdate: new Date(),
      batteryLevel: 87,
    },
    {
      id: "ESP32_002",
      zone: "Zone 2 - East Field",
      temperature: 26.2,
      humidity: 58.9,
      soilMoisture: 25.3,
      lightIntensity: 920,
      soilPH: 7.1,
      status: "online",
      lastUpdate: new Date(),
      batteryLevel: 92,
    },
    {
      id: "ESP32_003",
      zone: "Zone 3 - South Field",
      temperature: 23.8,
      humidity: 72.1,
      soilMoisture: 65.4,
      lightIntensity: 780,
      soilPH: 6.5,
      status: "online",
      lastUpdate: new Date(),
      batteryLevel: 78,
    },
    {
      id: "ESP32_004",
      zone: "Zone 4 - West Field",
      temperature: 25.1,
      humidity: 61.7,
      soilMoisture: 18.9,
      lightIntensity: 890,
      soilPH: 7.3,
      status: "offline",
      lastUpdate: new Date(Date.now() - 300000),
      batteryLevel: 23,
    },
    {
      id: "ESP32_005",
      zone: "Zone 5 - Center Field",
      temperature: 24.9,
      humidity: 68.3,
      soilMoisture: 52.1,
      lightIntensity: 810,
      soilPH: 6.9,
      status: "online",
      lastUpdate: new Date(),
      batteryLevel: 95,
    },
    {
      id: "ESP32_006",
      zone: "Zone 6 - Northwest",
      temperature: 23.5,
      humidity: 70.8,
      soilMoisture: 28.7,
      lightIntensity: 760,
      soilPH: 6.7,
      status: "online",
      lastUpdate: new Date(),
      batteryLevel: 81,
    },
    {
      id: "ESP32_007",
      zone: "Zone 7 - Northeast",
      temperature: 25.8,
      humidity: 55.4,
      soilMoisture: 72.3,
      lightIntensity: 940,
      soilPH: 7.0,
      status: "online",
      lastUpdate: new Date(),
      batteryLevel: 89,
    },
    {
      id: "ESP32_008",
      zone: "Zone 8 - Southwest",
      temperature: 26.5,
      humidity: 59.2,
      soilMoisture: 22.1,
      lightIntensity: 880,
      soilPH: 7.2,
      status: "warning",
      lastUpdate: new Date(),
      batteryLevel: 45,
    },
    {
      id: "ESP32_009",
      zone: "Zone 9 - Southeast",
      temperature: 24.2,
      humidity: 66.9,
      soilMoisture: 38.5,
      lightIntensity: 820,
      soilPH: 6.6,
      status: "online",
      lastUpdate: new Date(),
      batteryLevel: 93,
    },
  ])

  const [selectedDevice, setSelectedDevice] = useState(null)

  // Simulate real-time ESP32 data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEspDevices((prev) =>
        prev.map((device) => ({
          ...device,
          temperature: device.temperature + (Math.random() - 0.5) * 0.5,
          humidity: Math.max(0, Math.min(100, device.humidity + (Math.random() - 0.5) * 2)),
          soilMoisture: Math.max(0, Math.min(100, device.soilMoisture + (Math.random() - 0.7) * 1.5)),
          lightIntensity: Math.max(0, device.lightIntensity + (Math.random() - 0.5) * 50),
          soilPH: Math.max(5, Math.min(8, device.soilPH + (Math.random() - 0.5) * 0.1)),
          lastUpdate: device.status === "online" ? new Date() : device.lastUpdate,
          batteryLevel: Math.max(0, device.batteryLevel - Math.random() * 0.1),
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case "online":
        return "#22c55e"
      case "offline":
        return "#ef4444"
      case "warning":
        return "#f59e0b"
      default:
        return "#6b7280"
    }
  }

  const getBatteryColor = (level) => {
    if (level > 60) return "#22c55e"
    if (level > 30) return "#f59e0b"
    return "#ef4444"
  }

  const onlineDevices = espDevices.filter((d) => d.status === "online").length
  const avgTemperature = espDevices.reduce((sum, d) => sum + d.temperature, 0) / espDevices.length
  const avgHumidity = espDevices.reduce((sum, d) => sum + d.humidity, 0) / espDevices.length
  const avgSoilMoisture = espDevices.reduce((sum, d) => sum + d.soilMoisture, 0) / espDevices.length

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h1>ESP32 Sensor Analytics</h1>
        <div className="analytics-summary">
          <div className="summary-stat">
            <span className="stat-label">Online Devices</span>
            <span className="stat-value">{onlineDevices}/9</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Avg Temperature</span>
            <span className="stat-value">{avgTemperature.toFixed(1)}°C</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Avg Humidity</span>
            <span className="stat-value">{avgHumidity.toFixed(1)}%</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Avg Soil Moisture</span>
            <span className="stat-value">{avgSoilMoisture.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="esp-devices-grid">
        {espDevices.map((device) => (
          <div key={device.id} className={`esp-device-card ${device.status}`} onClick={() => setSelectedDevice(device)}>
            <div className="device-header">
              <h3>{device.id}</h3>
              <div className="device-status">
                <div className="status-indicator" style={{ backgroundColor: getStatusColor(device.status) }}></div>
                <span>{device.status.toUpperCase()}</span>
              </div>
            </div>

            <div className="device-zone">{device.zone}</div>

            <div className="device-sensors">
              <div className="sensor-row">
                <span className="sensor-icon">🌡️</span>
                <span className="sensor-value">{device.temperature.toFixed(1)}°C</span>
              </div>
              <div className="sensor-row">
                <span className="sensor-icon">💧</span>
                <span className="sensor-value">{device.humidity.toFixed(1)}%</span>
              </div>
              <div className="sensor-row">
                <span className="sensor-icon">🌱</span>
                <span className="sensor-value">{device.soilMoisture.toFixed(1)}%</span>
              </div>
              <div className="sensor-row">
                <span className="sensor-icon">☀️</span>
                <span className="sensor-value">{device.lightIntensity.toFixed(0)} lux</span>
              </div>
            </div>

            <div className="device-footer">
              <div className="battery-indicator">
                <div
                  className="battery-fill"
                  style={{
                    width: `${device.batteryLevel}%`,
                    backgroundColor: getBatteryColor(device.batteryLevel),
                  }}
                ></div>
                <span>{device.batteryLevel.toFixed(0)}%</span>
              </div>
              <div className="last-update">
                {device.status === "online" ? "Live" : `${Math.floor((Date.now() - device.lastUpdate) / 60000)}m ago`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedDevice && (
        <div className="device-modal-overlay" onClick={() => setSelectedDevice(null)}>
          <div className="device-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedDevice.id} - Detailed View</h2>
              <button className="modal-close" onClick={() => setSelectedDevice(null)}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <div className="detailed-sensors">
                <div className="sensor-detail">
                  <h4>🌡️ Temperature</h4>
                  <div className="sensor-detail-value">{selectedDevice.temperature.toFixed(2)}°C</div>
                </div>
                <div className="sensor-detail">
                  <h4>💧 Air Humidity</h4>
                  <div className="sensor-detail-value">{selectedDevice.humidity.toFixed(2)}%</div>
                </div>
                <div className="sensor-detail">
                  <h4>🌱 Soil Moisture</h4>
                  <div className="sensor-detail-value">{selectedDevice.soilMoisture.toFixed(2)}%</div>
                </div>
                <div className="sensor-detail">
                  <h4>☀️ Light Intensity</h4>
                  <div className="sensor-detail-value">{selectedDevice.lightIntensity.toFixed(0)} lux</div>
                </div>
                <div className="sensor-detail">
                  <h4>🧪 Soil pH</h4>
                  <div className="sensor-detail-value">{selectedDevice.soilPH.toFixed(2)}</div>
                </div>
                <div className="sensor-detail">
                  <h4>🔋 Battery Level</h4>
                  <div className="sensor-detail-value">{selectedDevice.batteryLevel.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="esp-placeholder-note">
        <h3>📡 Real-time ESP32 Integration Ready</h3>
        <p>
          This analytics dashboard is configured to receive live data from ESP32 devices. Connect your sensors to see
          real-time field monitoring data, historical trends, and automated alerts.
        </p>
        <div className="integration-features">
          <div className="feature-item">✓ DHT22 Temperature & Humidity Sensors</div>
          <div className="feature-item">✓ Soil Moisture Sensors</div>
          <div className="feature-item">✓ Light Intensity Sensors</div>
          <div className="feature-item">✓ pH Sensors</div>
          <div className="feature-item">✓ Battery Level Monitoring</div>
          <div className="feature-item">✓ WiFi Connectivity Status</div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
