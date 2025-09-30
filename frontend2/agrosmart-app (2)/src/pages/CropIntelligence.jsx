"use client"

import { useState, useEffect } from "react"
import "./CropIntelligence.css"

const CropIntelligence = () => {
  const [selectedCrop, setSelectedCrop] = useState("rice")
  const [cropData, setCropData] = useState({})
  const [recommendations, setRecommendations] = useState([])

  // Data for crop selection dropdown
  const crops = [
    { id: "rice", name: "Rice", icon: "🌾", season: "Kharif" },
    { id: "wheat", name: "Wheat", icon: "🌾", season: "Rabi" },
    { id: "maize", name: "Maize", icon: "🌽", season: "Kharif/Rabi" },
    { id: "tomato", name: "Tomato", icon: "🍅", season: "Year-round" },
    { id: "potato", name: "Potato", icon: "🥔", season: "Rabi" },
    { id: "onion", name: "Onion", icon: "🧅", season: "Rabi" },
    { id: "cabbage", name: "Cabbage", icon: "🥬", season: "Rabi" },
  ]

  // Detailed data for the selected crops (Mock Data for Sikkim)
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
      expectedYield: "4-5 tons/ha",
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
      expectedYield: "2-3 tons/ha",
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
      expectedYield: "3-4 tons/ha",
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
      expectedYield: "15-20 tons/ha",
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
      expectedYield: "12-15 tons/ha",
      waterRequirement: "500-700mm",
      soilType: "Sandy loam, well-drained",
    },
    onion: {
      sowingTime: "September-October",
      plantingTime: "October-November",
      harvestTime: "March-April",
      pros: ["Good cash crop", "Long storage life", "High demand"],
      cons: ["Sensitive to waterlogging", "Thrips and diseases are common"],
      suitability: "Good",
      expectedYield: "10-15 tons/ha",
      waterRequirement: "300-400mm",
      soilType: "Loamy, well-drained soil",
    },
    cabbage: {
      sowingTime: "July-August",
      plantingTime: "August-September",
      harvestTime: "November-December",
      pros: ["Cool season crop", "Good market price", "Nutritious", "Suitable for hills"],
      cons: ["Pest problems (diamondback moth)", "Requires regular irrigation", "Short shelf life"],
      suitability: "Very Good",
      expectedYield: "25-30 tons/ha",
      waterRequirement: "380-500mm",
      soilType: "Rich organic matter soil",
    },
  }

  useEffect(() => {
    const currentCrop = sikkimCropData[selectedCrop] || sikkimCropData.rice
    setCropData(currentCrop)

    // Function to generate dynamic recommendations based on challenges
    const generateRecommendations = (crop) => {
      const recs = [
        {
          type: "timing",
          priority: "high",
          title: "Optimal Planting Window",
          description: `Best sowing time for ${selectedCrop} in Sikkim is ${crop.sowingTime}. Adhering to this window is critical for yield.`,
          action: `Prepare fields by ${crop.sowingTime.split(',')[0]}`,
        },
        {
          type: "climate",
          priority: "medium",
          title: "Sikkim Climate Advantage",
          description: `${selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)} is ${crop.suitability.toLowerCase()} suited for Sikkim's cooler, higher-altitude climate.`,
          action: "Monitor local micro-climate conditions closely",
        },
        {
          type: "soil",
          priority: "medium",
          title: "Soil Preparation & Health",
          description: `Ensure ${crop.soilType} for optimal growth. Sikkim soils often benefit from organic matter.`,
          action: "Conduct soil testing and incorporate compost/manure",
        },
      ]
      
      // Add specific recommendations based on cons
      if (crop.cons.includes("Pest susceptible") || crop.cons.includes("Pest problems (diamondback moth)")) {
          recs.push({
              type: "protection",
              priority: "high",
              title: "Pest & Disease Prevention",
              description: `A major challenge is pests. Implement organic control (e.g., neem oil) from the seedling stage.`,
              action: "Apply neem-based organic pesticide pre-emptively.",
          })
      }
      
      if (crop.cons.includes("Water intensive")) {
          recs.push({
              type: "water",
              priority: "high",
              title: "Water Conservation Strategy",
              description: `Due to high water needs, proper bunding and water harvesting on terraced fields are essential for this crop.`,
              action: "Check and repair terrace bunds for water retention.",
          })
      }

      setRecommendations(recs)
    }

    generateRecommendations(currentCrop)
  }, [selectedCrop])

  // Function to map suitability to a color for the badge's inline style
  const getSuitabilityColor = (suitability) => {
    const colors = {
      Excellent: "#38A169", // Green (Success)
      "Very Good": "#4299E1", // Blue (Info)
      Good: "#ECC94B", // Yellow (Warning)
      Fair: "#F6AD55",
      Poor: "#E53E3E", // Red (High Risk)
    }
    return colors[suitability] || "#829AB1"
  }

  // Ensure we always have data to display
  const selectedCropData = crops.find((c) => c.id === selectedCrop) || crops[0]
  const displayCropData = cropData || sikkimCropData.rice

  return (
    <div className="crop-intelligence">
      <div className="crop-header">
        <h1>Crop Intelligence for Sikkim 🏔️</h1>
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
                style={{ backgroundColor: getSuitabilityColor(displayCropData.suitability) }}
              >
                {displayCropData.suitability} for Sikkim
              </span>
            </div>
          </div>
        </div>

        <div className="crop-stats">
          <div className="stat-item">
            <h3>Expected Yield</h3>
            <div className="stat-value">{displayCropData.expectedYield}</div>
            <div className="stat-indicator good">High Potential</div>
          </div>
          <div className="stat-item">
            <h3>Water Need</h3>
            <div className="stat-value">{displayCropData.waterRequirement}</div>
            <div className="stat-indicator neutral">Total Season</div>
          </div>
          <div className="stat-item">
            <h3>Optimal Soil</h3>
            <div className="stat-value">{displayCropData.soilType?.split(',')[0]}</div>
            <div className="stat-indicator neutral">Type</div>
          </div>
          <div className="stat-item">
            <h3>Sowing Time</h3>
            <div className="stat-value">{displayCropData.sowingTime?.split(',')[0] || 'N/A'}</div>
            <div className="stat-indicator good">Sikkim Window</div>
          </div>
        </div>
      </div>

      <div className="sikkim-analysis">
        <div className="analysis-section">
          <h3>✅ Advantages in Sikkim</h3>
          <div className="pros-list">
            {displayCropData.pros?.map((pro, index) => (
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
            {displayCropData.cons?.map((con, index) => (
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
                    {rec.type === "protection" && "🛡️"}
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
          <h3>Growing Calendar 📅</h3>
          <div className="calendar-info">
            <div className="calendar-item">
              <h4>🌱 Sowing Period</h4>
              <p>{displayCropData.sowingTime}</p>
            </div>
            <div className="calendar-item">
              <h4>🌿 Planting Period</h4>
              <p>{displayCropData.plantingTime}</p>
            </div>
            <div className="calendar-item">
              <h4>🌾 Harvest Period</h4>
              <p>{displayCropData.harvestTime}</p>
            </div>
            <div className="calendar-item">
              <h4>🏔️ Soil Type</h4>
              <p>{displayCropData.soilType}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CropIntelligence