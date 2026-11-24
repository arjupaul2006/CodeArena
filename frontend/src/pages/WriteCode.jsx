import React, { useEffect, useState } from "react";
import WorkspaceHeader from "../components/writecode/WorkspaceHeader";
import ProblemDescription from "../components/writecode/ProblemDescription";
import CodeEditorPanel from "../components/writecode/CodeEditorPanel";
import TopNav from "../components/problems/TopNav";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function WriteCode() {
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

    tags: ["Array", "Hash Table"],

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

  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("python");
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
  const [historySelection, setHistorySelection] = useState(null);
  const [lastSubmission, setLastSubmission] = useState(null);

  const navigate = useNavigate();

  const searchParams = useSearchParams()[0];
  const submissionId = searchParams.get("submission_id");

  // fetch submission with submissionId
  useEffect(() => {
    try {
      const fetchSubmittedCode = async () => {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

        const response = await axios.post(
          `${backendUrl}/api/submissionHistoryById`,
          {
            submissionId: submissionId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const data = response.data;
        console.log("Fetched submitted code:", data?.submission);

        if (data && data.submission) {
          setProblem(data?.submission?.problemId || null);
          setCode(data?.submission?.code || "");
          setSelectedLanguage(data?.submission?.language || "python");
        }
      };
      fetchSubmittedCode();
    } catch (error) {
      console.error("Error fetching problem data:", error);
    }
  }, [submissionId]);

  // fetch last submission with problemId
  useEffect(() => {
    try {
      const problemId = searchParams.get("id");
      if (!problemId) return;

      const fetchLastSubmission = async () => {
        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

        const response = await axios.post(
          `${backendUrl}/api/submissionHistoryByProblemId`,
          {
            problemId: problemId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const data = response.data;
        console.log("Fetched last submission:", data?.submissions);

        if (data && data.submissions && data.submissions.length > 0) {
          setCode(data?.submissions[0]?.code || "");
          setSelectedLanguage(data?.submissions[0]?.language || "python");
          setLastSubmission(data?.submissions[0] || null);
        }
      };

      fetchLastSubmission();
    } catch (error) {
      console.error("Error fetching last submission:", error);
    }
  }, [searchParams]);

  // fetch problem with its id
  useEffect(() => {
    try {
      const problemId = searchParams.get("id");
      if (!problemId) return;

      const fetchProblemData = async () => {
        const response = await fetch(
          `http://localhost:4000/api/problems/${problemId}`,
        );
        const data = await response.json();

        if (!response.ok) {
          console.error(data);
          return;
        }

        const problemData = data.problem;
        setProblem(problemData);
        setTestCases(data.testCases || []);
        console.log("Fetched problem data:", problemData);
        console.log("Fetched test cases:", data.testCases);
      };

      fetchProblemData();
    } catch (error) {
      console.error("Error fetching problem data:", error);
    }
  }, [searchParams]);

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

  return (
    <div className="flex flex-col h-screen bg-[#e8f3e8] dark:bg-[#111813] text-[#244333] dark:text-[#edf4ef] font-sans antialiased overflow-hidden">
      {/* Top Application Header */}
      <TopNav />

      {/* Main Split Panels */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 min-h-0 overflow-hidden">
        {/* Left Panel */}
        <div className="h-full overflow-hidden border-r border-[#b7d2bb] dark:border-[#405747]">
          <ProblemDescription
            demoproblem={demoproblem}
            problem={problem}
            submissionId={submissionId}
            testCases={effectiveTestCases}
            sampleTestCases={sampleTestCases}
            runExecutionResult={runExecutionResult}
            submitExecutionResult={submitExecutionResult}
            onSubmissionHistorySelect={setHistorySelection}
            lastSubmission={lastSubmission}
            setLastSubmission={setLastSubmission}
          />
        </div>

        {/* Right Panel */}
        <div className="relative h-full overflow-hidden bg-[#dcecdf] dark:bg-[#24382b]">
          <CodeEditorPanel
            demoproblem={demoproblem}
            problem={problem}
            submittedCode={code}
            submittedLanguage={selectedLanguage}
            testCases={effectiveTestCases}
            sampleTestCases={sampleTestCases}
            runExecutionResult={runExecutionResult}
            setRunExecutionResult={setRunExecutionResult}
            submitExecutionResult={submitExecutionResult}
            setSubmitExecutionResult={setSubmitExecutionResult}
            historySelection={historySelection}
          />
        </div>
      </div>
    </div>
  );
}
