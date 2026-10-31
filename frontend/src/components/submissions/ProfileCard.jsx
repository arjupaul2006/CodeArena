import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle2, Code2 } from "lucide-react";
import { UserDataContext } from "../../context/UserContext";

export default function ProfileCard() {
  const { user } = useContext(UserDataContext);
  const [imageError, setImageError] = useState(false);
  const [streaks, setStreaks] = useState({
    currentStreak: 0,
    maxStreak: 0,
  });

  useEffect(() => {
    setImageError(false);
  }, [user?.profileImage]);

  // Fetch submission streaks from the backend
  useEffect(() => {
    const fetchStreaks = async () => {
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${backendUrl}/api/getSubmissionEachDay`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          },
        );

        setStreaks({
          currentStreak: response.data?.currentStreak || 0,
          maxStreak: response.data?.maxStreak || 0,
        });
      } catch (error) {
        console.error("Error fetching submission streaks:", error);
      }
    };

    fetchStreaks();
  }, []);

  return (
    <div className="bg-[#f4faf1] rounded-2xl border border-[#b7d2bb] p-6 flex flex-col items-center text-center justify-between h-full shadow-lg">
      {/* Avatar Wrapper with Status Ring Indicator */}
      <div className="relative mt-2">
        <div className="w-24 h-24 rounded-2xl border-2 border-[#3f7d55] p-1 bg-[#e8f3e8] overflow-hidden shadow-md shadow-[#8eae94]/30 flex items-center justify-center">
          {user?.profileImage && !imageError ? (
            <img
              src={user.profileImage}
              alt={user?.username || "User profile avatar"}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-full rounded-xl bg-[#3f7d55] text-white flex items-center justify-center font-black text-3xl select-none uppercase">
              {(user?.username || user?.name || user?.email || "U").charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 bg-[#f4faf1] rounded-full p-0.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-500/20" />
        </div>
      </div>

      {/* Main Bio/Metadata Blocks */}
      <div className="mt-4 space-y-1">
        <h2 className="text-xl font-bold text-[#183226] tracking-tight">
          {user?.username || "Alex \"DevNull\" Rivera"}
        </h2>
        <p className="text-[#547060] text-xs font-medium">
          {user?.email || "Senior Backend Engineer @ Neotech"}
        </p>
      </div>

      {/* Numerical Rankings Horizontal Grid Split */}
      <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-5 border-t border-[#b7d2bb]">
        <div className="bg-[#e8f3e8] border border-[#b7d2bb] p-3.5 rounded-xl">
          <span className="text-[10px] uppercase tracking-wider text-[#668170] font-bold block mb-0.5">
            Global Rank
          </span>
          <span className="text-base font-black text-[#3f7d55] font-mono">
            #1,242
          </span>
        </div>
        <div className="bg-[#e8f3e8] border border-[#b7d2bb] p-3.5 rounded-xl">
          <span className="text-[10px] uppercase tracking-wider text-[#668170] font-bold block mb-0.5">
            Streak
          </span>
          <span className="text-base font-black text-emerald-700 font-mono">
            {streaks.currentStreak}{" "}
            {streaks.currentStreak === 1 ? "Day" : "Days"}
          </span>
          <span className="block mt-1 text-[10px] text-[#547060]">
            Best: {streaks.maxStreak}{" "}
            {streaks.maxStreak === 1 ? "day" : "days"}
          </span>
        </div>
      </div>
    </div>
  );
}
