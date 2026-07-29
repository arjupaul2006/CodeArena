import React from 'react';
import { Bell, Settings, Maximize2 } from 'lucide-react';

export default function WorkspaceHeader() {
  return (
    <header className="h-16 border-b border-gray-800/80 bg-[#0b0f19] flex items-center justify-between px-4 lg:px-6 z-40 shrink-0">
      {/* Brand & Tabs */}
      <div className="flex items-center gap-6">
        <span className="text-lg font-black tracking-tight text-white">
          Midnight<span className="text-blue-500">Code</span>
        </span>
        <nav className="hidden md:flex items-center gap-4 text-xs font-bold text-gray-400">
          <a href="#" className="text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md">Problems</a>
          <a href="#" className="hover:text-white transition-colors">Contests</a>
          <a href="#" className="hover:text-white transition-colors">Leaderboard</a>
          <a href="#" className="hover:text-white transition-colors">Discuss</a>
        </nav>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-all shadow-md shadow-blue-900/20">
          Upgrade Pro
        </button>
        <button className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-gray-800/60 transition-colors">
          <Bell className="w-4.5 h-4.5" />
        </button>
        <button className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-gray-800/60 transition-colors">
          <Settings className="w-4.5 h-4.5" />
        </button>
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
          alt="User Profile"
          className="h-7 w-7 rounded-full border border-gray-700 object-cover"
        />
      </div>
    </header>
  );
}