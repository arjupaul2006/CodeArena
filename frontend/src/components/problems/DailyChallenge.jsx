import React from 'react';
import { Zap } from 'lucide-react';

export default function DailyChallenge() {
  return (
    <div className="bg-gradient-to-br from-[#111c3a] to-[#0f1422] rounded-xl border border-blue-900/40 p-4 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
      <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold tracking-wider uppercase mb-2">
        <Zap className="h-3.5 w-3.5 fill-amber-400" /> Daily Challenge
      </div>
      <h3 className="text-lg font-bold text-white mb-1">Maximum Subarray</h3>
      <div className="flex gap-2 mb-4">
        <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-medium">Medium</span>
        <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded">Arrays</span>
      </div>
      <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 rounded-lg shadow-md shadow-blue-900/30 transition-all">
        Solve Now
      </button>
    </div>
  );
}