import React from 'react';
import { Bell, Settings, Maximize2 } from 'lucide-react';

export default function WorkspaceHeader() {
  return (
    <header className="h-16 border-b border-[#b7d2bb] bg-[#f4faf1] flex items-center justify-between px-4 lg:px-6 z-40 shrink-0">
      {/* Brand & Tabs */}
      <div className="flex items-center gap-6">
        <span className="text-lg font-black tracking-tight text-[#183226]">
          Code<span className="text-[#3f7d55]">Arena</span>
        </span>
        <nav className="hidden md:flex items-center gap-4 text-xs font-bold text-[#547060]">
          <a href="#" className="text-[#2f6b45] bg-[#dcecdf] px-2.5 py-1 rounded-md">Problems</a>
          <a href="#" className="hover:text-[#183226] transition-colors">Contests</a>
          <a href="#" className="hover:text-[#183226] transition-colors">Leaderboard</a>
          <a href="#" className="hover:text-[#183226] transition-colors">Discuss</a>
        </nav>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-all shadow-md shadow-blue-900/20">
          Upgrade Pro
        </button>
        <button className="p-1.5 text-[#547060] hover:text-[#183226] rounded-md hover:bg-[#dcecdf] transition-colors">
          <Bell className="w-4.5 h-4.5" />
        </button>
        <button className="p-1.5 text-[#547060] hover:text-[#183226] rounded-md hover:bg-[#dcecdf] transition-colors">
          <Settings className="w-4.5 h-4.5" />
        </button>
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
          alt="User Profile"
          className="h-7 w-7 rounded-full border border-[#b7d2bb] object-cover"
        />
      </div>
    </header>
  );
}