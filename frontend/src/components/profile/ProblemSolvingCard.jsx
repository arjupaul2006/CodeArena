import React, { useEffect } from "react";
import {
  CheckCircle2,
  Code2,
  Flame,
  Layers,
  ChevronRight,
  TrendingUp,
  Sparkles,
  BarChart2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProblemSolvingCard({
  problemSolving,
  problems,
  solvedProblemCategories,
  totalProblemCategories,
  totalDifficultyCounts,
  solvedDifficultyCounts,
  submissionHistory,
}) {
  const difficulty = [
    {
      label: "Easy",
      solved: solvedDifficultyCounts.easy || 0,
      total: totalDifficultyCounts.easy || 0,
    },
    {
      label: "Medium",
      solved: solvedDifficultyCounts.medium || 0,
      total: totalDifficultyCounts.medium || 0,
    },
    {
      label: "Hard",
      solved: solvedDifficultyCounts.hard || 0,
      total: totalDifficultyCounts.hard || 0,
    },
  ];

  const navigation = useNavigate();

  // const pending = problemSolving.pending || 0;
  const mostPracticed = problemSolving.mostPracticed || "N/A";
  const recentlySolved = submissionHistory.slice(0, 5);

  const totalSolved = difficulty.reduce((sum, d) => sum + (d.solved || 0), 0);
  const totalAvailable = difficulty.reduce((sum, d) => sum + (d.total || 0), 0);
  const overallPercentage =
    totalAvailable > 0 ? Math.round((totalSolved / totalAvailable) * 100) : 0;

  const categories = Object.keys(totalProblemCategories);

  const pending = submissionHistory.filter((submission, index, arr) => {
    return (
      submission.status === "Wrong Answer" &&
      !arr.some(
        (s) => s.problemId === submission.problemId && s.status === "Accepted",
      )
    );
  })?.length || 0;

  return (
    <section className="mt-6 rounded-3xl border border-[#b7d2bb] bg-[#f4faf1] p-5 sm:p-8 shadow-xl shadow-[#8eae94]/20 transition-all">
      {/* Header with Title and Pending Badge */}
      <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-[#3f7d55]" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3f7d55]">
              Problem Solving Skills
            </p>
          </div>
          <h2 className="mt-1.5 text-2xl sm:text-3xl font-black tracking-tight text-[#183226]">
            Difficulty & Topic Mastery
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-xl border border-[#b7d2bb] bg-[#e8f3e8] px-4 py-2 text-xs sm:text-sm font-bold text-[#385a43] shadow-xs">
            <span className="font-extrabold text-[#3f7d55]">{pending}</span>{" "}
            pending problems
          </span>
        </div>
      </div>

      {/* Difficulty Breakdown - 3 Sleek Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {difficulty.map((diff) => {
          const progress =
            diff.total > 0 ? Math.round((diff.solved / diff.total) * 100) : 0;

          // Theme styling per difficulty
          const theme =
            diff.label === "Easy"
              ? {
                  badge: "bg-emerald-100 text-emerald-800 border-emerald-300",
                  bar: "bg-emerald-500",
                  track: "bg-emerald-100/70",
                  glow: "shadow-emerald-500/10",
                }
              : diff.label === "Medium"
                ? {
                    badge: "bg-amber-100 text-amber-800 border-amber-300",
                    bar: "bg-amber-500",
                    track: "bg-amber-100/70",
                    glow: "shadow-amber-500/10",
                  }
                : {
                    badge: "bg-rose-100 text-rose-800 border-rose-300",
                    bar: "bg-rose-500",
                    track: "bg-rose-100/70",
                    glow: "shadow-rose-500/10",
                  };

          return (
            <div
              key={diff.label}
              className={`relative overflow-hidden rounded-2xl border border-[#b7d2bb] bg-[#e8f3e8]/70 p-5 transition-all hover:bg-[#e8f3e8] hover:shadow-md ${theme.glow}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-lg border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${theme.badge}`}
                >
                  {diff.label}
                </span>
                <span className="text-sm font-extrabold text-[#183226]">
                  {diff.solved}{" "}
                  <span className="text-xs font-medium text-[#668170]">
                    / {diff.total}
                  </span>
                </span>
              </div>

              {/* Visual Progress Bar */}
              <div
                className={`mt-4 h-2.5 w-full overflow-hidden rounded-full ${theme.track}`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${theme.bar}`}
                  style={{
                    width: `${Math.max(progress, diff.solved ? 4 : 0)}%`,
                  }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#547060]">
                  {progress}% Solved
                </span>
                <span className="text-[#668170]">
                  {diff.total - diff.solved} Remaining
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two-Column Grid: Topic-wise Progress & Focus Areas */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Left: Topic-wise Progress */}
        <div className="rounded-2xl border border-[#b7d2bb] bg-white/40 p-5 sm:p-6 backdrop-blur-xs">
          <div className="flex items-center justify-between border-b border-[#b7d2bb]/60 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#3f7d55]" />
              <h3 className="font-black text-[#183226] text-base">
                Topic-Wise Breakdown
              </h3>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#668170]">
              Completed
            </span>
          </div>

          <div className="mt-4 space-y-4">
            {categories.map((topic) => {
              const solved = solvedProblemCategories[topic] || 0;
              const total = totalProblemCategories[topic] || 0;

              return (
                <div key={topic} className="group">
                  <div className="mb-1.5 flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-[#385a43] group-hover:text-[#183226] transition-colors">
                      {topic}
                    </span>
                    <span className="font-bold text-[#3f7d55] bg-[#e8f3e8] px-2 py-0.5 rounded-md border border-[#b7d2bb]">
                      {solved} solved
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[#dcecdf]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#59986b] to-[#3f7d55] transition-all duration-300"
                      style={{
                        width: `${Math.round((solved / total) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Most Practiced & Recently Solved */}
        <div className="flex flex-col gap-5">
          {/* Most Practiced Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#183226] to-[#2b593d] p-5 sm:p-6 text-white shadow-lg">
            <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-[#76a980]/20 blur-xl pointer-events-none" />
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-300" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#c5dfc9]">
                Most Practiced Domain
              </p>
            </div>
            <p className="mt-2 text-2xl sm:text-3xl font-black text-white">
              {mostPracticed}
            </p>
            <p className="mt-1 text-xs text-[#dcecdf]">
              Consistently high accuracy and fastest solve velocity.
            </p>
          </div>

          {/* Recently Solved List */}
          <div className="flex-1 rounded-2xl border border-[#b7d2bb] bg-white/40 p-5 backdrop-blur-xs">
            <div className="flex items-center justify-between border-b border-[#b7d2bb]/60 pb-3">
              <h3 className="font-black text-[#183226] text-sm">
                Recently Solved
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#3f7d55]">
                Verified
              </span>
            </div>

            <ul className="mt-3.5 space-y-2.5">
              {recentlySolved.map((problem) => (
                <li
                  key={problem?.problemId}
                  className="flex items-center justify-between rounded-xl border border-[#b7d2bb]/50 bg-[#e8f3e8]/50 px-3 py-2 text-xs font-semibold text-[#183226] transition-colors hover:bg-[#e8f3e8]"
                >
                  <div
                    className="flex items-center gap-2 truncate"
                    onClick={() =>
                      navigation(`/write-code?id=${problem?.problemId?._id}`)
                    }
                    cursor="pointer"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    <span className="truncate">
                      {problem?.problemId?.title}
                    </span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#668170]" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
