"use client"

import { useEffect, useRef } from "react"
import "./Chart.css"

const Chart = ({ data }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !data || data.length === 0) return

    const ctx = canvas.getContext("2d")
    const { width, height } = canvas

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Chart configuration
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Data processing
    const maxSoilMoisture = Math.max(...data.map((d) => d.soilMoisture || 0))
    const maxTemperature = Math.max(...data.map((d) => d.temperature || 0))
    const maxHumidity = Math.max(...data.map((d) => d.humidity || 0))
    const maxValue = Math.max(maxSoilMoisture, maxTemperature, maxHumidity, 100)

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Vertical grid lines
    const stepX = chartWidth / Math.max(data.length - 1, 1)
    for (let i = 0; i < data.length; i++) {
      const x = padding + stepX * i
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
      ctx.stroke()
    }

    // Draw lines
    const drawLine = (values, color) => {
      if (values.length < 2) return

      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()

      values.forEach((value, index) => {
        const x = padding + (chartWidth / (values.length - 1)) * index
        const y = height - padding - (value / maxValue) * chartHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Draw points
      ctx.fillStyle = color
      values.forEach((value, index) => {
        const x = padding + (chartWidth / (values.length - 1)) * index
        const y = height - padding - (value / maxValue) * chartHeight

        ctx.beginPath()
        ctx.arc(x, y, 3, 0, 2 * Math.PI)
        ctx.fill()
      })
    }

    // Draw data lines
    drawLine(
      data.map((d) => d.soilMoisture || 0),
      "#3b82f6",
    )
    drawLine(
      data.map((d) => d.temperature || 0),
      "#ef4444",
    )
    drawLine(
      data.map((d) => d.humidity || 0),
      "#22c55e",
    )

    // Draw Y-axis labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
    ctx.font = "12px Inter"
    ctx.textAlign = "right"
    ctx.textBaseline = "middle"

    for (let i = 0; i <= 5; i++) {
      const value = (maxValue / 5) * (5 - i)
      const y = padding + (chartHeight / 5) * i
      ctx.fillText(value.toFixed(0), padding - 10, y)
    }

    // Draw X-axis labels (time)
    ctx.textAlign = "center"
    ctx.textBaseline = "top"

    const labelStep = Math.max(1, Math.floor(data.length / 5))
    data.forEach((item, index) => {
      if (index % labelStep === 0) {
        const x = padding + (chartWidth / (data.length - 1)) * index
        ctx.fillText(item.time || "", x, height - padding + 10)
      }
    })
  }, [data])

  return (
    <div className="chart-wrapper">
      <canvas ref={canvasRef} width={800} height={300} className="chart-canvas" />
    </div>
  )
}

export default Chart
