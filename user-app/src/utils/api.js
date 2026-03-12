const STORAGE_KEY = "smartgate_api_url"

function getApiBase() {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && saved.trim()) return saved.trim().replace(/\/$/, "")
  }
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL.replace(/\/$/, "")
  if (typeof window !== "undefined" && window.location?.hostname && !window.location.hostname.match(/^localhost|127\.0\.0\.1$/)) {
    return `${window.location.protocol}//${window.location.hostname}:5000`
  }
  return "http://localhost:5000"
}

export function getStoredApiUrl() {
  return typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) || "" : ""
}

export function setStoredApiUrl(url) {
  if (typeof window !== "undefined") {
    if (url && url.trim()) localStorage.setItem(STORAGE_KEY, url.trim().replace(/\/$/, ""))
    else localStorage.removeItem(STORAGE_KEY)
  }
}

export function getApiUrl(path) {
  const base = getApiBase()
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}

export async function api(path, options = {}) {
  const url = getApiUrl(path)
  const headers = { "Content-Type": "application/json", ...options.headers }
  let res
  try {
    res = await fetch(url, { headers, ...options })
  } catch (err) {
    if (err.message === "Failed to fetch" || err.name === "TypeError") {
      throw new Error("Cannot reach server. Set 'Server URL' on the home screen to your computer's IP (e.g. http://192.168.1.5:5000).")
    }
    throw err
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || res.statusText)
  return data
}
