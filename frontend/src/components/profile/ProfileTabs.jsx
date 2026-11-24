import React from "react";
import {
  User,
  Activity,
  Trophy,
  History,
  Award,
  LayoutGrid,
  Info,
} from "lucide-react";

export default function ProfileTabs({ activeTab, onTabChange, counts = {} }) {
  const tabs = [
    {
      id: "details",
      label: "User Details",
      icon: Info,
    },
    {
      id: "activity",
      label: "Coding Activity",
      icon: Activity,
      badge: counts.solvedCount ? `${counts.solvedCount} Solved` : null,
    },
    {
      id: "contests",
      label: "Contest Performance",
      icon: Trophy,
      badge: counts.contestCount ? `${counts.contestCount} Contests` : null,
    },
    {
      id: "submissions",
      label: "Submissions",
      icon: History,
      badge: counts.submissionCount || null,
    },
  ];

  return (
    <div className="w-full border-b border-[#b7d2bb] dark:border-[#405747] bg-[#f4faf1] dark:bg-[#172019]/80 backdrop-blur-md rounded-2xl p-1.5 shadow-sm">
      <nav className="flex gap-1.5 overflow-x-auto scrollbar-none" aria-label="Profile Sections">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                isActive
                  ? "bg-[#3f7d55] text-white shadow-md shadow-[#3f7d55]/30 scale-[1.01]"
                  : "text-[#547060] dark:text-[#aabdaf] hover:bg-[#dcecdf] dark:hover:bg-[#24382b] dark:bg-[#24382b]/70 hover:text-[#183226] dark:hover:text-[#edf4ef] dark:text-[#edf4ef]"
              }`}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-[#76a980]"}`} />
              <span>{tab.label}</span>

              {tab.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                    isActive
                      ? "bg-white dark:bg-[#172019]/25 text-white"
                      : "bg-[#e8f3e8] dark:bg-[#111813] border border-[#b7d2bb] dark:border-[#405747] text-[#3f7d55] dark:text-[#86c79a]"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

