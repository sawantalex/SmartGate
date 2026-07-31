import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useVisitor } from "../utils/VisitorContext"
import { getDepartmentData } from "../data/departmentSafety"
import { api } from "../utils/api"
import { ShieldCheck, Award, AlertCircle, RefreshCw, ArrowRight } from "lucide-react"

// Helper function to shuffle array elements randomly
function shuffleArray(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function Quiz() {
  const navigate = useNavigate()
  const { visitor, setVisitor, setPass } = useVisitor()
  const [retakeCount, setRetakeCount] = useState(0)

  const deptData = getDepartmentData(visitor?.department)

  // Dynamically shuffle options for every question like a real exam portal
  const processedQuestions = useMemo(() => {
    return deptData.quiz.map((q) => {
      const originalCorrectText = q.options[q.answer]
      const shuffledOptions = shuffleArray(q.options)
      const newCorrectIndex = shuffledOptions.indexOf(originalCorrectText)
      return {
        ...q,
        shuffledOptions,
        newCorrectIndex,
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitor?.department, retakeCount])

  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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

  const handleSelectOption = (qId, optionIndex) => {
    if (submitted) return
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: optionIndex,
    }))
  }

  const handleSubmitQuiz = async () => {
    let correctCount = 0
    processedQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.newCorrectIndex) {
        correctCount += 1
      }
    })

    const finalScore = Math.round((correctCount / processedQuestions.length) * 100)
    setScore(finalScore)
    setSubmitted(true)

    if (finalScore >= 80) {
      const vid = visitor?.id || visitor?._id
      if (!vid) return
      setError("")
      setLoading(true)
      try {
        const updatedVisitor = await api(`/api/visitors/${vid}`, {
          method: "PATCH",
          body: JSON.stringify({
            safetyTrainingStatus: "completed",
            quizScore: finalScore,
            preAuthStatus: "Pre-Authorized",
          }),
        })
        setVisitor(updatedVisitor)

        const passData = await api("/api/passes", {
          method: "POST",
          body: JSON.stringify({ visitorId: vid }),
        })
        setPass(passData)
      } catch (err) {
        setError(err.message || "Failed to issue visitor pass")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleRetake = () => {
    setSelectedAnswers({})
    setSubmitted(false)
    setScore(0)
    setError("")
    setRetakeCount((prev) => prev + 1)
  }

  const allAnswered = processedQuestions.every((q) => selectedAnswers[q.id] !== undefined)
  const isPassed = score >= 80
  const optionLabels = ["A", "B", "C", "D"]

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md sm:p-8">
        <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              Exam Portal Mode
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Safety Assessment: {deptData.name}
            </h1>
          </div>
          <Award className="text-indigo-600" size={28} />
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="space-y-6 text-center py-4">
            <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 ${
              isPassed ? "bg-emerald-50 border-emerald-500 text-emerald-600" : "bg-rose-50 border-rose-500 text-rose-600"
            }`}>
              <span className="text-2xl font-extrabold">{score}%</span>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isPassed ? "Safety Assessment Passed!" : "Assessment Retake Required"}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isPassed
                  ? `Congratulations! You scored ${score}%. Your pre-authorization is confirmed.`
                  : `Minimum passing score is 80%. Please review the department rules and retake the quiz.`}
              </p>
            </div>

            {isPassed ? (
              <button
                onClick={() => navigate("/pass")}
                disabled={loading}
                className="w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-emerald-700 flex items-center justify-center gap-2"
              >
                <span>{loading ? "Generating Digital Pass..." : "View Official Digital QR Pass"}</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handleRetake}
                className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-black flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                <span>Retake Quiz (Reshuffle Options)</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {processedQuestions.map((q, qIndex) => (
              <div key={q.id} className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                <p className="text-xs font-bold text-slate-900">
                  Question {qIndex + 1}: {q.question}
                </p>
                <div className="space-y-2 pt-1">
                  {q.shuffledOptions.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[q.id] === optIdx
                    const label = optionLabels[optIdx] || optIdx + 1
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full rounded-xl border p-3.5 text-left text-xs transition flex items-center gap-3 ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/80 font-bold text-indigo-950 shadow-2xs ring-2 ring-indigo-500/20"
                            : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300"
                        }`}
                      >
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${
                          isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"
                        }`}>
                          {label}
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            <button
              onClick={handleSubmitQuiz}
              disabled={!allAnswered}
              className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShieldCheck size={18} />
              <span>Submit Assessment & Generate QR Pass</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
