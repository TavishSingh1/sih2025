// src/api/api.js
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000"; // fallback to localhost

export async function fetchDashboardData() {
  const res = await fetch(`${API_BASE}/api/dashboard`);
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}
