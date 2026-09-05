import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';

export default function TopNav() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#b7d2bb] bg-[#f4faf1]/95 backdrop-blur-xl px-4 lg:px-6">
      {/* Left: Search & Desktop Links */}
      <div className="flex flex-1 items-center gap-6 max-w-xl">
        <div className="relative w-full max-w-xs hidden sm:block">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#668170]" />
          <input
            type="text"
            placeholder="Search problems..."
            className="w-full rounded-xl bg-[#e8f3e8] pl-10 pr-4 py-1.5 text-sm text-[#385a43] border border-[#b7d2bb] focus:border-[#3f7d55] focus:ring-1 focus:ring-[#3f7d55] focus:outline-none transition-all placeholder-[#7da188]"
          />
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#547060]">
          <a href="/problems" className="text-[#3f7d55] border-b-2 border-[#3f7d55] pb-5 pt-5 px-1 font-semibold">Problems</a>
          <a href="/contests" className="hover:text-[#183226] transition-colors">Contests</a>
          <a href="#" className="hover:text-[#183226] transition-colors">Leaderboard</a>
          <a href="#" className="hover:text-[#183226] transition-colors">Discuss</a>
        </nav>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3.5">
        <button className="hidden sm:inline-flex bg-[#3f7d55] hover:bg-[#326844] text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-md shadow-[#8eae94]/40 cursor-pointer">
          Upgrade Pro
        </button>
        <button className="p-2 text-[#547060] hover:text-[#183226] rounded-xl hover:bg-[#dcecdf] relative transition-colors cursor-pointer">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
        </button>
        <button className="p-2 text-[#547060] hover:text-[#183226] rounded-xl hover:bg-[#dcecdf] transition-colors cursor-pointer">
          <Settings className="h-4 w-4" />
        </button>
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
          alt="Avatar"
          className="h-8 w-8 rounded-full border border-[#a6cbaa] object-cover ring-2 ring-[#c5dfc9]"
        />
      </div>
    </header>
  );
}