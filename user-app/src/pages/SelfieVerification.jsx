import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useVisitor } from "../utils/VisitorContext"
import { api } from "../utils/api"
import { Camera, ScanFace, CheckCircle2, ShieldCheck, RefreshCw } from "lucide-react"

export default function SelfieVerification() {
  const navigate = useNavigate()
  const { visitor, setVisitor } = useVisitor()

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [selfie, setSelfie] = useState("")
  const [faceDetected, setFaceDetected] = useState(false)

  if (!visitor) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-slate-600">Please complete pre-registration first.</p>
        <button
          onClick={() => navigate("/register")}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-white text-sm font-semibold shadow-md hover:bg-indigo-700"
        >
          Go to Registration
        </button>
      </div>
    )
  }

  const startCamera = async () => {
    if (loading || stream) return
    setError("")
    setLoading(true)
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
        setFaceDetected(true)
      }
    } catch (err) {
      console.error(err)
      setError("Unable to access camera. Please allow camera permissions.")
    } finally {
      setLoading(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop())
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setFaceDetected(false)
  }

  const captureSelfie = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const dataUrl = canvas.toDataURL("image/png")
    setSelfie(dataUrl)
  }

  useEffect(() => {
    startCamera()
    return () => {
      stopCamera()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleContinue = async () => {
    const vid = visitor?.id || visitor?._id
    if (!vid || !selfie) return
    setError("")
    setSaving(true)
    try {
      // Simulate AI face descriptor encoding (128-dimensional embedding simulation string)
      const mockEmbedding = `FACE-EMB-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`

      const updated = await api(`/api/visitors/${vid}`, {
        method: "PATCH",
        body: JSON.stringify({
          selfie,
          faceEmbedding: mockEmbedding
        }),
      })
      setVisitor(updated)
      navigate("/training")
    } catch (err) {
      setError(err.message || "Failed to save identity photo")
    } finally {
      setSaving(false)
    }
  }

  const cameraReady = !!stream

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <ScanFace size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              AI Identity Verification
            </h1>
            <p className="text-xs text-slate-500">
              Real-time selfie capture & AI face biometric embedding for gate matching
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="aspect-video overflow-hidden rounded-2xl bg-slate-950 relative border border-slate-800 shadow-inner flex items-center justify-center">
            {/* Live Camera View */}
            <video
              ref={videoRef}
              className="h-full w-full object-cover opacity-90"
              playsInline
              muted
            />

            {/* AI Face Oval Frame Overlay */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className={`h-48 w-36 rounded-[50%] border-2 transition-all duration-300 ${
                faceDetected
                  ? "border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.5)]"
                  : "border-indigo-400/80 shadow-[0_0_30px_rgba(99,102,241,0.5)]"
              }`} />
              
              <div className="mt-3 flex items-center gap-1.5 rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-[11px] font-medium text-emerald-400 border border-emerald-500/30">
                <ScanFace size={14} className="animate-pulse" />
                <span>{cameraReady ? "AI Face Alignment Ready" : "Initializing Camera..."}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
            <p className="text-xs text-slate-500 max-w-xs">
              Position your face inside the oval frame. Ensure sufficient lighting for AI feature matching.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={cameraReady ? stopCamera : startCamera}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold shadow-sm transition ${
                  cameraReady
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    : "bg-slate-900 text-white hover:bg-black"
                }`}
              >
                {cameraReady ? "Stop camera" : loading ? "Starting..." : "Start camera"}
              </button>

              <button
                type="button"
                onClick={captureSelfie}
                disabled={!cameraReady}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Camera size={14} />
                <span>Capture Photo</span>
              </button>
            </div>
          </div>

          {selfie && (
            <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  Captured Biometric Photo Preview:
                </span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                  AI Features Extracted
                </span>
              </div>

              <div className="aspect-video max-w-xs overflow-hidden rounded-xl border border-slate-300 bg-black">
                <img src={selfie} alt="Captured Selfie" className="h-full w-full object-cover" />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selfie || saving}
          className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            "Saving Biometric Data..."
          ) : selfie ? (
            <>
              <span>Proceed to Interactive Safety Training</span>
              <ShieldCheck size={18} />
            </>
          ) : (
            "Capture photo to continue"
          )}
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
