"use client"

import { useState } from "react"
import "./Register.css"

const Register = ({ onRegister, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    farmName: "",
    location: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.name,
          email: formData.email,
          password: formData.password,
          farm_name: formData.farmName,
          location: formData.location,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Registration failed")
      }

      if (data.token) {
        localStorage.setItem("token", data.token)
      }

      onRegister(data.user)
    } catch (err) {
      alert(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-overlay"></div>
      </div>

      <div className="auth-content register-content">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <img src="/agrosmart-logo.png" alt="AgroSmart" />
              <h1>AgroSmart</h1>
            </div>
            <h2>Create Account</h2>
            <p>Join the smart irrigation revolution</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
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
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="farmName">Farm Name</label>
                <input
                  type="text"
                  id="farmName"
                  name="farmName"
                  value={formData.farmName}
                  onChange={handleChange}
                  placeholder="Enter farm name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span className="checkmark"></span>I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? <div className="loading-spinner"></div> : "Create Account"}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account?
              <button onClick={onSwitchToLogin} className="switch-link">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
