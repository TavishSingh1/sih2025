"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Sidebar from "./components/Sidebar"
import Header from "./components/Header"
import Dashboard from "./pages/Dashboard"
import IrrigationControl from "./pages/IrrigationControl"
import IrrigationRecommendation from "./pages/IrrigationRecommendation"
import Analytics from "./pages/Analytics"
import CropIntelligence from "./pages/CropIntelligence"
import PWAInstallPrompt from "./components/PWAInstallPrompt"
import OfflineIndicator from "./components/OfflineIndicator"
import "./App.css"

function App({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("SW registered: ", registration)
          })
          .catch((registrationError) => {
            console.log("SW registration failed: ", registrationError)
          })
      })
    }
  }, [darkMode])

  return (
    <Router>
      <div className={`app ${darkMode ? "dark" : ""}`}>
        <OfflineIndicator />
        <PWAInstallPrompt />

        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="main-content">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            user={user}
            onLogout={onLogout}
          />
          <main className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/irrigation" element={<IrrigationControl />} />
              <Route path="/irrigation-recommendation" element={<IrrigationRecommendation />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/crops" element={<CropIntelligence />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
