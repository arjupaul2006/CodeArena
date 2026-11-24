import React from "react";
import {
  Flame,
  CheckCircle2,
  XCircle,
  Percent,
  Sparkles,
  Award,
  Zap,
  TrendingUp,
  Target,
} from "lucide-react";

export default function ProfileStatsOverview({
  acceptanceRate = "75%",
  submissionHistory = [],
  streaks = { currentStreak: 0, maxStreak: 0 },
}) {
  const totalSubmissions = submissionHistory.length;

  const wrongAnswers = submissionHistory.filter(
    (submission) => submission.status === "wrong Answer",
  ).length;

  const acceptedSubmissions = submissionHistory.filter(
    (submission) => submission.status === "accepted",
  ).length;

  // Mapping labels to specific icons and tone styles
  const getStatMeta = (label) => {
    switch (label) {
      case "Total Submissions":
        return {
          icon: Target,
          accent: "text-emerald-700 bg-emerald-100/80 border-emerald-300",
          tag: "Overall attempts",
        };
      case "Accepted Submissions":
        return {
          icon: CheckCircle2,
          accent: "text-emerald-600 bg-emerald-100 border-emerald-300",
          tag: "Verified AC",
        };
      case "Wrong Answers":
        return {
          icon: XCircle,
          accent: "text-amber-700 bg-amber-100 border-amber-300",
          tag: "Learning steps",
        };
      case "Acceptance Rate":
        return {
          icon: Percent,
          accent: "text-blue-700 bg-blue-100 border-blue-300",
          tag: "Accuracy",
        };
      case "Maximum Streak":
      case "Longest Submission Streak":
        return {
          icon: Flame,
          accent: "text-orange-600 bg-orange-100 border-orange-300",
          tag: "Consistency",
        };
      default:
        return {
          icon: TrendingUp,
          accent: "text-[#3f7d55] dark:text-[#86c79a] bg-[#e8f3e8] dark:bg-[#111813] border-[#b7d2bb] dark:border-[#405747]",
          tag: "Metric",
        };
    }
  };

  const stats = [
    { label: "Total Submissions", value: `${totalSubmissions}` },
    { label: "Accepted Submissions", value: `${acceptedSubmissions}` },
    { label: "Wrong Answers", value: `${wrongAnswers}` },
    { label: "Acceptance Rate", value: "75%" },
    { label: "Maximum Streak", value: `${streaks.maxStreak} days` },
    { label: "Current Streak", value: `${streaks.currentStreak} days` },
  ];

  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-[#b7d2bb] dark:border-[#405747] bg-[#f4faf1] dark:bg-[#172019] shadow-xl shadow-[#8eae94]/20 transition-all">
      {/* Header with High-Impact Banner */}
      <div className="flex flex-col justify-between gap-5 bg-gradient-to-br from-[#183226] via-[#244b34] to-[#3f7d55] p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c5dfc9] dark:text-[#b9d7bf]">
              Coding Activity & Metrics
            </p>
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-white">
            Performance Overview
          </h2>
          <p className="mt-1.5 max-w-md text-xs sm:text-sm text-[#dcecdf]">
            Comprehensive breakdown of problem solving accuracy, discipline
            streaks, and submission records.
          </p>
        </div>

        {/* Highlight Quick Card */}
        <div className="flex items-center gap-4 rounded-2xl border border-white/20 bg-white dark:bg-[#172019]/10 px-5 py-3.5 backdrop-blur-md shadow-inner">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-[#172019]/15 text-emerald-300 border border-white/10">
            <Percent className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#c5dfc9] dark:text-[#b9d7bf]">
              Overall Accuracy
            </p>
            <p className="text-2xl font-black tracking-tight text-white">
              {acceptanceRate}
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid gap-3.5 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
        {stats.map((stat, index) => {
          const meta = getStatMeta(stat.label);
          const Icon = meta.icon;

          return (
            <div
              key={stat.label}
              className={`group relative overflow-hidden rounded-2xl border p-4.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                index < 3
                  ? "border-[#a6cbaa] dark:border-[#405747] bg-[#e8f3e8] dark:bg-[#111813]/90"
                  : "border-[#b7d2bb] dark:border-[#405747] bg-white dark:bg-[#172019]/60 hover:bg-[#e8f3e8] dark:hover:bg-[#1a241d] dark:bg-[#111813]/50"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs ${meta.accent}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#183226] dark:text-[#edf4ef]">
                      {stat.label}
                    </p>
                    <span className="text-[10px] font-medium text-[#668170] dark:text-[#aabdaf]">
                      {meta.tag}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3.5 flex items-baseline justify-between border-t border-[#b7d2bb] dark:border-[#405747]/50 pt-3">
                <p className="text-2xl font-black tracking-tight text-[#183226] dark:text-[#edf4ef]">
                  {stat.value}
                </p>
                <span className="h-1.5 w-1.5 rounded-full bg-[#76a980] transition-transform duration-300 group-hover:scale-150 group-hover:bg-[#3f7d55]" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
