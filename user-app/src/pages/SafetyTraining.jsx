import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useVisitor } from "../utils/VisitorContext"
import { getDepartmentData } from "../data/departmentSafety"
import { ShieldCheck, HardHat, AlertTriangle, CheckCircle2, ChevronRight, ChevronLeft, Play, Zap, Info } from "lucide-react"

export default function SafetyTraining() {
  const navigate = useNavigate()
  const { visitor } = useVisitor()

  const deptData = getDepartmentData(visitor?.department)
  const isShortVisit = visitor?.visitType === "Short Visit (< 1 hr)"

  const [activeTab, setActiveTab] = useState(0)
  const [acknowledgedPPE, setAcknowledgedPPE] = useState({})

  if (!visitor) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-slate-600 font-medium">Please complete registration first.</p>
        <button
          onClick={() => navigate("/register")}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-white text-sm font-semibold shadow-md hover:bg-indigo-700"
        >
          Go to Registration
        </button>
      </div>
    )
  }

  const togglePPECheck = (id) => {
    setAcknowledgedPPE((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const slides = [
    {
      id: "general",
      title: "1. Industrial Site Entry Rules",
      content: (
        <div className="space-y-4 text-xs text-slate-700">
          <div className="rounded-xl bg-amber-50 p-4 border border-amber-200 flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900">7-Minute Video Fast-Track Compressed Module</p>
              <p className="text-amber-800 text-[11px] mt-0.5">
                This interactive module replaces redundant long videos with key sector-specific guidelines tailored to your visit type: <span className="font-bold underline">{visitor?.visitType || "Standard Visit"}</span>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <CheckCircle2 size={16} className="text-indigo-600" />
                Escort Policy
              </span>
              <p className="text-[11px] text-slate-600">
                Visitors must remain accompanied by approved host employee <span className="font-semibold text-slate-800">({visitor?.hostEmployee || "Host Officer"})</span> at all times in plant bays.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <Zap size={16} className="text-indigo-600" />
                No Unauthorized Devices
              </span>
              <p className="text-[11px] text-slate-600">
                Photography, mobile phone usage in hazardous chemical zones, and unapproved electrical devices are strictly prohibited.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "ppe",
      title: `2. Mandatory PPE Checklist for ${deptData.name}`,
      content: (
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Interactive Hotspot Check: Click each mandatory item below to acknowledge that you will wear it upon entering the sector.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {deptData.requiredPPE.map((item) => {
              const isChecked = !!acknowledgedPPE[item.id]
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => togglePPECheck(item.id)}
                  className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                    isChecked
                      ? "border-emerald-500 bg-emerald-50/80 text-emerald-950 font-medium shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-xs truncate">{item.name}</span>
                  </div>
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center border ${
                    isChecked ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300"
                  }`}>
                    {isChecked && <CheckCircle2 size={14} />}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="rounded-xl bg-slate-100 p-3 text-[11px] text-slate-600 flex items-center gap-2">
            <Info size={16} className="text-indigo-600 shrink-0" />
            <span>PPE items will be inspected by security guards at Sector Gate check-in.</span>
          </div>
        </div>
      ),
    },
    {
      id: "evacuation",
      title: "3. Emergency Evacuation & Siren Protocol",
      content: (
        <div className="space-y-4 text-xs text-slate-700">
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 space-y-2">
            <p className="font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck size={18} className="text-indigo-600" />
              Siren Signal Definitions:
            </p>
            <ul className="space-y-1 text-[11px] text-slate-700 pl-1">
              <li>• <span className="font-bold text-amber-700">Intermittent Siren (2 min):</span> Caution / Minor Spill Alert - Prepare for assembly.</li>
              <li>• <span className="font-bold text-rose-700">Continuous High-Pitch Siren (3 min):</span> Major Evacuation - Proceed immediately to Assembly Point A.</li>
              <li>• <span className="font-bold text-emerald-700">Flat Continuous Tone (2 min):</span> All Clear Signal.</li>
            </ul>
          </div>

          <div className="rounded-xl bg-slate-900 text-white p-4 space-y-2">
            <p className="font-bold text-indigo-300 text-xs">Emergency Assembly Point & Contact:</p>
            <p className="text-[11px] text-slate-300">
              Primary Assembly Location: <span className="font-semibold text-white">Main Plaza Green Lawn (Gate 1)</span>
            </p>
            <p className="text-[11px] text-slate-300">
              Plant Safety Hotline: <span className="font-mono text-amber-400 font-bold">+91 1800-SMARTGATE-HSE</span>
            </p>
          </div>
        </div>
      ),
    },
  ]

  const currentSlide = slides[activeTab]

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md sm:p-8">
        <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              Compressed Safety Module
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Interactive Safety Compliance
            </h1>
          </div>

          {isShortVisit && (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
              ⚡ Fast-Track Visitor
            </span>
          )}
        </div>

        {/* Step Indicator Tabs */}
        <div className="flex items-center gap-1.5 mb-6">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveTab(idx)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === idx
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Step {idx + 1}
            </button>
          ))}
        </div>

        {/* Slide Content */}
        <div className="min-h-[240px] mb-6">
          <h2 className="text-sm font-bold text-slate-900 mb-3">{currentSlide.title}</h2>
          {currentSlide.content}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
          <button
            onClick={() => setActiveTab((prev) => Math.max(0, prev - 1))}
            disabled={activeTab === 0}
            className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          {activeTab < slides.length - 1 ? (
            <button
              onClick={() => setActiveTab((prev) => prev + 1)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-700"
            >
              <span>Next Step</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => navigate("/quiz")}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700"
            >
              <span>Acknowledge & Take Quiz</span>
              <ShieldCheck size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
