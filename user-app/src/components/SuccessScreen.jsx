import { CheckCircle } from "lucide-react"

export default function SuccessScreen({
  title = "Success",
  message,
  children,
  onAction,
  actionLabel = "Continue",
}) {
  return (
    <div className="flex flex-col items-center text-center py-8">
      <div className="rounded-full bg-[#eff6ff] p-4 mb-4">
        <CheckCircle size={48} className="text-[#3b82f6]" />
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{title}</h1>
      {message && <p className="text-gray-600 text-sm mb-6">{message}</p>}
      {children}
      {onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded-lg bg-[#3b82f6] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#2563eb]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
