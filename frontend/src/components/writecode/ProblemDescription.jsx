import React from 'react';
import { ThumbsUp, ThumbsDown, Star } from 'lucide-react';

export default function ProblemDescription() {
  return (
    <div className="p-5 lg:p-7 space-y-5">
      {/* Title Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl lg:text-2xl font-extrabold text-white tracking-tight">
            42. Trapping Rain Water
          </h1>
          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">
            Hard
          </span>
        </div>

        {/* Interaction Stats */}
        <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
          <button className="flex items-center gap-1 hover:text-gray-300 transition-colors">
            <ThumbsUp className="w-3.5 h-3.5" /> 14.2k
          </button>
          <button className="flex items-center gap-1 hover:text-gray-300 transition-colors">
            <ThumbsDown className="w-3.5 h-3.5" /> 205
          </button>
          <button className="flex items-center gap-1 hover:text-gray-300 transition-colors">
            <Star className="w-3.5 h-3.5" /> Favorite
          </button>
        </div>
      </div>

      {/* Markdown / Body Prompt Text */}
      <div className="text-sm text-gray-300 leading-relaxed max-w-2xl font-medium">
        Given <code className="bg-gray-800/80 px-1.5 py-0.5 rounded text-gray-200 font-mono text-xs">n</code> non-negative integers representing an elevation map where the width of each bar is <code className="bg-gray-800/80 px-1.5 py-0.5 rounded text-gray-200 font-mono text-xs">1</code>, compute how much water it can trap after raining.
      </div>

      {/* Embedded Visual Prompt Asset */}
      <div className="relative rounded-xl border border-gray-800/80 bg-[#0f1422] aspect-[4/3] max-w-xl overflow-hidden shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" /* High quality replacement vector */
          alt="Elevation map visualization"
          className="w-full h-full object-cover mix-blend-lighten opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1422] via-transparent to-transparent"></div>
      </div>
    </div>
  );
}