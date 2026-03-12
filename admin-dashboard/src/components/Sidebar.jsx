import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Shield, LayoutDashboard, FileText, ScanFace, Menu } from "lucide-react"

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/logs", label: "Entry Logs", icon: FileText },
  { to: "/verification", label: "Verification", icon: ScanFace },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  const NavContent = () => (
    <nav className="p-4 space-y-1">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-50 flex lg:hidden items-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg"
      >
        <Menu size={20} />
        Menu
      </button>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white transition-transform lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
      <div className="flex h-16 items-center gap-2 px-6 border-b border-slate-100">
        <Shield size={24} className="text-indigo-600" />
        <span className="font-bold text-slate-800">SmartGate Admin</span>
      </div>
      <NavContent />
    </aside>
    </>
  )
}
