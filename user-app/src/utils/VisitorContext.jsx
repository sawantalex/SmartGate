import { createContext, useContext, useState, useEffect } from "react"

const VisitorContext = createContext(null)

export function VisitorProvider({ children }) {
  const [visitor, setVisitorState] = useState(() => {
    try {
      const saved = sessionStorage.getItem("smartgate_visitor")
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [pass, setPassState] = useState(() => {
    try {
      const saved = sessionStorage.getItem("smartgate_pass")
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const setVisitor = (val) => {
    setVisitorState(val)
    if (val) {
      sessionStorage.setItem("smartgate_visitor", JSON.stringify(val))
    } else {
      sessionStorage.removeItem("smartgate_visitor")
    }
  }

  const setPass = (val) => {
    setPassState(val)
    if (val) {
      sessionStorage.setItem("smartgate_pass", JSON.stringify(val))
    } else {
      sessionStorage.removeItem("smartgate_pass")
    }
  }

  return (
    <VisitorContext.Provider value={{ visitor, setVisitor, pass, setPass }}>
      {children}
    </VisitorContext.Provider>
  )
}

export function useVisitor() {
  const ctx = useContext(VisitorContext)
  if (!ctx) throw new Error("useVisitor must be used within VisitorProvider")
  return ctx
}
