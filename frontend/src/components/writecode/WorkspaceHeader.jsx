import React, { useContext, useState, useEffect } from 'react';
import { Bell, Settings, Code2 } from 'lucide-react';
import { UserDataContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function WorkspaceHeader() {
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [user?.profileImage]);

  return (
    <header className="h-16 border-b border-[#b7d2bb] dark:border-[#405747] bg-[#f4faf1] dark:bg-[#172019] flex items-center justify-between px-4 lg:px-6 z-40 shrink-0">
      {/* Brand & Tabs */}
      <div className="flex items-center gap-6">
        <span className="text-lg font-black tracking-tight text-[#183226] dark:text-[#edf4ef]">
          Code<span className="text-[#3f7d55] dark:text-[#86c79a]">Arena</span>
        </span>
        <nav className="hidden md:flex items-center gap-4 text-xs font-bold text-[#547060] dark:text-[#aabdaf]">
          <a href="#" className="text-[#2f6b45] dark:text-[#86c79a] bg-[#dcecdf] dark:bg-[#24382b] px-2.5 py-1 rounded-md">Problems</a>
          <a href="#" className="hover:text-[#183226] dark:hover:text-[#edf4ef] dark:text-[#edf4ef] transition-colors">Contests</a>
          <a href="#" className="hover:text-[#183226] dark:hover:text-[#edf4ef] dark:text-[#edf4ef] transition-colors">Leaderboard</a>
          <a href="#" className="hover:text-[#183226] dark:hover:text-[#edf4ef] dark:text-[#edf4ef] transition-colors">Discuss</a>
        </nav>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button className="p-1.5 text-[#547060] dark:text-[#aabdaf] hover:text-[#183226] dark:hover:text-[#edf4ef] dark:text-[#edf4ef] rounded-md hover:bg-[#dcecdf] dark:hover:bg-[#24382b] dark:bg-[#24382b] transition-colors">
          <Bell className="w-4.5 h-4.5" />
        </button>
        <button onClick={() => navigate('/settings')} aria-label="Open settings" className="p-1.5 text-[#547060] dark:text-[#aabdaf] hover:text-[#183226] dark:hover:text-[#edf4ef] dark:text-[#edf4ef] rounded-md hover:bg-[#dcecdf] dark:hover:bg-[#24382b] dark:bg-[#24382b] transition-colors">
          <Settings className="w-4.5 h-4.5" />
        </button>

        {user?.profileImage && !imageError ? (
          <img
            src={user.profileImage}
            alt={user?.username || "User Profile"}
            onError={() => setImageError(true)}
            className="h-7 w-7 rounded-full border border-[#b7d2bb] dark:border-[#405747] object-cover"
          />
        ) : (
          <div
            className="h-7 w-7 rounded-full border border-[#a6cbaa] dark:border-[#405747] bg-[#3f7d55] text-white flex items-center justify-center font-bold text-xs ring-2 ring-[#c5dfc9] shadow-xs shrink-0 select-none uppercase"
            title={user?.username || user?.name || "User"}
          >
            {(user?.username || user?.name || user?.email || "U").charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </header>
  );
}