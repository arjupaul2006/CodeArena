import React from "react";

export default function StatsOverviewCard() {
  return (
    <div className="bg-[#0f1422] rounded-xl border border-gray-800/80 p-6 flex flex-col md:flex-row items-center justify-around gap-8 h-full shadow-lg">
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
              stroke="#1f2937"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#3b82f6"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset="110" /* Calculates ratio slice of total completed count */
              strokeLinecap="round"
            />
          </svg>
          <div className="flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white font-mono tracking-tight">
              542
            </span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Solved
            </span>
          </div>
        </div>
        <span className="text-xs font-semibold text-gray-400">
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
            barColor: "bg-emerald-400",
            labelColor: "text-emerald-400",
          },
          {
            label: "Medium",
            count: "198/550",
            pct: "36%",
            barColor: "bg-blue-400",
            labelColor: "text-blue-400",
          },
          {
            label: "Hard",
            count: "32/200",
            pct: "16%",
            barColor: "bg-rose-400",
            labelColor: "text-rose-400",
          },
        ].map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between items-baseline text-xs font-bold">
              <span className={`uppercase tracking-wider ${item.labelColor}`}>
                {item.label}
              </span>
              <span className="text-gray-300 font-mono">{item.count}</span>
            </div>
            <div className="w-full bg-gray-800/80 h-2 rounded-full overflow-hidden">
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
