import React from "react";
import { BookOpen, Sparkles } from "lucide-react";

export default function ContestRulesAnnouncements({ announcements }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Announcements Feed */}
      <div className="rounded-2xl border border-[#b7d2bb] dark:border-[#405747] bg-[#f4faf1] dark:bg-[#172019] p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-bold text-[#183226] dark:text-[#edf4ef] text-base border-b border-[#b7d2bb] dark:border-[#405747] pb-3">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Live Contest Announcements
        </div>

        <div className="space-y-3">
          {announcements?.map((ann) => (
            <div
              key={ann.id}
              className="rounded-xl border border-[#b7d2bb] dark:border-[#405747] bg-[#eef7eb] dark:bg-[#1a241d] p-4 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs font-bold text-[#3f7d55] dark:text-[#86c79a]">
                <span>{ann.title}</span>
                <span className="text-[10px] text-[#668170] dark:text-[#aabdaf] font-normal">{ann.time}</span>
              </div>
              <p className="text-xs leading-relaxed text-[#244333] dark:text-[#edf4ef]">{ann.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contest Rules */}
      <div className="rounded-2xl border border-[#b7d2bb] dark:border-[#405747] bg-[#f4faf1] dark:bg-[#172019] p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 font-bold text-[#183226] dark:text-[#edf4ef] text-base border-b border-[#b7d2bb] dark:border-[#405747] pb-3">
          <BookOpen className="h-5 w-5 text-[#3f7d55] dark:text-[#86c79a]" />
          Contest Rules & Guidelines
        </div>

        <ul className="space-y-3 text-xs leading-relaxed text-[#547060] dark:text-[#aabdaf]">
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#3f7d55] dark:text-[#86c79a]">1.</span>
            <span>
              <strong className="text-[#183226] dark:text-[#edf4ef]">Ranking:</strong> Standings are determined by total score. Ties are broken by total time penalty (time elapsed from contest start to final accepted submission + penalty minutes).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#3f7d55] dark:text-[#86c79a]">2.</span>
            <span>
              <strong className="text-[#183226] dark:text-[#edf4ef]">Penalties:</strong> Each incorrect submission before acceptance adds a 10-minute penalty to your time score.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#3f7d55] dark:text-[#86c79a]">3.</span>
            <span>
              <strong className="text-[#183226] dark:text-[#edf4ef]">Plagiarism Policy:</strong> All submissions are automatically screened for code copying. Any violation results in score forfeiture.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-[#3f7d55] dark:text-[#86c79a]">4.</span>
            <span>
              <strong className="text-[#183226] dark:text-[#edf4ef]">Supported Languages:</strong> C++20, Java 17, Python 3.11, JavaScript (Node.js v20).
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
