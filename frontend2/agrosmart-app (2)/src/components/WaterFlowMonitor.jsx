"use client"

import { useEffect, useRef } from "react"
import "./WaterFlowMonitor.css"

const WaterFlowMonitor = ({ zones }) => {
  const canvasRef = useRef(null)

  const activeZones = zones.filter((zone) => zone.status === "active")
  const totalFlow = activeZones.reduce((sum, zone) => sum + zone.flowRate, 0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const { width, height } = canvas

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw flow visualization
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 3

    // Draw main circle
    ctx.strokeStyle = "rgba(34, 197, 94, 0.3)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.stroke()

    // Draw flow indicators for active zones
    activeZones.forEach((zone, index) => {
      const angle = (index / activeZones.length) * 2 * Math.PI - Math.PI / 2
      const flowIntensity = zone.flowRate / 20 // Normalize flow rate

      // Draw flow line
      ctx.strokeStyle = `rgba(34, 197, 94, ${Math.min(1, flowIntensity)})`
      ctx.lineWidth = Math.max(2, flowIntensity * 4)
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius)
      ctx.stroke()

      // Draw zone indicator
      ctx.fillStyle = "rgba(34, 197, 94, 0.8)"
      ctx.beginPath()
      ctx.arc(centerX + Math.cos(angle) * (radius + 10), centerY + Math.sin(angle) * (radius + 10), 4, 0, 2 * Math.PI)
      ctx.fill()

      // Draw zone label
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.font = "12px Inter"
      ctx.textAlign = "center"
      ctx.fillText(
        zone.name.split(" ")[1] || `Zone ${zone.id}`,
        centerX + Math.cos(angle) * (radius + 25),
        centerY + Math.sin(angle) * (radius + 25),
      )
    })

    // Draw center flow rate
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.font = "bold 16px Inter"
    ctx.textAlign = "center"
    ctx.fillText(`${totalFlow.toFixed(1)}`, centerX, centerY - 5)
    ctx.font = "12px Inter"
    ctx.fillText("L/min", centerX, centerY + 15)
  }, [activeZones, totalFlow])

  return (
    <div className="water-flow-monitor">
      <div className="flow-visualization">
        <canvas ref={canvasRef} width={200} height={200} className="flow-canvas" />
      </div>

      <div className="flow-stats">
        <div className="stat-item">
          <span className="stat-label">Total Flow</span>
          <span className="stat-value text-success">{totalFlow.toFixed(1)} L/min</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active Zones</span>
          <span className="stat-value">{activeZones.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pressure</span>
          <span className="stat-value">2.8 bar</span>
        </div>
      </div>
    </div>
  )
}

export default WaterFlowMonitor
