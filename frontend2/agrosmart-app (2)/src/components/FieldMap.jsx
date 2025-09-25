"use client"

import { useState } from "react"
import "./FieldMap.css"

const FieldMap = () => {
  const [selectedZone, setSelectedZone] = useState(null)

  const zones = [
    { id: 1, name: "Zone A", x: 20, y: 30, status: "good", moisture: 65, crop: "Tomatoes" },
    { id: 2, name: "Zone B", x: 60, y: 25, status: "warning", moisture: 35, crop: "Peppers" },
    { id: 3, name: "Zone C", x: 40, y: 60, status: "good", moisture: 72, crop: "Lettuce" },
    { id: 4, name: "Zone D", x: 75, y: 70, status: "critical", moisture: 18, crop: "Carrots" },
    { id: 5, name: "Zone E", x: 15, y: 75, status: "good", moisture: 58, crop: "Spinach" },
  ]

  const getStatusColor = (status) => {
    const colors = {
      good: "#22c55e",
      warning: "#f59e0b",
      critical: "#ef4444",
    }
    return colors[status] || colors.good
  }

  return (
    <div className="field-map">
      <div className="field-map-container">
        <svg viewBox="0 0 100 100" className="field-svg">
          {/* Field boundary */}
          <rect
            x="5"
            y="10"
            width="90"
            height="80"
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />

          {/* Irrigation lines */}
          <line x1="10" y1="20" x2="90" y2="20" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="0.5" />
          <line x1="10" y1="40" x2="90" y2="40" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="0.5" />
          <line x1="10" y1="60" x2="90" y2="60" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="0.5" />
          <line x1="10" y1="80" x2="90" y2="80" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="0.5" />

          {/* Sensor zones */}
          {zones.map((zone) => (
            <g key={zone.id}>
              <circle
                cx={zone.x}
                cy={zone.y}
                r="3"
                fill={getStatusColor(zone.status)}
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth="0.5"
                className="zone-sensor"
                onClick={() => setSelectedZone(zone)}
              />
              <circle
                cx={zone.x}
                cy={zone.y}
                r="6"
                fill="none"
                stroke={getStatusColor(zone.status)}
                strokeWidth="0.3"
                opacity="0.5"
                className="zone-pulse"
              />
              <text
                x={zone.x}
                y={zone.y - 5}
                textAnchor="middle"
                fontSize="2"
                fill="rgba(255, 255, 255, 0.8)"
                className="zone-label"
              >
                {zone.name}
              </text>
            </g>
          ))}
        </svg>

        {selectedZone && (
          <div className="zone-tooltip">
            <div className="tooltip-header">
              <h4>{selectedZone.name}</h4>
              <button onClick={() => setSelectedZone(null)} className="tooltip-close">
                ×
              </button>
            </div>
            <div className="tooltip-content">
              <div className="tooltip-item">
                <span>Crop:</span>
                <span>{selectedZone.crop}</span>
              </div>
              <div className="tooltip-item">
                <span>Moisture:</span>
                <span style={{ color: getStatusColor(selectedZone.status) }}>{selectedZone.moisture}%</span>
              </div>
              <div className="tooltip-item">
                <span>Status:</span>
                <span style={{ color: getStatusColor(selectedZone.status) }}>
                  {selectedZone.status.charAt(0).toUpperCase() + selectedZone.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="field-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: "#22c55e" }}></div>
          <span>Optimal</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: "#f59e0b" }}></div>
          <span>Needs Water</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ backgroundColor: "#ef4444" }}></div>
          <span>Critical</span>
        </div>
      </div>
    </div>
  )
}

export default FieldMap
