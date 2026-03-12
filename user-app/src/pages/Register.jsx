import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useVisitor } from "../utils/VisitorContext"
import FormInput from "../components/FormInput"
import { api } from "../utils/api"

export default function Register() {
  const navigate = useNavigate()
  const { setVisitor } = useVisitor()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setError("")
    setLoading(true)
    try {
      const visitor = await api("/api/visitors", {
        method: "POST",
        body: JSON.stringify({
          fullName: fd.get("fullName") || "",
          company: fd.get("company") || "",
          mobile: fd.get("mobile") || "",
          email: fd.get("email") || "",
          phone: fd.get("mobile") || "",
          department: fd.get("department") || "",
          purpose: fd.get("purpose") || "",
          visitDate: new Date().toISOString(),
        }),
      })
      setVisitor(visitor)
      navigate("/selfie")
    } catch (err) {
      setError(err.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md sm:p-8">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-1">
          Visitor Registration
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Fill in your details before arriving at the facility.
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <FormInput name="fullName" placeholder="Full Name *" required />
          <FormInput name="company" placeholder="Company" />
          <FormInput name="mobile" placeholder="Mobile Number *" required type="tel" />
          <FormInput name="email" placeholder="Email Address *" required type="email" />
          <FormInput
            name="department"
            type="select"
            placeholder="Department to Visit *"
            required
            options={[
              { value: "Production", label: "Production" },
              { value: "Maintenance", label: "Maintenance" },
              { value: "Admin", label: "Admin" },
            ]}
          />
          <FormInput
            name="purpose"
            type="textarea"
            placeholder="Purpose of Visit *"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 rounded-lg bg-[#3b82f6] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#2563eb] disabled:opacity-60"
          >
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  )
}
