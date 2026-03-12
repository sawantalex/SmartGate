import { useNavigate } from "react-router-dom"

export default function SafetyTraining() {
  const navigate = useNavigate()

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md sm:p-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
          Safety Training
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Review safety guidelines before entering the facility.
        </p>
        <div className="rounded-xl bg-gray-50 p-6 mb-6 text-sm text-gray-600">
          Safety training content placeholder.
        </div>
        <button
          onClick={() => navigate("/quiz")}
          className="w-full rounded-lg bg-[#3b82f6] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#2563eb]"
        >
          Continue to Quiz
        </button>
      </div>
    </div>
  )
}
