import React, { useState, useContext, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import Sidebar from "../components/problems/SideBar";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileTabs from "../components/profile/ProfileTabs";
import ProfileStatsOverview from "../components/profile/ProfileStatsOverview";
import ProblemSolvingCard from "../components/profile/ProblemSolvingCard";
import ContestPerformanceCard from "../components/profile/ContestPerformanceCard";
import SubmissionHistoryCard from "../components/profile/SubmissionHistoryCard";
import ProfileDetails from "../components/profile/ProfileDetails";
import BadgesShowcase from "../components/profile/BadgesShowcase";
import EditProfileModal from "../components/profile/EditProfileModal";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import { fetchGlobalLeaderboard } from "../../services/contextServices";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

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
      value: `12`,
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
  const [searchParams] = useSearchParams();
  const userId = searchParams?.get("id") || null;
  const { user, setUser } = useContext(UserDataContext);
  const [profileUser, setProfileUser] = useState(user);

  const [profile, setProfile] = useState(initialProfileData);
  const [activeTab, setActiveTab] = useState("details");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [problems, setProblems] = useState([]);
  const [totalProblemCategories, setTotalProblemCategories] = useState({});
  const [solvedProblemCategories, setSolvedProblemCategories] = useState({});

  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [streaks, setStreaks] = useState({
    currentStreak: 0,
    maxStreak: 0,
  });

  const [globalUserRank, setGlobalUserRank] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);
  const [userSearch, setUserSearch] = useState("");
  const [userResults, setUserResults] = useState([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [userSearchError, setUserSearchError] = useState("");
  const [canEditProfile, setCanEditProfile] = useState(true);

  const navigate = useNavigate();

  const showToast = (type, message) => {
    setToast({ type, message });
    clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3500);
  };

  // Clear the toast timeout when the component unmounts
  useEffect(() => {
    return () => clearTimeout(toastTimeoutRef.current);
  }, []);

  // Search users
  useEffect(() => {
    const query = userSearch.trim();

    if (query.length < 2) {
      setUserResults([]);
      setUserSearchError("");
      setIsSearchingUsers(false);
      return;
    }

    const controller = new AbortController();
    const searchUsers = async () => {
      setIsSearchingUsers(true);
      setUserSearchError("");

      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        const response = await axios.get(
          `${backendUrl}/api/users/search?q=${encodeURIComponent(query)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            signal: controller.signal,
          },
        );
        setUserResults(response.data?.users || []);
      } catch (error) {
        if (error.name !== "CanceledError" && error.code !== "ERR_CANCELED") {
          console.error("Error searching users:", error);
          setUserSearchError("Unable to search users.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearchingUsers(false);
        }
      }
    };

    const timeoutId = setTimeout(searchUsers, 250);
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [userSearch]);

  // fetch the data of searched user profile
  useEffect(() => {
    const fetchProfileUser = async () => {
      if (!userId) {
        setProfileUser(user);
        return;
      }

      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        const response = await axios.get(`${backendUrl}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const profileUserData = response.data?.user;
        setProfileUser(profileUserData);
        setCanEditProfile(profileUserData?._id === user?._id);
      } catch (error) {
        console.error("Error fetching profile user:", error);
        showToast("error", "Unable to fetch user profile.");
      }
    };

    fetchProfileUser();
  }, [userId, user]);

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
          fullName: user.fullName || prev.fullName,
          profileImage: user.profileImage || prev.profileImage,
          role: user.role || prev.role,
          bio: user.bio || prev.bio,
          linkedin: user.linkedin || prev.linkedin,
          github: user.github || prev.github,
          gender: user.gender || prev.gender,
          xLink: user.xLink || prev.xLink,
          birthday: user.birthday || prev.birthday,
          location: user.location || prev.location,
        }));
      }
    }
  }, [user]);

  // Save the updated profile data
  const handleSaveProfile = async (updatedData) => {
    setProfile((prev) => ({
      ...prev,
      ...updatedData,
    }));

    if (setUser) {
      setUser((prevUser) => ({
        ...prevUser,
        username: updatedData.username,
        email: updatedData.email,
        profileImage: updatedData.profileImage,
        fullName: updatedData.fullName,
        role: updatedData.role,
        bio: updatedData.bio,
        linkedin: updatedData.linkedin,
        github: updatedData.github,
        gender: updatedData.gender,
        xLink: updatedData.xLink,
        birthday: updatedData.birthday,
        location: updatedData.location,
      }));
    }

    // Send the updated profile data to the backend
    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      await axios.post(`${backendUrl}/api/update-profile`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        user: user, // Include the user object in the request body
      });
      showToast("success", "Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("error", "Unable to update your profile.");
    }
  };

  // Update profile image to backend and context
  const handleProfileImageChange = async (file, profileImageUrl) => {
    const previousImageUrl = user?.profileImage || "";
    const formData = new FormData();
    formData.append("profileImage", file);
    setProfile((prev) => ({ ...prev, profileImage: profileImageUrl }));
    setUser((prevUser) => ({ ...prevUser, profileImage: profileImageUrl }));

    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
      const response = await axios.patch(
        `${backendUrl}/api/update-profile-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const savedImageUrl =
        response.data?.user?.profileImage || profileImageUrl;
      setProfile((prev) => ({ ...prev, profileImage: savedImageUrl }));
      setUser((prevUser) => ({ ...prevUser, profileImage: savedImageUrl }));
      showToast("success", "Profile image changed successfully.");
    } catch (error) {
      setProfile((prev) => ({ ...prev, profileImage: previousImageUrl }));
      setUser((prevUser) => ({ ...prevUser, profileImage: previousImageUrl }));
      console.error("Error updating profile image:", error);
      showToast("error", "Unable to change your profile image.");
    }
  };

  const currentUsername =
    profileUser?.username ||
    user?.username ||
    user?.name ||
    (user?.email ? user.email.split("@")[0] : null) ||
    "Alex DevNull";

  const totalSolved =
    profileUser?.problemSolving?.difficulty?.reduce(
      (acc, d) => acc + (d.solved || 0),
      0,
    ) || 186;

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
    if (profileUser) {
      console.log(
        "User solved problems in Dashboard:",
        profileUser,
        profileUser.solvedProblems,
      );

      // number of solved problems in each category
      const solvedCategoryCounts = (profileUser?.solvedProblems || []).reduce(
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
  }, [profileUser]);

  //fetch number of easy, medium, hard problems total
  const totalDifficultyCounts = problems.reduce((acc, problem) => {
    const difficulty = problem.difficulty?.toLowerCase();
    if (difficulty) {
      acc[difficulty] = (acc[difficulty] || 0) + 1;
    }
    return acc;
  }, {});

  // fetch number of easy, medium, hard problems solved
  const solvedDifficultyCounts = (profileUser?.solvedProblems || []).reduce(
    (acc, problem) => {
      const difficulty = problem.difficulty?.toLowerCase();
      if (difficulty) {
        acc[difficulty] = (acc[difficulty] || 0) + 1;
      }
      return acc;
    },
    {},
  );

  //fetch submission history
  useEffect(() => {
    const fetchSubmissionHistory = async () => {
      try {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
        const response = await axios.post(
          `${backendUrl}/api/submissionHistoryForProfile`,
          {
            searchUserId: profileUser?._id || null,
          },
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
  }, [profileUser]);

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
              searchUserId: profileUser?._id || null,
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

  // change context stats
  useEffect(() => {
    const highestContestScore = profileUser?.contestScores?.reduce(
      (max, contest) => {
        return contest.score > max ? contest.score : max;
      },
      0,
    );

    const averageContextScore =
      profileUser?.contestScores?.reduce(
        (sum, contest) => sum + contest.score,
        0,
      ) / (profileUser?.contestScores?.length || 1);

    // fetch the global leaderboard rank for the user
    if (!profileUser?._id) return;

    const loadGlobalLeaderboard = async () => {
      const data = await fetchGlobalLeaderboard();
      setGlobalUserRank(data.userRank);
    };

    loadGlobalLeaderboard();

    console.log("Global leaderboard rank for user:", globalUserRank);

    const contest_stats = [
      {
        label: "Contests Participated",
        value: `${profileUser?.contestsParticipated?.length || "0"}`,
        description: "Total contests joined",
      },
      {
        label: "Total Contest Score",
        value: `${profileUser?.totalContestScore || "0"}`,
        description: "Sum of contest scores",
      },
      {
        label: "Highest Contest Score",
        value: `${highestContestScore || "0"}`,
        description: "Best individual contest score",
      },
      {
        label: "Average Contest Score",
        value: `${averageContextScore || "0"}`,
        description: "Average score per contest",
      },
      {
        label: "Contest Rank",
        value: globalUserRank ? `#${globalUserRank}` : "#1,248",
        description: "Current overall leaderboard rank",
      },
    ];

    if (profileUser) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        contestStats: contest_stats,
      }));
    }
  }, [profileUser, globalUserRank]);

  // change submission history in initialProfileData
  useEffect(() => {
    if (profileUser) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        submissions: submissionHistory,
      }));
    }
  }, [submissionHistory, profileUser]);

  return (
    <div className="flex min-h-screen bg-[#e8f3e8] font-sans text-[#244333] antialiased selection:bg-[#3f7d55] selection:text-white">
      {toast && (
        <div
          role="status"
          className={`fixed right-4 top-4 z-[70] flex max-w-sm items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold shadow-xl ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          <span
            className={`h-2.5 w-2.5 shrink-0 rounded-full ${
              toast.type === "success" ? "bg-emerald-500" : "bg-red-500"
            }`}
          />
          <span>{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 text-current/60 hover:text-current"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}
      {/* Persistent Sidebar matching platform navigation */}
      <Sidebar />

      {/* Main Framework Content Container */}
      <div className="flex min-w-0 flex-1 flex-col pb-20 md:pb-0 md:pl-64">
        {/* Content Body Grid */}
        <main className="mx-auto w-full max-w-[1440px] flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Search Users Section */}
          <div className="relative max-w-xl">
            <label
              htmlFor="people-search"
              className="mb-2 block text-sm font-semibold text-[#183226]"
            >
              Find people
            </label>
            <div className="relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#668170]"
              />
              <input
                id="people-search"
                type="search"
                value={userSearch}
                onChange={(event) => setUserSearch(event.target.value)}
                placeholder="Search by username..."
                autoComplete="off"
                className="w-full rounded-xl border border-[#b7d2bb] bg-white py-2.5 pl-10 pr-4 text-sm text-[#385a43] outline-none transition focus:border-[#3f7d55] focus:ring-2 focus:ring-[#3f7d55]/20"
              />
            </div>
            {(isSearchingUsers ||
              userSearchError ||
              userResults.length > 0) && (
              <div className="absolute left-0 right-0 top-[4.5rem] z-20 overflow-hidden rounded-xl border border-[#b7d2bb] bg-white shadow-lg">
                {isSearchingUsers && (
                  <p className="px-4 py-3 text-sm text-[#668170]">
                    Searching users...
                  </p>
                )}
                {!isSearchingUsers && userSearchError && (
                  <p className="px-4 py-3 text-sm text-red-700">
                    {userSearchError}
                  </p>
                )}
                {!isSearchingUsers &&
                  !userSearchError &&
                  userResults.map((result) => (
                    <div
                      key={result._id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#f1f8f1]"
                      onClick={() => {
                        navigate(`/profile/?id=${result._id}`);
                      }}
                    >
                      {result.profileImage ? (
                        <img
                          src={result.profileImage}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c5dfc9] text-sm font-bold text-[#3f7d55]">
                          {result.username.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-[#183226]">
                          {result.username}
                        </p>
                        <p className="text-xs text-[#668170]">
                          {result.role || "CodeArena member"}
                        </p>
                      </div>
                    </div>
                  ))}
                {!isSearchingUsers &&
                  !userSearchError &&
                  userResults.length === 0 && (
                    <p className="px-4 py-3 text-sm text-[#668170]">
                      No users found.
                    </p>
                  )}
              </div>
            )}
          </div>

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
            user={profileUser}
            canEditProfile={canEditProfile}
            onEditClick={() => setIsEditModalOpen(true)}
            onProfileImageChange={handleProfileImageChange}
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
            {/* TAB: User Details */}
            {activeTab === "details" && (
              <div className="animate-in fade-in duration-300">
                <ProfileDetails user={profileUser} profile={profile} />
              </div>
            )}

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
                  submissionHistory={submissionHistory}
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
                <ContestPerformanceCard
                  contestStats={profile.contestStats}
                  user={profileUser}
                />
              </div>
            )}

            {/* TAB: Submissions */}
            {activeTab === "submissions" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <SubmissionHistoryCard submissions={submissionHistory} />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Interactive Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={profileUser}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
