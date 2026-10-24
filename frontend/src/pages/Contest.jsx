import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  Crown,
  Flame,
  Medal,
  Play,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import Sidebar from "../components/problems/SideBar";
import TopNav from "../components/problems/TopNav";
import { useContext } from "react";
import { UserDataContext } from "../context/UserContext";
import {
  addContestToUserProfile,
  addParticipant,
  fetchContests,
  removeContestFromUserProfile,
  removeParticipant,
} from "../../services/contextServices";
import ContestCard from "../components/contest/ContestCard";

const fallbackContests = [
  {
    _id: "weekly-sprint",
    title: "Weekly Algorithm Sprint",
    description:
      "Four focused problems. One sharp hour. Put your problem-solving rhythm to work.",
    startTime: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 85 * 60 * 1000).toISOString(),
    status: "live",
    problems: [
      { difficulty: "Easy" },
      { difficulty: "Medium" },
      { difficulty: "Medium" },
      { difficulty: "Hard" },
    ],
    participants: Array.from({ length: 284 }),
  },
  {
    _id: "spring-open",
    title: "Spring Open '26",
    description:
      "A broad set of data structures and algorithms for every level of competitor.",
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(
      Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000,
    ).toISOString(),
    status: "upcoming",
    problems: [
      { difficulty: "Easy" },
      { difficulty: "Medium" },
      { difficulty: "Hard" },
    ],
    participants: Array.from({ length: 612 }),
  },
  {
    _id: "graph-theory-night",
    title: "Graph Theory Night",
    description:
      "Explore paths, flows, and connected components in this advanced evening challenge.",
    startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000,
    ).toISOString(),
    status: "upcoming",
    problems: [
      { difficulty: "Medium" },
      { difficulty: "Hard" },
      { difficulty: "Hard" },
    ],
    participants: Array.from({ length: 176 }),
  },
];

const formatDate = (value) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const getStatus = (contest) => {
  if (contest.status) return contest.status;
  const now = Date.now();
  if (now < new Date(contest.startTime).getTime()) return "upcoming";
  if (now < new Date(contest.endTime).getTime()) return "live";
  return "completed";
};

const statusStyles = {
  live: "bg-rose-500/10 text-rose-700 border-rose-500/25",
  upcoming: "bg-amber-500/10 text-amber-800 border-amber-500/25",
  completed: "bg-[#dcecdf] text-[#547060] border-[#b7d2bb]",
};

