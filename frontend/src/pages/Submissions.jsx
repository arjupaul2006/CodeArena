import React from 'react';
import Sidebar from '../components/problems/SideBar';
import TopNav from '../components/problems/TopNav';
import ProfileCard from '../components/submissions/ProfileCard';
import StatsOverviewCard from '../components/submissions/StatsOverviewCard';
import ActivityHeatmap from '../components/submissions/ActivityHeatmap';
import SubmissionHistoryTable from '../components/submissions/SubmissionHistoryTable';

export default function Submissions() {
  return (
    <div className="flex min-h-screen bg-[#0b0f19] text-gray-300 font-sans antialiased">
      {/* Sidebar - Persistent layout component */}
      <Sidebar />

      {/* Main Framework Content Container */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 pb-20 md:pb-0">
        <TopNav />

        {/* Content Body Grid layout */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto space-y-6">
          
          {/* Top Row Grid: Profile Insight and Detailed Stats Rings */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 xl:col-span-4 h-full">
              <ProfileCard />
            </div>
            <div className="lg:col-span-7 xl:col-span-8 h-full">
              <StatsOverviewCard />
            </div>
          </div>

          {/* Middle Row Grid: Custom Contribution Activity Heatmap */}
          <ActivityHeatmap />

          {/* Bottom Row Grid: Complete Data Logs Audit Stream */}
          <SubmissionHistoryTable />
          
        </main>
      </div>
    </div>
  );
}