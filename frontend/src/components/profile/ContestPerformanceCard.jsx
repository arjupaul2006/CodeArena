import React from "react";
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Zap,
  TrendingUp,
  Target,
  Star,
} from "lucide-react";

export default function ContestPerformanceCard({ contestStats = [], user }) {
  const getContestIcon = (label) => {
    switch (label) {
      case "Contests Participated":
        return Target;
      case "Total Contest Score":
        return Star;
      case "Highest Contest Score":
        return Zap;
      case "Average Contest Score":
        return TrendingUp;
      case "Contest Rank":
        return Medal;
      case "Best Rank":
        return Trophy;
      case "Contests Won":
        return Crown;
      default:
        return Award;
    }
  };


  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-[#b7d2bb] bg-[#f4faf1] shadow-xl shadow-[#8eae94]/20 transition-all">
      {/* Contest Banner Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1e4530] via-[#2d6142] to-[#3f7d55] p-6 text-white sm:p-8">
        <div className="absolute -right-10 -bottom-10 h-44 w-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-300" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c5dfc9]">
                Competitive Arena Record
              </p>
            </div>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-black tracking-tight text-white">
              Contest Performance
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[#dcecdf]">
              Live contest ratings, leaderboard standing, and tournament trophies.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto rounded-full border border-white/20 bg-black/20 px-4 py-2 backdrop-blur-md">
            <Crown className="h-4 w-4 text-amber-300" />
            <span className="text-xs font-bold text-white">
              Top 2% Leaderboard
            </span>
          </div>
        </div>
      </div>

      {/* Contest Metrics Grid */}
      <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3 xl:grid-cols-4">
        {contestStats.map((stat) => {
          const Icon = getContestIcon(stat.label);
          const isHighPriority =
            stat.label === "Contest Rank" || stat.label === "Best Rank" || stat.label === "Contests Won";

          return (
            <div
              key={stat.label}
              className={`relative overflow-hidden rounded-2xl border p-4.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
                isHighPriority
                  ? "border-[#76a980] bg-[#e8f3e8] shadow-xs"
                  : "border-[#b7d2bb] bg-white/50 hover:bg-[#e8f3e8]/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#547060]">
                  {stat.label}
                </span>
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                    isHighPriority
                      ? "bg-[#3f7d55] text-white"
                      : "bg-[#dcecdf] text-[#3f7d55]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>

              <p className="mt-3 text-2xl font-black tracking-tight text-[#183226]">
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-[#668170]">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

