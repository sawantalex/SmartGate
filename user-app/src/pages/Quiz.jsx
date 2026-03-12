import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useVisitor } from "../utils/VisitorContext"
import { api } from "../utils/api"

export default function Quiz() {
  const navigate = useNavigate()
  const { visitor, setPass } = useVisitor()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleComplete = async () => {
    const vid = visitor?.id || visitor?._id
    if (!vid) return
    setError("")
    setLoading(true)
    try {
      const passData = await api("/api/passes", {
        method: "POST",
        body: JSON.stringify({ visitorId: vid }),
      })
      setPass(passData)
      navigate("/pass")
    } catch (err) {
      setError(err.message || "Failed to create pass")
    } finally {
      setLoading(false)
    }
  }

  if (!visitor) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Please complete registration first.</p>
        <button
          onClick={() => navigate("/register")}
          className="rounded-lg bg-[#3b82f6] px-6 py-2 text-white text-sm font-semibold shadow-sm hover:bg-[#2563eb]"
        >
          Go to Registration
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md sm:p-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
          Safety Quiz
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Complete the safety quiz to proceed.
        </p>
        {error && (
          <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="rounded-xl bg-gray-50 p-6 mb-6 text-sm text-gray-600">
          Quiz questions placeholder.
        </div>
        <button
          onClick={handleComplete}
          disabled={loading}
          className="w-full rounded-lg bg-[#3b82f6] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#2563eb] disabled:opacity-60"
        >
          {loading ? "Creating pass..." : "Complete & Get Pass"}
        </button>
      </div>
    </div>
  )
}
