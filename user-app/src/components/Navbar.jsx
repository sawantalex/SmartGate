import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { ShieldCheck, Menu, X, Home, UserPlus, BadgeCheck, Lock } from "lucide-react"
import { getAdminUrl } from "../utils/api"

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/register", label: "Pre-Register", icon: UserPlus },
  { to: "/pass", label: "Digital Pass", icon: BadgeCheck },
]

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white/90 border-b border-slate-200/80 backdrop-blur-md text-slate-900 shadow-xs sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-center gap-2.5 font-extrabold text-base sm:text-lg tracking-wide">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <ShieldCheck size={20} />
            </div>
            <span className="text-slate-900 font-extrabold text-lg tracking-tight">
              SmartGate
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-5">
            {navLinks.map((item) => {
              const active = location.pathname === item.to
              const IconComponent = item.icon
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-all ${
                    active
                      ? "text-indigo-600 border-b-2 border-indigo-600 pb-1"
                      : "text-slate-600 hover:text-indigo-600"
                  }`}
                >
                  <IconComponent size={16} />
                  {item.label}
                </Link>
              )
            })}

            {/* Dynamic Admin Panel Login Button */}
            <a
              href={getAdminUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-md transition hover:bg-black active:scale-95 ml-2"
            >
              <Lock size={14} className="text-indigo-400" />
              <span>Admin Panel Login</span>
            </a>
          </div>

          <button
            className="sm:hidden p-2 text-slate-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="sm:hidden flex flex-col gap-2 pb-4 pt-2 border-t border-slate-100">
            {navLinks.map((item) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <IconComponent size={18} className="text-indigo-600" />
                  {item.label}
                </Link>
              )
            })}

            <a
              href={getAdminUrl()}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-xs font-bold bg-slate-900 text-white rounded-xl p-2.5 justify-center mt-1"
              onClick={() => setMenuOpen(false)}
            >
              <Lock size={16} className="text-indigo-400" />
              <span>Admin Panel Login</span>
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
