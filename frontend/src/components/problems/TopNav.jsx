import React, { useContext, useState, useEffect } from "react";
import { Search, Bell, Settings, Code2 } from "lucide-react";
import { UserDataContext } from "../../context/UserContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function TopNav() {
  const { user } = useContext(UserDataContext);
  const [imageError, setImageError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setImageError(false);
  }, [user?.profileImage]);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#b7d2bb] bg-[#f4faf1]/95 px-4 backdrop-blur-xl transition-colors dark:border-[#303e35] dark:bg-[#0d1510]/95 lg:px-6">
      {/* Left: Search & Desktop Links */}
      <div className="flex flex-1 items-center gap-6 max-w-xl">
        <div className="relative w-full max-w-xs hidden sm:block">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-[#668170] dark:text-[#aabdaf]" />
          <input
            type="text"
            placeholder="Search problems..."
            className="w-full rounded-xl border border-[#b7d2bb] bg-[#e8f3e8] py-1.5 pl-10 pr-4 text-sm text-[#385a43] placeholder-[#7da188] transition-all focus:border-[#3f7d55] focus:outline-none focus:ring-1 focus:ring-[#3f7d55] dark:border-[#405747] dark:bg-[#171f19] dark:text-[#dfe8e2] dark:placeholder-[#819887]"
          />
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#547060] dark:text-[#aabdaf]">
          <Link
            to="/problems"
            className={
              location.pathname === "/problems"
                ? "text-[#3f7d55] dark:text-[#86c79a] border-b-2 border-[#3f7d55] pb-5 pt-5 px-1 font-semibold"
                : "hover:text-[#183226] dark:hover:text-[#edf4ef] transition-colors"
            }
          >
            Problems
          </Link>
          <Link
            to="/contests"
            className={
              location.pathname === "/contests"
                ? "text-[#3f7d55] dark:text-[#86c79a] border-b-2 border-[#3f7d55] pb-5 pt-5 px-1 font-semibold"
                : "hover:text-[#183226] dark:hover:text-[#edf4ef] transition-colors"
            }
          >
            Contests
          </Link>
          <a href="#" className="hover:text-[#183226] dark:hover:text-[#edf4ef] transition-colors">
            Leaderboard
          </a>
          <a href="#" className="hover:text-[#183226] dark:hover:text-[#edf4ef] transition-colors">
            Discuss
          </a>
        </nav>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3.5">
        <button className="relative cursor-pointer rounded-xl p-2 text-[#547060] transition-colors hover:bg-[#dcecdf] hover:text-[#183226] dark:text-[#aabdaf] dark:hover:bg-[#24382b] dark:hover:text-[#edf4ef]">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
        </button>
        <button
          onClick={() => navigate("/settings")}
          aria-label="Open settings"
          className="cursor-pointer rounded-xl p-2 text-[#547060] transition-colors hover:bg-[#dcecdf] hover:text-[#183226] dark:text-[#aabdaf] dark:hover:bg-[#24382b] dark:hover:text-[#edf4ef]"
        >
          <Settings className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2.5">
          {user?.profileImage && !imageError ? (
            <img
              src={user.profileImage}
              alt={user?.username || "User avatar"}
              onError={() => setImageError(true)}
              className="h-8 w-8 rounded-full border border-[#a6cbaa] object-cover ring-2 ring-[#c5dfc9] dark:border-[#405747] dark:ring-[#24382b]"
              onClick={() => {
                // Navigate to profile page
                navigate("/profile");
              }}
            />
          ) : (
            <div
              className="h-8 w-8 shrink-0 select-none rounded-full border border-[#a6cbaa] bg-[#3f7d55] text-xs font-bold uppercase text-white ring-2 ring-[#c5dfc9] shadow-xs dark:border-[#405747] dark:bg-[#86c79a] dark:text-[#0d1510] dark:ring-[#24382b]"
              title={user?.username || user?.name || "User"}
              onClick={() => {
                // Navigate to profile page
                navigate("/profile");
              }}
            >
              {(user?.username || user?.name || user?.email || "U")
                .charAt(0)
                .toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
