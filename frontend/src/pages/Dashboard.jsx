import React, { useContext, useEffect } from "react";
import {
  Trophy,
  Terminal,
  Zap,
  Flame,
  Target,
  Clock,
  CheckCircle2,
  ChevronRight,
  Code2,
} from "lucide-react";
import Sidebar from "../components/problems/SideBar";
import TopNav from "../components/problems/TopNav";
import { UserDataContext } from "../context/UserContext.jsx";

const stat = [
  {
    label: "Global Rank",
    value: "#12,450",
    sub: "Top 4.2%",
    icon: Trophy,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    label: "Problems Solved",
    value: "452 / 2,410",
    sub: "72% Efficiency",
    icon: Code2,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    label: "Current Streak",
    value: "14 Days",
    sub: "Max: 32 days",
    icon: Flame,
    color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  },
  {
    label: "Accuracy Rate",
    value: "76.4%",
    sub: "+2.1% this week",
    icon: Target,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
];

export default function DashboardOverview() {
  const { user, setUser } = useContext(UserDataContext);

  useEffect(() => {
    console.log("User data in dashboard:", user);
  }, [user]);

  return (
    <div className="flex min-h-screen bg-[#e8f3e8] text-[#244333] font-sans antialiased">
      {/* Shared Persistent Layout Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0 pb-16 md:pb-0">
        <TopNav />

        <main className="flex-1 p-4 lg:p-6 max-w-[1600px] w-full mx-auto space-y-6">
          {/* 1. Welcome Banner Hero */}
          <div className="relative rounded-2xl bg-[#cfe8d3] border border-[#a6cbaa] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 overflow-hidden shadow-xl shadow-[#9ab99f]/30">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-[#183226] tracking-tight">
                Welcome back, Developer! 👋
              </h1>
              <p className="text-[#547060] text-sm mt-1 max-w-xl">
                You're in the top{" "}
                <span className="text-rose-400 font-bold">8%</span> of coders
                this week. Keep up the momentum to secure your spot in the rank
                brackets.
              </p>
            </div>
            <button className="bg-[#3f7d55] hover:bg-[#326844] text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-[#8eae94]/40 cursor-pointer">
              Resume Daily Challenge <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* 2. Key Metrics Overview Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stat.map((metric, idx) => {
              const Icon = metric.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#f4faf1] rounded-2xl border border-[#b7d2bb] p-4 flex items-center justify-between shadow-md"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#668170] block">
                      {metric.label}
                    </span>
                    <span className="text-xl lg:text-2xl font-black text-[#244333] tracking-tight block">
                      {metric.value}
                    </span>
                    <span className="text-[11px] text-[#668170] block">
                      {metric.sub}
                    </span>
                  </div>
                  <div
                    className={`p-2.5 rounded-xl border hidden sm:block ${metric.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. Primary Analytical Section Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            {/* Left: Activity Matrix Map Visual & Topic Strengths */}
            <div className="xl:col-span-2 space-y-6">
              {/* Activity Map Module Shell */}
              <div className="bg-[#f4faf1] rounded-2xl border border-[#b7d2bb] p-4 lg:p-5 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#244333]">
                      Submission Frequency
                    </h3>
                    <p className="text-xs text-[#668170]">
                      Your commit and check-in behavior over the past months.
                    </p>
                  </div>
                  <select className="bg-[#e8f3e8] border border-[#b7d2bb] text-xs text-[#385a43] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#3f7d55]">
                    <option>Last 6 Months</option>
                    <option>Year 2026</option>
                  </select>
                </div>

                {/* Simulated Mock Contribution Matrix Map Component */}
                <div className="p-6 bg-[#e8f3e8] rounded-xl border border-[#b7d2bb] flex flex-col justify-center items-center text-center">
                  <Terminal className="h-8 w-8 text-[#7da188] mb-2" />
                  <span className="text-sm font-semibold text-[#547060]">
                    Activity Analytics Heatmap Widget Container
                  </span>
                  <p className="text-xs text-[#668170] mt-1 max-w-xs">
                    Integrate your charts package here (e.g., recharts,
                    react-calendar-heatmap).
                  </p>
                </div>
              </div>

              {/* Skill Proficiency Index Breakdown */}
              <div className="bg-[#f4faf1] rounded-2xl border border-[#b7d2bb] p-4 lg:p-5 shadow-lg">
                <h3 className="text-base font-bold text-[#244333] mb-4">
                  Skill Index & Strengths
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      name: "Dynamic Programming",
                      level: "Intermediate",
                      progress: "54%",
                      color: "from-rose-500 to-red-500",
                    },
                    {
                      name: "Data Structures",
                      level: "Advanced",
                      progress: "88%",
                      color: "from-amber-500 to-rose-500",
                    },
                    {
                      name: "Algorithms",
                      level: "Advanced",
                      progress: "82%",
                      color: "from-rose-500 to-orange-500",
                    },
                    {
                      name: "System Design",
                      level: "Beginner",
                      progress: "20%",
                      color: "from-[#8b5cf6] to-rose-500",
                    },
                  ].map((skill, index) => (
                    <div
                      key={index}
                      className="p-3.5 bg-[#e8f3e8] rounded-xl border border-[#b7d2bb] space-y-2"
                    >
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-bold text-[#385a43]">
                          {skill.name}
                        </span>
                        <span className="text-[10px] text-[#668170] font-medium">
                          {skill.level}
                        </span>
                      </div>
                      <div className="w-full bg-[#c5dcc8] h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${skill.color}`}
                          style={{ width: skill.progress }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side Pane: Recent Submissions & Upcoming Schedules */}
            <div className="xl:col-span-1 space-y-6 w-full">
              {/* Stream of Live Submissions */}
              <div className="bg-[#f4faf1] rounded-2xl border border-[#b7d2bb] p-4 lg:p-5 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-base font-bold text-[#244333]">
                    Recent Activity
                  </h3>
                  <a
                    href="#"
                    className="text-xs font-semibold text-rose-400 hover:underline"
                  >
                    View logs
                  </a>
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      title: "Search in Rotated Sorted Array",
                      outcome: "Accepted",
                      time: "12 mins ago",
                      outcomeColor: "text-emerald-400",
                    },
                    {
                      title: "Median of Two Sorted Arrays",
                      outcome: "Accepted",
                      time: "2 hours ago",
                      outcomeColor: "text-emerald-400",
                    },
                    {
                      title: "3Sum",
                      outcome: "Time Limit Exceeded",
                      time: "Yesterday",
                      outcomeColor: "text-rose-400",
                    },
                    {
                      title: "Two Sum",
                      outcome: "Accepted",
                      time: "3 days ago",
                      outcomeColor: "text-emerald-400",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-start p-2.5 rounded-xl bg-[#e8f3e8] border border-[#b7d2bb] text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-[#385a43] block truncate max-w-[180px]">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-[#668170] flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {item.time}
                        </span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-mono font-semibold block ${item.outcomeColor}`}
                        >
                          {item.outcome}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contests Spotlight Card */}
              <div className="bg-[#f4faf1] rounded-2xl border border-[#b7d2bb] p-4 lg:p-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none"></div>
                <h3 className="text-base font-bold text-[#244333] mb-1">
                  Upcoming Arena Battles
                </h3>
                <p className="text-xs text-[#668170] mb-4">
                  Compete globally against elite developers.
                </p>

                <div className="p-3.5 bg-[#e8f3e8] border-l-4 border-[#3f7d55] rounded-r-xl space-y-1.5">
                  <span className="text-xs font-bold text-[#385a43] block">
                    Midnight Knockout Round #48
                  </span>
                  <span className="text-[11px] text-[#668170] block">
                    Starts in:{" "}
                    <strong className="text-rose-400 font-mono">
                      1d 4h 12m
                    </strong>
                  </span>
                  <button className="mt-2 w-full text-center bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold py-2 rounded-xl transition-all cursor-pointer">
                    Register For Match
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
