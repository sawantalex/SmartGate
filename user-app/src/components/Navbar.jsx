import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Shield, Menu, X, Home, UserPlus, BadgeCheck } from "lucide-react"

const navLinks = [
  { to: "/", label: "Home", icon: Home },
  { to: "/register", label: "Register", icon: UserPlus },
  { to: "/pass", label: "Visitor Pass", icon: BadgeCheck },
]

export default function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="text-white shadow-md">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-base sm:text-lg">
            <Shield size={20} />
            SmartGate
          </Link>

          <div className="hidden sm:flex gap-4 sm:gap-6">
            {navLinks.map((item) => {
              const active = location.pathname === item.to
              const IconComponent = item.icon
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 text-sm ${
                    active ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  <IconComponent size={18} />
                  {item.label}
                </Link>
              )
            })}
          </div>

          <button
            className="sm:hidden p-2 -mr-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="sm:hidden flex flex-col gap-2 pb-4">
            {navLinks.map((item) => {
              const IconComponent = item.icon
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-2 text-white/90 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  <IconComponent size={18} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}
