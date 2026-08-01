import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function ProfileCard() {
  return (
    <div className="bg-[#1c0d12]/90 rounded-2xl border border-rose-950/80 p-6 flex flex-col items-center text-center justify-between h-full shadow-lg">
      {/* Avatar Wrapper with Status Ring Indicator */}
      <div className="relative mt-2">
        <div className="w-24 h-24 rounded-2xl border-2 border-rose-500 p-1 bg-[#12080a] overflow-hidden shadow-md shadow-rose-950">
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80"
            alt="User profile avatar"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-[#1c0d12] rounded-full p-0.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/10" />
        </div>
      </div>

      {/* Main Bio/Metadata Blocks */}
      <div className="mt-4 space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Alex "DevNull" Rivera
        </h2>
        <p className="text-slate-400 text-xs font-medium">
          Senior Backend Engineer @ Neotech
        </p>
      </div>

      {/* Numerical Rankings Horizontal Grid Split */}
      <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-5 border-t border-rose-950/60">
        <div className="bg-[#12080a] border border-rose-950/80 p-3.5 rounded-xl">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-0.5">
            Global Rank
          </span>
          <span className="text-base font-black text-rose-400 font-mono">
            #1,242
          </span>
        </div>
        <div className="bg-[#12080a] border border-rose-950/80 p-3.5 rounded-xl">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-0.5">
            Streak
          </span>
          <span className="text-base font-black text-emerald-400 font-mono">
            14 Days
          </span>
        </div>
      </div>
    </div>
  );
}
