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
      <aside className="fixed inset-y-0 left-0 z-50 hidden md:flex w-64 flex-col bg-[#14090b] border-r border-rose-950/60 p-4 justify-between backdrop-blur-xl">
        <div className="space-y-6">
          {/* Logo */}
          <div className="px-2 pt-1 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shadow-sm shadow-rose-950">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center">
                Code<span className="text-rose-500">Arena</span>
              </span>
              <span className="text-[10px] text-rose-300/60 block font-mono">v2.4.0 • Enterprise</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.link;
              return (
                <Link
                  key={idx}
                  to={item.link}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-rose-500/10 text-rose-300 font-semibold border-l-2 border-rose-500 shadow-sm shadow-rose-950/30'
                      : 'text-slate-400 hover:bg-rose-950/30 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer/Action Elements */}
        <div className="space-y-3 pt-4 border-t border-rose-950/60">
          <button className="w-full bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-xl transition-all shadow-sm cursor-pointer">
            <Plus className="h-4 w-4" /> New Submission
          </button>
          <div className="space-y-0.5">
            <Link to="/help" className="flex items-center gap-3 px-3 py-2 text-xs text-slate-400 hover:text-white rounded-lg transition-colors"><HelpCircle className="h-4 w-4 text-slate-500" /> Help & Docs</Link>
            <Link to="/logout" className="flex items-center gap-3 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"><LogOut className="h-4 w-4 text-rose-400" /> Logout</Link>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#14090b] border-t border-rose-950/60 px-2 py-1 flex justify-around items-center backdrop-blur-lg">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.link;
          return (
            <Link
              key={idx}
              to={item.link}
              className={`flex flex-col items-center p-2 text-[10px] ${
                isActive ? 'text-rose-400 font-bold' : 'text-slate-400'
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