import React, { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DailyChallenge() {
  const [randomProblem, setRandomProblem] = useState();
  const navigate = useNavigate();

  // fetch random problem
  useEffect(() => {
    const fetchRandomProblem = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        const response = await axios.get(
          `${backendUrl}/api/random-problem`,
        );
        const data = await response.data;
        console.log("Random Problem:", data.problem);
        setRandomProblem(data.problem);

      } catch (error) {
        console.error("Error fetching random problem:", error);
      }
    };

    fetchRandomProblem();
  }, []);

  const handleSolveNow = () => {
    if (randomProblem) {
      // Navigate to the problem page
      navigate(`/write-code?id=${randomProblem._id}`);
    }
  };

  return (
    <div className="bg-[#f4faf1] dark:bg-[#172019] rounded-xl border border-[#b7d2bb] dark:border-[#405747] p-4 shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#3f7d55]/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="flex items-center gap-1.5 text-xs text-[#2f6b45] dark:text-[#86c79a] font-bold tracking-wider uppercase mb-2">
        <Zap className="h-3.5 w-3.5 fill-[#3f7d55] text-[#3f7d55] dark:text-[#86c79a]" /> Daily
        Challenge
      </div>
      <h3 className="text-lg font-bold text-[#183226] dark:text-[#edf4ef] mb-1">
        {randomProblem?.title || "No problem for today"}
      </h3>
      <div className="flex gap-2 mb-4">
        <span className="text-[10px] bg-amber-500/15 text-amber-800 border border-amber-500/30 px-2 py-0.5 rounded font-semibold">
          {randomProblem?.difficulty || "Easy"}
        </span>
      </div>
      <button className="w-full bg-[#3f7d55] hover:bg-[#326844] text-white text-xs font-semibold py-2 rounded-lg shadow-md shadow-[#8eae94]/40 transition-all cursor-pointer" onClick={handleSolveNow}>
        Solve Now
      </button>
    </div>
  );
}
