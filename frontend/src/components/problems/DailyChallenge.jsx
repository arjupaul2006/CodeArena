import React from 'react';
import { Zap } from 'lucide-react';

export default function DailyChallenge() {
  return (
    <div className="bg-[#f4faf1] rounded-xl border border-[#b7d2bb] p-4 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#3f7d55]/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="flex items-center gap-1.5 text-xs text-[#2f6b45] font-bold tracking-wider uppercase mb-2">
        <Zap className="h-3.5 w-3.5 fill-[#3f7d55] text-[#3f7d55]" /> Daily Challenge
      </div>
      <h3 className="text-lg font-bold text-[#183226] mb-1">Maximum Subarray</h3>
      <div className="flex gap-2 mb-4">
        <span className="text-[10px] bg-amber-500/15 text-amber-800 border border-amber-500/30 px-2 py-0.5 rounded font-semibold">Medium</span>
        <span className="text-[10px] bg-[#dcecdf] text-[#2f6b45] border border-[#b7d2bb] px-2 py-0.5 rounded font-semibold">Arrays</span>
      </div>
      <button className="w-full bg-[#3f7d55] hover:bg-[#326844] text-white text-xs font-semibold py-2 rounded-lg shadow-md shadow-[#8eae94]/40 transition-all cursor-pointer">
        Solve Now
      </button>
    </div>
  );
}