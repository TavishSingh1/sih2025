"use client"

import { useState, useEffect } from "react"
import "./OfflineIndicator.css"

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineMessage(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineMessage(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline && !showOfflineMessage) return null

  return (
    <div className={`offline-indicator ${isOnline ? "online" : "offline"}`}>
      <div className="offline-content">
        {isOnline ? (
          <>
            <div className="status-icon online">✓</div>
            <span>Back online! Syncing data...</span>
          </>
        ) : (
          <>
            <div className="status-icon offline">⚠</div>
            <span>You're offline. Some features may be limited.</span>
          </>
        )}
      </div>
    </div>
  )
}

export default OfflineIndicator
