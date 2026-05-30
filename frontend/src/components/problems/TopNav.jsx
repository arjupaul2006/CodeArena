import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';

export default function TopNav() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-800 bg-[#0b0f19]/80 backdrop-blur-md px-4 lg:px-6">
      {/* Left: Search & Desktop Links */}
      <div className="flex flex-1 items-center gap-6 max-w-xl">
        <div className="relative w-full max-w-xs hidden sm:block">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search problems..."
            className="w-full rounded-md bg-[#111827] pl-9 pr-4 py-1.5 text-sm text-gray-200 border border-transparent focus:border-blue-500 focus:outline-none transition-all"
          />
        </div>
        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-gray-400">
          <a href="#" className="text-blue-400 border-b-2 border-blue-400 pb-5 pt-5 px-1">Problems</a>
          <a href="#" className="hover:text-white transition-colors">Contests</a>
          <a href="#" className="hover:text-white transition-colors">Leaderboard</a>
          <a href="#" className="hover:text-white transition-colors">Discuss</a>
        </nav>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-4">
        <button className="hidden sm:inline-flex bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-all shadow-md shadow-blue-900/20">
          Upgrade Pro
        </button>
        <button className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-gray-800 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-gray-800">
          <Settings className="h-5 w-5" />
        </button>
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
          alt="Avatar"
          className="h-8 w-8 rounded-full border border-gray-700 object-cover"
        />
      </div>
    </header>
  );
}