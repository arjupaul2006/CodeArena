import React from "react";

export default function ActivityHeatmap() {
  // Generate a mock map matrix representing submission densities
  const matrixRows = 7;
  const matrixCols = 46;
  const densityValues = [0, 1, 2, 3, 4]; // Map density levels to shades

  return (
    <div className="bg-[#0f1422] rounded-xl border border-gray-800/80 p-5 shadow-lg space-y-4">
      {/* Top Banner Text Info Indicators */}
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-white tracking-tight">
          Activity Heatmap
        </h3>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium">
          <span>Less</span>
          <div className="w-2.5 h-2.5 bg-gray-800 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-emerald-950 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-emerald-800 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-emerald-600 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-sm"></div>
          <span>More</span>
        </div>
      </div>

      {/* Grid Canvas Wrapper with horizontal scrolling capability for mobile screen sizes */}
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-800">
        <div className="flex flex-col gap-1 min-w-[720px]">
          {Array.from({ length: matrixRows }).map((_, rIdx) => (
            <div key={rIdx} className="flex gap-1">
              {Array.from({ length: matrixCols }).map((_, cIdx) => {
                // Generate safe seed weights mimicking random code density patterns
                const seedWeight = Math.floor(Math.sin(rIdx * cIdx + rIdx) * 5);
                const weight = Math.max(0, Math.min(4, seedWeight));

                const colorShades = [
                  "bg-gray-800/40 hover:bg-gray-700", // 0: Empty
                  "bg-emerald-950/70 hover:bg-emerald-900", // 1: Low Density
                  "bg-emerald-800/80 hover:bg-emerald-700", // 2: Med Density
                  "bg-emerald-600 hover:bg-emerald-500", // 3: High Density
                  "bg-emerald-400 hover:bg-emerald-300", // 4: Maximum Activity
                ];

                return (
                  <div
                    key={cIdx}
                    className={`w-3 h-3 rounded-[2px] transition-all cursor-pointer ${colorShades[weight]}`}
                    title={`Submissions depth: ${weight}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Footer Analytics Logs */}
      <div className="flex justify-between items-center pt-2 text-xs font-medium text-gray-500">
        <span>
          Yearly Submissions:{" "}
          <strong className="text-gray-400 font-mono">1,402</strong>
        </span>
        <span>
          Last active: <strong className="text-gray-400">2 hours ago</strong>
        </span>
      </div>
    </div>
  );
}
