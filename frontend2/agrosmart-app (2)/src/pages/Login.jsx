"use client"

import { useState } from "react"
import "./Login.css"

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Login failed")
      }

      if (data.token) {
        localStorage.setItem("token", data.token)
      }

      onLogin(data.user)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="auth-container">
      <div className="auth-background"><div className="auth-overlay"></div></div>
      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <img src="/agrosmart-logo.png" alt="AgroSmart" />
              <h1>AgroSmart</h1>
            </div>
            <h2>Welcome Back</h2>
            <p>Sign in to your smart irrigation dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? <div className="loading-spinner"></div> : "Sign In"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?
              <button onClick={onSwitchToRegister} className="switch-link">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
