import QRCode from "react-qr-code"
import { ShieldCheck, HardHat, CheckCircle2, Award, Calendar, UserCheck, IdCard, Car } from "lucide-react"
import { getDepartmentData } from "../data/departmentSafety"

export default function QRPassCard({ visitor, pass }) {
  if (!visitor) return null

  const name = visitor.name || visitor.fullName
  const vid = visitor.id || visitor._id
  const pid = pass?.passId || pass?._id || pass?.id
  const deptData = getDepartmentData(visitor.department)

  const validTillFormatted = pass?.validTill
    ? new Date(pass.validTill).toLocaleString()
    : new Date(Date.now() + 12 * 3600 * 1000).toLocaleString()

  const qrPayload = JSON.stringify({
    visitorId: vid,
    passId: pid,
    validTill: pass?.validTill || new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    name,
    email: visitor.email,
    phone: visitor.phone || visitor.mobile,
    company: visitor.company,
    department: visitor.department,
    hostEmployee: visitor.hostEmployee,
    purpose: visitor.purpose,
    quizScore: visitor.quizScore || 100,
    safetyStatus: "COMPLETED",
    preAuthStatus: visitor.preAuthStatus || "Pre-Authorized",
  })

  return (
    <div className="w-full max-w-md mx-auto rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xl">
      {/* Top Pass Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-indigo-400" size={24} />
            <div>
              <h2 className="text-base font-extrabold text-white tracking-wide uppercase">
                SmartGate Industrial Pass
              </h2>
              <p className="text-[10px] text-indigo-300">PSO1 Safety Compliance Verified</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 tracking-wider uppercase">
            PRE-AUTHORIZED
          </span>
        </div>
      </div>

      {/* Visitor Profile Strip */}
      <div className="p-5 space-y-4">
        <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
          {visitor.selfie ? (
            <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-indigo-500 shadow-md shrink-0 bg-slate-900">
              <img src={visitor.selfie} alt={name} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="h-20 w-20 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-xl shrink-0">
              {name.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1 space-y-1 text-xs">
            <h3 className="text-base font-bold text-slate-900 truncate">{name}</h3>
            <p className="text-slate-500 font-medium">{visitor.company || "Independent Auditor/Visitor"}</p>

            <div className="pt-1 flex flex-wrap gap-1.5">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
                <HardHat size={12} />
                {visitor.department || "General Plant"}
              </span>

              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                <Award size={12} />
                Quiz: {visitor.quizScore || 100}%
              </span>
            </div>
          </div>
        </div>

        {/* Visit Details Table */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Host Officer</span>
            <p className="font-semibold text-slate-800">{visitor.hostEmployee || "Plant Ops Manager"}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Visit Type</span>
            <p className="font-semibold text-slate-800">{visitor.visitType || "Standard Visit"}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">ID Verified</span>
            <p className="font-semibold text-slate-800">{visitor.idProofType || "Govt ID"} ({visitor.idProofNumber || "Verified"})</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Vehicle No.</span>
            <p className="font-semibold text-slate-800">{visitor.vehicleNo || "N/A (Pedestrian)"}</p>
          </div>
        </div>

        {/* Required PPE Checklist */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs space-y-1.5">
          <p className="font-bold text-amber-900 text-[11px] flex items-center gap-1">
            <HardHat size={14} className="text-amber-700" />
            Sector Required PPE Gear (Must Wear at Sector Gate):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {deptData.requiredPPE.map((item) => (
              <span key={item.id} className="bg-white text-slate-800 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-amber-200 shadow-2xs">
                {item.icon} {item.name}
              </span>
            ))}
          </div>
        </div>

        {/* QR Code Container */}
        <div className="pt-2 text-center space-y-2">
          <p className="text-[11px] font-medium text-slate-500">
            Present this QR Pass at Gate 1 Security Checkpoint:
          </p>

          <div className="inline-block p-3 bg-white rounded-2xl border-2 border-slate-900 shadow-md">
            <QRCode
              value={qrPayload}
              size={170}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              viewBox="0 0 256 256"
            />
          </div>

          <div className="text-[10px] text-slate-400 font-mono">
            Pass ID: {pid} • Valid Till: {validTillFormatted}
          </div>
        </div>
      </div>
    </div>
  )
}
