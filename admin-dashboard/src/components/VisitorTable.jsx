import StatusBadge from "./StatusBadge"

export default function VisitorTable({ visitors }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th className="px-4 py-3 font-medium text-slate-600">Visitor</th>
            <th className="px-4 py-3 font-medium text-slate-600 hidden sm:table-cell">Company</th>
            <th className="px-4 py-3 font-medium text-slate-600">Department</th>
            <th className="px-4 py-3 font-medium text-slate-600">Visit Date</th>
            <th className="px-4 py-3 font-medium text-slate-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {visitors?.map((v) => (
            <tr
              key={v.id || v._id}
              className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
            >
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-slate-900">{v.name || v.fullName}</p>
                  <p className="text-xs text-slate-500 sm:hidden">{v.company}</p>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">{v.company}</td>
              <td className="px-4 py-3 text-slate-600">{v.department}</td>
              <td className="px-4 py-3 text-slate-600">
                {v.visitDate ? new Date(v.visitDate).toLocaleDateString() : "—"}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={v.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {(!visitors || visitors.length === 0) && (
        <div className="py-12 text-center text-slate-500">No visitors found.</div>
      )}
    </div>
  )
}
