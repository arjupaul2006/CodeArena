import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';

export default function TopNav() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-rose-950/60 bg-[#12080a]/85 backdrop-blur-xl px-4 lg:px-6">
      {/* Left: Search & Desktop Links */}
      <div className="flex flex-1 items-center gap-6 max-w-xl">
        <div className="relative w-full max-w-xs hidden sm:block">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search problems..."
            className="w-full rounded-xl bg-[#1c0d12] pl-10 pr-4 py-1.5 text-sm text-slate-200 border border-rose-950/80 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-none transition-all placeholder-slate-500"
          />
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="#" className="text-rose-400 border-b-2 border-rose-400 pb-5 pt-5 px-1 font-semibold">Problems</a>
          <a href="#" className="hover:text-white transition-colors">Contests</a>
          <a href="#" className="hover:text-white transition-colors">Leaderboard</a>
          <a href="#" className="hover:text-white transition-colors">Discuss</a>
        </nav>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3.5">
        <button className="hidden sm:inline-flex bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-md shadow-rose-950/40 cursor-pointer">
          Upgrade Pro
        </button>
        <button className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-rose-950/40 relative transition-colors cursor-pointer">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
        </button>
        <button className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-rose-950/40 transition-colors cursor-pointer">
          <Settings className="h-4 w-4" />
        </button>
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
          alt="Avatar"
          className="h-8 w-8 rounded-full border border-rose-500/30 object-cover ring-2 ring-rose-500/10"
        />
      </div>
    </header>
  );
}