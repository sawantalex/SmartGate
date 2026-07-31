import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useVisitor } from "../utils/VisitorContext"
import QRPassCard from "../components/QRPassCard"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { getDepartmentData } from "../data/departmentSafety"
import { Download, CheckCircle, Home, Printer, FileText, ShieldCheck, AlertCircle } from "lucide-react"

export default function VisitorPass() {
  const navigate = useNavigate()
  const { visitor, pass } = useVisitor()
  const passCardRef = useRef(null)

  const [showDownloadOptions, setShowDownloadOptions] = useState(false)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  if (!visitor) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-slate-600 font-medium">No visitor pass found. Please complete registration first.</p>
        <button
          onClick={() => navigate("/register")}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-white text-sm font-semibold shadow-md hover:bg-indigo-700"
        >
          Go to Registration
        </button>
      </div>
    )
  }

  const visitorName = visitor.name || visitor.fullName || "Visitor"
  const deptData = getDepartmentData(visitor.department)
  const pid = pass?.passId || pass?._id || pass?.id || `PASS-${Date.now()}`
  const validTill = pass?.validTill
    ? new Date(pass.validTill).toLocaleString()
    : new Date(Date.now() + 12 * 3600 * 1000).toLocaleString()

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true)
    setDownloadSuccess("")
    setErrorMsg("")

    try {
      // Primary Method: Try html2canvas with sanitized options
      const cardEl = passCardRef.current
      if (cardEl) {
        try {
          const canvas = await html2canvas(cardEl, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            logging: false,
          })

          const imgData = canvas.toDataURL("image/png")
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
          })

          const pdfWidth = pdf.internal.pageSize.getWidth()
          const imgWidth = 140
          const imgHeight = (canvas.height * imgWidth) / canvas.width
          const xPos = (pdfWidth - imgWidth) / 2

          // Header
          pdf.setFillColor(15, 23, 42)
          pdf.rect(0, 0, pdfWidth, 22, "F")
          pdf.setTextColor(255, 255, 255)
          pdf.setFontSize(14)
          pdf.setFont("helvetica", "bold")
          pdf.text("SmartGate Industrial Pass — PSO1 Verified", 15, 14)

          pdf.addImage(imgData, "PNG", xPos, 28, imgWidth, imgHeight)

          pdf.setTextColor(100, 116, 139)
          pdf.setFontSize(9)
          pdf.setFont("helvetica", "normal")
          pdf.text(
            `Pass ID: ${pid} • Present this pass at Gate 1 Checkpoint`,
            pdfWidth / 2,
            28 + imgHeight + 10,
            { align: "center" }
          )

          pdf.save(`SmartGate_Visitor_Pass_${visitorName.replace(/\s+/g, "_")}.pdf`)
          setDownloadSuccess("Official PDF Visitor Pass downloaded!")
          setIsGeneratingPdf(false)
          return
        } catch (canvasErr) {
          console.warn("Canvas capture fallback trigger:", canvasErr)
        }
      }

      // Fallback Method: Native jsPDF Vector Document Generation
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()

      // Header Banner
      pdf.setFillColor(15, 23, 42)
      pdf.rect(0, 0, pdfWidth, 28, "F")

      pdf.setTextColor(255, 255, 255)
      pdf.setFontSize(16)
      pdf.setFont("helvetica", "bold")
      pdf.text("SmartGate Industrial Visitor Pass", 15, 15)

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(165, 180, 252)
      pdf.text("PSO1 Pre-Authorization & Safety Compliance Verified", 15, 22)

      // Main Card Box
      pdf.setDrawColor(226, 232, 240)
      pdf.setFillColor(255, 255, 255)
      pdf.roundedRect(15, 35, 180, 200, 4, 4, "FD")

      // Status Badge
      pdf.setFillColor(236, 253, 245)
      pdf.setDrawColor(167, 243, 208)
      pdf.roundedRect(135, 42, 50, 9, 2, 2, "FD")
      pdf.setTextColor(6, 95, 70)
      pdf.setFontSize(9)
      pdf.setFont("helvetica", "bold")
      pdf.text("PRE-AUTHORIZED", 160, 48, { align: "center" })

      // Visitor Info
      pdf.setTextColor(15, 23, 42)
      pdf.setFontSize(14)
      pdf.setFont("helvetica", "bold")
      pdf.text(visitorName, 25, 48)

      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(100, 116, 139)
      pdf.text(visitor.company || "Independent Visitor", 25, 54)

      // Details Grid
      let y = 68
      pdf.setDrawColor(241, 245, 249)
      pdf.setFillColor(248, 250, 252)
      pdf.roundedRect(25, y, 160, 45, 3, 3, "FD")

      pdf.setFontSize(8)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(148, 163, 184)
      pdf.text("TARGET DEPARTMENT", 30, y + 8)
      pdf.text("HOST OFFICER", 110, y + 8)

      pdf.setFontSize(10)
      pdf.setTextColor(15, 23, 42)
      pdf.text(visitor.department || "General Plant", 30, y + 14)
      pdf.text(visitor.hostEmployee || "Plant Ops Manager", 110, y + 14)

      pdf.setFontSize(8)
      pdf.setTextColor(148, 163, 184)
      pdf.text("VISIT TYPE", 30, y + 26)
      pdf.text("ID PROOF VERIFIED", 110, y + 26)

      pdf.setFontSize(10)
      pdf.setTextColor(15, 23, 42)
      pdf.text(visitor.visitType || "Standard Visit", 30, y + 32)
      pdf.text(`${visitor.idProofType || "Govt ID"} (${visitor.idProofNumber || "Verified"})`, 110, y + 32)

      pdf.setFontSize(8)
      pdf.setTextColor(148, 163, 184)
      pdf.text("SAFETY QUIZ SCORE", 30, y + 40)
      pdf.text("VEHICLE NO.", 110, y + 40)

      pdf.setFontSize(10)
      pdf.setTextColor(16, 185, 129)
      pdf.text(`${visitor.quizScore || 100}% (PASSED)`, 30, y + 44)
      pdf.setTextColor(15, 23, 42)
      pdf.text(visitor.vehicleNo || "N/A", 110, y + 44)

      // Required PPE Section
      y = 122
      pdf.setDrawColor(254, 215, 170)
      pdf.setFillColor(255, 251, 235)
      pdf.roundedRect(25, y, 160, 25, 3, 3, "FD")

      pdf.setFontSize(9)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(146, 64, 14)
      pdf.text(`Mandatory PPE Gear for ${deptData.name}:`, 30, y + 7)

      pdf.setFontSize(8)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(71, 85, 105)
      const ppeText = deptData.requiredPPE.map((p) => p.name).join(" • ")
      pdf.text(pdf.splitTextToSize(ppeText, 150), 30, y + 14)

      // QR Pass Notice
      y = 158
      pdf.setFontSize(9)
      pdf.setFont("helvetica", "bold")
      pdf.setTextColor(100, 116, 139)
      pdf.text("Present this Digital QR Pass at Gate 1 Security Checkpoint", pdfWidth / 2, y, { align: "center" })

      pdf.setFontSize(8)
      pdf.setFont("helvetica", "normal")
      pdf.setTextColor(148, 163, 184)
      pdf.text(`Pass ID: ${pid} • Valid Until: ${validTill}`, pdfWidth / 2, y + 65, { align: "center" })

      pdf.save(`SmartGate_Visitor_Pass_${visitorName.replace(/\s+/g, "_")}.pdf`)
      setDownloadSuccess("Official PDF Visitor Pass downloaded!")
    } catch (err) {
      console.error("PDF generation error:", err)
      setErrorMsg("Failed to export PDF file. You can also click Print Pass Badge.")
    } finally {
      setIsGeneratingPdf(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span>Pre-Authorization Verified & Approved</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Official Visitor Pass</h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Present this QR code at Gate 1 Checkpoint or download a PDF copy for your records.
        </p>
      </div>

      {/* Target element for canvas/PDF export */}
      <div ref={passCardRef} className="rounded-3xl p-1 bg-white">
        <QRPassCard visitor={visitor} pass={pass} />
      </div>

      {/* Notifications */}
      {downloadSuccess && (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs font-bold text-emerald-900 flex items-center gap-2">
          <CheckCircle size={18} className="text-emerald-600 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs font-semibold text-rose-700 flex items-center gap-2">
          <AlertCircle size={18} className="text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Download & Action Bar */}
      {!showDownloadOptions ? (
        <div className="space-y-3 pt-2">
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="w-full rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Download size={20} />
            <span>{isGeneratingPdf ? "Generating PDF Pass..." : "Download Pass (PDF File)"}</span>
          </button>

          <button
            onClick={() => setShowDownloadOptions(true)}
            className="w-full rounded-2xl bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-black flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} />
            <span>Done (View All Options)</span>
          </button>
        </div>
      ) : (
        /* Options Panel */
        <div className="rounded-3xl border border-indigo-200 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-indigo-100 pb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Download & Save Pass</h2>
              <p className="text-xs text-slate-500">Choose your preferred download format</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="flex items-center justify-center gap-2.5 rounded-2xl bg-emerald-600 p-4 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50 transition"
            >
              <Download size={18} />
              <span>{isGeneratingPdf ? "Generating..." : "Download PDF File"}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2.5 rounded-2xl bg-slate-800 p-4 text-xs font-bold text-white shadow-md hover:bg-slate-900 transition"
            >
              <Printer size={18} />
              <span>Print Pass Badge</span>
            </button>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full mt-2 rounded-2xl border border-slate-300 bg-white py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-2"
          >
            <Home size={16} />
            <span>Return to Home Portal</span>
          </button>
        </div>
      )}
    </div>
  )
}
