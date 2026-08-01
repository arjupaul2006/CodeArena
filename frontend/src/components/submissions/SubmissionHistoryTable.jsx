import React from "react";
import { ChevronDown } from "lucide-react";

// Mock empty historical dataset or rows tracking code execution values
const mockSubmissions = [
  {
    verdict: "Accepted",
    problem: "Search in Rotated Sorted Array",
    language: "C++",
    runtime: "4 ms",
    memory: "11.2 MB",
    date: "May 22, 2026",
    color: "text-emerald-400",
  },
  {
    verdict: "Accepted",
    problem: "Median of Two Sorted Arrays",
    language: "Python",
    runtime: "48 ms",
    memory: "14.1 MB",
    date: "May 20, 2026",
    color: "text-emerald-400",
  },
  {
    verdict: "Wrong Answer",
    problem: "3Sum",
    language: "Java",
    runtime: "N/A",
    memory: "N/A",
    date: "May 18, 2026",
    color: "text-rose-400",
  },
];

export default function SubmissionHistoryTable() {
  return (
    <div className="bg-[#1c0d12]/90 rounded-2xl border border-rose-950/80 shadow-lg overflow-hidden">
      {/* Filtering toolbar block headers */}
      <div className="p-4 sm:px-6 border-b border-rose-950/80 bg-[#12080a] flex flex-col sm:flex-row gap-3 justify-between sm:items-center">
        <h3 className="text-base font-bold text-white tracking-tight">
          Submission History
        </h3>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Dropdown 1 */}
          <button className="bg-[#12080a] hover:bg-rose-950/40 text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-rose-950 text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer">
            All Verdicts <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>
          {/* Dropdown 2 */}
          <button className="bg-[#12080a] hover:bg-rose-950/40 text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-rose-950 text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer">
            All Languages <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Layout Scroll containment body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-rose-950 text-[11px] uppercase tracking-wider text-slate-400 font-bold bg-[#12080a]">
              <th className="py-3.5 px-6">Verdict</th>
              <th className="py-3.5 px-6">Problem</th>
              <th className="py-3.5 px-6">Language</th>
              <th className="py-3.5 px-6">Runtime</th>
              <th className="py-3.5 px-6">Memory</th>
              <th className="py-3.5 px-6">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-950/60 text-sm font-medium text-slate-300">
            {mockSubmissions.length > 0 ? (
              mockSubmissions.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-rose-950/30 transition-colors cursor-pointer"
                >
                  <td className={`py-4 px-6 font-bold font-mono ${row.color}`}>
                    {row.verdict}
                  </td>
                  <td className="py-4 px-6 text-white font-semibold hover:text-rose-400 transition-colors">
                    {row.problem}
                  </td>
                  <td className="py-4 px-6 text-slate-400 font-mono text-xs">
                    {row.language}
                  </td>
                  <td className="py-4 px-6 text-slate-400 font-mono text-xs">
                    {row.runtime}
                  </td>
                  <td className="py-4 px-6 text-slate-400 font-mono text-xs">
                    {row.memory}
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-xs">
                    {row.date}
                  </td>
                </tr>
              ))
            ) : (
              /* fallback structure placeholder matching your snapshot exactly */
              <tr>
                <td
                  colSpan="6"
                  className="py-12 text-center text-sm text-slate-500 font-medium"
                >
                  No submissions logged matching current search filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
