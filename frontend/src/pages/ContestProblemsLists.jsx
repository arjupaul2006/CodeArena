import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, RefreshCw, Share2 } from "lucide-react";
import { io } from "socket.io-client";

import Sidebar from "../components/problems/SideBar";
import TopNav from "../components/problems/TopNav";
import {
  fetchContestById,
  fetchContestLeaderboard,
  fetchContestProgress,
  fetchContestSubmissions,
} from "../../services/contextServices";

// Modular Components
import ContestHeroBanner from "../components/contest/ContestHeroBanner";
import ContestStatsRow from "../components/contest/ContestStatsRow";
import ContestProblemList from "../components/contest/ContestProblemList";
import ContestLeaderboard from "../components/contest/ContestLeaderboard";
import ContestRulesAnnouncements from "../components/contest/ContestRulesAnnouncements";
import ContestSubmissionsLog from "../components/contest/ContestSubmissionsLog";
import ProblemQuickViewModal from "../components/contest/ProblemQuickViewModal";
import { UserDataContext } from "../context/UserContext";

export default function ContestProblems({ contestIdProp, onBackProp }) {

  const params = useParams();
  const navigate = useNavigate();
  const activeContestId = params.contestId;
  const { user } = useContext(UserDataContext);

  const [contest, setContest] = useState({
    problems: [],
    leaderboard: [],
    mySubmissions: [],
    announcements: [],
  });
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("problems"); // 'problems' | 'leaderboard' | 'rules' | 'submissions'
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [selectedProblemModal, setSelectedProblemModal] = useState(null);

  // Live Timer Countdown State
  const [timeLeft, setTimeLeft] = useState({ hours: "00", minutes: "00", seconds: "00" });
  const [contestStatus, setContestStatus] = useState("live");


  // Fetch contest details from backend API
  useEffect(() => {
    if (!activeContestId) return;

    let isMounted = true;

    const loadContest = async () => {
      setLoading(true);
      setContest({
        problems: [],
        leaderboard: [],
        mySubmissions: [],
        announcements: [],
      });
      setProgress(null);

      const [data, progressData, leaderboardData, submissionsData] =
        await Promise.all([
        fetchContestById(activeContestId),
        fetchContestProgress(activeContestId),
        fetchContestLeaderboard(activeContestId),
        fetchContestSubmissions(activeContestId),
      ]);

      if (isMounted && data) {
        const formattedProblems = (data.problems || []).map((prob, idx) => ({
          ...prob,
          letter: String.fromCharCode(65 + idx),
          points: prob.score || 100, // Default to 100 if score is not provided
          status:
            progressData?.problems?.find(
              (item) => item.problemId === prob._id,
            )?.solved
              ? "solved"
              : "unsolved",
          attempts:
            progressData?.problems?.find(
              (item) => item.problemId === prob._id,
            )?.attempts || 0,
          lastStatus:
            progressData?.problems?.find(
              (item) => item.problemId === prob._id,
            )?.lastStatus || null,
        }));

        setContest({
          ...data,
          problems: formattedProblems,
          leaderboard: (leaderboardData?.leaderboard || []).map((entry) => ({
            ...entry,
            isUser: String(entry.userId) === String(user?._id),
          })),
          userRank: leaderboardData?.userRank || null,
          mySubmissions: (Array.isArray(submissionsData)
            ? submissionsData
            : []
          ).map((submission) => ({
            id: submission.id,
            problemTitle: submission.problemTitle,
            problemLetter:
              String.fromCharCode(
                65 +
                (data.problems || []).findIndex(
                  (problem) =>
                    problem._id === String(submission.problemId),
                ),
              ),
            language: submission.language,
            status: submission.status,
            runtime: `${submission.runtime} ms`,
            memory: `${submission.memory} MB`,
            time: new Date(submission.submittedAt).toLocaleString(),
          })),
        });
      }
      if (isMounted) setProgress(progressData);
      if (isMounted) setLoading(false);
    };

    loadContest();
    return () => {
      isMounted = false;
    };
  }, [activeContestId]);

  // Socket.io integration for real-time leaderboard updates
  useEffect(() => {
    if (!activeContestId) return undefined;

    const socket = io(
      import.meta.env.VITE_BACKEND_URL || "http://localhost:4000",
      {
        transports: ["websocket"],
        withCredentials: true,
      },
    );

    // Handle leaderboard updates from the server
    const handleLeaderboardUpdate = (event) => {
      if (event.contestId !== activeContestId) return;

      setContest((currentContest) => ({
        ...currentContest,
        leaderboard: event.leaderboard.map((entry) => ({
          ...entry,
          isUser: String(entry.userId) === String(user?._id),
        })),
        userRank:
          event.leaderboard.find(
            (entry) => String(entry.userId) === String(user?._id),
          )?.rank || null,
      }));
    };

    socket.emit("contest:join", activeContestId);
    socket.on("contest:leaderboard:update", handleLeaderboardUpdate);

    return () => {
      socket.emit("contest:leave", activeContestId);
      socket.off("contest:leaderboard:update", handleLeaderboardUpdate);
      socket.disconnect();
    };
  }, [activeContestId, user?._id]);

  // Live countdown timer calculation
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(contest.endTime || Date.now() + 3600000).getTime();
      const start = new Date(contest.startTime || Date.now()).getTime();

      let targetTime = end;
      if (now < start) {
        targetTime = start;
        setContestStatus("upcoming");
      } else if (now > end) {
        setContestStatus("completed");
        setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
        return;
      } else {
        setContestStatus("live");
      }

      const diff = Math.max(0, targetTime - now);
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: h.toString().padStart(2, "0"),
        minutes: m.toString().padStart(2, "0"),
        seconds: s.toString().padStart(2, "0"),
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [contest.startTime, contest.endTime]);

  // Filter problems based on search & difficulty filter
  const filteredProblems = useMemo(() => {
    return (contest.problems || []).filter((problem) => {
      const matchesSearch =
        problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        problem.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        problem.letter.toLowerCase() === searchQuery.toLowerCase();

      const matchesDiff =
        difficultyFilter === "All" ||
        problem.difficulty.toLowerCase() === difficultyFilter.toLowerCase();

      return matchesSearch && matchesDiff;
    });
  }, [contest.problems, searchQuery, difficultyFilter]);

  // Function to handle problem solving navigation
  const handleSolveProblem = (problem) => {
    if (problem._id) {
      navigate(`/contests/write-code/${activeContestId}/${problem._id}`);
    } else {
      navigate(`/write-code`);
    }
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-emerald-500/15 text-emerald-700 border-emerald-500/30";
      case "medium":
        return "bg-amber-500/15 text-amber-800 border-amber-500/30";
      case "hard":
        return "bg-rose-500/15 text-rose-700 border-rose-500/30";
      default:
        return "bg-gray-50 dark:bg-[#172019]0/15 text-gray-700 dark:text-[#aabdaf] border-gray-500/30";
    }
  };

  const solvedCount = progress?.solvedCount ||
    contest.problems?.filter((p) => p.status === "solved").length ||
    0;
  const totalPoints = useMemo(
    () => contest.problems?.reduce((acc, p) => acc + (p.points || 100), 0) || 0,
    [contest.problems]
  );

  return (
    <div className="flex min-h-screen bg-[#e8f3e8] dark:bg-[#111813] font-sans text-[#244333] dark:text-[#edf4ef] antialiased">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col pb-16 md:pl-64 md:pb-0">
        <TopNav />

        <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Top Navigation Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => (onBackProp ? onBackProp() : navigate("/contests"))}
              className="inline-flex items-center gap-2 rounded-xl border border-[#b7d2bb] dark:border-[#405747] bg-[#f4faf1] dark:bg-[#172019] px-4 py-2 text-xs font-bold text-[#244333] dark:text-[#edf4ef] shadow-sm transition-all hover:bg-[#eef7eb] dark:bg-[#1a241d] hover:border-[#8eae94]"
            >
              <ArrowLeft className="h-4 w-4 text-[#3f7d55] dark:text-[#86c79a]" />
              Back to Contests
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#b7d2bb] dark:border-[#405747] bg-[#f4faf1] dark:bg-[#172019] px-3 py-2 text-xs font-semibold text-[#547060] dark:text-[#aabdaf] transition-colors hover:text-[#183226] dark:hover:text-[#edf4ef] dark:text-[#edf4ef]"
                title="Refresh Contest Data"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Sync
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Contest link copied to clipboard!");
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#b7d2bb] dark:border-[#405747] bg-[#f4faf1] dark:bg-[#172019] px-3 py-2 text-xs font-semibold text-[#547060] dark:text-[#aabdaf] transition-colors hover:text-[#183226] dark:hover:text-[#edf4ef] dark:text-[#edf4ef]"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </button>
            </div>
          </div>

          {/* Hero Banner Component */}
          <ContestHeroBanner
            contest={contest}
            contestStatus={contestStatus}
            timeLeft={timeLeft}
            totalPoints={totalPoints}
          />

          {/* Quick Stats Summary Component */}
          <ContestStatsRow
            contest={contest}
            solvedCount={solvedCount}
            attempts={progress?.attempts || 0}
          />

          {/* Tab Navigation Menu */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#b7d2bb] dark:border-[#405747] pb-2">
            <div className="flex gap-2 rounded-2xl border border-[#b7d2bb] dark:border-[#405747] bg-[#f4faf1] dark:bg-[#172019] p-1.5 shadow-sm text-xs font-bold">
              {[
                { id: "problems", label: "Problems List", count: contest.problems?.length },
                { id: "leaderboard", label: "Live Leaderboard" },
                { id: "rules", label: "Rules & Announcements" },
                { id: "submissions", label: "My Submissions", count: contest.mySubmissions?.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all ${activeTab === tab.id
                      ? "bg-[#3f7d55] text-white shadow-md shadow-[#8eae94]/20"
                      : "text-[#547060] dark:text-[#aabdaf] hover:bg-[#eef7eb] dark:bg-[#1a241d] hover:text-[#183226] dark:hover:text-[#edf4ef] dark:text-[#edf4ef]"
                    }`}
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${activeTab === tab.id
                          ? "bg-white dark:bg-[#172019]/20 text-white"
                          : "bg-[#c5dfc9] dark:bg-[#2b4636] text-[#244333] dark:text-[#edf4ef]"
                        }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Tab Views */}
          {activeTab === "problems" && (
            <ContestProblemList
              filteredProblems={filteredProblems}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              difficultyFilter={difficultyFilter}
              setDifficultyFilter={setDifficultyFilter}
              onSelectProblemModal={setSelectedProblemModal}
              onSolveProblem={handleSolveProblem}
              getDifficultyBadge={getDifficultyBadge}
            />
          )}

          {activeTab === "leaderboard" && (
            <ContestLeaderboard leaderboard={contest.leaderboard} />
          )}

          {activeTab === "rules" && (
            <ContestRulesAnnouncements announcements={contest.announcements} />
          )}

          {activeTab === "submissions" && (
            <ContestSubmissionsLog submissions={contest.mySubmissions} />
          )}
        </main>
      </div>

      {/* Quick View Problem Modal */}
      {selectedProblemModal && (
        <ProblemQuickViewModal
          problem={selectedProblemModal}
          onClose={() => setSelectedProblemModal(null)}
          onSolve={handleSolveProblem}
        />
      )}
    </div>
  );
}
