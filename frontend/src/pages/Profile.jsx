import React, { useState, useContext, useEffect } from "react";
import Sidebar from "../components/problems/SideBar";
import TopNav from "../components/problems/TopNav";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileTabs from "../components/profile/ProfileTabs";
import ProfileStatsOverview from "../components/profile/ProfileStatsOverview";
import ProblemSolvingCard from "../components/profile/ProblemSolvingCard";
import ContestPerformanceCard from "../components/profile/ContestPerformanceCard";
import SubmissionHistoryCard from "../components/profile/SubmissionHistoryCard";
import BadgesShowcase from "../components/profile/BadgesShowcase";
import EditProfileModal from "../components/profile/EditProfileModal";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";

const initialProfileData = {
  username: "Alex DevNull",
  email: "alex.devnull@codearena.dev",
  role: "Senior Backend Engineer",
  joinedDate: "January 12, 2024",
  lastActive: "Today at 10:42 AM",
  bio: "Competitive programmer & algorithm enthusiast. Top 2% in CodeArena weekly battles.",
  profileImage:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
  stats: [
    { label: "Total Submissions", value: "248" },
    { label: "Accepted Submissions", value: "186" },
    { label: "Wrong Answers", value: "62" },
    { label: "Acceptance Rate", value: "75%" },
    { label: "Maximum Streak", value: "21 days" },
    { label: "Longest Submission Streak", value: "34 days" },
  ],
  problemSolving: {
    difficulty: [
      { label: "Easy", solved: 82, total: 150, color: "bg-emerald-500" },
      { label: "Medium", solved: 76, total: 120, color: "bg-amber-500" },
      { label: "Hard", solved: 28, total: 60, color: "bg-rose-500" },
    ],
    topics: [
      { label: "Arrays & Hashing", solved: 28 },
      { label: "Two Pointers & Sliding Window", solved: 22 },
      { label: "Dynamic Programming", solved: 19 },
      { label: "Graphs & BFS/DFS", solved: 15 },
      { label: "Trees & Binary Search Trees", solved: 14 },
    ],
    recentlySolved: [
      "Two Sum",
      "Valid Parentheses",
      "Merge Intervals",
      "Course Schedule II",
    ],
    mostPracticed: "Dynamic Programming",
    pending: 144,
  },
  contestStats: [
    {
      label: "Contests Participated",
      value: "12",
      description: "Total contests joined",
    },
    {
      label: "Total Contest Score",
      value: "8,460",
      description: "Sum of contest scores",
    },
    {
      label: "Highest Contest Score",
      value: "980",
      description: "Best individual contest score",
    },
    {
      label: "Average Contest Score",
      value: "705",
      description: "Average score per contest",
    },
    {
      label: "Contest Rank",
      value: "#1,248",
      description: "Current overall leaderboard rank",
    },
    {
      label: "Best Rank",
      value: "#87",
      description: "Highest position achieved",
    },
    {
      label: "Contests Won",
      value: "2",
      description: "Number of first-place finishes",
    },
  ],
  submissions: [
    {
      problem: "Two Sum",
      language: "C++",
      status: "Accepted",
      submittedAt: "2 hours ago",
      executionTime: "42 ms",
      memory: "14.2 MB",
      tests: "57 / 57",
    },
    {
      problem: "Longest Increasing Subsequence",
      language: "Python",
      status: "Wrong Answer",
      submittedAt: "Yesterday",
      executionTime: "—",
      memory: "—",
      tests: "18 / 24",
    },
    {
      problem: "Best Time to Buy and Sell Stock",
      language: "C++",
      status: "Accepted",
      submittedAt: "2 days ago",
      executionTime: "68 ms",
      memory: "16.8 MB",
      tests: "211 / 211",
    },
    {
      problem: "Binary Tree Level Order Traversal",
      language: "Java",
      status: "Runtime Error",
      submittedAt: "3 days ago",
      executionTime: "31 ms",
      memory: "12.4 MB",
      tests: "14 / 20",
    },
    {
      problem: "Coin Change",
      language: "Python",
      status: "TLE",
      submittedAt: "4 days ago",
      executionTime: "2,004 ms",
      memory: "28.1 MB",
      tests: "22 / 30",
    },
    {
      problem: "Valid Anagram",
      language: "JavaScript",
      status: "Compilation Error",
      submittedAt: "5 days ago",
      executionTime: "—",
      memory: "—",
      tests: "0 / 49",
    },
  ],
};

