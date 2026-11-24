import React from "react";
import { Award, BookOpen, Clock, ShieldCheck, User } from "lucide-react";

export default function ContestHeroBanner({ contest, contestStatus, timeLeft, totalPoints }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#b7d2bb] dark:border-[#405747] bg-gradient-to-br from-[#183226] via-[#1c3a2d] to-[#244333] p-6 sm:p-8 text-[#f4faf1] shadow-2xl">
      {/* Ambient Background Circles */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full border-[32px] border-[#3f7d55]/20 blur-sm pointer-events-none" />
      <div className="absolute -bottom-28 right-40 h-64 w-64 rounded-full border-[24px] border-[#b7d2bb] dark:border-[#405747]/10 pointer-events-none" />

      <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div className="max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${
                contestStatus === "live"
                  ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                  : contestStatus === "upcoming"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                  : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
              }`}
            >
              {contestStatus === "live" && (
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              )}
              {contestStatus === "live" ? "Contest Live" : contestStatus}
            </span>

            <span className="inline-flex items-center gap-1.5 text-xs text-[#c5dfc9] dark:text-[#b9d7bf]">
              <User className="h-3.5 w-3.5 text-[#3f7d55] dark:text-[#86c79a]" />
              {contest.participantsCount || contest.participants?.length || 1280} Competitors
            </span>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl text-white">
            {contest.title}
          </h1>
          <p className="text-sm leading-relaxed text-[#c5dfc9] dark:text-[#b9d7bf] max-w-2xl">
            {contest.description}
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-[#dcecdf]">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="h-4 w-4 text-[#8eae94]" />
              Ranked Competition
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Award className="h-4 w-4 text-[#f5b85b]" />
              {totalPoints} Total Points
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <BookOpen className="h-4 w-4 text-[#8eae94]" />
              {contest.problems?.length || 4} Problems
            </span>
          </div>
        </div>

        {/* Live Countdown Timer Box */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#3f7d55]/50 bg-[#12261d]/80 px-6 py-5 backdrop-blur-md shadow-xl min-w-[240px]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#c5dfc9] dark:text-[#b9d7bf] mb-2 uppercase tracking-widest">
            <Clock className="h-4 w-4 text-rose-400 animate-pulse" />
            {contestStatus === "live"
              ? "Time Remaining"
              : contestStatus === "upcoming"
              ? "Starts In"
              : "Contest Ended"}
          </div>

          <div className="flex items-center gap-2 font-mono text-3xl font-black text-white">
            <div className="flex flex-col items-center">
              <span>{timeLeft.hours}</span>
              <span className="text-[10px] font-sans text-[#8eae94] uppercase tracking-normal">Hrs</span>
            </div>
            <span className="text-[#3f7d55] dark:text-[#86c79a] pb-3">:</span>
            <div className="flex flex-col items-center">
              <span>{timeLeft.minutes}</span>
              <span className="text-[10px] font-sans text-[#8eae94] uppercase tracking-normal">Min</span>
            </div>
            <span className="text-[#3f7d55] dark:text-[#86c79a] pb-3">:</span>
            <div className="flex flex-col items-center">
              <span className="text-rose-400">{timeLeft.seconds}</span>
              <span className="text-[10px] font-sans text-[#8eae94] uppercase tracking-normal">Sec</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
