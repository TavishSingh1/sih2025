"use client"

import { useState, useEffect } from "react"
import "./IrrigationControl.css"

// Hardcoded backend base URL
const BASE_URL = "https://sih-backend-5pqc.onrender.com"
// Crop names removed, only icons remain. cropType field remains for icon mapping.
const ESP_ZONES = [
    { id: 1, name: "Zone 1", espId: "zone1", cropType: "Tomatoes" },
    { id: 2, name: "Zone 2", espId: "zone2", cropType: "Bell Peppers" },
    { id: 3, name: "Zone 3", espId: "zone3", cropType: "Lettuce" },
    { id: 4, name: "Zone 4", espId: "zone4", cropType: "Carrots" },
    { id: 5, name: "Zone 5", espId: "zone5", cropType: "Green Beans" },
    { id: 6, name: "Zone 6", espId: "zone6", cropType: "Cabbage" },
    { id: 7, name: "Zone 7", espId: "zone7", cropType: "Spinach" },
    { id: 8, name: "Zone 8", espId: "zone8", cropType: "Radish" },
    { id: 9, name: "Zone 9", espId: "zone9", cropType: "Onions" },
]

// Initial state, merging static data with dynamic/loading data
const initialZonesState = ESP_ZONES.map(z => ({
    ...z,
    soilMoisture: undefined, // Start as undefined, not 0
    temperature: undefined, // Start as undefined, not 0
    humidity: undefined,
    // REMOVED: ph: undefined,
    // REMOVED: lightIntensity: undefined,
    status: "idle",
    valveStatus: "closed",
    lastWatered: "Never",
    waterFlow: 0,
    loading: true,
    error: null
}))

