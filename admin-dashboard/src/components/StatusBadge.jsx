const variants = {
  approved: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  rejected: "bg-red-100 text-red-800",
  "checked-in": "bg-emerald-100 text-emerald-800",
  "checked-out": "bg-slate-100 text-slate-700",
  inside: "bg-blue-100 text-blue-800",
  exited: "bg-slate-100 text-slate-700",
}

export default function StatusBadge({ status }) {
  const style = variants[status] || variants.pending
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : "—"

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}
    >
      {label}
    </span>
  )
}
