import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getStoredApiUrl, setStoredApiUrl, getAdminUrl } from "../utils/api"
import { DEPARTMENTS, getDepartmentData } from "../data/departmentSafety"
import {
  ShieldCheck,
  HardHat,
  Smartphone,
  Camera,
  Award,
  QrCode,
  ArrowRight,
  Lock,
  Globe,
  Settings,
  AlertTriangle,
  Sparkles,
  UserCheck
} from "lucide-react"

export default function LandingPage() {
  const navigate = useNavigate()
  const [serverUrl, setServerUrl] = useState("")
  const [showServer, setShowServer] = useState(false)
  const [selectedDeptId, setSelectedDeptId] = useState(DEPARTMENTS[0].id)

  const activeDept = getDepartmentData(selectedDeptId)

  useEffect(() => {
    setServerUrl(getStoredApiUrl())
  }, [])

  const features = [
    {
      icon: ShieldCheck,
      title: "Pre-Authorization & Sector Choice",
      description:
        "Pre-register prior to arrival. Select your target industrial department with dynamic PPE compliance requirements.",
      badge: "Fast-Track Pass",
      color: "border-indigo-200 text-indigo-700 bg-indigo-50",
    },
    {
      icon: Smartphone,
      title: "6-Digit Mobile OTP Authentication",
      description:
        "Verified 6-digit phone authorization ensuring high security and visitor mobile validation.",
      badge: "Mobile Auth",
      color: "border-indigo-200 text-indigo-700 bg-indigo-50",
    },
    {
      icon: Camera,
      title: "AI Biometric Face Recognition",
      description:
        "Real-time selfie capture with automated gate check-in matching & feature vector extraction.",
      badge: "AI Biometrics",
      color: "border-indigo-200 text-indigo-700 bg-indigo-50",
    },
    {
      icon: Award,
      title: "Compressed 7-Min Safety Training",
      description:
        "Modern micro-learning module replacing long videos, followed by a 3-question department quiz.",
      badge: "PSO1 Compliance",
      color: "border-indigo-200 text-indigo-700 bg-indigo-50",
    },
    {
      icon: QrCode,
      title: "Instant Digital QR Gate Pass",
      description:
        "Official QR pass issuance containing visitor photo, approved host officer, and verified safety score.",
      badge: "Contactless Pass",
      color: "border-indigo-200 text-indigo-700 bg-indigo-50",
    },
  ]

  const steps = [
    { num: "01", title: "Pre-Register Details", desc: "Enter host employee, ID proof, & target department" },
    { num: "02", title: "OTP & AI Selfie", desc: "Verify 6-digit phone code & capture biometric photo" },
    { num: "03", title: "Safety & Quiz", desc: "Review compressed safety steps & pass 3-question evaluation" },
    { num: "04", title: "Scan & Enter", desc: "Present digital QR pass at Sector Gate 1 checkpoint" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/40 via-slate-50 to-white text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Floating Glass Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold">
              <ShieldCheck size={22} />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                SmartGate
              </span>
              <p className="text-[10px] text-slate-500 font-medium">PSO1 Industrial Safety & Access Control</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={getAdminUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-black active:scale-95"
            >
              <Lock size={15} className="text-indigo-400" />
              <span>Admin Panel Login</span>
            </a>

            <button
              onClick={() => navigate("/register")}
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-95"
            >
              <span>Pre-Register Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Soft Ambient Light Gradients */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[700px] rounded-full bg-indigo-200/30 blur-[130px]" />
        <div className="pointer-events-none absolute top-1/3 left-1/3 h-[280px] w-[280px] rounded-full bg-sky-200/40 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100/80 border border-indigo-200 px-4 py-1.5 text-xs font-bold text-indigo-900 shadow-xs">
              <Sparkles size={14} className="text-indigo-600 animate-pulse" />
              <span>PSO1 Industrial Pre-Authorization & Safety Compliance System</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-[1.1]">
              Next-Gen Fast-Track Entry for{" "}
              <span className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
                Industrial Facilities
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Eliminate long gate queues and redundant 7-minute videos. Pre-authorize visits, complete sector safety training, and verify identity with AI face biometrics.
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate("/register")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-base font-extrabold text-white shadow-xl shadow-indigo-600/25 transition hover:bg-indigo-700 active:scale-98"
              >
                <ShieldCheck size={20} />
                <span>Start Visitor Pre-Authorization</span>
              </button>

              <a
                href={getAdminUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-7 py-4 text-base font-extrabold text-white shadow-xl transition hover:bg-black active:scale-98"
              >
                <Lock size={18} className="text-indigo-400" />
                <span>Admin Panel Login</span>
              </a>

              <button
                type="button"
                onClick={() => setShowServer(!showServer)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 px-6 py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
              >
                <Settings size={18} className="text-indigo-600" />
                <span>{showServer ? "Hide Settings" : "Mobile Config"}</span>
              </button>
            </div>

            {/* Mobile Server URL Drawer */}
            {showServer && (
              <div className="mt-4 max-w-md mx-auto rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xl backdrop-blur-md">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Globe size={14} className="text-indigo-600" />
                  Mobile API Server Endpoint URL:
                </label>
                <input
                  type="url"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                  onBlur={() => setStoredApiUrl(serverUrl)}
                  placeholder="http://192.168.0.102:5000"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1.5">
                  When testing from mobile on the same local Wi-Fi, set your computer&apos;s IP (e.g. <span className="font-mono text-indigo-700 font-bold">http://192.168.0.102:5000</span>).
                </p>
              </div>
            )}

            {/* Live Key Metrics Strip */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-extrabold text-indigo-600">85%</p>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">Faster Gate Check-in</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-extrabold text-emerald-600">100%</p>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">PPE Compliance Rate</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-extrabold text-sky-600">6 Sectors</p>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">Dynamic Industrial PPE</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-2xl font-extrabold text-purple-600">AI Face</p>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">Biometric Gate Match</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-800 bg-indigo-100/80 px-3 py-1 rounded-full border border-indigo-200">
              System Architecture & Core Modules
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Built Specifically for Industrial Operations
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              PSO1 compliance requirements integrated into a single seamless visitor experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={i}
                  className="group relative rounded-2xl border border-slate-200 bg-gradient-to-b from-indigo-50/20 to-white p-6 transition-all duration-300 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10"
                >
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border ${f.color}`}>
                    <Icon size={24} />
                  </div>
                  <span className="mb-2 inline-block rounded-full bg-indigo-100 border border-indigo-200 px-2.5 py-0.5 text-[10px] font-bold text-indigo-800">
                    {f.badge}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Interactive Department PPE Showcase Section */}
      <section className="py-16 bg-slate-50/70">
        <div className="mx-auto max-w-7xl px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-800 bg-indigo-100/80 px-3 py-1 rounded-full border border-indigo-200">
              Dynamic Sector Compliance
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Preview Mandatory PPE Gear by Sector
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Select an industrial sector below to preview the dynamic protective equipment requirements automatically enforced during visitor registration.
            </p>
          </div>

          {/* Department Selector Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDeptId(dept.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDeptId === dept.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 border border-indigo-500"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-indigo-300 hover:text-indigo-800"
                }`}
              >
                <span>{dept.icon}</span>
                <span>{dept.name}</span>
              </button>
            ))}
          </div>

          {/* Active Department PPE Preview Card */}
          <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-800 border border-indigo-200 text-2xl">
                  {activeDept.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{activeDept.name}</h3>
                  <p className="text-xs text-slate-500">Pre-authorization PPE specifications</p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                activeDept.riskLevel === "High Risk"
                  ? "bg-rose-100 text-rose-800 border border-rose-200"
                  : "bg-emerald-100 text-emerald-800 border border-emerald-200"
              }`}>
                {activeDept.riskLevel}
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <HardHat size={16} className="text-indigo-600" />
                Mandatory Protective Equipment (PPE Checklist):
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {activeDept.requiredPPE.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs font-semibold text-slate-800"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs space-y-1">
              <p className="font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle size={16} className="text-amber-600" />
                Sector Hazards Warning:
              </p>
              <p className="text-amber-800 text-[11px]">
                {activeDept.hazards.join(" • ")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Flow Diagram */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-800 bg-indigo-100/80 px-3 py-1 rounded-full border border-indigo-200">
              Visitor Journey
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
              Simple 4-Step Pre-Authorization Flow
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, idx) => (
              <div key={idx} className="relative rounded-2xl border border-slate-200 bg-slate-50/60 p-6 space-y-3 shadow-2xs">
                <span className="text-3xl font-extrabold text-indigo-600">{st.num}</span>
                <h3 className="text-base font-bold text-slate-900">{st.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => navigate("/register")}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-extrabold text-white shadow-xl shadow-indigo-600/25 transition hover:bg-indigo-700 active:scale-95"
            >
              <span>Begin Pre-Authorization Flow</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-100 py-8 text-center text-xs text-slate-600">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© SmartGate Industrial Visitor Management System.</p>
          <div className="flex items-center gap-4 text-slate-600">
            <button onClick={() => navigate("/register")} className="hover:text-indigo-600 font-semibold">Visitor Pre-Reg</button>
            <span>•</span>
            <a href="http://localhost:5174" target="_blank" rel="noreferrer" className="hover:text-indigo-600 font-semibold">Admin Panel Login</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
