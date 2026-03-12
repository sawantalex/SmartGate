import { createContext, useContext, useState } from "react"

const VisitorContext = createContext(null)

export function VisitorProvider({ children }) {
  const [visitor, setVisitor] = useState(null)
  const [pass, setPass] = useState(null)
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
