import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useVisitor } from "../utils/VisitorContext"
import { api } from "../utils/api"

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

  const startCamera = async () => {
    if (loading || stream) return
    setError("")
    setLoading(true)
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, // front camera on mobile
        audio: false,
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
      }
    } catch (err) {
      console.error(err)
      setError("Unable to access camera. Please allow camera permission.")
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
    // auto-start camera on mount for smoother flow
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
      const updated = await api(`/api/visitors/${vid}`, {
        method: "PATCH",
        body: JSON.stringify({ selfie }),
      })
      setVisitor(updated)
      navigate("/training")
    } catch (err) {
      setError(err.message || "Failed to save selfie")
    } finally {
      setSaving(false)
    }
  }

  const cameraReady = !!stream

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md sm:p-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
          Identity Verification (Selfie)
        </h1>
        <p className="text-sm text-gray-500 mb-4">
          Use your front camera to record a short selfie and confirm your identity before entering.
        </p>

        {error && (
          <div className="mb-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div className="aspect-video overflow-hidden rounded-xl bg-black/90 relative">
            {/* Live video */}
            <video
              ref={videoRef}
              className="h-full w-full object-cover opacity-80"
              playsInline
              muted
            />
            {/* Message overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-6 pointer-events-none">
              <p className="text-sm font-medium text-white/90 drop-shadow">
                Video here – align your face inside the frame and hold still.
              </p>
              <p className="text-xs text-white/70 max-w-xs">
                Make sure your face is clearly visible with good lighting.
              </p>
            </div>
            {/* Frame */}
            <div className="pointer-events-none absolute inset-8 rounded-2xl border-2 border-[#3b82f6]/80 shadow-[0_0_35px_rgba(59,130,246,0.7)]" />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-[11px] text-gray-500 max-w-xs">
              Tap <span className="font-semibold text-gray-700">Capture selfie</span> once you are ready.
              You can retake if you are not satisfied.
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={cameraReady ? stopCamera : startCamera}
                className={`rounded-lg px-3 py-2 text-xs font-semibold shadow-sm ${
                  cameraReady
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-gray-900 text-white hover:bg-black"
                }`}
              >
                {cameraReady ? "Stop camera" : loading ? "Starting..." : "Start camera"}
              </button>
              <button
                type="button"
                onClick={captureSelfie}
                disabled={!cameraReady}
                className="rounded-lg bg-[#3b82f6] px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#2563eb] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Capture selfie
              </button>
            </div>
          </div>

          {selfie && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-1">Captured preview:</p>
              <div className="aspect-video max-w-sm overflow-hidden rounded-xl border border-gray-200 bg-black/80">
                <img src={selfie} alt="Selfie preview" className="h-full w-full object-cover" />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selfie || saving}
          className="w-full rounded-lg bg-[#3b82f6] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : selfie ? "Continue" : "Capture a selfie to continue"}
        </button>
      </div>

      {/* hidden canvas used for capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

