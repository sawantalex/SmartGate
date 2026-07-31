import StatusBadge from "./StatusBadge"
import { ShieldCheck, Award, HardHat } from "lucide-react"

export default function VisitorTable({ visitors }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-xs">
        <thead className="border-b border-slate-200 bg-slate-50/80">
          <tr>
            <th className="px-4 py-3.5 font-bold text-slate-700">Visitor & Photo</th>
            <th className="px-4 py-3.5 font-bold text-slate-700 hidden sm:table-cell">Company</th>
            <th className="px-4 py-3.5 font-bold text-slate-700">Sector & Host</th>
            <th className="px-4 py-3.5 font-bold text-slate-700">Safety Score</th>
            <th className="px-4 py-3.5 font-bold text-slate-700">Pre-Auth Status</th>
            <th className="px-4 py-3.5 font-bold text-slate-700">Gate Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {visitors?.map((v) => (
            <tr
              key={v.id || v._id}
              className="hover:bg-slate-50/70 transition"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {v.selfie ? (
                    <img src={v.selfie} alt={v.name} className="h-9 w-9 rounded-xl object-cover border border-slate-300" />
                  ) : (
                    <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                      {(v.name || v.fullName || "V").slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-slate-900">{v.name || v.fullName}</p>
                    <p className="text-[11px] text-slate-500">{v.phone || v.mobile}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-600 hidden sm:table-cell font-medium">
                {v.company || "Independent"}
              </td>
              <td className="px-4 py-3">
                <p className="font-bold text-indigo-700 flex items-center gap-1">
                  <HardHat size={12} />
                  {v.department || "General Plant"}
                </p>
                <p className="text-[10px] text-slate-500">Host: {v.hostEmployee || "Plant Officer"}</p>
              </td>
              <td className="px-4 py-3">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                  <Award size={12} />
                  {v.quizScore || 100}%
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-800 border border-indigo-200 uppercase tracking-wider inline-flex items-center gap-1">
                  <ShieldCheck size={12} />
                  {v.preAuthStatus || "Pre-Authorized"}
                </span>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={v.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {(!visitors || visitors.length === 0) && (
        <div className="py-12 text-center text-xs text-slate-500">No visitors registered yet.</div>
      )}
    </div>
  )
}
