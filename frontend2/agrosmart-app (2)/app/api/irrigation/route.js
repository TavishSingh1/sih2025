import { NextResponse } from 'next/server'

// Crop baseline water requirements (mm/day)
const CROP_BASELINE_REQUIREMENTS = {
  rice: 8.0,
  wheat: 4.5,
  maize: 5.5,
  corn: 5.5,
  millets: 3.5,
  sorghum: 4.0,
  barley: 4.2,
  sugarcane: 12.0,
  cotton: 6.5,
  soybean: 5.0,
  tomato: 6.0,
  potato: 5.5,
  onion: 4.5,
  cabbage: 5.0,
  carrot: 4.0,
  beans: 4.5,
  peas: 4.0,
  cucumber: 6.5,
  lettuce: 3.5,
  spinach: 3.0
}

// Optimal nutrient levels for crops (N-P-K)
const CROP_OPTIMAL_NUTRIENTS = {
  rice: { nitrogen: 120, phosphorous: 60, potassium: 40 },
  wheat: { nitrogen: 100, phosphorous: 50, potassium: 30 },
  maize: { nitrogen: 150, phosphorous: 75, potassium: 50 },
  corn: { nitrogen: 150, phosphorous: 75, potassium: 50 },
  millets: { nitrogen: 40, phosphorous: 20, potassium: 20 },
  sorghum: { nitrogen: 80, phosphorous: 40, potassium: 30 },
  barley: { nitrogen: 90, phosphorous: 45, potassium: 25 },
  sugarcane: { nitrogen: 200, phosphorous: 100, potassium: 80 },
  cotton: { nitrogen: 120, phosphorous: 60, potassium: 60 },
  soybean: { nitrogen: 30, phosphorous: 60, potassium: 40 },
  tomato: { nitrogen: 150, phosphorous: 100, potassium: 200 },
  potato: { nitrogen: 120, phosphorous: 80, potassium: 160 },
  onion: { nitrogen: 100, phosphorous: 50, potassium: 50 },
  cabbage: { nitrogen: 150, phosphorous: 75, potassium: 100 },
  carrot: { nitrogen: 80, phosphorous: 40, potassium: 100 },
  beans: { nitrogen: 25, phosphorous: 50, potassium: 50 },
  peas: { nitrogen: 20, phosphorous: 40, potassium: 40 },
  cucumber: { nitrogen: 120, phosphorous: 60, potassium: 120 },
  lettuce: { nitrogen: 100, phosphorous: 50, potassium: 80 },
  spinach: { nitrogen: 120, phosphorous: 60, potassium: 100 }
}

// Parse CSV data (simulated - in real app, this would read from the actual CSV)
let cropData = null

async function loadCropData() {
  if (cropData) return cropData

  try {
    const response = await fetch('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/data_core-p27MBVeKwnlMfMaB3zigTErBOjbam5.csv')
    const csvText = await response.text()
    
    const lines = csvText.split('\n')
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    
    cropData = {}
    
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue
      
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
      const cropType = values[headers.indexOf('Crop Type')]?.toLowerCase()
      
      if (cropType) {
        cropData[cropType] = {
          temperature: parseFloat(values[headers.indexOf('Temparature')] || '25'),
          humidity: parseFloat(values[headers.indexOf('Humidity')] || '50'),
          moisture: parseFloat(values[headers.indexOf('Moisture')] || '50'),
          soilType: values[headers.indexOf('Soil Type')]?.toLowerCase() || 'loamy',
          nitrogen: parseFloat(values[headers.indexOf('Nitrogen')] || '50'),
          potassium: parseFloat(values[headers.indexOf('Potassium')] || '30'),
          phosphorous: parseFloat(values[headers.indexOf('Phosphorous')] || '25'),
          fertilizerName: values[headers.indexOf('Fertilizer Name')] || '28-28'
        }
      }
    }
    
    return cropData
  } catch (error) {
    console.error('Error loading crop data:', error)
    return {}
  }
}

