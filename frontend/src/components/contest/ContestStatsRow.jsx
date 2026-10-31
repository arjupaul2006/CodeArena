import React from "react";
import { BarChart2, CheckCircle2, Trophy, Zap } from "lucide-react";

export default function ContestStatsRow({ contest, solvedCount, attempts = 0 }) {
  const totalProblems = contest.problems?.length || 4;
  const progressPercent = Math.min(100, (solvedCount / totalProblems) * 100).toFixed(0);

  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="rounded-2xl border border-[#b7d2bb] bg-[#f4faf1] p-4 shadow-sm hover:border-[#8eae94] transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#668170]">Problems Solved</span>
          <CheckCircle2 className="h-4 w-4 text-[#3f7d55]" />
        </div>
        <p className="mt-2 text-2xl font-black text-[#183226]">
          {solvedCount} <span className="text-xs font-medium text-[#668170]">/ {totalProblems}</span>
        </p>
        <div className="mt-2 h-1.5 w-full rounded-full bg-[#dcecdf]">
          <div
            className="h-1.5 rounded-full bg-[#3f7d55]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-[#b7d2bb] bg-[#f4faf1] p-4 shadow-sm hover:border-[#8eae94] transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#668170]">Your Score</span>
          <Trophy className="h-4 w-4 text-amber-600" />
        </div>
        <p className="mt-2 text-2xl font-black text-[#183226]">
          {contest.problems
            ?.filter((problem) => problem.status === "solved")
            .reduce((score, problem) => score + (problem.score || 0), 0) || 0}{" "}
          <span className="text-xs font-normal text-[#668170]">pts</span>
        </p>
        <p className="mt-1 text-[11px] font-medium text-[#547060]">Penalty: 00:25:30</p>
      </div>

      <div className="rounded-2xl border border-[#b7d2bb] bg-[#f4faf1] p-4 shadow-sm hover:border-[#8eae94] transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#668170]">Global Rank</span>
          <BarChart2 className="h-4 w-4 text-[#3f7d55]" />
        </div>
        <p className="mt-2 text-2xl font-black text-[#183226]">
          {contest.userRank ? `#${contest.userRank}` : "—"}
        </p>
        <p className="mt-1 text-[11px] font-medium text-[#547060]">
          {contest.userRank
            ? `Position among ${contest.participantsCount || contest.participants?.length || 0} competitors`
            : "Submit a solution to get ranked"}
        </p>
      </div>

      <div className="rounded-2xl border border-[#b7d2bb] bg-[#f4faf1] p-4 shadow-sm hover:border-[#8eae94] transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#668170]">Accuracy</span>
          <Zap className="h-4 w-4 text-amber-500" />
        </div>
        <p className="mt-2 text-2xl font-black text-[#183226]">66.7%</p>
        <p className="mt-1 text-[11px] font-medium text-[#547060]">
          {attempts} {attempts === 1 ? "attempt" : "attempts"} recorded
        </p>
      </div>
    </section>
  );
}