const IrrigationControl = () => {
    const [zones, setZones] = useState(initialZonesState)
    const [expandedZone, setExpandedZone] = useState(null)
    const [emergencyMode, setEmergencyMode] = useState(false)
    const [systemStats, setSystemStats] = useState({
        totalWaterUsed: '0.0',
        avgMoisture: '—',
        avgTemperature: '—',
    })

    /* =========================================================================
        FETCHING LOGIC (Updated to return undefined sensor values on error)
        ========================================================================= */

    const fetchZone = async (zoneStaticData) => {
        const { espId } = zoneStaticData
        const url = `${BASE_URL}/data/${espId}`

        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 30000)

            const res = await fetch(url, {
                method: "GET",
                headers: { Accept: "application/json", 'Content-Type': 'application/json' },
                cache: "no-store",
                mode: "cors",
                redirect: "follow",
                signal: controller.signal
            })

            clearTimeout(timeoutId)

            if (!res.ok) {
                let serverError = `HTTP ${res.status}: ${res.statusText}`
                try {
                    const ctype = res.headers.get("content-type") || ""
                    if (ctype.includes("application/json")) {
                        const j = await res.json()
                        if (j?.error) serverError = j.error
                    }
                } catch { /* ignore parse error */ }
                
                // 💡 FIX: Return only static data and error state (no default sensor values)
                return { ...zoneStaticData, loading: false, error: serverError }
            }

            const json = await res.json()

            if (json?.error) {
                // 💡 FIX: Return only static data and error state (no default sensor values)
                return { ...zoneStaticData, loading: false, error: json.error }
            }

            // Successfully fetched data
            return {
                ...zoneStaticData,
                temperature: json?.temperature,
                humidity: json?.humidity,
                soilMoisture: json?.moisture, 
                // REMOVED: ph: 7.0, 
                // REMOVED: lightIntensity: 800,
                timestamp: json?.timestamp ? new Date(json.timestamp) : new Date(),
                loading: false,
                error: null,
            }
        } catch (error) {
            let errorMsg = error.name === 'AbortError' ? "Request timeout (30s)" : "Network/Connection error"
            // 💡 FIX: Return only static data and error state (no default sensor values)
            return { ...zoneStaticData, loading: false, error: errorMsg }
        }
    }

    // Main function to refresh all zones concurrently
    const refreshAll = async () => {
        const staticZones = zones.map(({ id, name, espId, cropType, lastWatered, waterFlow, status, valveStatus }) => ({ 
            id, name, espId, cropType, lastWatered, waterFlow, status, valveStatus 
        }));
        
        const results = await Promise.all(staticZones.map(fetchZone))
        
        setZones(prevZones => prevZones.map(prevZone => {
            const result = results.find(r => r.id === prevZone.id)
            if (!result || result.error) {
                // 💡 FIX: Explicitly clear sensor data to undefined/null on error/failure
                return { 
                    ...prevZone, 
                    soilMoisture: undefined, 
                    temperature: undefined, 
                    humidity: undefined, 
                    // REMOVED: ph: undefined, 
                    // REMOVED: lightIntensity: undefined,
                    loading: result?.loading ?? false, 
                    error: result?.error ?? "No data available" 
                }
            }

            // If fetching succeeded, use the new sensor data
            return {
                ...prevZone,
                soilMoisture: result.soilMoisture,
                temperature: result.temperature,
                humidity: result.humidity,
                // REMOVED: ph: result.ph,
                // REMOVED: lightIntensity: result.lightIntensity,
                loading: false,
                error: null,
            }
        }))
    }
    
    // Auto-refresh hook
    useEffect(() => {
        refreshAll()
        const id = setInterval(refreshAll, 5000) // Poll every 5s
        return () => clearInterval(id)
    }, [])
    
    // System Stats Calculation Hook (Updated to use '—' on no available data)
    useEffect(() => {
        // Filter zones that have successfully fetched data (no loading, no error, and soilMoisture is a number)
        const availableZones = zones.filter(z => !z.loading && !z.error && z.soilMoisture !== undefined)
        
        if (availableZones.length > 0) {
            // Use ?? 0 for safety, though the filter should ensure sensor values exist
            const avgMoisture = availableZones.reduce((sum, zone) => sum + (zone.soilMoisture ?? 0), 0) / availableZones.length
            const avgTemperature = availableZones.reduce((sum, zone) => sum + (zone.temperature ?? 0), 0) / availableZones.length
            const totalWaterUsed = zones.reduce((sum, zone) => sum + zone.waterFlow, 0)
    
            setSystemStats({
                avgMoisture: avgMoisture.toFixed(1),
                avgTemperature: avgTemperature.toFixed(1),
                totalWaterUsed: totalWaterUsed.toFixed(1),
            })
        } else {
            // 💡 FIX: Set stats to placeholders when no valid zones have data
            setSystemStats({
                avgMoisture: '—',
                avgTemperature: '—',
                totalWaterUsed: zones.reduce((sum, zone) => sum + zone.waterFlow, 0).toFixed(1),
            })
        }
    }, [zones])
    
    /* =========================================================================
        CONTROL LOGIC (Same as before)
        ========================================================================= */

    const handleIrrigate = (zoneId) => {
        // --- TODO: REAL API CALL TO TRIGGER VALVE ---
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
                            lastWatered: "Just completed",
                            waterFlow: 0,
                        }
                    }
                    return zone
                }),
            )
            refreshAll() 
        }, 30000)
    }

    const handleEmergencyStop = () => {
        // --- TODO: REAL API CALL TO CLOSE ALL VALVES ---
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
            refreshAll()
        }, 5000)
    }

    const handleZoneClick = (zoneId) => {
        setExpandedZone(expandedZone === zoneId ? null : zoneId)
    }

    /* =========================================================================
        HELPER FUNCTIONS (Updated to use icons only)
        ========================================================================= */

    const getMoistureStatus = (moisture) => {
        if (moisture === undefined) return "unknown"
        if (moisture < 25) return "critical"
        if (moisture < 40) return "low"
        if (moisture < 65) return "good"
        return "excellent"
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

    /* =========================================================================
        JSX RENDER (Updated icon and sensor display)
        ========================================================================= */

    return (
        <div className="irrigation-control">
            <div className="irrigation-header">
                <div className="header-content">
                    <div className="irrigation-title">
                        <div className="title-icon">
                            {/* 💡 FIX: Removed the $ sign icon and replaced it with a gear/settings icon */}
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 .51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
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
                                <span className="stat-label">Water Flow (Current)</span>
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
                    {/* The button alignment is fixed in CSS */}
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

            {/* --- Start of Field Matrix --- */}
            
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
                        const moisture = zone.soilMoisture;
                        const moistureStatus = getMoistureStatus(moisture)
                        // If moisture is undefined/null, it can't need irrigation
                        const needsIrrigation = (moisture !== undefined && moisture < 30) && !zone.loading
                        const isExpanded = expandedZone === zone.id
                        
                        const isUnavailable = zone.loading || zone.error

                        // Use 'unknown' if moisture is undefined but no error is present (e.g., initial state)
                        const cardClass = isUnavailable ? "unavailable" : `${zone.status} ${moistureStatus}`

                        return (
                            <div
                                key={zone.id}
                                className={`zone-card ${cardClass} ${isExpanded ? "expanded" : ""}`}
                                onClick={() => handleZoneClick(zone.id)}
                            >
                                <div className="zone-header">
                                    <div className="zone-title">
                                        {/* REMOVED: zone.cropType name, kept icon */}
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
                                            <span className="sensor-value">
                                                {isUnavailable || moisture === undefined ? "..." : `${moisture.toFixed(0)}%`}
                                            </span>
                                            <span className="sensor-label">Moisture</span>
                                        </div>
                                    </div>
                                    <div className="sensor-preview temperature">
                                        <div className="sensor-icon">🌡️</div>
                                        <div className="sensor-data">
                                            <span className="sensor-value">
                                                {isUnavailable || zone.temperature === undefined ? "..." : `${zone.temperature.toFixed(1)}°C`}
                                            </span>
                                            <span className="sensor-label">Temperature</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {isUnavailable ? (
                                    <div className="zone-unavailable-message">
                                        <p>{zone.loading ? "Fetching data..." : `Error: ${zone.error}`}</p>
                                    </div>
                                ) : (
                                    isExpanded && (
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
                                                        <span className="sensor-reading">{moisture !== undefined ? `${moisture.toFixed(1)}%` : 'N/A'}</span>
                                                    </div>
                                                    <div className="sensor-trend">
                                                        {moisture !== undefined ? (moisture < 30 ? "📉" : moisture > 70 ? "📈" : "➡️") : '—'}
                                                    </div>
                                                </div>

                                                <div className="sensor-detail">
                                                    <div className="sensor-icon">🌡️</div>
                                                    <div className="sensor-info">
                                                        <span className="sensor-name">Temperature</span>
                                                        <span className="sensor-reading">{zone.temperature !== undefined ? `${zone.temperature.toFixed(1)}°C` : 'N/A'}</span>
                                                    </div>
                                                    <div className="sensor-trend">
                                                        {zone.temperature !== undefined ? (zone.temperature > 28 ? "🔥" : zone.temperature < 20 ? "❄️" : "") : '—'}
                                                    </div>
                                                </div>

                                                <div className="sensor-detail">
                                                    <div className="sensor-icon">💨</div>
                                                    <div className="sensor-info">
                                                        <span className="sensor-name">Air Humidity</span>
                                                        <span className="sensor-reading">{zone.humidity !== undefined ? `${zone.humidity.toFixed(0)}%` : 'N/A'}</span>
                                                    </div>
                                                    <div className="sensor-trend">
                                                        {zone.humidity !== undefined ? (zone.humidity > 70 ? "💧" : zone.humidity < 50 ? "🏜️" : "") : '—'}
                                                    </div>
                                                </div>

                                               



                                                <div className="sensor-detail">
                                                    <div className="sensor-icon">🚿</div>
                                                    <div className="sensor-info">
                                                        <span className="sensor-name">Water Flow</span>
                                                        <span className="sensor-reading">{zone.waterFlow.toFixed(1)} L/h</span>
                                                    </div>
                                                    <div className="sensor-trend">{zone.waterFlow > 0 ? "💧" : ""}</div>
                                                </div>
                                            </div>

                                            <div className="zone-info">
                                                <div className="crop-info">
                                                    <span className="crop-icon-large">{getCropIcon(zone.cropType)}</span>
                                                    <div>
                                                        {/* REMOVED: Crop name display */}
                                                        {/* <span className="crop-name">{zone.cropType}</span> */}
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
                                    )
                                )}

                                <div className="moisture-bar">
                                    <div
                                        className={`moisture-fill ${moistureStatus}`}
                                        style={{
                                            width: `${Math.max(5, moisture || 0)}%`,
                                        }}
                                    >
                                        <div className="moisture-shine"></div>
                                    </div>
                                    <div className="moisture-percentage">
                                        {isUnavailable || moisture === undefined ? "..." : `${moisture.toFixed(0)}%`}
                                    </div>
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