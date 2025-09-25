"use client"
import { Link, useLocation } from "react-router-dom"
import "./Sidebar.css"

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()

  const menuItems = [
    { path: "/", icon: "dashboard", label: "Dashboard", category: "OVERVIEW" },
    { path: "/irrigation", icon: "irrigation", label: "Irrigation Control", category: "CONTROL" },
    { path: "/irrigation-recommendation", icon: "recommendation", label: "Irrigation AI", category: "CONTROL" },
    { path: "/analytics", icon: "analytics", label: "Analytics", category: "CONTROL" },
    { path: "/crops", icon: "crops", label: "Crop Intelligence", category: "MONITORING" },
  ]

  const getIcon = (iconName) => {
    const icons = {
      dashboard: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      irrigation: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2v20M8 6l4-4 4 4M8 18l4 4 4-4" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      recommendation: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      ),
      analytics: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" />
          <path d="M18 17l-5-5-4 4-4-4" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      crops: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2a3 3 0 0 0-3 3c0 1.5 1.5 3 3 3s3-1.5 3-3a3 3 0 0 0-3-3z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M12 8v13" stroke="currentColor" strokeWidth="2" />
          <path d="M8 16c0-2 2-4 4-4s4 2 4 4" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
    }
    return icons[iconName] || icons.dashboard
  }

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {})

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-24%20at%2000.31.24_7cdfda33.jpg-Fuvc0HnIYSTWWyUmDc4I6Ngq5fnIZu.jpeg"
              alt="AgroSmart"
            />
            <span>AgroSmart</span>
          </div>
          <button className="sidebar-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="nav-group">
              <div className="nav-group-label">{category}</div>
              {items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${location.pathname === item.path ? "nav-item-active" : ""}`}
                  onClick={onClose}
                >
                  <span className="nav-item-icon">{getIcon(item.icon)}</span>
                  <span className="nav-item-label">{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="connection-status">
            <div className="status-indicator status-online"></div>
            <div className="status-text">
              <div className="status-title">System Online</div>
              <div className="status-subtitle">9 ESP32 devices connected</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
