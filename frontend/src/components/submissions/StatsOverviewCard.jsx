import React from "react";

export default function StatsOverviewCard() {
  return (
    <div className="bg-[#f4faf1] rounded-2xl border border-[#b7d2bb] p-6 flex flex-col md:flex-row items-center justify-around gap-8 h-full shadow-lg">
      {/* Circular Chart Gauge Visual */}
      <div className="flex flex-col items-center justify-center text-center space-y-2 shrink-0">
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* SVG Background Track & Radial Fill Indicator */}
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
              strokeDashoffset="110"
              strokeLinecap="round"
            />
          </svg>
          <div className="flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-[#183226] font-mono tracking-tight">
              542
            </span>
            <span className="text-[10px] font-bold text-[#668170] uppercase tracking-widest">
              Solved
            </span>
          </div>
        </div>
        <span className="text-xs font-semibold text-[#547060]">
          Top 4.2% of all users
        </span>
      </div>

      {/* Progress Bars Track Lists */}
      <div className="w-full max-w-md space-y-4">
        {[
          {
            label: "Easy",
            count: "312/400",
            pct: "78%",
            barColor: "bg-emerald-600",
            labelColor: "text-emerald-800",
          },
          {
            label: "Medium",
            count: "198/550",
            pct: "36%",
            barColor: "bg-amber-500",
            labelColor: "text-amber-800",
          },
          {
            label: "Hard",
            count: "32/200",
            pct: "16%",
            barColor: "bg-rose-500",
            labelColor: "text-rose-800",
          },
        ].map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between items-baseline text-xs font-bold">
              <span className={`uppercase tracking-wider ${item.labelColor}`}>
                {item.label}
              </span>
              <span className="text-[#183226] font-mono">{item.count}</span>
            </div>
            <div className="w-full bg-[#e8f3e8] h-2 rounded-full overflow-hidden border border-[#b7d2bb]">
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
