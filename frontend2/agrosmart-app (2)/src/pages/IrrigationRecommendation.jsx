"use client"

import { useState } from "react"
import "./IrrigationRecommendation.css"

const IrrigationRecommendation = () => {
  const [cropName, setCropName] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!cropName.trim()) return

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/irrigation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cropName: cropName.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get irrigation recommendation")
      }

      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getIrrigationLevelColor = (level) => {
    switch (level) {
      case "Low":
        return "#22c55e"
      case "Medium":
        return "#f59e0b"
      case "High":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num)
  }

  return (
    <div className="irrigation-recommendation">
      <div className="page-header">
        <h1>Irrigation Recommendation</h1>
        <p>Get AI-powered irrigation recommendations based on crop data and environmental conditions</p>
      </div>

      <div className="recommendation-container">
        <div className="input-section">
          <form onSubmit={handleSubmit} className="crop-form">
            <div className="form-group">
              <label htmlFor="cropName">Enter Crop Name</label>
              <input
                type="text"
                id="cropName"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                placeholder="e.g., rice, wheat, maize, tomato..."
                className="crop-input"
                disabled={loading}
              />
            </div>
            <button type="submit" className="check-button" disabled={loading || !cropName.trim()}>
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Analyzing...
                </>
              ) : (
                "Check Irrigation Needs"
              )}
            </button>
          </form>
        </div>

        {error && (
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <div>
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="results-section">
            <div className="result-header">
              <h2>Irrigation Recommendation for {result.crop}</h2>
              <div
                className="irrigation-level-badge"
                style={{ backgroundColor: getIrrigationLevelColor(result.irrigation_level) }}
              >
                {result.irrigation_level} Water Need
              </div>
            </div>

            <div className="recommendation-cards">
              <div className="recommendation-card primary">
                <div className="card-icon">💧</div>
                <div className="card-content">
                  <h3>Daily Irrigation</h3>
                  <div className="metric-value">{result.irrigation_mm_per_day} mm/day</div>
                  <div className="metric-subtitle">
                    ~{formatNumber(result.irrigation_liters_per_ha_per_day)} L/hectare/day
                  </div>
                </div>
              </div>

              <div className="recommendation-card">
                <div className="card-icon">🌡️</div>
                <div className="card-content">
                  <h3>Temperature Impact</h3>
                  <div className="metric-value">{result.cropData.temperature}°C</div>
                  <div className="metric-subtitle">Score: {result.explanation.S_temp}</div>
                </div>
              </div>

              <div className="recommendation-card">
                <div className="card-icon">💨</div>
                <div className="card-content">
                  <h3>Humidity Level</h3>
                  <div className="metric-value">{result.cropData.humidity}%</div>
                  <div className="metric-subtitle">Score: {result.explanation.S_hum}</div>
                </div>
              </div>

              <div className="recommendation-card">
                <div className="card-icon">🌱</div>
                <div className="card-content">
                  <h3>Soil Moisture</h3>
                  <div className="metric-value">{result.cropData.moisture}%</div>
                  <div className="metric-subtitle">Score: {result.explanation.S_moist}</div>
                </div>
              </div>
            </div>

            <div className="detailed-analysis">
              <h3>Detailed Analysis</h3>
              <div className="analysis-grid">
                <div className="analysis-item">
                  <span className="analysis-label">Soil Type:</span>
                  <span className="analysis-value">
                    {result.cropData.soilType} (×{result.explanation.M_soil})
                  </span>
                </div>
                <div className="analysis-item">
                  <span className="analysis-label">Fertilizer:</span>
                  <span className="analysis-value">
                    {result.cropData.fertilizerName} (×{result.explanation.M_fert})
                  </span>
                </div>
                <div className="analysis-item">
                  <span className="analysis-label">Nitrogen Level:</span>
                  <span className="analysis-value">{result.cropData.nitrogen} kg/ha</span>
                </div>
                <div className="analysis-item">
                  <span className="analysis-label">Phosphorous Level:</span>
                  <span className="analysis-value">{result.cropData.phosphorous} kg/ha</span>
                </div>
                <div className="analysis-item">
                  <span className="analysis-label">Potassium Level:</span>
                  <span className="analysis-value">{result.cropData.potassium} kg/ha</span>
                </div>
                <div className="analysis-item">
                  <span className="analysis-label">Irrigation Index:</span>
                  <span className="analysis-value">{result.explanation.I_index}</span>
                </div>
              </div>
            </div>

            <div className="recommendations">
              <h3>💡 Smart Recommendations</h3>
              <div className="recommendation-list">
                {result.irrigation_level === "High" && (
                  <div className="recommendation-item high">
                    <strong>High Water Requirement:</strong> Consider drip irrigation or sprinkler systems for efficient
                    water delivery. Monitor soil moisture frequently.
                  </div>
                )}
                {result.irrigation_level === "Medium" && (
                  <div className="recommendation-item medium">
                    <strong>Moderate Water Requirement:</strong> Regular irrigation schedule recommended. Check soil
                    moisture every 2-3 days.
                  </div>
                )}
                {result.irrigation_level === "Low" && (
                  <div className="recommendation-item low">
                    <strong>Low Water Requirement:</strong> Minimal irrigation needed. Focus on water conservation
                    techniques.
                  </div>
                )}

                {result.explanation.S_nutrient > 0.6 && (
                  <div className="recommendation-item nutrient">
                    <strong>Nutrient Deficiency Detected:</strong> Consider soil testing and appropriate fertilizer
                    application to optimize water uptake.
                  </div>
                )}

                {result.cropData.soilType === "sandy" && (
                  <div className="recommendation-item soil">
                    <strong>Sandy Soil:</strong> Increase irrigation frequency but reduce quantity per session to
                    prevent water loss.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default IrrigationRecommendation
