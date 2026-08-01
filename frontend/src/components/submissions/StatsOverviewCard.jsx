import React from "react";

export default function StatsOverviewCard() {
  return (
    <div className="bg-[#1c0d12]/90 rounded-2xl border border-rose-950/80 p-6 flex flex-col md:flex-row items-center justify-around gap-8 h-full shadow-lg">
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
              stroke="#2b141a"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#f43f5e"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset="110"
              strokeLinecap="round"
            />
          </svg>
          <div className="flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white font-mono tracking-tight">
              542
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Solved
            </span>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-400">
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
            barColor: "bg-amber-400",
            labelColor: "text-amber-400",
          },
          {
            label: "Hard",
            count: "32/200",
            pct: "16%",
            barColor: "bg-rose-500",
            labelColor: "text-rose-400",
          },
        ].map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between items-baseline text-xs font-bold">
              <span className={`uppercase tracking-wider ${item.labelColor}`}>
                {item.label}
              </span>
              <span className="text-slate-300 font-mono">{item.count}</span>
            </div>
            <div className="w-full bg-[#12080a] h-2 rounded-full overflow-hidden border border-rose-950/40">
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
