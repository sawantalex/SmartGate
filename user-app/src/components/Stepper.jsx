import { ClipboardList, Smartphone, Camera, Shield, Lock, QrCode } from "lucide-react"

const steps = [
  { label: "Registration", Icon: ClipboardList },
  { label: "OTP Mobile", Icon: Smartphone },
  { label: "AI Selfie", Icon: Camera },
  { label: "Safety Training", Icon: Shield },
  { label: "Quiz", Icon: Lock },
  { label: "QR Pass", Icon: QrCode },
]

export default function Stepper({ currentStep = 0 }) {
  const total = steps.length
  const safeStep = Math.min(Math.max(currentStep, 0), total - 1)
  const progress = total > 1 ? (safeStep / (total - 1)) * 100 : 0

  return (
    <nav
      className="w-full bg-white/95 border-b border-amber-200/60 py-3 text-slate-800"
      role="navigation"
      aria-label="Registration progress"
    >
      <div className="mx-auto flex max-w-3xl flex-col px-4">
        <div className="relative flex items-center justify-between gap-2 sm:gap-4">
          {/* Base connecting line */}
          <div
            className="pointer-events-none absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-slate-200"
            aria-hidden
          />

          {/* Royal Gold progress line */}
          <div
            className="pointer-events-none absolute left-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-[width] duration-500 ease-out shadow-xs"
            style={{ width: `${Math.max(0, progress)}%` }}
            aria-hidden
          />

          {steps.map((step, index) => {
            const isActive = index === safeStep
            const isCompleted = index < safeStep
            const Icon = step.Icon

            const circleStyles = isCompleted || isActive
              ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-bold"
              : "bg-slate-100 text-slate-400 border-slate-200"

            return (
              <div
                key={step.label}
                className="relative z-10 flex flex-1 flex-col items-center"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border sm:h-9 sm:w-9 transition-all duration-300 ${circleStyles}`}
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                </div>
              </div>
            )
          })}
        </div>

        {/* Labels */}
        <div className="mt-2 flex items-start justify-between gap-1 sm:gap-2">
          {steps.map((step, index) => {
            const isActive = index === safeStep
            const isCompleted = index < safeStep
            const labelStyles =
              isActive || isCompleted ? "text-amber-700 font-bold" : "text-slate-400 font-medium"

            return (
              <div
                key={step.label}
                className="min-w-0 flex-1 text-center"
              >
                <span
                  className={`block text-[0.65rem] leading-tight sm:text-xs truncate px-0.5 ${labelStyles}`}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
