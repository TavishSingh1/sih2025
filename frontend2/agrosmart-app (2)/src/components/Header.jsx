"use client"

import { useState } from "react"
import "./Header.css"

const Header = ({ onMenuClick, darkMode, onToggleDarkMode, user, onLogout }) => {
  const [notifications] = useState([
    { id: 1, message: "Soil moisture low in Zone A", type: "warning", time: "2 min ago" },
    { id: 2, message: "Irrigation completed in Zone B", type: "success", time: "5 min ago" },
    { id: 3, message: "ESP32 Device #3 offline", type: "error", time: "10 min ago" },
  ])

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-button" onClick={onMenuClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <div className="header-title">
          <img src="/agrosmart-logo.png" alt="AgroSmart" className="logo" />
          <h1>AgroSmart</h1>
        </div>
      </div>

      <div className="header-right">
        {user && (
          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
            <button className="logout-button" onClick={onLogout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" />
                <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" />
                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        )}

        <button className="theme-toggle" onClick={onToggleDarkMode}>
          {darkMode ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
              <path
                d="m12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" />
            </svg>
          )}
        </button>

        <div className="notifications">
          <button className="notification-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="notification-badge">{notifications.length}</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
