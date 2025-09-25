"use client"

import { useState } from "react"
import "./Settings.css"

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      push: true,
      email: false,
      sms: false,
      criticalOnly: false,
    },
    system: {
      autoIrrigation: true,
      weatherIntegration: true,
      dataRetention: 30,
      updateInterval: 5,
    },
    display: {
      theme: "dark",
      language: "en",
      timezone: "Asia/Kolkata",
      units: "metric",
    },
    connectivity: {
      wifiSSID: "AgroSmart_Network",
      mqttBroker: "mqtt.agrosmart.local",
      apiEndpoint: "https://api.agrosmart.com",
    },
  })

  const [deviceInfo, setDeviceInfo] = useState({
    esp32Status: "connected",
    firmwareVersion: "v2.1.3",
    lastSync: new Date(Date.now() - 300000),
    batteryLevel: 87,
    signalStrength: -45,
  })

  const handleSettingChange = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
  }

  const handleSaveSettings = () => {
    // Simulate saving settings
    console.log("Settings saved:", settings)
    alert("Settings saved successfully!")
  }

  const handleFactoryReset = () => {
    if (window.confirm("Are you sure you want to reset all settings to factory defaults?")) {
      // Reset to default settings
      setSettings({
        notifications: {
          push: true,
          email: false,
          sms: false,
          criticalOnly: false,
        },
        system: {
          autoIrrigation: true,
          weatherIntegration: true,
          dataRetention: 30,
          updateInterval: 5,
        },
        display: {
          theme: "dark",
          language: "en",
          timezone: "Asia/Kolkata",
          units: "metric",
        },
        connectivity: {
          wifiSSID: "AgroSmart_Network",
          mqttBroker: "mqtt.agrosmart.local",
          apiEndpoint: "https://api.agrosmart.com",
        },
      })
      alert("Settings reset to factory defaults!")
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      connected: "#22c55e",
      disconnected: "#ef4444",
      syncing: "#f59e0b",
    }
    return colors[status] || "#6b7280"
  }

  return (
    <div className="settings">
      <div className="settings-header">
        <h1>System Settings</h1>
        <div className="settings-actions">
          <button className="save-btn" onClick={handleSaveSettings}>
            Save Changes
          </button>
          <button className="reset-btn" onClick={handleFactoryReset}>
            Factory Reset
          </button>
        </div>
      </div>

      <div className="settings-content">
        <div className="settings-main">
          <div className="settings-section">
            <h2>Notifications</h2>
            <div className="setting-group">
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => handleSettingChange("notifications", "push", e.target.checked)}
                  />
                  Push Notifications
                </label>
                <p>Receive real-time alerts on your device</p>
              </div>
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => handleSettingChange("notifications", "email", e.target.checked)}
                  />
                  Email Notifications
                </label>
                <p>Get alerts via email</p>
              </div>
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.sms}
                    onChange={(e) => handleSettingChange("notifications", "sms", e.target.checked)}
                  />
                  SMS Notifications
                </label>
                <p>Receive critical alerts via SMS</p>
              </div>
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.notifications.criticalOnly}
                    onChange={(e) => handleSettingChange("notifications", "criticalOnly", e.target.checked)}
                  />
                  Critical Alerts Only
                </label>
                <p>Only receive high-priority notifications</p>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2>System Configuration</h2>
            <div className="setting-group">
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.system.autoIrrigation}
                    onChange={(e) => handleSettingChange("system", "autoIrrigation", e.target.checked)}
                  />
                  Automatic Irrigation
                </label>
                <p>Enable AI-driven irrigation scheduling</p>
              </div>
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.system.weatherIntegration}
                    onChange={(e) => handleSettingChange("system", "weatherIntegration", e.target.checked)}
                  />
                  Weather Integration
                </label>
                <p>Use weather data for irrigation decisions</p>
              </div>
              <div className="setting-item">
                <label>
                  Data Retention (days):
                  <input
                    type="number"
                    value={settings.system.dataRetention}
                    onChange={(e) => handleSettingChange("system", "dataRetention", Number.parseInt(e.target.value))}
                    min="7"
                    max="365"
                  />
                </label>
                <p>How long to keep sensor data</p>
              </div>
              <div className="setting-item">
                <label>
                  Update Interval (minutes):
                  <input
                    type="number"
                    value={settings.system.updateInterval}
                    onChange={(e) => handleSettingChange("system", "updateInterval", Number.parseInt(e.target.value))}
                    min="1"
                    max="60"
                  />
                </label>
                <p>How often to collect sensor data</p>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2>Display & Interface</h2>
            <div className="setting-group">
              <div className="setting-item">
                <label>
                  Theme:
                  <select
                    value={settings.display.theme}
                    onChange={(e) => handleSettingChange("display", "theme", e.target.value)}
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="auto">Auto</option>
                  </select>
                </label>
                <p>Choose your preferred color scheme</p>
              </div>
              <div className="setting-item">
                <label>
                  Language:
                  <select
                    value={settings.display.language}
                    onChange={(e) => handleSettingChange("display", "language", e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="ne">Nepali</option>
                  </select>
                </label>
                <p>Select your preferred language</p>
              </div>
              <div className="setting-item">
                <label>
                  Timezone:
                  <select
                    value={settings.display.timezone}
                    onChange={(e) => handleSettingChange("display", "timezone", e.target.value)}
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="Asia/Kathmandu">Asia/Kathmandu (NPT)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </label>
                <p>Set your local timezone</p>
              </div>
              <div className="setting-item">
                <label>
                  Units:
                  <select
                    value={settings.display.units}
                    onChange={(e) => handleSettingChange("display", "units", e.target.value)}
                  >
                    <option value="metric">Metric (°C, L, kg)</option>
                    <option value="imperial">Imperial (°F, gal, lb)</option>
                  </select>
                </label>
                <p>Choose measurement units</p>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h2>Connectivity</h2>
            <div className="setting-group">
              <div className="setting-item">
                <label>
                  WiFi Network:
                  <input
                    type="text"
                    value={settings.connectivity.wifiSSID}
                    onChange={(e) => handleSettingChange("connectivity", "wifiSSID", e.target.value)}
                  />
                </label>
                <p>ESP32 WiFi network name</p>
              </div>
              <div className="setting-item">
                <label>
                  MQTT Broker:
                  <input
                    type="text"
                    value={settings.connectivity.mqttBroker}
                    onChange={(e) => handleSettingChange("connectivity", "mqttBroker", e.target.value)}
                  />
                </label>
                <p>MQTT server for real-time communication</p>
              </div>
              <div className="setting-item">
                <label>
                  API Endpoint:
                  <input
                    type="text"
                    value={settings.connectivity.apiEndpoint}
                    onChange={(e) => handleSettingChange("connectivity", "apiEndpoint", e.target.value)}
                  />
                </label>
                <p>Backend API server URL</p>
              </div>
            </div>
          </div>
        </div>

        <div className="device-status">
          <h2>Device Status</h2>
          <div className="status-cards">
            <div className="status-card">
              <h3>ESP32 Connection</h3>
              <div className="status-indicator">
                <div className="status-dot" style={{ backgroundColor: getStatusColor(deviceInfo.esp32Status) }}></div>
                <span>{deviceInfo.esp32Status.toUpperCase()}</span>
              </div>
            </div>
            <div className="status-card">
              <h3>Firmware Version</h3>
              <div className="status-value">{deviceInfo.firmwareVersion}</div>
            </div>
            <div className="status-card">
              <h3>Last Sync</h3>
              <div className="status-value">{deviceInfo.lastSync.toLocaleTimeString()}</div>
            </div>
            <div className="status-card">
              <h3>Battery Level</h3>
              <div className="status-value">{deviceInfo.batteryLevel}%</div>
              <div className="battery-indicator">
                <div className="battery-fill" style={{ width: `${deviceInfo.batteryLevel}%` }}></div>
              </div>
            </div>
            <div className="status-card">
              <h3>Signal Strength</h3>
              <div className="status-value">{deviceInfo.signalStrength} dBm</div>
            </div>
          </div>

          <div className="device-actions">
            <button className="action-btn">Update Firmware</button>
            <button className="action-btn">Restart Device</button>
            <button className="action-btn">Run Diagnostics</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
