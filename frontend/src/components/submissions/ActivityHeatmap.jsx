import React from "react";

export default function ActivityHeatmap() {
  // Generate a mock map matrix representing submission densities
  const matrixRows = 7;
  const matrixCols = 46;

  return (
    <div className="bg-[#f4faf1] rounded-2xl border border-[#b7d2bb] p-5 shadow-lg space-y-4">
      {/* Top Banner Text Info Indicators */}
      <div className="flex justify-between items-center">
        <h3 className="text-base font-bold text-[#183226] tracking-tight">
          Activity Heatmap
        </h3>
        <div className="flex items-center gap-1.5 text-[11px] text-[#547060] font-medium">
          <span>Less</span>
          <div className="w-2.5 h-2.5 bg-[#dcecdf] rounded-xs"></div>
          <div className="w-2.5 h-2.5 bg-[#a6cbaa] rounded-xs"></div>
          <div className="w-2.5 h-2.5 bg-[#64a478] rounded-xs"></div>
          <div className="w-2.5 h-2.5 bg-[#3f7d55] rounded-xs"></div>
          <div className="w-2.5 h-2.5 bg-[#244333] rounded-xs"></div>
          <span>More</span>
        </div>
      </div>

      {/* Grid Canvas Wrapper */}
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#a6cbaa]">
        <div className="flex flex-col gap-1 min-w-[720px]">
          {Array.from({ length: matrixRows }).map((_, rIdx) => (
            <div key={rIdx} className="flex gap-1">
              {Array.from({ length: matrixCols }).map((_, cIdx) => {
                // Generate safe seed weights mimicking random code density patterns
                const seedWeight = Math.floor(Math.sin(rIdx * cIdx + rIdx) * 5);
                const weight = Math.max(0, Math.min(4, seedWeight));

                const colorShades = [
                  "bg-[#dcecdf] hover:bg-[#c9e1cc]", // 0: Empty
                  "bg-[#a6cbaa] hover:bg-[#90b895]", // 1: Low Density
                  "bg-[#64a478] hover:bg-[#4d8f61]", // 2: Med Density
                  "bg-[#3f7d55] hover:bg-[#326844]", // 3: High Density
                  "bg-[#244333] hover:bg-[#183226]", // 4: Maximum Activity
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
      <div className="flex justify-between items-center pt-2 text-xs font-medium text-[#547060]">
        <span>
          Yearly Submissions:{" "}
          <strong className="text-[#183226] font-mono">1,402</strong>
        </span>
        <span>
          Last active: <strong className="text-[#385a43]">2 hours ago</strong>
        </span>
      </div>
    </div>
  );
}
