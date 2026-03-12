import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import DashboardLayout from "./layouts/DashboardLayout"
import Dashboard from "./pages/Dashboard"
import EntryLogs from "./pages/EntryLogs"
import Verification from "./pages/Verification"

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem("admin_logged_in") === "true"
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="logs" element={<EntryLogs />} />
        <Route path="verification" element={<Verification />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
