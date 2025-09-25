"use client"

import { useState } from "react"
import App from "../src/App"
import Login from "../src/pages/Login"
import Register from "../src/pages/Register"

export default function Page() {
  const [currentView, setCurrentView] = useState("login") // 'login', 'register', 'app'
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
    setCurrentView("app")
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentView("login")
  }

  const switchToRegister = () => setCurrentView("register")
  const switchToLogin = () => setCurrentView("login")

  if (currentView === "login") {
    return <Login onLogin={handleLogin} onSwitchToRegister={switchToRegister} />
  }

  if (currentView === "register") {
    return <Register onRegister={handleLogin} onSwitchToLogin={switchToLogin} />
  }

  return <App user={user} onLogout={handleLogout} />
}
