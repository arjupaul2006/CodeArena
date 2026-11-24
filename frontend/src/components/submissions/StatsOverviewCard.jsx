import React, { useEffect, useState } from "react";

export default function StatsOverviewCard({ user }) {
  const [problems, setProblems] = useState([]);

  // Fetch problems from the backend API and update the state
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

        const response = await fetch(`${backendUrl}/api/problems`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();

        if (data.problems) {
          setProblems(data.problems);
        }
      } catch (error) {
        console.warn("Backend unavailable, using fallback problem set:", error);
      }
    };

    fetchProblems();
  }, []);

  const totalProblemsCount = problems.length;
  const solvedCount = user?.solvedProblems?.length ?? 0;

  // Calculate SVG stroke offset for ratio solved/total
  const circumference = 251.2;
  const solvedRatio =
    totalProblemsCount > 0
      ? Math.min(solvedCount / totalProblemsCount, 1)
      : 0;

  const strokeDashoffset = circumference * (1 - solvedRatio);

  // Set of solved problem IDs
  const solvedSet = new Set(
    (user?.solvedProblems || []).map((id) =>
      typeof id === "object" ? String(id._id || id) : String(id)
    )
  );

  // Calculate stats per difficulty if problems are loaded
  const easyProblems = problems.filter((p) => p.difficulty === "Easy");
  const mediumProblems = problems.filter((p) => p.difficulty === "Medium");
  const hardProblems = problems.filter((p) => p.difficulty === "Hard");

  const easySolved = easyProblems.filter((p) => solvedSet.has(String(p._id))).length;
  const mediumSolved = mediumProblems.filter((p) => solvedSet.has(String(p._id))).length;
  const hardSolved = hardProblems.filter((p) => solvedSet.has(String(p._id))).length;

  const difficultyStats = [
    {
      label: "Easy",
      count:
        easyProblems.length > 0
          ? `${easySolved}/${easyProblems.length}`
          : "0/0",
      pct:
        easyProblems.length > 0
          ? `${Math.round((easySolved / easyProblems.length) * 100)}%`
          : "0%",
      barColor: "bg-emerald-600",
      labelColor: "text-emerald-800",
    },
    {
      label: "Medium",
      count:
        mediumProblems.length > 0
          ? `${mediumSolved}/${mediumProblems.length}`
          : "0/0",
      pct:
        mediumProblems.length > 0
          ? `${Math.round((mediumSolved / mediumProblems.length) * 100)}%`
          : "0%",
      barColor: "bg-amber-500",
      labelColor: "text-amber-800",
    },
    {
      label: "Hard",
      count:
        hardProblems.length > 0
          ? `${hardSolved}/${hardProblems.length}`
          : "0/0",
      pct:
        hardProblems.length > 0
          ? `${Math.round((hardSolved / hardProblems.length) * 100)}%`
          : "0%",
      barColor: "bg-rose-500",
      labelColor: "text-rose-800",
    },
  ];

  return (
    <div className="bg-[#f4faf1] dark:bg-[#172019] rounded-2xl border border-[#b7d2bb] dark:border-[#405747] p-6 flex flex-col md:flex-row items-center justify-around gap-8 h-full shadow-lg">
      {/* Circular Chart Gauge Visual */}
      <div className="flex flex-col items-center justify-center text-center space-y-2 shrink-0">
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* SVG Background Track & Dynamic Radial Fill Indicator */}
          <svg
            className="absolute w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#d5e7d7"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#3f7d55"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-[#183226] dark:text-[#edf4ef] font-mono tracking-tight">
              {solvedCount} /
              <span className="text-[#668170] dark:text-[#aabdaf] font-normal text-sm ml-1">
                {totalProblemsCount}
              </span>
            </span>
            <span className="text-xs font-semibold text-[#547060] dark:text-[#aabdaf]">
              Problems Solved
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bars Track Lists */}
      <div className="w-full max-w-md space-y-4">
        {difficultyStats.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between items-baseline text-xs font-bold">
              <span className={`uppercase tracking-wider ${item.labelColor}`}>
                {item.label}
              </span>
              <span className="text-[#183226] dark:text-[#edf4ef] font-mono">{item.count}</span>
            </div>
            <div className="w-full bg-[#e8f3e8] dark:bg-[#111813] h-2 rounded-full overflow-hidden border border-[#b7d2bb] dark:border-[#405747]">
              <div
                className={`h-full ${item.barColor} rounded-full transition-all duration-500`}
                style={{ width: item.pct }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
