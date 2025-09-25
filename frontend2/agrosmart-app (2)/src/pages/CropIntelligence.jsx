"use client"

import { useState, useEffect } from "react"
import "./CropIntelligence.css"

const CropIntelligence = () => {
  const [selectedCrop, setSelectedCrop] = useState("rice")
  const [cropData, setCropData] = useState({})
  const [recommendations, setRecommendations] = useState([])

  const crops = [
    { id: "rice", name: "Rice", icon: "🌾", season: "Kharif" },
    { id: "wheat", name: "Wheat", icon: "🌾", season: "Rabi" },
    { id: "maize", name: "Maize", icon: "🌽", season: "Kharif/Rabi" },
    { id: "tomato", name: "Tomato", icon: "🍅", season: "Year-round" },
    { id: "potato", name: "Potato", icon: "🥔", season: "Rabi" },
    { id: "onion", name: "Onion", icon: "🧅", season: "Rabi" },
    { id: "cabbage", name: "Cabbage", icon: "🥬", season: "Rabi" },
    { id: "cauliflower", name: "Cauliflower", icon: "🥦", season: "Rabi" },
    { id: "carrot", name: "Carrot", icon: "🥕", season: "Rabi" },
    { id: "beans", name: "Beans", icon: "🫘", season: "Kharif/Rabi" },
    { id: "peas", name: "Peas", icon: "🟢", season: "Rabi" },
    { id: "spinach", name: "Spinach", icon: "🥬", season: "Rabi" },
    { id: "lettuce", name: "Lettuce", icon: "🥬", season: "Year-round" },
    { id: "radish", name: "Radish", icon: "🔴", season: "Rabi" },
    { id: "cucumber", name: "Cucumber", icon: "🥒", season: "Kharif" },
    { id: "brinjal", name: "Brinjal", icon: "🍆", season: "Kharif" },
    { id: "okra", name: "Okra", icon: "🌶️", season: "Kharif" },
    { id: "chili", name: "Chili", icon: "🌶️", season: "Kharif" },
    { id: "ginger", name: "Ginger", icon: "🫚", season: "Kharif" },
    { id: "turmeric", name: "Turmeric", icon: "🟡", season: "Kharif" },
  ]

  const sikkimCropData = {
    rice: {
      sowingTime: "May-June",
      plantingTime: "June-July",
      harvestTime: "October-November",
      pros: [
        "High yield potential",
        "Suitable for terraced fields",
        "Good market demand",
        "Traditional crop knowledge",
      ],
      cons: ["Water intensive", "Vulnerable to climate change", "Labor intensive", "Pest susceptible"],
      suitability: "Excellent",
      expectedYield: "4-5 tons/hectare",
      waterRequirement: "1200-1500mm",
      soilType: "Clay loam, well-drained",
    },
    wheat: {
      sowingTime: "October-November",
      plantingTime: "November-December",
      harvestTime: "April-May",
      pros: ["Cool climate suitable", "Good storage life", "Multiple varieties available", "Government support"],
      cons: ["Limited growing season", "Requires irrigation", "Susceptible to rust", "Lower yield in hills"],
      suitability: "Good",
      expectedYield: "2-3 tons/hectare",
      waterRequirement: "450-650mm",
      soilType: "Well-drained loamy soil",
    },
    maize: {
      sowingTime: "March-April, July-August",
      plantingTime: "April-May, August-September",
      harvestTime: "July-August, December-January",
      pros: ["Adaptable to various altitudes", "Good fodder crop", "Multiple uses", "Drought tolerant"],
      cons: ["Bird damage", "Storage issues", "Market price fluctuation", "Requires good drainage"],
      suitability: "Excellent",
      expectedYield: "3-4 tons/hectare",
      waterRequirement: "500-800mm",
      soilType: "Well-drained fertile soil",
    },
    tomato: {
      sowingTime: "February-March, June-July",
      plantingTime: "March-April, July-August",
      harvestTime: "June-July, October-November",
      pros: ["High value crop", "Good market demand", "Suitable climate", "Multiple harvests"],
      cons: ["Disease prone", "Requires intensive care", "Transportation issues", "Price volatility"],
      suitability: "Very Good",
      expectedYield: "15-20 tons/hectare",
      waterRequirement: "400-600mm",
      soilType: "Well-drained sandy loam",
    },
    potato: {
      sowingTime: "September-October",
      plantingTime: "October-November",
      harvestTime: "January-February",
      pros: ["Cool climate ideal", "High nutritional value", "Good storage", "Multiple varieties"],
      cons: ["Late blight susceptible", "Requires quality seeds", "Storage facilities needed", "Market glut issues"],
      suitability: "Excellent",
      expectedYield: "12-15 tons/hectare",
      waterRequirement: "500-700mm",
      soilType: "Sandy loam, well-drained",
    },
    cabbage: {
      sowingTime: "July-August",
      plantingTime: "August-September",
      harvestTime: "November-December",
      pros: ["Cool season crop", "Good market price", "Nutritious", "Suitable for hills"],
      cons: ["Pest problems", "Requires regular irrigation", "Transportation challenges", "Short shelf life"],
      suitability: "Very Good",
      expectedYield: "25-30 tons/hectare",
      waterRequirement: "380-500mm",
      soilType: "Rich organic matter soil",
    },
  }

  useEffect(() => {
    const currentCrop = sikkimCropData[selectedCrop] || sikkimCropData.rice
    setCropData(currentCrop)

    // Generate recommendations based on Sikkim conditions
    const generateRecommendations = () => {
      const recs = [
        {
          type: "timing",
          priority: "high",
          title: "Optimal Planting Window",
          description: `Best sowing time for ${selectedCrop} in Sikkim is ${currentCrop.sowingTime}. Plan accordingly for maximum yield.`,
          action: `Prepare fields by ${currentCrop.sowingTime}`,
        },
        {
          type: "climate",
          priority: "medium",
          title: "Sikkim Climate Advantage",
          description: `${selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)} is ${currentCrop.suitability.toLowerCase()} suited for Sikkim's climate conditions.`,
          action: "Monitor weather patterns and adjust practices",
        },
        {
          type: "soil",
          priority: "medium",
          title: "Soil Preparation",
          description: `Ensure ${currentCrop.soilType} for optimal growth. Test soil pH and nutrient levels.`,
          action: "Conduct soil testing and amendment",
        },
        {
          type: "water",
          priority: "high",
          title: "Water Management",
          description: `This crop requires ${currentCrop.waterRequirement} of water. Plan irrigation accordingly.`,
          action: "Set up efficient irrigation system",
        },
      ]
      setRecommendations(recs)
    }

    generateRecommendations()
  }, [selectedCrop])

  const getPriorityColor = (priority) => {
    const colors = {
      high: "#ef4444",
      medium: "#f59e0b",
      low: "#22c55e",
    }
    return colors[priority] || "#6b7280"
  }

  const getSuitabilityColor = (suitability) => {
    const colors = {
      Excellent: "#22c55e",
      "Very Good": "#3b82f6",
      Good: "#f59e0b",
      Fair: "#f97316",
      Poor: "#ef4444",
    }
    return colors[suitability] || "#6b7280"
  }

  const selectedCropData = crops.find((c) => c.id === selectedCrop)

  return (
    <div className="crop-intelligence">
      <div className="crop-header">
        <h1>Crop Intelligence for Sikkim</h1>
        <div className="crop-selectors">
          <select value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)} className="crop-select">
            {crops.map((crop) => (
              <option key={crop.id} value={crop.id}>
                {crop.icon} {crop.name} ({crop.season})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="crop-overview">
        <div className="crop-card">
          <div className="crop-icon">{selectedCropData?.icon}</div>
          <div className="crop-info">
            <h2>{selectedCropData?.name}</h2>
            <div className="crop-season">
              <span className="season-badge">{selectedCropData?.season} Season</span>
            </div>
            <div className="suitability-indicator">
              <span
                className="suitability-badge"
                style={{ backgroundColor: getSuitabilityColor(cropData.suitability) }}
              >
                {cropData.suitability} for Sikkim
              </span>
            </div>
          </div>
        </div>

        <div className="crop-stats">
          <div className="stat-item">
            <h3>Expected Yield</h3>
            <div className="stat-value">{cropData.expectedYield}</div>
            <div className="stat-indicator good">Per Hectare</div>
          </div>
          <div className="stat-item">
            <h3>Water Requirement</h3>
            <div className="stat-value">{cropData.waterRequirement}</div>
            <div className="stat-indicator neutral">Total Season</div>
          </div>
          <div className="stat-item">
            <h3>Sowing Time</h3>
            <div className="stat-value">{cropData.sowingTime}</div>
            <div className="stat-indicator good">Sikkim Climate</div>
          </div>
          <div className="stat-item">
            <h3>Harvest Time</h3>
            <div className="stat-value">{cropData.harvestTime}</div>
            <div className="stat-indicator good">Expected</div>
          </div>
        </div>
      </div>

      <div className="sikkim-analysis">
        <div className="analysis-section">
          <h3>✅ Advantages in Sikkim</h3>
          <div className="pros-list">
            {cropData.pros?.map((pro, index) => (
              <div key={index} className="pro-item">
                <span className="pro-icon">✓</span>
                <span>{pro}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analysis-section">
          <h3>⚠️ Challenges & Considerations</h3>
          <div className="cons-list">
            {cropData.cons?.map((con, index) => (
              <div key={index} className="con-item">
                <span className="con-icon">!</span>
                <span>{con}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="intelligence-content">
        <div className="recommendations-section">
          <h2>Sikkim-Specific Recommendations</h2>
          <div className="recommendations-list">
            {recommendations.map((rec, index) => (
              <div key={index} className={`recommendation-card ${rec.priority}`}>
                <div className="rec-header">
                  <div className="rec-type">
                    {rec.type === "timing" && "📅"}
                    {rec.type === "climate" && "🌤️"}
                    {rec.type === "soil" && "🌱"}
                    {rec.type === "water" && "💧"}
                  </div>
                  <div className="rec-content">
                    <h3>{rec.title}</h3>
                    <span className={`priority-badge ${rec.priority}`}>{rec.priority.toUpperCase()}</span>
                  </div>
                </div>
                <p>{rec.description}</p>
                <div className="rec-action">
                  <strong>Action:</strong> {rec.action}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="growing-calendar">
          <h3>Sikkim Growing Calendar</h3>
          <div className="calendar-info">
            <div className="calendar-item">
              <h4>🌱 Sowing Period</h4>
              <p>{cropData.sowingTime}</p>
            </div>
            <div className="calendar-item">
              <h4>🌿 Planting Period</h4>
              <p>{cropData.plantingTime}</p>
            </div>
            <div className="calendar-item">
              <h4>🌾 Harvest Period</h4>
              <p>{cropData.harvestTime}</p>
            </div>
            <div className="calendar-item">
              <h4>🏔️ Soil Type</h4>
              <p>{cropData.soilType}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CropIntelligence