function calculateNormalizedScores(data) {
  // Temperature score: (Temperature - 10) / (40 - 10), clamped 0-1
  const S_temp = Math.max(0, Math.min(1, (data.temperature - 10) / (40 - 10)))
  
  // Humidity score: 1 - (Humidity / 100)
  const S_hum = Math.max(0, 1 - (data.humidity / 100))
  
  // Moisture score: 1 - (Moisture / 100)
  const S_moist = Math.max(0, 1 - (data.moisture / 100))
  
  return { S_temp, S_hum, S_moist }
}

function calculateNutrientDeficiency(cropName, data) {
  const optimal = CROP_OPTIMAL_NUTRIENTS[cropName.toLowerCase()]
  if (!optimal) return 0.5 // Default if crop not found
  
  const nDeficiency = Math.max(0, (optimal.nitrogen - data.nitrogen) / optimal.nitrogen)
  const pDeficiency = Math.max(0, (optimal.phosphorous - data.phosphorous) / optimal.phosphorous)
  const kDeficiency = Math.max(0, (optimal.potassium - data.potassium) / optimal.potassium)
  
  return (nDeficiency + pDeficiency + kDeficiency) / 3
}

function getSoilMultiplier(soilType) {
  const multipliers = {
    sandy: 1.2,
    loamy: 1.0,
    loam: 1.0,
    silty: 0.95,
    clay: 0.85
  }
  return multipliers[soilType.toLowerCase()] || 1.0
}

function getFertilizerMultiplier(fertilizerName) {
  if (!fertilizerName) return 1.0
  
  const name = fertilizerName.toLowerCase()
  if (name.includes('urea')) return 1.05
  if (name.includes('potash')) return 1.03
  if (name.includes('phosphate')) return 1.0
  
  // For NPK fertilizers like "28-28"
  if (name.match(/\d+-\d+/)) return 1.02
  
  return 1.0
}

function categorizeIrrigation(mmPerDay) {
  if (mmPerDay < 3.0) return 'Low'
  if (mmPerDay <= 6.0) return 'Medium'
  return 'High'
}

export async function POST(request) {
  try {
    const { cropName } = await request.json()
    
    if (!cropName) {
      return NextResponse.json({ error: 'Crop name is required' }, { status: 400 })
    }
    
    // Load crop data
    const data = await loadCropData()
    const cropKey = cropName.toLowerCase()
    const cropInfo = data[cropKey]
    
    if (!cropInfo) {
      return NextResponse.json({ 
        error: 'Crop not found in dataset',
        availableCrops: Object.keys(data)
      }, { status: 404 })
    }
    
    // Get baseline requirement
    const CWR_base_mm = CROP_BASELINE_REQUIREMENTS[cropKey] || 5.0
    
    // Calculate normalized scores
    const { S_temp, S_hum, S_moist } = calculateNormalizedScores(cropInfo)
    
    // Calculate nutrient deficiency
    const S_nutrient = calculateNutrientDeficiency(cropName, cropInfo)
    
    // Calculate irrigation index
    const I_index = 0.30 * S_temp + 0.25 * S_hum + 0.30 * S_moist + 0.15 * S_nutrient
    
    // Get multipliers
    const M_soil = getSoilMultiplier(cropInfo.soilType)
    const M_fert = getFertilizerMultiplier(cropInfo.fertilizerName)
    
    // Final calculation
    const irrigation_mm_per_day = CWR_base_mm * (1 + I_index) * M_soil * M_fert
    const irrigation_liters_per_ha_per_day = irrigation_mm_per_day * 10000
    
    // Categorize
    const irrigation_level = categorizeIrrigation(irrigation_mm_per_day)
    
    return NextResponse.json({
      crop: cropName,
      irrigation_mm_per_day: Math.round(irrigation_mm_per_day * 100) / 100,
      irrigation_liters_per_ha_per_day: Math.round(irrigation_liters_per_ha_per_day),
      irrigation_level,
      explanation: {
        S_temp: Math.round(S_temp * 100) / 100,
        S_hum: Math.round(S_hum * 100) / 100,
        S_moist: Math.round(S_moist * 100) / 100,
        S_nutrient: Math.round(S_nutrient * 100) / 100,
        I_index: Math.round(I_index * 100) / 100,
        M_soil,
        M_fert: Math.round(M_fert * 100) / 100
      },
      cropData: cropInfo
    })
    
  } catch (error) {
    console.error('Error processing irrigation request:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
