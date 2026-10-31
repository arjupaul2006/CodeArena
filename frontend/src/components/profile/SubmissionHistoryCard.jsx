import React, { useState } from "react";
import {
  Clock,
  Cpu,
  HardDrive,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
  Code2,
  Filter,
} from "lucide-react";

export default function SubmissionHistoryCard({ submissions = [] }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filterOptions = [
    "All",
    "Accepted",
    "Wrong Answer",
    "Runtime Error",
    "TLE",
    "Compilation Error",
  ];

  const filteredSubmissions =
    activeFilter === "All"
      ? submissions
      : submissions.filter((s) => s.status === activeFilter);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Accepted":
        return {
          label: "Accepted",
          style: "bg-emerald-100 text-emerald-800 border-emerald-300",
          dot: "bg-emerald-500",
          icon: CheckCircle2,
        };
      case "Wrong Answer":
        return {
          label: "Wrong Answer",
          style: "bg-amber-100 text-amber-800 border-amber-300",
          dot: "bg-amber-500",
          icon: XCircle,
        };
      case "TLE":
        return {
          label: "Time Limit Exceeded",
          style: "bg-orange-100 text-orange-800 border-orange-300",
          dot: "bg-orange-500",
          icon: AlertTriangle,
        };
      case "Compilation Error":
        return {
          label: "Compilation Error",
          style: "bg-violet-100 text-violet-800 border-violet-300",
          dot: "bg-violet-500",
          icon: AlertTriangle,
        };
      default:
        return {
          label: status,
          style: "bg-rose-100 text-rose-800 border-rose-300",
          dot: "bg-rose-500",
          icon: AlertTriangle,
        };
    }
  };

  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-[#b7d2bb] bg-[#f4faf1] shadow-xl shadow-[#8eae94]/20 transition-all">
      {/* Header and Filter Tabs */}
      <div className="border-b border-[#b7d2bb] p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-[#3f7d55]" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3f7d55]">
                Submission Audit Stream
              </p>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-[#183226]">
              Recent Submissions
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#547060]">
            Showing {filteredSubmissions.length} of {submissions.length} attempts
          </span>
        </div>

        {/* Scrollable Filter Chips */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
          {filterOptions.map((filter) => {
            const count =
              filter === "All"
                ? submissions.length
                : submissions.filter((s) => s.status === filter).length;

            const isActive = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#3f7d55] text-white shadow-sm shadow-[#3f7d55]/40"
                    : "bg-[#e8f3e8] text-[#547060] border border-[#b7d2bb] hover:bg-[#dcecdf] hover:text-[#183226]"
                }`}
              >
                <span>{filter}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#c5dfc9] text-[#244333]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submission Rows */}
      <div className="divide-y divide-[#d5e7d7]">
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((submission, index) => {
            const badge = getStatusBadge(submission.status);
            const StatusIcon = badge.icon;

            return (
              <div
                key={`${submission.problem}-${submission.submittedAt}-${index}`}
                className="group p-4 sm:p-6 transition-all hover:bg-[#e8f3e8]/70"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left Column: Problem Name & Meta */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className="truncate font-extrabold text-[#183226] text-base group-hover:text-[#3f7d55] transition-colors">
                        {submission.problem}
                      </h3>
                      <span className="rounded-md border border-[#b7d2bb] bg-[#e8f3e8] px-2 py-0.5 text-[11px] font-mono font-bold text-[#385a43]">
                        {submission.language}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#668170]">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-[#76a980]" />
                        {submission.submittedAt}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Execution Metrics & Status Chip */}
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs">
                    {submission.executionTime && submission.executionTime !== "—" && (
                      <div className="flex items-center gap-1.5 rounded-xl border border-[#b7d2bb] bg-[#e8f3e8] px-2.5 py-1.5 font-mono text-[#385a43]">
                        <Cpu className="h-3.5 w-3.5 text-[#547060]" />
                        <span>{submission.executionTime}</span>
                      </div>
                    )}

                    {submission.memory && submission.memory !== "—" && (
                      <div className="flex items-center gap-1.5 rounded-xl border border-[#b7d2bb] bg-[#e8f3e8] px-2.5 py-1.5 font-mono text-[#385a43]">
                        <HardDrive className="h-3.5 w-3.5 text-[#547060]" />
                        <span>{submission.memory}</span>
                      </div>
                    )}

                    {submission.tests && (
                      <div className="flex items-center gap-1.5 rounded-xl border border-[#b7d2bb] bg-[#e8f3e8] px-2.5 py-1.5 font-mono font-semibold text-[#183226]">
                        <span className="text-[#668170]">Tests:</span>
                        <span>{submission.tests}</span>
                      </div>
                    )}

                    {/* Status Pill */}
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-bold ${badge.style}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
                      <span>{submission.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center">
            <Filter className="mx-auto h-8 w-8 text-[#a6cbaa]" />
            <p className="mt-2 text-sm font-semibold text-[#183226]">
              No submissions found for "{activeFilter}"
            </p>
            <p className="mt-0.5 text-xs text-[#668170]">
              Try selecting a different filter above.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

