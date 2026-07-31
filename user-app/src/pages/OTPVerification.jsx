import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useVisitor } from "../utils/VisitorContext"
import Loader from "../components/Loader"
import { api } from "../utils/api"
import { Smartphone, CheckCircle, ShieldCheck, RefreshCw, ArrowRight, KeyRound } from "lucide-react"

export default function OTPVerification() {
  const [otp, setOtp] = useState("") // Empty by default for manual entry
  const [demoCode, setDemoCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [sentNotice, setSentNotice] = useState("")
  const navigate = useNavigate()
  const { visitor, setVisitor } = useVisitor()

  const vid = visitor?.id || visitor?._id
  const targetPhone = visitor?.phone || visitor?.mobile || ""

  useEffect(() => {
    if (!visitor) return

    if (visitor?.otp) {
      setDemoCode(visitor.otp)
      setSentNotice(`6-Digit Verification Passcode has been sent to ${targetPhone}`)
    } else if (targetPhone) {
      api("/api/visitors/send-otp", {
        method: "POST",
        body: JSON.stringify({ phone: targetPhone }),
      })
        .then((res) => {
          if (res.otp) {
            setDemoCode(res.otp)
            setSentNotice(`6-Digit Verification Passcode has been sent to ${targetPhone}`)
          }
        })
        .catch(() => setError("Failed to send verification OTP"))
    }
  }, [visitor, targetPhone])

  const handleVerify = async (e) => {
    if (e) e.preventDefault()
    if (!vid || otp.length !== 6) return
    setError("")
    setLoading(true)
    try {
      // Verify manual OTP input with backend
      await api("/api/visitors/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          phone: targetPhone,
          otp: otp.trim(),
          visitorId: vid,
        }),
      })

      // Mark visitor as verified in DB
      const updated = await api(`/api/visitors/${vid}`, {
        method: "PATCH",
        body: JSON.stringify({ otpVerified: true }),
      })

      setVisitor(updated)
      navigate("/selfie")
    } catch (err) {
      setError(err.message || "Invalid OTP code. Please check the code sent to your mobile.")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError("")
    try {
      const res = await api("/api/visitors/send-otp", {
        method: "POST",
        body: JSON.stringify({ phone: targetPhone }),
      })
      if (res.otp) {
        setDemoCode(res.otp)
        setSentNotice(`A new 6-digit verification code was sent to ${targetPhone}`)
      }
    } catch {
      setError("Unable to resend OTP right now")
    }
  }

  if (!visitor) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-slate-600 font-medium">No active pre-registration found. Please start registration.</p>
        <button
          onClick={() => navigate("/register")}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-white text-sm font-semibold shadow-md hover:bg-indigo-700"
        >
          Go to Registration
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md sm:p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4 border border-indigo-100">
          <Smartphone size={24} />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
          Mobile OTP Verification
        </h1>
        <p className="text-xs text-slate-500 mb-6">
          A 6-digit verification code has been dispatched to <span className="font-bold text-slate-900">{targetPhone}</span>
        </p>

        {sentNotice && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-900 flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
            <span className="font-semibold">{sentNotice}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 text-center">
              Enter 6-Digit OTP Code Sent to Your Mobile
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="──────"
              maxLength={6}
              autoFocus
              className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-center text-2xl font-bold tracking-[0.5em] text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={otp.length !== 6 || loading}
            className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size="sm" />
                Verifying Code...
              </>
            ) : (
              <>
                <span>Verify OTP & Proceed to AI Selfie</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 space-y-3 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Didn&apos;t receive code?</span>
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <RefreshCw size={12} />
              Resend OTP
            </button>
          </div>

          {/* Quick Demo Helper for local testing */}
          {demoCode && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setOtp(demoCode)}
                className="text-[11px] text-slate-400 hover:text-indigo-600 underline font-mono flex items-center justify-center gap-1 mx-auto"
              >
                <KeyRound size={12} />
                <span>Dev Test Helper: Click to fill received code ({demoCode})</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
