import React from 'react';

export default function ProgressCard() {
  return (
    <div className="bg-[#f4faf1] rounded-xl border border-[#b7d2bb] p-4 space-y-4 shadow-lg">
      <div>
        <div className="flex justify-between items-end mb-1.5">
          <h4 className="text-xs uppercase font-bold tracking-wider text-[#668170]">Your Progress</h4>
          <span className="text-sm font-bold font-mono text-[#3f7d55]">72%</span>
        </div>
        <div className="w-full bg-[#c5dcc8] h-2 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-[#3f7d55] to-emerald-500 h-full w-[72%] rounded-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#b7d2bb]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#668170] block mb-0.5">Solved</span>
          <span className="text-2xl font-black text-[#183226] tracking-tight">452</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#668170] block mb-0.5">Streak</span>
          <span className="text-2xl font-black text-[#2f6b45] tracking-tight flex items-center gap-1">
            14d <span className="text-xs font-normal text-[#547060]">🔥</span>
          </span>
        </div>
      </div>
    </div>
  );
}