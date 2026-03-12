import QRCode from "react-qr-code"

export default function QRPassCard({ visitor, pass }) {
  if (!visitor) return null

  const name = visitor.name || visitor.fullName
  const vid = visitor.id || visitor._id
  const pid = pass?._id || pass?.id

  const qrPayload = JSON.stringify({
    visitorId: vid,
    passId: pid,
    validTill: pass?.validTill,
    name,
    email: visitor.email,
    phone: visitor.phone || visitor.mobile,
    company: visitor.company,
    department: visitor.department,
    purpose: visitor.purpose,
    visitDate: visitor.visitDate,
  })

  return (
    <div className="w-full max-w-sm mx-auto rounded-xl border border-gray-100 bg-white p-5 shadow-md">
      <div className="mb-4 space-y-2 text-sm">
        <p><span className="font-semibold text-gray-600">Visitor:</span> {name}</p>
        <p><span className="font-semibold text-gray-600">Company:</span> {visitor.company || "-"}</p>
        <p><span className="font-semibold text-gray-600">Department:</span> {visitor.department || "-"}</p>
        <p><span className="font-semibold text-gray-600">Purpose:</span> {visitor.purpose || "-"}</p>
        <p>
          <span className="font-semibold text-gray-600">Visit Date:</span>{" "}
          {visitor.visitDate ? new Date(visitor.visitDate).toLocaleString() : "-"}
        </p>
        <p><span className="font-semibold text-gray-600">Visitor ID:</span> {vid}</p>
      </div>

      <div className="flex justify-center rounded-lg bg-white p-3 ring-1 ring-gray-200">
        <QRCode
          value={qrPayload}
          size={180}
          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          viewBox="0 0 256 256"
        />
      </div>
    </div>
  )
}
