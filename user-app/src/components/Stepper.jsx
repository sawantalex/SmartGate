import { ClipboardList, Camera, Shield, Lock, QrCode } from "lucide-react"

const steps = [
  { label: "Registration", Icon: ClipboardList },
  { label: "Identity Verification (Selfie)", Icon: Camera },
  { label: "Safety Training", Icon: Shield },
  { label: "Quiz", Icon: Lock },
  { label: "Visitor Pass", Icon: QrCode },
]

export default function Stepper({ currentStep = 0 }) {
  const total = steps.length
  const safeStep = Math.min(Math.max(currentStep, 0), total - 1)
  const progress = total > 1 ? (safeStep / (total - 1)) * 100 : 0

  return (
    <nav
      className="w-full bg-white backdrop-blur-sm"
      role="navigation"
      aria-label="Registration progress"
    >
      <div className="mx-auto flex max-w-2xl flex-col px-4 py-3">
        <div className="relative flex items-center justify-between gap-2 sm:gap-4">
          {/* Gray connecting line */}
          <div
            className="pointer-events-none absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-gray-200"
            aria-hidden
          />

          {/* Accent progress line with smooth transition */}
          <div
            className="pointer-events-none absolute left-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-[#3b82f6] transition-[width] duration-500 ease-out"
            style={{ width: `${Math.max(0, progress)}%` }}
            aria-hidden
          />

          {steps.map((step, index) => {
            const isActive = index === safeStep
            const isCompleted = index < safeStep
            const Icon = step.Icon

            const circleStyles = isCompleted || isActive
              ? "bg-[#3b82f6] text-white border-[#3b82f6]"
              : "bg-gray-100 text-gray-400 border-gray-200"

            return (
              <div
                key={step.label}
                className="relative z-10 flex flex-1 flex-col items-center"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 sm:h-10 sm:w-10 transition-all duration-300 ${circleStyles}`}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
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
              isActive || isCompleted ? "text-[#3b82f6]" : "text-gray-400"

            return (
              <div
                key={step.label}
                className="min-w-0 flex-1 text-center"
              >
                <span
                  className={`block text-[0.6rem] leading-tight sm:text-xs font-medium truncate px-0.5 ${labelStyles}`}
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
