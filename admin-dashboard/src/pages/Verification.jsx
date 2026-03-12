import { useEffect, useRef, useState } from "react"
import { Camera, ScanFace, CheckCircle2, AlertCircle } from "lucide-react"
import { api } from "../utils/api"

export default function Verification() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [loadingCamera, setLoadingCamera] = useState(false)
  const [error, setError] = useState("")
  const [scannerActive, setScannerActive] = useState(false)
  const [scanResult, setScanResult] = useState("")
  const [scannedData, setScannedData] = useState(null)
  const [logSuccess, setLogSuccess] = useState("")
  const [logging, setLogging] = useState(false)
  const [selfieImage, setSelfieImage] = useState("")
  const scannerRef = useRef(null)

  // Start camera
  const startCamera = async () => {
    if (loadingCamera || stream) return
    setError("")
    setLoadingCamera(true)
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
      }
    } catch (err) {
      console.error(err)
      setError("Unable to access camera. Please check permissions.")
    } finally {
      setLoadingCamera(false)
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

  // QR scanning loop using native BarcodeDetector when available
  const startScanner = async () => {
    setError("")
    if (!("BarcodeDetector" in window)) {
      setError("QR scanning is not supported in this browser. Try latest Chrome or Edge on Android.")
      return
    }
    if (!stream) {
      await startCamera()
    }
    setScanResult("")
    setScannedData(null)
    setLogSuccess("")
    setScannerActive(true)
  }

  const stopScanner = () => {
    setScannerActive(false)
    scannerRef.current = null
  }

  const scanAgain = () => {
    setScanResult("")
    setScannedData(null)
    setLogSuccess("")
    setError("")
    setScannerActive(true)
  }

  useEffect(() => {
    let detector
    let animationId

    const scanFrame = async () => {
      if (!scannerActive || !videoRef.current || !canvasRef.current) return
      const video = videoRef.current
      if (!video.videoWidth || !video.videoHeight) {
        animationId = requestAnimationFrame(scanFrame)
        return
      }
      try {
        if (!detector) {
          detector = new window.BarcodeDetector({ formats: ["qr_code"] })
        }

        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        const barcodes = await detector.detect(canvas)
        if (barcodes.length > 0) {
          const raw = barcodes[0].rawValue || "{}"
          setScanResult(raw)
          try {
            const parsed = JSON.parse(raw)
            setScannedData(parsed)
          } catch {
            setScannedData(null)
          }
          setScannerActive(false)
          return
        }
      } catch (err) {
        console.error("Scan error", err)
      }
      animationId = requestAnimationFrame(scanFrame)
    }

    if (scannerActive) {
      animationId = requestAnimationFrame(scanFrame)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [scannerActive])

  const captureSelfie = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const dataUrl = canvas.toDataURL("image/png")
    setSelfieImage(dataUrl)
  }

  useEffect(() => {
    // Clean up on unmount
    return () => {
      stopScanner()
      stopCamera()
    }
  }, [])

  const cameraReady = !!stream

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Visitor Verification</h1>
          <p className="text-sm text-slate-500 mt-1">
            Scan the visitor&apos;s QR code and capture a selfie for manual verification.
          </p>
        </div>
        <button
          onClick={cameraReady ? stopCamera : startCamera}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm ${
            cameraReady
              ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          <Camera size={18} />
          {cameraReady ? "Stop Camera" : loadingCamera ? "Starting..." : "Start Camera"}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <ScanFace size={20} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">QR Scanner</h2>
              <p className="text-xs text-slate-500">
                Hold the visitor pass in front of the camera to scan the QR.
              </p>
            </div>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-950/90 flex items-center justify-center">
            <video
              ref={videoRef}
              className="h-full w-full object-cover opacity-80"
              playsInline
              muted
            />
            <div className="pointer-events-none absolute inset-10 rounded-xl border-2 border-emerald-400/70 shadow-[0_0_40px_rgba(16,185,129,0.65)]" />
            <div className="pointer-events-none absolute inset-x-1/4 top-1/2 h-px -translate-y-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span
                className={`h-2 w-2 rounded-full ${
                  scannerActive ? "bg-emerald-500" : "bg-slate-300"
                }`}
              />
              {scannerActive ? "Scanning for QR code..." : "Scanner idle"}
            </div>
            <div className="flex gap-2">
              <button
                onClick={startScanner}
                disabled={scannerActive}
                className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Start Scan
              </button>
              <button
                onClick={stopScanner}
                disabled={!scannerActive}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Stop
              </button>
            </div>
          </div>

          {scanResult && (
            <div className="mt-4 space-y-2">
              {scannedData?.validTill && new Date(scannedData.validTill) < new Date() && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  Pass expired on {new Date(scannedData.validTill).toLocaleString()}. You can still log entry if allowed by policy.
                </div>
              )}
              <div className="flex items-start gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium">QR Detected</p>
                  {scannedData?.name && <p className="mt-1">Visitor: {scannedData.name}</p>}
                  <p className="break-all text-[11px] mt-0.5 opacity-80">{scanResult.slice(0, 80)}...</p>
                </div>
              </div>
              {scannedData?.visitorId && (
                <>
                  <button
                    onClick={async () => {
                      setLogSuccess("")
                      setError("")
                      setLogging(true)
                      try {
                        await api("/api/entry-logs", {
                          method: "POST",
                          body: JSON.stringify({ visitorId: scannedData.visitorId, action: "entry" }),
                        })
                        setLogSuccess("Entry logged successfully")
                      } catch (err) {
                        setError(err.message || "Failed to log entry")
                      } finally {
                        setLogging(false)
                      }
                    }}
                    disabled={logging}
                    className="w-full rounded-lg bg-emerald-600 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {logging ? "Logging..." : "Log Entry"}
                  </button>
                  <button
                    type="button"
                    onClick={scanAgain}
                    className="w-full rounded-lg bg-slate-100 py-2 text-xs font-medium text-slate-700 hover:bg-slate-200"
                  >
                    Scan again
                  </button>
                </>
              )}
              {!scannedData?.visitorId && (
                <p className="text-amber-700 text-xs">Invalid QR: no visitor ID. Ask for a valid pass.</p>
              )}
              {logSuccess && (
                <p className="text-xs text-emerald-600 font-medium">{logSuccess}</p>
              )}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50 text-sky-600">
              <Camera size={20} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Selfie Verification</h2>
              <p className="text-xs text-slate-500">
                Capture the visitor&apos;s live photo and match it with their ID/card.
              </p>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            <div className="relative aspect-video overflow-hidden rounded-xl border border-slate-200 bg-slate-900">
              {selfieImage ? (
                <img
                  src={selfieImage}
                  alt="Captured selfie"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                  Camera view will appear in the QR panel. Click &quot;Capture Selfie&quot; to save a frame.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] text-slate-500 max-w-xs">
                Ensure the visitor&apos;s face is clearly visible with good lighting before capturing.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={captureSelfie}
                  disabled={!cameraReady}
                  className="inline-flex items-center gap-1 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Camera size={14} />
                  Capture Selfie
                </button>
                {selfieImage && (
                  <button
                    onClick={() => setSelfieImage("")}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200"
                  >
                    Retake
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Hidden canvas used for both scanning & selfie capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

