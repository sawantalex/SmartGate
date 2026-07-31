import { useEffect, useState } from "react"
import { Users, CheckCircle, Clock, ShieldCheck, HardHat, Award } from "lucide-react"
import DashboardCards from "../components/DashboardCards"
import VisitorTable from "../components/VisitorTable"
import { api } from "../utils/api"

export default function Dashboard() {
  const [visitors, setVisitors] = useState([])
  const [passes, setPasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([api("/api/visitors"), api("/api/passes")])
      .then(([v, p]) => {
        setVisitors(Array.isArray(v) ? v : [])
        setPasses(Array.isArray(p) ? p : [])
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const checkedIn = visitors.filter((v) => v.status === "checked-in").length
  const preAuthorized = visitors.filter((v) => v.preAuthStatus === "Pre-Authorized" || v.safetyTrainingStatus === "completed").length
  const pending = visitors.filter((v) => v.status === "pending").length

  const stats = [
    { label: "Total Industrial Visitors", value: visitors.length, icon: Users },
    { label: "Pre-Authorized Visitors", value: preAuthorized, icon: ShieldCheck, color: "bg-indigo-100 text-indigo-600" },
    { label: "Currently Inside Sector", value: checkedIn, icon: CheckCircle, color: "bg-emerald-100 text-emerald-600" },
    { label: "Pending Gate Arrival", value: pending, icon: Clock, color: "bg-amber-100 text-amber-600" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Industrial Facility Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            PSO1 Real-Time Visitor Pre-Authorization & Safety Compliance Tracking
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-xs text-slate-500">Loading industrial visitor data...</p>
      ) : (
        <>
          <DashboardCards stats={stats} />
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Pre-Authorized Visitor Roster</h2>
              <span className="text-xs font-medium text-slate-500">Total: {visitors.length} Visitors</span>
            </div>
            <VisitorTable visitors={visitors} />
          </div>
        </>
      )}
    </div>
  )
}
