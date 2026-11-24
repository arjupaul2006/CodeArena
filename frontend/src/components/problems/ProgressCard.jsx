import React, { useContext, useEffect } from "react";
import { UserDataContext } from "../../context/UserContext";

export default function ProgressCard() {
  const { user, setUser } = useContext(UserDataContext);


  useEffect(() => {
    console.log("User data in ProgressCard:", user);
  }, [user]);
  // console.log("User data in ProgressCard:", user);

  const solvedCount = user?.solvedProblems?.length ?? 0;

  return (
    <div className="bg-[#f4faf1] dark:bg-[#172019] rounded-xl border border-[#b7d2bb] dark:border-[#405747] p-4 space-y-4 shadow-lg">
      <div>
        <div className="flex justify-between items-end mb-1.5">
          <h4 className="text-xs uppercase font-bold tracking-wider text-[#668170] dark:text-[#aabdaf]">
            Your Progress
          </h4>
          <span className="text-sm font-bold font-mono text-[#3f7d55] dark:text-[#86c79a]">
            72%
          </span>
        </div>
        <div className="w-full bg-[#c5dcc8] dark:bg-[#2b4636] h-2 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-[#3f7d55] to-emerald-500 h-full w-[72%] rounded-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#b7d2bb] dark:border-[#405747]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#668170] dark:text-[#aabdaf] block mb-0.5">
            Solved
          </span>
          <span className="text-2xl font-black text-[#183226] dark:text-[#edf4ef] tracking-tight">
            {solvedCount}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#668170] dark:text-[#aabdaf] block mb-0.5">
            Streak
          </span>
          <span className="text-2xl font-black text-[#2f6b45] dark:text-[#86c79a] tracking-tight flex items-center gap-1">
            14d <span className="text-xs font-normal text-[#547060] dark:text-[#aabdaf]">ðŸ”¥</span>
          </span>
        </div>
      </div>
    </div>
  );
}
