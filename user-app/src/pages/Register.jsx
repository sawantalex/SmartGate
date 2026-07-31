import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useVisitor } from "../utils/VisitorContext"
import FormInput from "../components/FormInput"
import { api } from "../utils/api"
import { DEPARTMENTS, getDepartmentData } from "../data/departmentSafety"
import { ShieldCheck, HardHat, AlertTriangle, Upload, FileText, CheckCircle2, X } from "lucide-react"

export default function Register() {
  const navigate = useNavigate()
  const { setVisitor } = useVisitor()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [selectedDeptId, setSelectedDeptId] = useState(DEPARTMENTS[0].id)
  const currentDept = getDepartmentData(selectedDeptId)

  // ID Proof Upload States
  const [idDocFile, setIdDocFile] = useState(null)
  const [idDocBase64, setIdDocBase64] = useState("")
  const [idDocName, setIdDocName] = useState("")
  const [idDocSize, setIdDocSize] = useState("")
  const [idDocIsPdf, setIdDocIsPdf] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSizeBytes = 1 * 1024 * 1024 // 1 MB limit

    if (file.size > maxSizeBytes) {
      setError(`File "${file.name}" exceeds the 1 MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB). Please select a smaller photo or PDF.`)
      e.target.value = ""
      return
    }

    setError("")
    setIdDocName(file.name)
    setIdDocSize((file.size / 1024).toFixed(1) + " KB")
    setIdDocIsPdf(file.type === "application/pdf" || file.name.endsWith(".pdf"))

    const reader = new FileReader()
    reader.onload = () => {
      setIdDocBase64(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveFile = () => {
    setIdDocFile(null)
    setIdDocBase64("")
    setIdDocName("")
    setIdDocSize("")
    setIdDocIsPdf(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setError("")
    
    const rawMobile = (fd.get("mobile") || "").toString().trim()
    const digitsOnly = rawMobile.replace(/\D/g, "")

    if (digitsOnly.length !== 10) {
      setError("Mobile number must be exactly 10 digits (e.g., 9876543210). You entered " + digitsOnly.length + " digits.")
      return
    }

    setLoading(true)
    try {
      const visitor = await api("/api/visitors", {
        method: "POST",
        body: JSON.stringify({
          fullName: fd.get("fullName") || "",
          company: fd.get("company") || "",
          mobile: digitsOnly,
          email: fd.get("email") || "",
          phone: digitsOnly,
          department: selectedDeptId,
          hostEmployee: fd.get("hostEmployee") || "Plant Operations Manager",
          idProofType: fd.get("idProofType") || "Govt ID",
          idProofNumber: fd.get("idProofNumber") || "",
          idProofDocument: idDocBase64,
          vehicleNo: fd.get("vehicleNo") || "",
          visitType: fd.get("visitType") || "Standard Visit",
          purpose: fd.get("purpose") || "",
          visitDate: new Date().toISOString(),
        }),
      })

      // Trigger OTP generation endpoint
      try {
        const otpRes = await api("/api/visitors/send-otp", {
          method: "POST",
          body: JSON.stringify({ phone: visitor.phone }),
        })
        if (otpRes.otp) {
          visitor.otp = otpRes.otp
        }
      } catch (err) {
        console.warn("OTP trigger notice:", err)
      }

      setVisitor(visitor)
      navigate("/otp-verification")
    } catch (err) {
      setError(err.message || "Pre-authorization registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white sm:text-2xl">
              Industrial Visitor Pre-Authorization
            </h1>
            <p className="text-xs text-indigo-200">
              PSO1 Safety Compliance & Fast-Track Access Control
            </p>
          </div>
        </div>
        <p className="text-xs text-slate-300 mt-2">
          Complete pre-registration before arriving on premises. Select your target industrial department to review mandatory PPE gear and safety rules.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md sm:p-8">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 flex items-center gap-2">
            <AlertTriangle className="shrink-0 text-red-600" size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider text-indigo-600">
            1. Visitor Personal & Host Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput name="fullName" placeholder="Full Name *" required />
            <FormInput name="company" placeholder="Company / Organization Name *" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              name="mobile"
              placeholder="10-Digit Mobile Number (e.g. 9876543210) *"
              required
              type="tel"
              maxLength={10}
              minLength={10}
              pattern="[0-9]{10}"
              title="Please enter exactly 10 digits"
            />
            <FormInput name="email" placeholder="Email Address *" required type="email" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput name="hostEmployee" placeholder="Host Employee / Officer to Visit *" required />
            <FormInput
              name="visitType"
              type="select"
              placeholder="Visit Type *"
              required
              options={[
                { value: "Standard Visit", label: "Standard Visit (Full Day)" },
                { value: "Short Visit (< 1 hr)", label: "Short Visit (< 1 Hour - Fast-Track)" },
                { value: "Auditor / Contractor", label: "Auditor / Contractor Work" },
              ]}
            />
          </div>

          {/* ID Proof Type, Number & Vehicle No Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              name="idProofType"
              type="select"
              placeholder="ID Proof Type *"
              required
              options={[
                { value: "Govt ID", label: "Govt Photo ID Card" },
                { value: "Aadhaar Card", label: "Aadhaar Card" },
                { value: "Driving License", label: "Driving License" },
                { value: "Passport", label: "Passport" },
              ]}
            />
            <FormInput name="idProofNumber" placeholder="ID Number *" required />
            <FormInput name="vehicleNo" placeholder="Vehicle No. (Optional)" />
          </div>

          {/* ID Proof Document (Photo or PDF Upload Section) */}
          <div className="rounded-xl border border-indigo-100 bg-slate-50/70 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Upload size={16} className="text-indigo-600" />
                <span>Upload ID Proof Document (Photo or PDF)</span>
              </label>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                Max 1 MB
              </span>
            </div>

            {idDocBase64 ? (
              <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-950">
                <div className="flex items-center gap-3 min-w-0">
                  {idDocIsPdf ? (
                    <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                      <FileText size={20} />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-lg overflow-hidden border border-emerald-300 shrink-0 bg-slate-900">
                      <img src={idDocBase64} alt="ID Preview" className="h-full w-full object-cover" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="font-bold truncate text-slate-900">{idDocName}</p>
                    <p className="text-[11px] text-emerald-700 font-medium">Size: {idDocSize} • Ready to submit</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-1 text-slate-400 hover:text-red-600 rounded-md transition"
                  title="Remove document"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-4 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition text-center space-y-1">
                <Upload size={22} className="text-indigo-500" />
                <span className="text-xs font-semibold text-slate-700">
                  Click to select ID Photo (.jpg, .png) or PDF Document
                </span>
                <span className="text-[10px] text-slate-400">
                  Allowed formats: JPG, PNG, WEBP, PDF (Max size: 1 MB)
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}

            {/* Verification Reminder Note */}
            <div className="rounded-lg bg-amber-50 border border-amber-200/80 p-2.5 text-[11px] font-semibold text-amber-800 flex items-center gap-2">
              <AlertTriangle size={15} className="text-amber-600 shrink-0" />
              <span>Please bring your original ID document while visiting the premises for physical verification.</span>
            </div>
          </div>

          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider text-indigo-600 pt-3">
            2. Department Selection & Dynamic PPE Compliance
          </h2>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Select Industrial Department to Visit *
            </label>
            <select
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white p-3 text-sm font-medium text-gray-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.icon} {dept.name} ({dept.riskLevel})
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Department Safety Gear & Precautions Box */}
          <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 to-slate-50 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardHat className="text-indigo-600" size={20} />
                <h3 className="text-sm font-bold text-slate-900">
                  Required PPE Gear for {currentDept.name}
                </h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                currentDept.riskLevel === "High Risk"
                  ? "bg-rose-100 text-rose-800 border border-rose-200"
                  : "bg-emerald-100 text-emerald-800 border border-emerald-200"
              }`}>
                {currentDept.riskLevel}
              </span>
            </div>

            <p className="text-xs text-slate-600">
              The system requires all visitors to wear mandatory protective equipment before entering this sector:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {currentDept.requiredPPE.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 rounded-lg bg-white p-2.5 border border-indigo-100 shadow-2xs text-xs font-medium text-slate-800"
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-indigo-100/80">
              <p className="text-[11px] font-bold text-amber-800 flex items-center gap-1.5 mb-1">
                <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                Department Hazard Notice:
              </p>
              <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5 pl-1">
                {currentDept.hazards.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          </div>

          <FormInput
            name="purpose"
            type="textarea"
            placeholder="Detailed Purpose of Visit (e.g., Equipment inspection, Client audit) *"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              "Processing Pre-Authorization..."
            ) : (
              <>
                <span>Continue to Mobile OTP Verification</span>
                <ShieldCheck size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