export default function Contest() {
  const [contests, setContests] = useState(fallbackContests);
  const [activeTab, setActiveTab] = useState("all");
  // State to track joined contests
  const [joinedContests, setJoinedContests] = useState([]);
  const { user } = useContext(UserDataContext);

  // fetch the contest
  useEffect(() => {
    const loadContests = async () => {
      const data = await fetchContests();
      setContests(data);
    };

    loadContests();
  }, []);

  // Filter contests based on the active tab
  const filteredContests = useMemo(
    () =>
      contests.filter(
        (contest) => activeTab === "all" || getStatus(contest) === activeTab,
      ),
    [activeTab, contests],
  );

  // Find the first live contest for the banner
  const liveContest = contests.find((contest) => getStatus(contest) === "live");

  // Function to handle joining or leaving a contest
  const handleJoin = async (contestId) => {
    const contest = contests.find((contest) => contest._id === contestId);

    if (!contest || !user?._id) {
      return;
    }

    const isParticipant = contest.participants?.some(
      (participant) => participant?.user?.toString() === user._id.toString(),
    );

    try {
      if (isParticipant) {
        // Remove from Contest collection
        const data = await removeParticipant(contestId, user._id);

        console.log("Participant removed:", data);

        // Remove from User collection
        await removeContestFromUserProfile(contestId, user._id);

        // Update React state
        setContests((prevContests) =>
          prevContests.map((contest) =>
            contest._id === contestId
              ? {
                  ...contest,
                  participants:
                    contest.participants?.filter(
                      (participant) =>
                        participant?.user?.toString() !== user._id.toString(),
                    ) || [],
                }
              : contest,
          ),
        );
      } else {
        // Add to Contest collection
        const data = await addParticipant(contestId, user._id);

        console.log("Participant added:", data);

        // Add to User collection
        await addContestToUserProfile(contestId, user._id);

        // Update React state
        setContests((prevContests) =>
          prevContests.map((contest) =>
            contest._id === contestId
              ? {
                  ...contest,
                  participants: [
                    ...(contest.participants || []),
                    { user: user._id },
                  ],
                }
              : contest,
          ),
        );
      }
    } catch (error) {
      console.error(
        isParticipant
          ? "Failed to remove participant."
          : "Failed to add participant.",
        error,
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#e8f3e8] font-sans text-[#244333] antialiased">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col pb-16 md:pl-64 md:pb-0">
        <TopNav />
        {/* Main Content */}
        <main className="mx-auto w-full max-w-375 flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
          <section className="relative overflow-hidden rounded-2xl border border-[#b7d2bb] bg-[#183226] px-6 py-7 text-[#f4faf1] shadow-xl sm:px-8">
            <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full border-26 border-[#3f7d55]/40" />
            <div className="absolute -bottom-24 right-36 h-48 w-48 rounded-full border-18 border-[#b7d2bb]/10" />
            <div className="relative max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#3f7d55]/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#c5dfc9]">
                <Sparkles className="h-3.5 w-3.5" /> Compete. Learn. Level up.
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Make your next solve count.
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#c5dfc9]">
                Join timed challenges, test your instincts, and see how your
                approach stacks up against the CodeArena community.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-[#dcecdf]">
                <span className="inline-flex items-center gap-2">
                  <Flame className="h-4 w-4 text-[#f5b85b]" />
                  {liveContest
                    ? "1 contest live now"
                    : "New contests every week"}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#c5dfc9]" />
                  1,240+ active competitors
                </span>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Your rank", value: "#248", icon: Medal },
              { label: "Contests joined", value: "12", icon: Trophy },
              { label: "Best finish", value: "Top 8%", icon: Crown },
              { label: "Current streak", value: "4 weeks", icon: Flame },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-2xl border border-[#b7d2bb] bg-[#f4faf1] p-4 shadow-sm"
              >
                <Icon className="h-4 w-4 text-[#3f7d55]" />
                <p className="mt-3 text-xl font-black tracking-tight text-[#183226]">
                  {value}
                </p>
                <p className="mt-1 text-xs text-[#668170]">{label}</p>
              </div>
            ))}
          </section>

          <section className="space-y-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#183226]">
                  Contest calendar
                </h2>
                <p className="mt-1 text-sm text-[#668170]">
                  Pick a challenge that matches your pace.
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="flex rounded-xl border border-[#b7d2bb] bg-[#f4faf1] p-1 text-xs font-semibold">
                {[
                  ["all", "All contests"],
                  ["live", "Live now"],
                  ["upcoming", "Upcoming"],
                  ["outdated", "Outdated"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setActiveTab(value)}
                    className={`rounded-lg px-3 py-2 transition-colors ${activeTab === value ? "bg-[#3f7d55] text-white shadow-sm" : "text-[#547060] hover:text-[#183226]"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contest Cards */}
            {filteredContests.length ? (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {filteredContests.map((contest) => (
                  <ContestCard
                    key={contest._id}
                    contest={contest}
                    joined={contest.participants?.some(
                      (participant) =>
                        participant?.user?.toString() === user?._id?.toString(),
                    )}
                    onJoin={handleJoin}
                    getStatus={getStatus}
                    formatDate={formatDate}
                    statusStyles={statusStyles}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-[#b7d2bb] bg-[#f4faf1] p-12 text-center text-sm text-[#668170]">
                No contests in this view yet.
              </div>
            )}
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Leaderboard */}
            <div className="rounded-2xl border border-[#b7d2bb] bg-[#f4faf1] p-5 shadow-lg shadow-[#8eae94]/10 lg:col-span-3">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-[#183226]">Live leaderboard</h2>
                  <p className="mt-1 text-xs text-[#668170]">
                    Weekly Algorithm Sprint
                  </p>
                </div>
                <button className="text-xs font-bold text-[#3f7d55] hover:text-[#183226]">
                  View full board{" "}
                  <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
                </button>
              </div>
              {["byteBender", "algo_anya", "recursiveRay", "sam_codes"].map(
                (name, index) => (
                  <div
                    key={name}
                    className="flex items-center gap-3 border-t border-[#dcecdf] py-3"
                  >
                    <span
                      className={`w-5 text-center text-xs font-bold ${index === 0 ? "text-amber-600" : "text-[#668170]"}`}
                    >
                      {index + 1}
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c5dfc9] text-xs font-bold text-[#3f7d55]">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <span className="flex-1 text-sm font-semibold text-[#244333]">
                      {name}
                    </span>
                    <span className="text-xs font-bold text-[#547060]">
                      {[842, 796, 754, 721][index]} pts
                    </span>
                  </div>
                ),
              )}
            </div>

            <div className="rounded-2xl border border-[#b7d2bb] bg-[#d5e7d7] p-5 lg:col-span-2">
              <div className="flex items-center gap-2 text-[#2f6b45]">
                <Play className="h-4 w-4" />
                <h2 className="font-bold">How contests work</h2>
              </div>

              {/* Steps */}
              <div className="mt-5 space-y-4">
                {[
                  [
                    "01",
                    "Register early",
                    "Save your spot before the countdown ends.",
                  ],
                  [
                    "02",
                    "Solve your way",
                    "Submit solutions and watch your score update.",
                  ],
                  [
                    "03",
                    "Climb the board",
                    "Compare your finish and keep your streak alive.",
                  ],
                ].map(([number, title, text]) => (
                  <div key={number} className="flex gap-3">
                    <span className="font-mono text-xs font-bold text-[#3f7d55]">
                      {number}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[#244333]">
                        {title}
                      </p>
                      <p className="mt-0.5 text-xs leading-5 text-[#547060]">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
