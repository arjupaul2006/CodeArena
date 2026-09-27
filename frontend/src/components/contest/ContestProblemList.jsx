import React from "react";
import { CheckCircle2, Code2, Filter, Info, Search, X } from "lucide-react";

export default function ContestProblemList({
  filteredProblems,
  searchQuery,
  setSearchQuery,
  difficultyFilter,
  setDifficultyFilter,
  onSelectProblemModal,
  onSolveProblem,
  getDifficultyBadge,
}) {
  return (
    <div className="space-y-4">
      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#668170]" />
          <input
            type="text"
            placeholder="Search by title, tag, or letter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#b7d2bb] bg-[#f4faf1] pl-10 pr-4 py-2 text-xs font-medium text-[#183226] placeholder-[#668170] focus:border-[#3f7d55] focus:outline-none focus:ring-1 focus:ring-[#3f7d55]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#668170] hover:text-[#183226]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <Filter className="h-4 w-4 text-[#547060]" />
          <span className="text-[#668170]">Difficulty:</span>
          {["All", "Easy", "Medium", "Hard"].map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                difficultyFilter === diff
                  ? "bg-[#3f7d55] text-white"
                  : "bg-[#f4faf1] text-[#547060] border border-[#b7d2bb] hover:border-[#8eae94]"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Problems Cards / Table */}
      <div className="grid grid-cols-1 gap-4">
        {filteredProblems.length > 0 ? (
          filteredProblems.map((problem) => (
            <div
              key={problem._id || problem.letter}
              className="group flex flex-col justify-between gap-4 rounded-2xl border border-[#b7d2bb] bg-[#f4faf1] p-5 shadow-sm transition-all hover:border-[#8eae94] hover:shadow-md md:flex-row md:items-center"
            >
              <div className="flex items-start gap-4">
                {/* Problem Letter Icon Badge */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-black text-lg transition-transform group-hover:scale-105 ${
                    problem.status === "solved"
                      ? "bg-emerald-500/20 text-emerald-800 border border-emerald-500/40"
                      : "bg-[#c5dfc9] text-[#3f7d55] border border-[#8eae94]/40"
                  }`}
                >
                  {problem.status === "solved" ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-700" />
                  ) : (
                    problem.letter
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs text-[#3f7d55]">
                      Problem {problem.letter}
                    </span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getDifficultyBadge(
                        problem.difficulty
                      )}`}
                    >
                      {problem.difficulty}
                    </span>
                    <span className="rounded-full bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                      {problem.points} pts
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectProblemModal(problem)}
                    className="text-base font-bold text-[#183226] cursor-pointer hover:text-[#3f7d55] transition-colors"
                  >
                    {problem.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#668170]">
                    <span>
                      Acceptance:{" "}
                      <strong className="text-[#244333]">
                        {(
                          ((problem.solvedCount || 100) / (problem.totalAttempts || 200)) *
                          100
                        ).toFixed(1)}
                        %
                      </strong>{" "}
                      ({problem.solvedCount} / {problem.totalAttempts})
                    </span>
                    <span>•</span>
                    <span>Time Limit: {problem.timeLimit || 2000}ms</span>
                    <span>•</span>
                    <span>Memory: {problem.memoryLimit || 128}MB</span>
                  </div>

                  {/* Tag Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {problem.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-[#eef7eb] border border-[#b7d2bb] px-2 py-0.5 text-[10px] font-medium text-[#547060]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Problem Actions */}
              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => onSelectProblemModal(problem)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#b7d2bb] bg-[#eef7eb] px-3.5 py-2 text-xs font-bold text-[#3f7d55] transition-all hover:bg-[#c5dfc9] hover:text-[#183226]"
                >
                  <Info className="h-3.5 w-3.5" />
                  Quick View
                </button>

                <button
                  onClick={() => onSolveProblem(problem)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#3f7d55] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#8eae94]/30 transition-all hover:bg-[#326844] hover:shadow-lg"
                >
                  <Code2 className="h-4 w-4" />
                  Solve Challenge
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-[#b7d2bb] bg-[#f4faf1] p-12 text-center text-sm text-[#668170]">
            No problems matching your current filter search.
          </div>
        )}
      </div>
    </div>
  );
}
