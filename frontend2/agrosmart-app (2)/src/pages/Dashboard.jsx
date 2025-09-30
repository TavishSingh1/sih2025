"use client"

import { useState, useEffect } from 'react';
import "./Dashboard.css";

// Hardcoded backend base URL
const BASE_URL = "https://sih-backend-5pqc.onrender.com"
const ESP_ZONES = ["zone1","zone2","zone3","zone4","zone5","zone6","zone7","zone8","zone9"]

// Initial state for all zones' sensor data
const initialSensorState = ESP_ZONES.map(z => ({
    espZone: z,
    temperature: undefined,
    moisture: undefined,
    loading: true,
    error: null
}))

const Dashboard = () => {
    const [zonesSensorData, setZonesSensorData] = useState(initialSensorState);
    const [systemStats, setSystemStats] = useState({
        totalFields: ESP_ZONES.length,
        availableFields: 0,
        avgTemperature: '—',
        avgMoisture: '—',
        pestRiskLevel: 'LOW',
    });

    /* =========================================================================
       FETCHING LOGIC (Adapted from Analytics.js)
       ========================================================================= */

    const fetchZone = async (zoneIdentifier) => {
        const url = `${BASE_URL}/data/${zoneIdentifier}`
        
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
                let serverError = `HTTP ${res.status}`
                try {
                    const ctype = res.headers.get("content-type") || ""
                    if (ctype.includes("application/json")) {
                        const j = await res.json()
                        if (j?.error) serverError = j.error
                    }
                } catch { /* ignore parse error */ }
                
                // Return only error state
                return { espZone: zoneIdentifier, loading: false, error: serverError }
            }

            const json = await res.json()
            
            // Successfully fetched data
            return {
                espZone: zoneIdentifier,
                temperature: json?.temperature,
                moisture: json?.moisture, 
                loading: false,
                error: null,
            }
        } catch (error) {
            let errorMsg = error.name === 'AbortError' ? "Timeout" : "Network Error"
            return { espZone: zoneIdentifier, loading: false, error: errorMsg }
        }
    }

    const refreshAll = async () => {
        const results = await Promise.all(ESP_ZONES.map(fetchZone))
        setZonesSensorData(results)
    }

    /* =========================================================================
       EFFECT HOOKS
       ========================================================================= */

    // 1. Auto-refresh hook (polls every 5s)
    useEffect(() => {
        refreshAll()
        const id = setInterval(refreshAll, 5000)
        return () => clearInterval(id)
    }, []);

    // 2. System Stats Calculation Hook
    useEffect(() => {
        // Filter zones that have successfully fetched data (no loading, no error, and moisture/temp are numbers)
        const availableData = zonesSensorData.filter(z => 
            !z.loading && !z.error && z.temperature !== undefined && z.moisture !== undefined
        );
        
        let avgTemperature = '—';
        let avgMoisture = '—';
        let pestRiskLevel = 'LOW';
        let availableFields = availableData.length;

        if (availableData.length > 0) {
            const totalTemp = availableData.reduce((sum, z) => sum + z.temperature, 0);
            const totalMoisture = availableData.reduce((sum, z) => sum + z.moisture, 0);

            avgTemperature = (totalTemp / availableData.length).toFixed(1);
            avgMoisture = (totalMoisture / availableData.length).toFixed(0);
            
            // Basic Logic for Pest Risk (Example)
            // If avg temp is high (>30C) and avg moisture is high (>60%)
            if (parseFloat(avgTemperature) > 30 && parseFloat(avgMoisture) > 60) {
                pestRiskLevel = 'HIGH';
            } else if (parseFloat(avgTemperature) > 25 || parseFloat(avgMoisture) > 50) {
                pestRiskLevel = 'MODERATE';
            }
        }

        setSystemStats({
            totalFields: ESP_ZONES.length,
            availableFields: availableFields,
            avgTemperature: avgTemperature,
            avgMoisture: avgMoisture,
            pestRiskLevel: pestRiskLevel,
        });

    }, [zonesSensorData]);

    /* =========================================================================
       JSX RENDER
       ========================================================================= */

    const { totalFields, availableFields, avgTemperature, avgMoisture, pestRiskLevel } = systemStats;
    const isErrorState = availableFields === 0 && !zonesSensorData.some(z => z.loading);

    return (
        <div className="dashboard">
            {/* ---- HEADER ---- */}
            <div className="dashboard-header">
                <div className="dashboard-title">
                    <h1>North East Smart Farming</h1>
                    <p>General overview of farming activities across North East India</p>
                </div>
                <div className="dashboard-stats">
                    {/* STAT 1: Total Fields */}
                    <div className="stat-card highlight">
                        <span className="stat-label">🌱 Fields with Data</span>
                        <span className="stat-value">{availableFields} / {totalFields}</span>
                    </div>
                    
                    {/* STAT 2: Avg Temperature */}
                    <div className="stat-card temperature-data">
                        <span className="stat-label">🌡️ Avg Temp (Available)</span>
                        <span className="stat-value">{avgTemperature}°C</span>
                    </div>
                    
                    {/* STAT 3: Avg Soil Moisture */}
                    <div className="stat-card moisture-data">
                        <span className="stat-label">💧 Avg Moisture</span>
                        <span className="stat-value">{avgMoisture}%</span>
                    </div>

                    {/* STAT 4: Pest Risk Level */}
                    <div className="stat-card risk-data">
                        <span className="stat-label">⚠️ Pest Risk Level</span>
                        <span className={`stat-value risk-${pestRiskLevel.toLowerCase()}`}>{pestRiskLevel}</span>
                    </div>
                </div>
            </div>
            
            {/* ---- ERROR/LOADING Message ---- */}
            {zonesSensorData.some(z => z.loading) && (
                <div className="global-message loading">
                    <p>Fetching initial data from all zones... Please wait (up to 30s for server wake-up). ⏳</p>
                </div>
            )}
            {isErrorState && (
                <div className="global-message error">
                    <p>🚨 Connection Error: Unable to fetch data from any zone. Please check the backend service. Error Example: {zonesSensorData.find(z => z.error)?.error || "N/A"}</p>
                </div>
            )}

            {/* ---- HERO SECTION ---- */}
            <div className="hero-section">
                <h2>Welcome to the North East Farms 🌄</h2>
                <p>
                    This dashboard offers a simple and general view of farming activities across the region. 
                    Stay connected with seasonal highlights, events, and community updates.
                </p>
            </div>

            {/* ---- HIGHLIGHTS ---- */}
            <div className="section">
                <h2>📌 Key Highlights</h2>
                <div className="highlight-grid">
                    <div className="highlight-card">
                        <h3>Organic Farming</h3>
                        <p>Sikkim is India’s first fully organic state 🌱</p>
                    </div>
                    <div className="highlight-card">
                        <h3>Upcoming Season</h3>
                        <p>Recommended crops: Maize, Soybean, Buckwheat 🌾</p>
                    </div>
                    <div className="highlight-card">
                        <h3>Community Event</h3>
                        <p>Terrace Farming Workshop – Regional Hub, Oct 12 👩‍🌾</p>
                    </div>
                </div>
            </div>

            {/* ---- NEWS ---- */}
            <div className="section">
                <h2>📰 Latest Updates</h2>
                <ul className="news-list">
                    <li>📢 Organic Festival in Gangtok – Next Week</li>
                    <li>🌱 Training program for young farmers in the region announced</li>
                    <li>🚜 Irrigation projects planned for South Sikkim</li>
                    <li>🌾 Cardamom and paddy harvest expected to be strong this year</li>
                </ul>
            </div>

            {/* ---- FOOTER ---- */}
            <div className="dashboard-footer">
                <p>🌍 Powered by Smart Farming Initiative – North East India</p>
            </div>
        </div>
    );
}

export default Dashboard;