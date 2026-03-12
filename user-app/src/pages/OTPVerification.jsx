import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useVisitor } from "../utils/VisitorContext"
import Loader from "../components/Loader"
import SuccessScreen from "../components/SuccessScreen"
import { api } from "../utils/api"

export default function OTPVerification() {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState("")
  const [sentOtp, setSentOtp] = useState(false)
  const navigate = useNavigate()
  const { visitor } = useVisitor()

  useEffect(() => {
    if (!visitor?.id || sentOtp) return
    api(`/api/visitors/${visitor.id}/send-otp`, { method: "POST" })
      .then((res) => {
        setSentOtp(true)
        if (res.otp) setOtp(res.otp) // pre-fill in dev for testing
      })
      .catch(() => setError("Failed to send OTP"))
  }, [visitor?.id, sentOtp])

  const handleVerify = async (e) => {
    e.preventDefault()
    if (!visitor?.id || otp.length !== 6) return
    setError("")
    setLoading(true)
    try {
      await api(`/api/visitors/${visitor.id}/verify-otp`, {
        method: "POST",
        body: JSON.stringify({ otp }),
      })
      setVerified(true)
    } catch (err) {
      setError(err.message || "Invalid or expired OTP")
    } finally {
      setLoading(false)
    }
  }

  if (!visitor) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No registration data. Please register first.</p>
        <button
          onClick={() => navigate("/register")}
          className="rounded-lg bg-[#3b82f6] px-6 py-2 text-white text-sm font-semibold shadow-sm hover:bg-[#2563eb]"
        >
          Go to Registration
        </button>
      </div>
    )
  }

  if (verified) {
    return (
      <SuccessScreen
        title="Verified"
        message="Your identity has been verified. You can now get your visitor pass."
        actionLabel="Get Visitor Pass"
        onAction={() => navigate("/pass")}
      />
    )
  }

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md sm:p-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
          OTP Verification
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter the 6-digit code sent to {visitor.mobile}
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-center text-lg tracking-[0.5em] text-gray-800 focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20"
          />

          <button
            type="submit"
            disabled={otp.length !== 6 || loading}
            className="mt-6 w-full rounded-lg bg-[#3b82f6] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size="sm" />
                Verifying...
              </>
            ) : (
              "Verify"
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-500">
          OTP is sent to your mobile. Check dev server response for pre-filled code in development.
        </p>
      </div>
    </div>
  )
}
