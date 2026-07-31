import { Outlet, useLocation } from "react-router-dom"
import Navbar from "../components/Navbar"
import Stepper from "../components/Stepper"

const STEP_ROUTES = [
  "/register",
  "/otp-verification",
  "/selfie",
  "/training",
  "/quiz",
  "/pass",
]

export default function MainLayout() {
  const location = useLocation()
  const isLanding = location.pathname === "/"
  const stepIndex = STEP_ROUTES.findIndex((r) => location.pathname === r)
  const showStepper = stepIndex >= 0

  return (
    <div className={`min-h-screen flex flex-col ${isLanding ? "bg-amber-50/30" : "bg-slate-50"}`}>
      {!isLanding && (
        <header className="sticky top-0 z-30 bg-white border-b border-amber-200/60 shadow-sm">
          <Navbar />
          {showStepper && <Stepper currentStep={stepIndex} />}
        </header>
      )}
      <main
        className={
          isLanding
            ? "flex-1"
            : "flex-1 w-full max-w-3xl mx-auto px-4 py-6 sm:py-8"
        }
      >
        <Outlet />
      </main>
    </div>
  )
}
