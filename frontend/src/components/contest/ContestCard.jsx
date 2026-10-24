import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Code2,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";

function ContestCard({
  contest,
  onJoin,
  joined,
  getStatus,
  formatDate,
  statusStyles,
}) {
  // const status = getStatus(contest);
  const [status, setStatus] = useState("upcoming");
  const problemCount = contest.problems?.length || 0;
  const navigate = useNavigate();

  const handleEnterContest = (contestId) => {
    navigate(`/contests/${contestId}`);
  };

  // check the status of the contest and update the status accordingly
  useEffect(() => {
    const now = Date.now();
    const startTime = new Date(contest.startTime).getTime();
    const endTime = new Date(contest.endTime).getTime();

    if (now < startTime) {
      setStatus("upcoming");
    } else if (now > endTime) {
      // Contest has ended
      setStatus("ended");
    } else {
      setStatus("live");
    }
  }, [contest]);

  // can not navigate to contest if the contest has not started
  useEffect(() => {
    if (!contest?.startTime || !contest?.endTime) return;

    const checkContestStatus = () => {
      const now = Date.now();
      const startTime = new Date(contest.startTime).getTime();

      // Contest has not started
      if (now < startTime) {
        navigate("/contests", { replace: true });
        return;
      }
    };

    checkContestStatus();

    const interval = setInterval(checkContestStatus, 1000);

    return () => clearInterval(interval);
  }, [contest?.startTime, contest?.endTime, navigate]);

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#b7d2bb] bg-[#f4faf1] shadow-lg shadow-[#8eae94]/10 transition-all hover:-translate-y-0.5 hover:border-[#8eae94] hover:shadow-xl">
      <div>
        <div className="flex items-start justify-between border-b border-[#b7d2bb] bg-[#eef7eb] p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c5dfc9] text-[#3f7d55]">
            <Trophy className="h-5 w-5" />
          </div>
          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyles[status]}`}
          >
            {status === "live" && (
              <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
            )}
            {status}
          </span>
        </div>
        <div className="space-y-3 p-5">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-[#183226]">
              {contest.title}
            </h3>
            <p className="mt-1.5 min-h-10 text-sm leading-5 text-[#668170]">
              {contest.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-[#547060]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-[#3f7d55]" />
              {formatDate(contest.startTime)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-[#3f7d55]" />
              {status === "live" ? "Ends in 1h 25m" : "90 minutes"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Code2 className="h-3.5 w-3.5 text-[#3f7d55]" />
              {problemCount} problems
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[#b7d2bb] px-5 py-4">
        <span className="inline-flex items-center gap-1.5 text-xs text-[#668170]">
          <Users className="h-3.5 w-3.5" />
          {(contest.participants?.length || 0).toLocaleString()} registered
        </span>

        {status === "live" ? (
          <button
            onClick={() => handleEnterContest(contest._id)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${joined ? "bg-[#dcecdf] text-[#2f6b45]" : "bg-[#3f7d55] text-white shadow-md shadow-[#8eae94]/30 hover:bg-[#326844]"}`}
          >
            {joined ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Enter the contest
              </>
            ) : (
              <>
                <ArrowRight className="h-3.5 w-3.5" />
                Join
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() =>
              status === "ended"
                ? handleEnterContest(contest._id)
                : onJoin(contest._id)
            }
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${joined ? "bg-[#dcecdf] text-[#2f6b45]" : "bg-[#3f7d55] text-white shadow-md shadow-[#8eae94]/30 hover:bg-[#326844]"}`}
          >
            {status === "ended" ? (
              <>
                <ArrowRight className="h-3.5 w-3.5" />
                View problems
              </>
            ) : joined ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Joined
              </>
            ) : (
              <>
                <ArrowRight className="h-3.5 w-3.5" />
                Join
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
}

export default ContestCard;