export default function Profile() {
  const { user, setUser } = useContext(UserDataContext);
  const [profile, setProfile] = useState(initialProfileData);
  const [activeTab, setActiveTab] = useState("activity");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [problems, setProblems] = useState([]);
  const [totalProblemCategories, setTotalProblemCategories] = useState({});
  const [solvedProblemCategories, setSolvedProblemCategories] = useState({});

  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [streaks, setStreaks] = useState({
    currentStreak: 0,
    maxStreak: 0,
  });

  // Sync with UserDataContext whenever user changes or updates
  useEffect(() => {
    if (user && typeof user === "object") {
      const resolvedUsername =
        (user.username && user.username.trim()) ||
        (user.name && user.name.trim()) ||
        (user.email && user.email.split("@")[0]);

      if (resolvedUsername || user.email || user.profileImage) {
        setProfile((prev) => ({
          ...prev,
          username: resolvedUsername || prev.username,
          email: user.email || prev.email,
          profileImage: user.profileImage || prev.profileImage,
          role: user.role || prev.role,
          bio: user.bio || prev.bio,
        }));
      }
    }
  }, [user]);

  const handleSaveProfile = (updatedData) => {
    setProfile((prev) => ({
      ...prev,
      ...updatedData,
    }));

    if (setUser) {
      setUser((prevUser) => ({
        ...prevUser,
        username: updatedData.username,
        name: updatedData.username,
        email: updatedData.email,
        profileImage: updatedData.profileImage,
        role: updatedData.role,
        bio: updatedData.bio,
      }));
    }
  };

  const currentUsername =
    profile?.username ||
    user?.username ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : null) ||
    "Alex DevNull";

  const totalSolved =
    profile.problemSolving?.difficulty?.reduce(
      (acc, d) => acc + (d.solved || 0),
      0,
    ) || 186;

  // fetch number of toatl problems in each category
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

        // console.log("Category counts:", categoryCounts);
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
          problem?.tags.forEach((tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
          });
          return acc;
        },
        {},
      );

      //   console.log("Solved category counts:", solvedCategoryCounts);
      setSolvedProblemCategories(solvedCategoryCounts);
    }
  }, [user]);

  //fetch number of easy, medium, hard problems total
  const totalDifficultyCounts = problems.reduce((acc, problem) => {
    const difficulty = problem.difficulty?.toLowerCase();
    if (difficulty) {
      acc[difficulty] = (acc[difficulty] || 0) + 1;
    }
    return acc;
  }, {});

  // fetch number of easy, medium, hard problems solved
  const solvedDifficultyCounts = (user?.solvedProblems || []).reduce(
    (acc, problem) => {
      const difficulty = problem.difficulty?.toLowerCase();
      if (difficulty) {
        acc[difficulty] = (acc[difficulty] || 0) + 1;
      }
      return acc;
    },
    {},
  );

  //fetch submission history from user context
  useEffect(() => {
    const fetchSubmissionHistory = async () => {
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        const response = await axios.get(
          `${backendUrl}/api/submissionHistory`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        const data = await response.data;
        console.log("User submission history:", data.submissions);
        setSubmissionHistory(data.submissions);
      } catch (error) {
        console.error("Error fetching submission history:", error);
      }
    };

    if (user) {
      fetchSubmissionHistory();
    }
  }, [user]);

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
    <div className="flex min-h-screen bg-[#e8f3e8] font-sans text-[#244333] antialiased selection:bg-[#3f7d55] selection:text-white">
      {/* Persistent Sidebar matching platform navigation */}
      <Sidebar />

      {/* Main Framework Content Container */}
      <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0 md:pl-64">
        <TopNav />

        {/* Content Body Grid */}
        <main className="mx-auto w-full max-w-[1440px] flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Top Page Breadcrumb & Title */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3f7d55]">
              Account & Profile
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-[#183226]">
              {currentUsername}'s Profile
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#547060]">
              Manage your personal credentials, competitive record, and
              submission achievements.
            </p>
          </div>

          {/* Section 1: Hero Profile Header Card */}
          <ProfileHeader
            profile={profile}
            user={user}
            onEditClick={() => setIsEditModalOpen(true)}
          />

          {/* Section Navigation Tabs */}
          <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            counts={{
              solvedCount: totalSolved,
              contestCount: profile.contestStats?.[0]?.value || "12",
              submissionCount: profile.submissions?.length || 6,
              badgesCount: "4",
            }}
          />

          {/* Tab Views Content */}
          <div className="transition-all duration-300">
            {/* TAB: Coding Activity */}
            {activeTab === "activity" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <ProblemSolvingCard
                  problemSolving={profile.problemSolving}
                  problems={problems}
                  solvedProblemCategories={solvedProblemCategories}
                  totalProblemCategories={totalProblemCategories}
                  totalDifficultyCounts={totalDifficultyCounts}
                  solvedDifficultyCounts={solvedDifficultyCounts}
                />
                <ProfileStatsOverview
                  acceptanceRate={
                    profile.stats.find((s) => s.label === "Acceptance Rate")
                      ?.value || "75%"
                  }
                  submissionHistory={submissionHistory}
                  streaks={streaks}
                />
              </div>
            )}

            {/* TAB: Contest Performance */}
            {activeTab === "contests" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <ContestPerformanceCard contestStats={profile.contestStats} />
              </div>
            )}

            {/* TAB: Submissions */}
            {activeTab === "submissions" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <SubmissionHistoryCard submissions={submissionHistory} />
              </div>
            )}

            {/* TAB: Badges & Honors */}
            {activeTab === "badges" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <BadgesShowcase />
              </div>
            )}

            {/* TAB: View All */}
            {activeTab === "all" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <ProfileStatsOverview
                  stats={profile.stats}
                  acceptanceRate={
                    profile.stats.find((s) => s.label === "Acceptance Rate")
                      ?.value || "75%"
                  }
                />
                <ProblemSolvingCard problemSolving={profile.problemSolving} />
                <ContestPerformanceCard contestStats={profile.contestStats} />
                <BadgesShowcase />
                <SubmissionHistoryCard submissions={profile.submissions} />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Interactive Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
