import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getStoredApiUrl, setStoredApiUrl } from "../utils/api"

export default function LandingPage() {
  const navigate = useNavigate()
  const [serverUrl, setServerUrl] = useState("")
  const [showServer, setShowServer] = useState(false)

  useEffect(() => {
    setServerUrl(getStoredApiUrl())
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-blue-300">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
          SmartGate Visitor Portal
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mx-auto mb-6">
          Pre-register your visit, complete identity verification and safety
          training, and receive your digital pass for secure entry.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="rounded-xl bg-white text-black px-10 py-4 font-semibold text-lg shadow-md transition hover:bg-[#2563eb] hover:shadow-lg active:scale-[0.98]"
        >
          Register Visitor
        </button>
        <div className="mt-8 text-left max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => setShowServer(!showServer)}
            className="text-sm text-gray-600 underline"
          >
            {showServer ? "Hide" : "Mobile? Set server URL"}
          </button>
          {showServer && (
            <div className="mt-2">
              <input
                type="url"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                onBlur={() => setStoredApiUrl(serverUrl)}
                placeholder="http://192.168.1.5:5000"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Use your computer&apos;s IP (e.g. 192.168.1.5:5000). Same WiFi.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
