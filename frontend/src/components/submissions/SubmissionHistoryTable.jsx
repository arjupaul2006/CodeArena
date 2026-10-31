import React, { useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { UserDataContext } from "../../context/UserContext";
import axios from "axios";

// Mock empty historical dataset or rows tracking code execution values
const mockSubmissions = [
  {
    verdict: "Accepted",
    problem: "Search in Rotated Sorted Array",
    language: "C++",
    runtime: "4 ms",
    memory: "11.2 MB",
    date: "May 22, 2026",
    color: "text-emerald-700",
  },
  {
    verdict: "Accepted",
    problem: "Median of Two Sorted Arrays",
    language: "Python",
    runtime: "48 ms",
    memory: "14.1 MB",
    date: "May 20, 2026",
    color: "text-emerald-700",
  },
  {
    verdict: "Wrong Answer",
    problem: "3Sum",
    language: "Java",
    runtime: "N/A",
    memory: "N/A",
    date: "May 18, 2026",
    color: "text-rose-700",
  },
];

export default function SubmissionHistoryTable() {

  const [submissionHistory, setSubmissionHistory] = React.useState([]);

  // Fetch submission history from the backend API
  useEffect(() => {
    // Fetch submission history from the backend API
    const fetchSubmissionHistory = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL // Fallback to localhost if not set

        const response = await axios.get(
          `${backendUrl}/api/submissionHistory`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store the token in localStorage
            },
          },
        );
        const data = await response.data;
        console.log("Submission history:", data);
        setSubmissionHistory(data.submissions || []);
      } catch (error) {
        console.error("Error fetching submission history:", error);
      }
    };

    fetchSubmissionHistory();
  }, []);

  return (
    <div className="bg-[#f4faf1] rounded-2xl border border-[#b7d2bb] shadow-lg overflow-hidden">
      {/* Filtering toolbar block headers */}
      <div className="p-4 sm:px-6 border-b border-[#b7d2bb] bg-[#eef7eb] flex flex-col sm:flex-row gap-3 justify-between sm:items-center">
        <h3 className="text-base font-bold text-[#183226] tracking-tight">
          Submission History
        </h3>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Dropdown 1 */}
          <button className="bg-[#ffffff] hover:bg-[#dcecdf] text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-[#b7d2bb] text-[#244333] flex items-center gap-1.5 transition-colors cursor-pointer">
            All Verdicts <ChevronDown className="w-3.5 h-3.5 text-[#668170]" />
          </button>
          {/* Dropdown 2 */}
          <button className="bg-[#ffffff] hover:bg-[#dcecdf] text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-[#b7d2bb] text-[#244333] flex items-center gap-1.5 transition-colors cursor-pointer">
            All Languages <ChevronDown className="w-3.5 h-3.5 text-[#668170]" />
          </button>
        </div>
      </div>

      {/* Layout Scroll containment body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#b7d2bb] text-[11px] uppercase tracking-wider text-[#547060] font-bold bg-[#e8f3e8]">
              <th className="py-3.5 px-6">Verdict</th>
              <th className="py-3.5 px-6">Problem</th>
              <th className="py-3.5 px-6">Language</th>
              <th className="py-3.5 px-6">Runtime</th>
              <th className="py-3.5 px-6">Memory</th>
              <th className="py-3.5 px-6">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#b7d2bb] text-sm font-medium text-[#244333]">
            {submissionHistory.length > 0 ? (
              submissionHistory.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-[#eef7eb] transition-colors cursor-pointer"
                >
                  <td className={`py-4 px-6 font-bold font-mono ${row?.status == "accepted" ? "text-emerald-700" : "text-rose-700"}`}>
                    {row?.status == "accepted" ? "Accepted" : "Wrong Answer"}
                  </td>
                  <td className="py-4 px-6 text-[#183226] font-semibold hover:text-[#2f6b45] transition-colors">
                    {row?.problemId?.title}
                  </td>
                  <td className="py-4 px-6 text-[#547060] font-mono text-xs">
                    {row.language}
                  </td>
                  <td className="py-4 px-6 text-[#547060] font-mono text-xs">
                    {row.runtime} ms
                  </td>
                  <td className="py-4 px-6 text-[#547060] font-mono text-xs">
                    {row.memory} KB
                  </td>
                  <td className="py-4 px-6 text-[#668170] text-xs">
                    {new Date(row.submissionDate).toDateString() } at {new Date(row.submissionDate).toLocaleTimeString()}
                  </td>
                </tr>
              ))
            ) : (
              /* fallback structure placeholder matching your snapshot exactly */
              <tr>
                <td
                  colSpan="6"
                  className="py-12 text-center text-sm text-[#547060] font-medium"
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
