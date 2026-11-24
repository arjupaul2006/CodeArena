import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import ProblemDescription from "../components/writecode/ProblemDescription";
import CodeEditorPanel from "../components/writecode/CodeEditorPanel";
import TopNav from "../components/problems/TopNav";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { fetchContestById } from "../../services/contextServices";
import ContestProblemDescription from "../components/contestWriteCode/ContestProblemDescription";
import ContestCodeEditor from "../components/contestWriteCode/ContestCodeEditor";

export default function ContextWriteCode() {
  // const problem = {
  //   title: "Two Sum",
  //   difficulty: "Easy",
  //   description:
  //     "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\nYou can return the answer in any order.",
  //   tags: ["array", "hash-table", "two-pointers"],

  //   constraints: [
  //     "2 <= nums.length <= 10^4",
  //     "-10^9 <= nums[i] <= 10^9",
  //     "-10^9 <= target <= 10^9",
  //     "Only one valid answer exists.",
  //   ],

  //   examples: [
  //     {
  //       input: {
  //         nums: [[2, 7, 11, 15]],
  //         target: 9,
  //       },
  //       output: [0, 1],
  //       explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
  //     },
  //     {
  //       input: {
  //         nums: [3, 2, 4],
  //         target: 6,
  //       },
  //       output: [1, 2],
  //       explanation: "nums[1] + nums[2] = 2 + 4 = 6",
  //     },
  //   ],

  //   tags: ["Array", "Hash Table"],

  //   testCases: [
  //     {
  //       input: {
  //         nums: [2, 7, 11, 15],
  //         target: 9,
  //       },
  //       expectedOutput: [0, 1],
  //     },
  //     {
  //       input: {
  //         nums: [3, 2, 4],
  //         target: 6,
  //       },
  //       expectedOutput: [1, 2],
  //     },
  //     {
  //       input: {
  //         nums: [3, 3],
  //         target: 6,
  //       },
  //       expectedOutput: [0, 1],
  //     },
  //     {
  //       input: {
  //         nums: [1, 5, 8, 10],
  //         target: 18,
  //       },
  //       expectedOutput: [2, 3],
  //     },
  //   ],
  // };

  const demoproblem = {
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\nYou can return the answer in any order.",
    tags: ["array", "hash-table", "two-pointers"],

    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],

    examples: [
      {
        input: {
          n: 5,
          nums: [1, 2, 3, 4, 5],
        },
        output: 5,
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: {
          n: 3,
          nums: [3, 2, 4],
        },
        output: 4,
        explanation: "nums[1] + nums[2] = 2 + 4 = 6",
      },
    ],

    test_cases: [
      {
        input: "4\n2 7 11 15\n9",
        expectedOutput: "0 1",
        isSample: true,
      },
      {
        input: "3\n3 2 4\n6",
        expectedOutput: "1 2",
        isSample: true,
      },
      {
        input: "2\n3 3\n6",
        expectedOutput: "0 1",
        isSample: false,
      },
      {
        input: "5\n1 5 3 7 9\n10",
        expectedOutput: "1 3",
        isSample: false,
      },
      {
        input: "6\n10 -2 8 4 6 12\n10",
        expectedOutput: "1 2",
        isSample: false,
      },
    ],
  };

  const { contestId, problemId } = useParams();
  const navigate = useNavigate();

  const [contest, setContest] = useState(null);
  const [contestStatus, setContestStatus] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [problem, setProblem] = useState(null);
  const [testCases, setTestCases] = useState([]);
  // const [executionResult, setExecutionResult] = useState({
  //   verdict: null,
  //   message: "Run your code to see test results.",
  //   runs: [],
  // });
  const [runExecutionResult, setRunExecutionResult] = useState({
    verdict: null,
    message: "Run your code to see test results.",
    runs: [],
  });

  const [submitExecutionResult, setSubmitExecutionResult] = useState({
    verdict: null,
    code: "",
    language: "",
    runtime: 0,
    memory: 0,
    message: "Submit your code to see submission results.",
    runs: [],
  });

  const searchParams = useSearchParams()[0];

  useEffect(() => {
    if (!contestId) return;

    let isMounted = true;

    const fetchContestData = async () => {
      const contestData = await fetchContestById(contestId);

      if (isMounted) {
        setContest(contestData);
      }
    };

    fetchContestData();

    return () => {
      isMounted = false;
    };
  }, [contestId]);

  useEffect(() => {
    if (!contest?.startTime || !contest?.endTime) {
      return undefined;
    }

    const updateTimer = () => {
      const now = Date.now();
      const start = new Date(contest.startTime).getTime();
      const end = new Date(contest.endTime).getTime();

      if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
        setContestStatus(null);
        setTimeLeft(null);
        return;
      }

      let targetTime = end;
      let status = "live";

      if (now < start) {
        targetTime = start;
        status = "upcoming";
      } else if (now >= end) {
        setContestStatus("completed");
        setTimeLeft({ hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const remaining = Math.max(0, targetTime - now);
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setContestStatus(status);
      setTimeLeft({
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, [contest?.startTime, contest?.endTime]);

  // fetch problem with its id
  useEffect(() => {
    try {
      if (!problemId) return;

      const fetchProblemData = async () => {
        const response = await fetch(
          `http://localhost:4000/api/contests/${contestId}/problem/${problemId}`,
        );
        const data = await response.json();

        if (!response.ok) {
          console.error(data);
          return;
        }

        const problemData = data.contestProblem;
        setProblem(problemData);
        setTestCases(data.testCaseData.test_cases || []);
        console.log("Fetched problem data:", problemData);
        console.log("Fetched test cases:", data.testCases);
      };

      fetchProblemData();
    } catch (error) {
      console.error("Error fetching problem data:", error);
    }
  }, [contestId, problemId, searchParams]);

  const effectiveTestCases =
    testCases && testCases.length > 0
      ? testCases
      : problem?.test_cases ||
        problem?.testCases ||
        demoproblem?.test_cases ||
        [];

  const sampleTestCases = effectiveTestCases.filter(
    (tc) => tc.isSample || tc.is_sample,
  );


  // Redirect to /contests if the contest has ended
  useEffect(() => {
    if (!contest?.endTime) return;

    const checkContestEnd = () => {
      const endTime = new Date(contest.endTime).getTime();
      const remainingTime = endTime - Date.now();

      if (remainingTime <= 0) {
        navigate("/contests", { replace: true });
      }
    };

    checkContestEnd();

    const interval = setInterval(checkContestEnd, 1000);

    return () => clearInterval(interval);
  }, [contest?.endTime, navigate]);

  return (
    <div className="flex flex-col h-screen bg-[#e8f3e8] dark:bg-[#111813] text-[#244333] dark:text-[#edf4ef] font-sans antialiased overflow-hidden">
      {/* Top Application Header */}
      <TopNav />

      {timeLeft && (
        <div
          className={`flex h-10 shrink-0 items-center justify-center gap-2 border-b px-4 text-xs font-bold ${
            contestStatus === "completed"
              ? "border-[#d6b5b5] dark:border-[#765050] bg-[#fff1f1] dark:bg-[#3a2020] text-[#8b3a3a] dark:text-[#f2aaaa]"
              : contestStatus === "upcoming"
                ? "border-[#e3cf9d] dark:border-[#776b43] bg-[#fff9e8] dark:bg-[#383020] text-[#896b24] dark:text-[#dcca82]"
                : "border-[#b7d2bb] dark:border-[#405747] bg-[#f4faf1] dark:bg-[#172019] text-[#244333] dark:text-[#edf4ef]"
          }`}
          role="timer"
          aria-live="polite"
        >
          <Clock className="h-4 w-4" />
          <span>
            {contestStatus === "upcoming"
              ? "Contest starts in"
              : contestStatus === "completed"
                ? "Contest ended"
                : "Contest time remaining"}
          </span>
          <span className="font-mono text-sm tracking-wider">
            {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
          </span>
        </div>
      )}

      {/* Main Split Panels */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 min-h-0 overflow-hidden">
        {/* Left Panel */}
        <div className="h-full overflow-hidden border-r border-[#b7d2bb] dark:border-[#405747]">
          <ContestProblemDescription
            demoproblem={demoproblem}
            contestId={contestId}
            problem={problem}
            problemId={problemId}
            testCases={effectiveTestCases}
            sampleTestCases={sampleTestCases}
            runExecutionResult={runExecutionResult}
            submitExecutionResult={submitExecutionResult}
          />
        </div>

        {/* Right Panel */}
        <div className="relative h-full overflow-hidden bg-[#dcecdf] dark:bg-[#24382b]">
          <ContestCodeEditor
            demoproblem={demoproblem}
            problem={problem}
            contestId={contestId}
            testCases={effectiveTestCases}
            sampleTestCases={sampleTestCases}
            runExecutionResult={runExecutionResult}
            setRunExecutionResult={setRunExecutionResult}
            submitExecutionResult={submitExecutionResult}
            setSubmitExecutionResult={setSubmitExecutionResult}
          />
        </div>
      </div>
    </div>
  );
}
