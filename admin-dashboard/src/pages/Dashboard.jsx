import { useEffect, useState } from "react"
import { Users, CheckCircle, Clock } from "lucide-react"
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
  const pending = visitors.filter((v) => v.status === "pending").length

  const stats = [
    { label: "Total Visitors", value: visitors.length, icon: Users },
    { label: "Checked In", value: checkedIn, icon: CheckCircle, color: "bg-emerald-100 text-emerald-600" },
    { label: "Pending", value: pending, icon: Clock, color: "bg-amber-100 text-amber-600" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>
      {error && (
        <div className="mb-4 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}
      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <>
          <DashboardCards stats={stats} />
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">Recent Visitors</h2>
            <VisitorTable visitors={visitors} />
          </div>
        </>
      )}
    </div>
  )
}
