import { Routes, Route, Navigate } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import LandingPage from "./pages/LandingPage"
import Register from "./pages/Register"
import OTPVerification from "./pages/OTPVerification"
import SelfieVerification from "./pages/SelfieVerification"
import SafetyTraining from "./pages/SafetyTraining"
import Quiz from "./pages/Quiz"
import VisitorPass from "./pages/VisitorPass"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="register" element={<Register />} />
        <Route path="otp-verification" element={<OTPVerification />} />
        <Route path="selfie" element={<SelfieVerification />} />
        <Route path="training" element={<SafetyTraining />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="pass" element={<VisitorPass />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
