"use client"

import { useEffect, useState } from "react"
import "./Analytics.css"

// Hardcoded backend base URL (no env)
const BASE_URL = "https://sih-backend-5pqc.onrender.com"
// Renamed ZONES to ESP_ZONES for consistency
const ESP_ZONES = ["zone1","zone2","zone3","zone4","zone5","zone6","zone7","zone8","zone9"]

export default function Analytics() {
  // Renamed internal state structure key 'zone' to 'espZone'
  const [zonesData, setZonesData] = useState(
    ESP_ZONES.map(z => ({ espZone: z, loading: true, error: "Data not fetched" }))
  )
  const [debugInfo, setDebugInfo] = useState([])

  const addDebugInfo = (info) => {
    setDebugInfo(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${info}`])
  }

  // Parameter remains 'zone' as it's the identifier, but it corresponds to espZone on backend
  const fetchZone = async (zoneIdentifier) => {
    // The URL structure remains the same and is correct for your backend's route: /data/:espZone
    const url = `${BASE_URL}/data/${zoneIdentifier}`
    addDebugInfo(`Fetching ${zoneIdentifier}...`)
    
    try {
      // Increased timeout to 30 seconds for services like Render that spin down
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout
      
      const res = await fetch(url, {
        method: "GET",
        headers: { 
          Accept: "application/json",
          'Content-Type': 'application/json',
          // REMOVED: 'Access-Control-Allow-Origin': '*' - This header is not sent by the client
        },
        cache: "no-store",
        mode: "cors",
        redirect: "follow",
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      addDebugInfo(`${zoneIdentifier}: Response status ${res.status}`)

      const ctype = res.headers.get("content-type") || ""
      if (!res.ok) {
        let serverError = `HTTP ${res.status}: ${res.statusText}`
        try {
          if (ctype.includes("application/json")) {
            const j = await res.json()
            if (j?.error) serverError = j.error // Will capture "No data found for this espZone"
          } else {
            const t = await res.text()
            if (t) serverError = t.substring(0, 100)
          }
        } catch (parseError) {
          // If we can't parse the error, keep the HTTP status error
        }
        addDebugInfo(`${zoneIdentifier}: Error - ${serverError}`)
        
        // Use the original identifier and the error message
        return { espZone: zoneIdentifier, error: serverError, loading: false }
      }

      if (!ctype.includes("application/json")) {
        addDebugInfo(`${zoneIdentifier}: Non-JSON response (${ctype})`)
        return { espZone: zoneIdentifier, error: "Non-JSON response", loading: false }
      }

      const json = await res.json()
      addDebugInfo(`${zoneIdentifier}: Data received successfully`)
      
      if (json?.error) {
        return { espZone: zoneIdentifier, error: json.error, loading: false }
      }

      // Log the actual response structure for debugging
      console.log(`${zoneIdentifier} response:`, json)

      return {
        // Use espZone from payload or fallback to identifier
        espZone: json?.espZone || zoneIdentifier, 
        temperature: json?.temperature,
        humidity: json?.humidity,
        moisture: json?.moisture,
        timestamp: json?.timestamp ? new Date(json.timestamp) : null,
        loading: false,
        error: null,
      }
    } catch (error) {
      let errorMsg = "Network/Connection error" // General network failure
      if (error.name === 'AbortError') {
        errorMsg = "Request timeout (30s)"
      } 
      // CORS and other network issues often manifest as a generic fetch error
      
      addDebugInfo(`${zoneIdentifier}: ${errorMsg}`)
      return { espZone: zoneIdentifier, error: errorMsg, loading: false }
    }
  }

  const refreshAll = async () => {
    addDebugInfo("Starting data refresh...")
    // Use ESP_ZONES
    const results = await Promise.all(ESP_ZONES.map(fetchZone))
    setZonesData(results)
    
    const successCount = results.filter(r => !r.error && !r.loading).length
    addDebugInfo(`Refresh complete: ${successCount}/${ESP_ZONES.length} zones successful`)
  }

  // Test a single zone first
  const testSingleZone = async () => {
    addDebugInfo("Testing zone1 connection...")
    const result = await fetchZone("zone1")
    console.log("Test result:", result)
  }

  useEffect(() => {
    refreshAll()
    const id = setInterval(refreshAll, 5000) // poll every 5s
    return () => clearInterval(id)
  }, [])

  // Optional header summary
  const available = zonesData.filter(z => !z.loading && !z.error)
  const avgTemp = available.length ? (available.reduce((s,z)=>s+(z.temperature??0),0)/available.length).toFixed(1) : "—"
  const avgHum  = available.length ? (available.reduce((s,z)=>s+(z.humidity??0),0)/available.length).toFixed(1) : "—"
  const avgMoi  = available.length ? (available.reduce((s,z)=>s+(z.moisture??0),0)/available.length).toFixed(0) : "—"

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h1>ESP32 Sensor Analytics</h1>
        <div className="analytics-summary">
          <div className="summary-stat"><span className="stat-label">Zones with Data</span><span className="stat-value">{available.length}/9</span></div>
          <div className="summary-stat"><span className="stat-label">Avg Temp</span><span className="stat-value">{avgTemp}°C</span></div>
          <div className="summary-stat"><span className="stat-label">Avg Humidity</span><span className="stat-value">{avgHum}%</span></div>
          <div className="summary-stat"><span className="stat-label">Avg Moisture</span><span className="stat-value">{avgMoi}</span></div>
        </div>
      </div>

      {/* Debug panel - Remove this once everything works */}
      <div style={{
        background: '#f0f0f0',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '5px',
        fontSize: '12px',
        maxHeight: '120px',
        overflowY: 'auto'
      }}>
        <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
          <button onClick={testSingleZone} style={{padding: '5px 10px', fontSize: '12px'}}>
            Test Zone1
          </button>
          <button onClick={refreshAll} style={{padding: '5px 10px', fontSize: '12px'}}>
            Refresh All
          </button>
        </div>
        <div>
          <strong>Debug Info:</strong>
          {debugInfo.map((info, idx) => (
            <div key={idx}>{info}</div>
          ))}
        </div>
      </div>

      <div className="esp-devices-grid">
        {zonesData.map((z) => {
          // Use 'espZone' for the key and display
          const hasData = !z.loading && !z.error &&
            (z.temperature !== undefined || z.humidity !== undefined || z.moisture !== undefined)

          return (
            <div key={z.espZone} className="esp-device-card">
              <div className="device-header">
                <h3>{z.espZone.toUpperCase()}</h3>
              </div>

              {z.loading ? (
                <div className="no-data"><p>Loading…</p></div>
              ) : !hasData ? (
                // Now z.error will clearly show "No data found for this espZone" if 404
                <div className="no-data"><p>⚠️ {z.error || "No data available"}</p></div>
              ) : (
                <div className="device-sensors">
                  <div className="sensor-row"><span className="sensor-icon">🌡️</span><span className="sensor-value">{z.temperature}°C</span></div>
                  <div className="sensor-row"><span className="sensor-icon">💧</span><span className="sensor-value">{z.humidity}%</span></div>
                  <div className="sensor-row"><span className="sensor-icon">🌱</span><span className="sensor-value">{z.moisture}</span></div>
                  <div className="last-update">Last Update: {z.timestamp ? z.timestamp.toLocaleTimeString() : "N/A"}</div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}