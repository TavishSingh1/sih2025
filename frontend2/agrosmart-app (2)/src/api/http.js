// Works with CRA (process.env.REACT_APP_*) and Vite (import.meta.env.VITE_*)
const API_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

export async function http(path, { method = "GET", body, headers = {} } = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Defensive: ensure JSON (helps diagnose DOCTYPE errors)
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const text = await res.text();
    throw new Error(
      `Expected JSON but got: ${text.slice(0, 200)} ... (URL: ${API_BASE}${path})`
    );
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || `HTTP ${res.status}`);
  }
  return data;
}

export { API_BASE };
