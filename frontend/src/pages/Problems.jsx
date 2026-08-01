import React from "react";
import Sidebar from "../components/problems/SideBar";
import TopNav from "../components/problems/TopNav";
import ProblemTable from "../components/problems/ProblemTable";
import DailyChallenge from "../components/problems/DailyChallenge";
import CategoriesCard from "../components/problems/CategoriesCard";
import ProgressCard from "../components/problems/ProgressCard";

const Problems = () => {
  return (
    <div className="flex min-h-screen bg-[#12080a] text-slate-300 font-sans antialiased">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 pb-16 md:pb-0">
        <TopNav />

        <main className="flex-1 p-4 lg:p-6 grid grid-cols-1 xl:grid-cols-4 gap-6 items-start max-w-[1600px] w-full mx-auto">
          {/* Left/Middle: Header & Table (Takes 3 cols on massive screens) */}
          <div className="xl:col-span-3 space-y-6 min-w-0">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                Problem Set
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Sharpen your skills with our curated collection of challenges.
              </p>
            </div>

            <ProblemTable />
          </div>

          {/* Right Column: Widgets */}
          <div className="xl:col-span-1 space-y-6 w-full">
            <DailyChallenge />
            <CategoriesCard />
            <ProgressCard />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Problems;
