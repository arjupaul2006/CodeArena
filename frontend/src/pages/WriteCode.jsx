import React, { useEffect,useState } from "react";
import WorkspaceHeader from "../components/writecode/WorkspaceHeader";
import ProblemDescription from "../components/writecode/ProblemDescription";
import CodeEditorPanel from "../components/writecode/CodeEditorPanel";
import TopNav from "../components/problems/TopNav";
import { useSearchParams } from "react-router-dom";

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
  const [testCases, setTestCases] = useState([]);

  const searchParams = useSearchParams()[0];

  useEffect(() => {
    try {
      const problemId = searchParams.get("id");

      const fetchProblemData = async () => {
        const response = await fetch(`http://localhost:4000/api/problems/${problemId}`);
        const data = await response.json();
        const problemData = data.problem;
        setProblem(problemData);
        setTestCases(data.testCases);
        console.log("Fetched problem data:", problemData);
        console.log("Fetched test cases:", data.testCases);
      };


      fetchProblemData();
    }
    catch (error) {
      console.error("Error fetching problem data:", error);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0b0f19] text-gray-300 font-sans antialiased overflow-hidden">
      {/* Top Application Header */}
      <TopNav />

      {/* Main Split Panels */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 min-h-0 overflow-hidden">
        {/* Left Panel */}
        <div className="h-full overflow-y-auto border-r border-gray-800/80 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <ProblemDescription demoproblem={demoproblem} problem={problem} />
        </div>

        {/* Right Panel */}
        <div className="relative h-full overflow-hidden bg-[#0f1422]">
          <CodeEditorPanel demoproblem={demoproblem} problem={problem} testCases={testCases} />
        </div>
      </div>
    </div>
  );
}
