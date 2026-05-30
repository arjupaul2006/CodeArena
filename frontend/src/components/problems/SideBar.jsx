import React, { useState } from 'react';
import { LayoutDashboard, Code2, Trophy, History, BarChart3, HelpCircle, LogOut, Plus } from 'lucide-react';
import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', link: '/dashboard' },
  { icon: Code2, label: 'Problems', link: '/problems' },
  { icon: Trophy, label: 'Contests', link: '/contests' },
  { icon: History, label: 'Submissions', link: '/submissions' },
  { icon: BarChart3, label: 'Stats', link: '/stats' },
];

export default function Sidebar() {

  const location = useLocation();


  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden md:flex w-64 flex-col bg-[#0f1422] border-r border-gray-800/80 p-4 justify-between">
        <div className="space-y-6">
          {/* Logo */}
          <div className="px-2">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Midnight<span className="text-blue-500">Code</span>
            </span>
            <span className="text-[10px] text-gray-500 block">v2.4.0-stable</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.link}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === item.link
                      ? 'bg-blue-600/10 text-blue-400 font-semibold border-l-2 border-blue-500 rounded-l-none'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer/Action Elements */}
        <div className="space-y-4 pt-4 border-t border-gray-800">
          <button className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-lg transition-colors">
            <Plus className="h-4 w-4" /> New Submission
          </button>
          <div className="space-y-1">
            <Link to="/help" className="flex items-center gap-3 px-3 py-2 text-xs text-gray-400 hover:text-white rounded-md"><HelpCircle className="h-4 w-4"/> Help</Link>
            <Link to="/logout" className="flex items-center gap-3 px-3 py-2 text-xs text-red-400 hover:bg-red-950/20 rounded-md"><LogOut className="h-4 w-4"/> Logout</Link>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation (For superb Responsiveness) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0f1422] border-t border-gray-800 px-2 py-1 flex justify-around items-center">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              to={item.link}
              className={`flex flex-col items-center p-2 text-[10px] ${
                location.pathname === item.link ? 'text-blue-400 font-bold' : 'text-gray-400'
              }`}
            >
              <Icon className="h-5 w-5 mb-0.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}