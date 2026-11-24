import React from "react";

export default function ContestLeaderboard({ leaderboard }) {
  return (
    <div className="rounded-2xl border border-[#b7d2bb] dark:border-[#405747] bg-[#f4faf1] dark:bg-[#172019] p-5 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-[#183226] dark:text-[#edf4ef] text-lg">Contest Standings</h3>
          <p className="text-xs text-[#668170] dark:text-[#aabdaf]">Updated live every 30 seconds</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#547060] dark:text-[#aabdaf]">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Solved
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-rose-500" /> Unsolved
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-[#244333] dark:text-[#edf4ef]">
          <thead className="border-b border-[#b7d2bb] dark:border-[#405747] bg-[#eef7eb] dark:bg-[#1a241d] text-[11px] font-bold uppercase tracking-wider text-[#547060] dark:text-[#aabdaf]">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Participant</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Time Penalty</th>
              <th className="px-4 py-3 text-center">Problem A</th>
              <th className="px-4 py-3 text-center">Problem B</th>
              <th className="px-4 py-3 text-center">Problem C</th>
              <th className="px-4 py-3 text-center">Problem D</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dcecdf]">
            {leaderboard?.map((item) => (
              <tr
                key={item.rank}
                className={`transition-colors ${
                  item.isUser
                    ? "bg-[#eef7eb] dark:bg-[#1a241d] font-bold text-[#183226] dark:text-[#edf4ef]"
                    : "hover:bg-[#eef7eb] dark:bg-[#1a241d]/60"
                }`}
              >
                <td className="px-4 py-3.5 font-bold">
                  {item.rank === 1 ? (
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-400 text-amber-950 font-black">
                      1
                    </span>
                  ) : item.rank === 2 ? (
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-300 text-slate-800 font-black">
                      2
                    </span>
                  ) : item.rank === 3 ? (
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-amber-700/30 text-amber-900 font-black">
                      3
                    </span>
                  ) : (
                    `#${item.rank}`
                  )}
                </td>

                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#c5dfc9] dark:bg-[#2b4636] text-xs font-bold text-[#3f7d55] dark:text-[#86c79a]">
                      {item.avatar}
                    </div>
                    <span>{item.name}</span>
                    {item.isUser && (
                      <span className="rounded bg-[#3f7d55] px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                        YOU
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-3.5 font-black text-[#183226] dark:text-[#edf4ef]">
                  {item.score} <span className="text-[10px] font-normal text-[#668170] dark:text-[#aabdaf]">pts</span>
                </td>

                <td className="px-4 py-3.5 font-mono text-xs text-[#547060] dark:text-[#aabdaf]">
                  {item.penalty}
                </td>

                {["A", "B", "C", "D"].map((letter) => (
                  <td key={letter} className="px-4 py-3.5 text-center">
                    {item.problemsSolved?.[letter] ? (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-800 font-bold text-xs">
                        âœ“
                      </span>
                    ) : (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-gray-200 dark:bg-[#24382b]/60 text-gray-400 text-xs">
                        -
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
