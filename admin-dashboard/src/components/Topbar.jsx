import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"

export default function Topbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in")
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="lg:hidden font-semibold text-slate-800">SmartGate</div>
      <div className="flex-1" />
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      >
        <LogOut size={18} />
        Logout
      </button>
    </header>
  )
}
