import React, { useContext, useEffect, useState } from "react";
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
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DashboardOverview() {
  const { user, setUser } = useContext(UserDataContext);
  const [noOfProblems, setNoOfProblems] = React.useState(0);
  const [problems, setProblems] = useState([]);
  const [totalProblemCategories, setTotalProblemCategories] = useState([]);
  const [solvedProblemCategories, setSolvedProblemCategories] = useState([]);
  const solvedProblemsCount = user?.solvedProblems?.length || 0;
  const navigate = useNavigate();

  const [cats, setcats] = useState([
    {
      name: "Array",
      level: "Beginner",
      total: 120,
      solved: 86,
      progress: "72%",
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Math",
      level: "Beginner",
      total: 120,
      solved: 86,
      progress: "72%",
      color: "from-red-500 to-cyan-500",
    },
    {
      name: "Strings",
      level: "Beginner",
      total: 95,
      solved: 62,
      progress: "65%",
      color: "from-emerald-500 to-teal-500",
    },
    {
      name: "Linked List",
      level: "Beginner",
      total: 80,
      solved: 46,
      progress: "58%",
      color: "from-violet-500 to-purple-500",
    },
    {
      name: "Stack & Queue",
      level: "Beginner",
      total: 70,
      solved: 45,
      progress: "64%",
      color: "from-orange-500 to-amber-500",
    },
    {
      name: "Hash Table",
      level: "Intermediate",
      total: 100,
      solved: 54,
      progress: "54%",
      color: "from-pink-500 to-rose-500",
    },
    {
      name: "Binary Search",
      level: "Intermediate",
      total: 80,
      solved: 38,
      progress: "48%",
      color: "from-cyan-500 to-blue-500",
    },
    {
      name: "Recursion",
      level: "Intermediate",
      total: 100,
      solved: 45,
      progress: "45%",
      color: "from-indigo-500 to-violet-500",
    },
    {
      name: "Sorting",
      level: "Intermediate",
      total: 120,
      solved: 82,
      progress: "68%",
      color: "from-lime-500 to-green-500",
    },
    {
      name: "Trees",
      level: "Intermediate",
      total: 100,
      solved: 52,
      progress: "52%",
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Binary Search Tree",
      level: "Intermediate",
      total: 100,
      solved: 42,
      progress: "42%",
      color: "from-teal-500 to-cyan-500",
    },
    {
      name: "Heap / Priority Queue",
      level: "Intermediate",
      total: 90,
      solved: 34,
      progress: "38%",
      color: "from-amber-500 to-orange-500",
    },
    {
      name: "Graphs",
      level: "Advanced",
      total: 100,
      solved: 35,
      progress: "35%",
      color: "from-blue-500 to-indigo-500",
    },
    {
      name: "BFS & DFS",
      level: "Intermediate",
      total: 100,
      solved: 35,
      progress: "47%",
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Greedy Algorithms",
      level: "Intermediate",
      total: 100,
      solved: 35,
      progress: "41%",
      color: "from-yellow-500 to-orange-500",
    },
    {
      name: "Backtracking",
      level: "Advanced",
      total: 100,
      solved: 35,
      progress: "32%",
      color: "from-red-500 to-pink-500",
    },
    {
      name: "Dynamic Programming",
      level: "Advanced",
      total: 100,
      solved: 35,
      progress: "28%",
      color: "from-rose-500 to-red-500",
    },
    {
      name: "Trie",
      level: "Advanced",
      total: 100,
      solved: 35,
      progress: "25%",
      color: "from-fuchsia-500 to-purple-500",
    },
    {
      name: "Bit Manipulation",
      level: "Intermediate",
      total: 100,
      solved: 35,
      progress: "36%",
      color: "from-slate-500 to-gray-500",
    },
    {
      name: "Disjoint Set Union",
      level: "Advanced",
      total: 100,
      solved: 35,
      progress: "22%",
      color: "from-orange-500 to-red-500",
    },
    {
      name: "Topological Sort",
      level: "Advanced",
      total: 100,
      solved: 35,
      progress: "19%",
      color: "from-cyan-500 to-teal-500",
    },
    {
      name: "Shortest Path",
      level: "Advanced",
      total: 100,
      solved: 35,
      progress: "17%",
      color: "from-indigo-500 to-blue-500",
    },
    {
      name: "Minimum Spanning Tree",
      level: "Advanced",
      total: 100,
      solved: 35,
      progress: "15%",
      color: "from-emerald-500 to-green-500",
    },
  ]);

  const [streaks, setStreaks] = useState({
    currentStreak: 0,
    maxStreak: 0,
  });

  // Fetch problems from the backend API and update the state
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

        const response = await fetch(`${backendUrl}/api/problems`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();

        if (data.problems) {
          setProblems(data.problems);
          setNoOfProblems(data.problems.length);
        }
      } catch (error) {
        console.warn("Backend unavailable, using fallback problem set:", error);
      }
    };

    fetchProblems();
  }, []);

  const [submissionHistory, setSubmissionHistory] = React.useState([]);

  // Fetch submission history from the backend API
  useEffect(() => {
    // Fetch submission history from the backend API
    const fetchSubmissionHistory = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL; // Fallback to localhost if not set

        const response = await axios.get(
          `${backendUrl}/api/submissionHistory`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store the token in localStorage
            },
          },
        );
        const data = await response.data;
        console.log("Submission history:", data);
        setSubmissionHistory(data.submissions || []);
      } catch (error) {
        console.error("Error fetching submission history:", error);
      }
    };

    fetchSubmissionHistory();
  }, []);

  // Fetch submission streaks from the backend
  useEffect(() => {
    const fetchStreaks = async () => {
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `${backendUrl}/api/getSubmissionEachDay`,
          {
            data: {
              searchUserId: null,
            },
          },
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
      value: `${solvedProblemsCount} / ${noOfProblems}`,
      sub: "72% Efficiency",
      icon: Code2,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Current Streak",
      value: `${streaks.currentStreak} days`,
      sub: `Max: ${streaks.maxStreak} days`,
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

  // fetch number of total problems in each category
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        const response = await axios.get(`${backendUrl}/api/problems`);
        const data = await response.data;
        // console.log("All problems in Dashboard:", data.problems);
        setProblems(data.problems);

        // number of problems in each category
        const categoryCounts = data.problems.reduce((acc, problem) => {
          problem?.tags?.forEach((tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
          });
          return acc;
        }, {});

        console.log("Category counts:", categoryCounts);
        setTotalProblemCategories(categoryCounts);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    fetchProblems();
  }, []);

  // fetch number of solved problems in each category
  useEffect(() => {
    if (user) {
      console.log(
        "User solved problems in Dashboard:",
        user,
        user.solvedProblems,
      );

      // number of solved problems in each category
      const solvedCategoryCounts = (user?.solvedProblems || []).reduce(
        (acc, problem) => {
          problem?.tags?.forEach((tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
          });
          return acc;
        },
        {},
      );

      console.log("Solved category counts:", solvedCategoryCounts);
      setSolvedProblemCategories(solvedCategoryCounts);
    }
  }, [user]);

  // change the progress of each category in cats array
  useEffect(() => {
    const updatedCats = cats.map((cat) => {
      const total = totalProblemCategories[cat.name] || 0;
      const solved = solvedProblemCategories[cat.name] || 0;
      const progress =
        total > 0 ? `${Math.round((solved / total) * 100)}%` : "0%";
      return { ...cat, total, solved, progress };
    });
    setcats(updatedCats);
  }, [totalProblemCategories, solvedProblemCategories]);

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
            </div>
            <button
              className="bg-[#3f7d55] hover:bg-[#326844] text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-[#8eae94]/40 cursor-pointer"
              onClick={() => navigate("/problems")}
            >
              Daily Challenge <ChevronRight className="h-4 w-4" />
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
            {/* Left: Topic Strengths */}
            <div className="xl:col-span-2 space-y-6">
              {/* Skill Proficiency Index Breakdown */}
              <div className="bg-[#f4faf1] rounded-2xl border border-[#b7d2bb] p-4 lg:p-5 shadow-lg">
                <h3 className="text-base font-bold text-[#244333] mb-4">
                  Skill Index & Strengths
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cats.map(
                    (skill, index) =>
                      Object.keys(totalProblemCategories).includes(skill.name) && (
                        <div
                          key={index}
                          className="p-3.5 bg-[#e8f3e8] rounded-xl border border-[#b7d2bb] space-y-2"
                          onClick={() =>
                            navigate(`/problems?tag=${skill.name}`)
                          }
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
                      ),
                  )}
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
                    href="/submissions"
                    className="text-xs font-semibold text-rose-400 hover:underline"
                  >
                    View Detailed History{" "}
                    <ChevronRight className="h-3.5 w-3.5 inline" />
                  </a>
                </div>

                <div className="space-y-2.5">
                  {submissionHistory.length > 0 &&
                    submissionHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-start p-2.5 rounded-xl bg-[#e8f3e8] border border-[#b7d2bb] text-xs"
                        onClick={() =>
                          navigate(`/write-code?submission_id=${item._id}`)
                        }
                      >
                        <div className="space-y-0.5">
                          <span className="font-semibold text-[#385a43] block truncate max-w-[180px]">
                            {item.problemId?.title}
                          </span>
                          <span className="text-[11px] text-[#668170] flex items-center gap-1">
                            <Clock className="h-3 w-3" />{" "}
                            {new Date(item.submissionDate).toDateString()} at{" "}
                            {new Date(item.submissionDate).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span
                            className={`font-mono font-semibold block text-green-500`}
                          >
                            {item.status === "accepted"
                              ? "Accepted"
                              : "Wrong Answer"}
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
