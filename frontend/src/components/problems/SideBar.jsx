import React, { useState } from "react";
import {
  LayoutDashboard,
  Code2,
  Trophy,
  History,
  BarChart3,
  HelpCircle,
  LogOut,
  Plus,
} from "lucide-react";
import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", link: "/dashboard" },
  { icon: Code2, label: "Problems", link: "/problems" },
  { icon: Trophy, label: "Contests", link: "/contests" },
  { icon: History, label: "Submissions", link: "/submissions" },
  { icon: BarChart3, label: "Stats", link: "/stats" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden md:flex w-64 flex-col bg-[#d5e7d7] dark:bg-[#34483a] border-r border-[#b7d2bb] dark:border-[#405747] p-4 justify-between backdrop-blur-xl">
        <div className="space-y-6">
          {/* Logo */}
          <div className="px-2 pt-1 flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#c5dfc9] dark:bg-[#2b4636] border border-[#a6cbaa] dark:border-[#405747] text-[#3f7d55] dark:text-[#86c79a] shadow-sm shadow-[#9ab99f]">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-[#183226] dark:text-[#edf4ef] flex items-center">
                Code<span className="text-[#3f7d55] dark:text-[#86c79a]">Arena</span>
              </span>
              <span className="text-[10px] text-[#668170] dark:text-[#aabdaf] block font-mono">
                v2.4.0 â€¢ Enterprise
              </span>
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
                      ? "bg-[#c5dfc9] dark:bg-[#2b4636] text-[#2f6b45] dark:text-[#86c79a] font-semibold border-l-2 border-[#3f7d55] shadow-sm shadow-[#9ab99f]/30"
                      : "text-[#547060] dark:text-[#aabdaf] hover:bg-[#c5dfc9] dark:bg-[#2b4636] hover:text-[#244333] dark:hover:text-[#edf4ef] dark:text-[#edf4ef]"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${isActive ? "text-[#3f7d55] dark:text-[#86c79a]" : "text-[#668170] dark:text-[#aabdaf]"}`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer/Action Elements */}
        <div className="space-y-3 pt-4 border-t border-[#b7d2bb] dark:border-[#405747]">
          <div className="space-y-0.5">
            <Link
              to="/help"
              className="flex items-center gap-3 px-3 py-2 text-xs text-[#547060] dark:text-[#aabdaf] hover:text-[#183226] dark:hover:text-[#edf4ef] dark:text-[#edf4ef] rounded-lg transition-colors"
            >
              <HelpCircle className="h-4 w-4 text-[#668170] dark:text-[#aabdaf]" /> Help & Docs
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 text-xs text-rose-700 hover:bg-rose-500/10 rounded-lg transition-colors dark:text-rose-300 dark:hover:text-rose-200"
            >
              <LogOut className="h-4 w-4 text-rose-600 dark:text-rose-300" /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#d5e7d7] dark:bg-[#34483a] border-t border-[#b7d2bb] dark:border-[#405747] px-2 py-1 flex justify-around items-center backdrop-blur-lg shadow-lg">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.link;
          return (
            <Link
              key={idx}
              to={item.link}
              className={`flex flex-col items-center p-2 text-[10px] ${
                isActive ? "text-[#3f7d55] dark:text-[#86c79a] font-bold" : "text-[#547060] dark:text-[#aabdaf]"
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
