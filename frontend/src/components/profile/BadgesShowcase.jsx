import React from "react";
import {
  Award,
  Flame,
  Zap,
  Trophy,
  Shield,
  Sparkles,
  Target,
  CheckCircle2,
} from "lucide-react";

export default function BadgesShowcase() {
  const badges = [
    {
      id: "streak_30",
      title: "30-Day Flame",
      description: "Maintained a continuous 30+ day coding streak",
      icon: Flame,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-700 bg-amber-50 border-amber-200",
      unlocked: true,
      tier: "Gold",
    },
    {
      id: "century_coder",
      title: "Century Solver",
      description: "Successfully solved 100+ unique algorithmic problems",
      icon: Target,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      unlocked: true,
      tier: "Platinum",
    },
    {
      id: "contest_victor",
      title: "Arena Victor",
      description: "Finished 1st place in an official CodeArena contest",
      icon: Trophy,
      color: "from-yellow-400 to-amber-500",
      textColor: "text-amber-800 bg-yellow-50 border-yellow-200",
      unlocked: true,
      tier: "Diamond",
    },
    {
      id: "speed_demon",
      title: "Sub-50ms Demon",
      description: "Authored solutions beating 95%+ execution velocity",
      icon: Zap,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-700 bg-blue-50 border-blue-200",
      unlocked: true,
      tier: "Master",
    },
    {
      id: "guardian",
      title: "Clean Sheet",
      description: "Submitted 10 consecutive accepted problems without WA",
      icon: Shield,
      color: "from-emerald-600 to-emerald-800",
      textColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      unlocked: false,
      tier: "Silver",
    },
    {
      id: "grandmaster",
      title: "Grandmaster",
      description: "Attain a contest leaderboard rating exceeding 2,200",
      icon: Sparkles,
      color: "from-purple-500 to-pink-600",
      textColor: "text-purple-700 bg-purple-50 border-purple-200",
      unlocked: false,
      tier: "Mythic",
    },
  ];

  return (
    <section className="mt-6 rounded-3xl border border-[#b7d2bb] dark:border-[#405747] bg-[#f4faf1] dark:bg-[#172019] p-5 sm:p-7 shadow-xl shadow-[#8eae94]/20 transition-all">
      <div className="flex items-center justify-between border-b border-[#b7d2bb] dark:border-[#405747]/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-[#3f7d55] dark:text-[#86c79a]" />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3f7d55] dark:text-[#86c79a]">
              Honor Roll & Milestones
            </p>
          </div>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-[#183226] dark:text-[#edf4ef]">
            Earned Badges
          </h2>
        </div>
        <span className="rounded-full bg-[#e8f3e8] dark:bg-[#111813] border border-[#b7d2bb] dark:border-[#405747] px-3 py-1 text-xs font-bold text-[#3f7d55] dark:text-[#86c79a]">
          4 Unlocked
        </span>
      </div>

      <div className="mt-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {badges.map((badge) => {
          const Icon = badge.icon;

          return (
            <div
              key={badge.id}
              className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-1 ${
                badge.unlocked
                  ? "border-[#a6cbaa] dark:border-[#405747] bg-[#e8f3e8] dark:bg-[#111813]/70 hover:bg-[#e8f3e8] dark:hover:bg-[#1a241d] dark:bg-[#111813]"
                  : "border-dashed border-[#b7d2bb] dark:border-[#405747] bg-white dark:bg-[#172019]/30 opacity-60"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-md ${
                    badge.unlocked
                      ? `bg-gradient-to-br ${badge.color} text-white`
                      : "bg-[#dcecdf] dark:bg-[#24382b] text-[#668170] dark:text-[#aabdaf]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="truncate text-xs sm:text-sm font-extrabold text-[#183226] dark:text-[#edf4ef]">
                      {badge.title}
                    </h3>
                    <span
                      className={`rounded-md border px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-wider ${badge.textColor}`}
                    >
                      {badge.tier}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-tight text-[#547060] dark:text-[#aabdaf]">
                    {badge.description}
                  </p>
                </div>
              </div>

              {badge.unlocked && (
                <div className="mt-3 flex items-center justify-end gap-1 text-[10px] font-bold text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Unlocked</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

