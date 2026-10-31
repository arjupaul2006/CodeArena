import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function ContestSubmissionsLog({ submissions }) {
  return (
    <div className="rounded-2xl border border-[#b7d2bb] bg-[#f4faf1] p-5 shadow-sm">
      <h3 className="font-bold text-[#183226] text-lg mb-4">My Submissions Log</h3>

      {submissions?.length ? (
        <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#244333]">
          <thead className="border-b border-[#b7d2bb] bg-[#eef7eb] text-[11px] font-bold uppercase tracking-wider text-[#547060]">
            <tr>
              <th className="px-4 py-3">Submission ID</th>
              <th className="px-4 py-3">Problem</th>
              <th className="px-4 py-3">Language</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Runtime</th>
              <th className="px-4 py-3">Memory</th>
              <th className="px-4 py-3">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dcecdf]">
            {submissions?.map((sub) => (
              <tr key={sub.id} className="hover:bg-[#eef7eb]/60 transition-colors">
                <td className="px-4 py-3 font-mono text-[11px] text-[#668170]">
                  {sub.id}
                </td>
                <td className="px-4 py-3 font-bold text-[#183226]">
                  Problem {sub.problemLetter}: {sub.problemTitle}
                </td>
                <td className="px-4 py-3 text-[#547060]">{sub.language}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      sub.status === "Accepted"
                        ? "bg-emerald-500/15 text-emerald-800 border border-emerald-500/30"
                        : "bg-rose-500/15 text-rose-800 border border-rose-500/30"
                    }`}
                  >
                    {sub.status === "Accepted" ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <XCircle className="h-3 w-3 text-rose-600" />
                    )}
                    {sub.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono">{sub.runtime}</td>
                <td className="px-4 py-3 font-mono">{sub.memory}</td>
                <td className="px-4 py-3 text-[#668170]">{sub.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-[#b7d2bb] bg-[#eef7eb] p-8 text-center text-sm text-[#668170]">
          No submissions for this contest yet.
        </p>
      )}
    </div>
  );
}
