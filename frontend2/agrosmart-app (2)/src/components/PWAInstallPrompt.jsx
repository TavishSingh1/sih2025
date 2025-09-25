"use client"

import { useState, useEffect } from "react"
import "./PWAInstallPrompt.css"

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setShowInstallPrompt(false)
    }

    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    localStorage.setItem("pwa-install-dismissed", "true")
  }

  // Don't show if already installed or dismissed
  if (isInstalled || !showInstallPrompt || localStorage.getItem("pwa-install-dismissed")) {
    return null
  }

  return (
    <div className="pwa-install-prompt">
      <div className="install-content">
        <div className="install-icon">📱</div>
        <div className="install-text">
          <h3>Install AgroSmart</h3>
          <p>Get quick access to your irrigation system from your home screen</p>
        </div>
        <div className="install-actions">
          <button className="install-btn" onClick={handleInstallClick}>
            Install
          </button>
          <button className="dismiss-btn" onClick={handleDismiss}>
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

export default PWAInstallPrompt
