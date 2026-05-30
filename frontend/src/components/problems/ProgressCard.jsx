import React from 'react';

export default function ProgressCard() {
  return (
    <div className="bg-[#0f1422] rounded-xl border border-gray-800 p-4 space-y-4">
      <div>
        <div className="flex justify-between items-end mb-1.5">
          <h4 className="text-xs uppercase font-bold tracking-wider text-gray-500">Your Progress</h4>
          <span className="text-sm font-bold font-mono text-blue-400">72%</span>
        </div>
        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full w-[72%] rounded-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-800/60">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-0.5">Solved</span>
          <span className="text-2xl font-black text-white tracking-tight">452</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-0.5">Streak</span>
          <span className="text-2xl font-black text-emerald-400 tracking-tight flex items-center gap-1">
            14d <span className="text-xs font-normal text-gray-400">🔥</span>
          </span>
        </div>
      </div>
    </div>
  );
}