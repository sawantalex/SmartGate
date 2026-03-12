import { useNavigate } from "react-router-dom"
import { useVisitor } from "../utils/VisitorContext"
import QRPassCard from "../components/QRPassCard"

export default function VisitorPass() {
  const navigate = useNavigate()
  const { visitor, pass } = useVisitor()

  if (!visitor) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">No visitor pass. Please complete registration first.</p>
        <button
          onClick={() => navigate("/register")}
          className="rounded-lg bg-[#3b82f6] px-6 py-2 text-white text-sm font-semibold shadow-sm hover:bg-[#2563eb]"
        >
          Go to Registration
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold text-gray-800 mb-1 text-center">Visitor Pass</h1>
      <p className="text-sm text-gray-600 text-center mb-6">
        Show this QR code at the entrance for verification.
      </p>

      <QRPassCard visitor={visitor} pass={pass} />

      <button
        onClick={() => navigate("/")}
        className="mt-6 w-full rounded-lg bg-[#3b82f6] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#2563eb]"
      >
        Done
      </button>
    </div>
  )
}
