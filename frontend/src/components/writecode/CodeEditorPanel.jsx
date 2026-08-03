import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { RotateCcw, Maximize2 } from "lucide-react";
import ExecutionTerminal from "./ExecutionTerminal";
import axios from "axios";

const normalizeOutput = (value) => String(value ?? "").trim();

export default function CodeEditorPanel({ demoproblem, problem, testCases }) {
  const languageOptions = [
    {
      label: "Python 3",
      value: "python",
      codeLines: "# Write your code here\nprint('Hello, World!')",
    },
    {
      label: "JavaScript",
      value: "javascript",
      codeLines: "// Write your code here\nconsole.log('Hello, World!');",
    },
    {
      label: "Java",
      value: "java",
      codeLines:
        '// Write your code here\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    },
    {
      label: "C++",
      value: "cpp",
      codeLines:
        '// Write your code here\n#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
    },
    {
      label: "Go",
      value: "go",
      codeLines:
        '// Write your code here\npackage main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
    },
    {
      label: "Ruby",
      value: "ruby",
      codeLines: "# Write your code here\nputs 'Hello, World!'",
    },
    {
      label: "C#",
      value: "csharp",
      codeLines:
        '// Write your code here\nusing System;\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}',
    },
    {
      label: "PHP",
      value: "php",
      codeLines: "<?php\necho 'Hello, World!';\n?>",
    },
    {
      label: "Swift",
      value: "swift",
      codeLines: '// Write your code here\nprint("Hello, World!")',
    },
    {
      label: "Kotlin",
      value: "kotlin",
      codeLines:
        '// Write your code here\nfun main() {\n    println("Hello, World!")\n}',
    },
  ];

  const getStarterCodeForLanguage = (language) => {
    const starterCode = problem?.starterCode?.[language];
    if (typeof starterCode === "string" && starterCode.trim()) {
      return starterCode;
    }

    const fallbackOption = languageOptions.find(
      (option) => option.value === language,
    );
    return fallbackOption?.codeLines ?? "";
  };

  const [executionResult, setExecutionResult] = useState({
    verdict: null,
    message: "Run your code to compare outputs against every testcase.",
    runs: [],
  });

  const [isRunning, setIsRunning] = useState(false);

  const [code, setCode] = useState(() => getStarterCodeForLanguage("python"));

  const [selectedLanguage, setSelectedLanguage] = useState("python");

  const [isTerminalOpen, setIsTerminalOpen] = useState(true);

  useEffect(() => {
    setCode(getStarterCodeForLanguage(selectedLanguage));
  }, [problem, selectedLanguage]);

  // Handle code execution
  const handleCodeExecution = async () => {
    // New test case structure:
    // problem.test_cases
    if (!testCases?.length) {
      setExecutionResult({
        verdict: "wrong-answer",
        message: "No test cases found for this problem.",
        runs: [],
      });

      return;
    }

    setIsRunning(true);

    try {
      const runs = [];

      // Execute code against every test case
      for (let index = 0; index < testCases.length; index++) {
        const testCase = testCases[index];

        // Input is already a string
        const serializedInput = testCase.input ?? "";

        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/execute`,
          {
            code,
            input: serializedInput,
            language: selectedLanguage,
            problem: problem ?? null,
          },
        );

        // Get actual output from backend
        const actualOutput = normalizeOutput(
          data?.output ?? data?.stderr ?? data?.error,
        );

        // Check if there was a compilation/runtime/language error
        const isErrorFound = Boolean(data?.error || data?.stderr);

        // Expected output from database
        const expectedOutput = normalizeOutput(testCase.expectedOutput);

        // Test case passes only if:
        // 1. Backend execution was successful
        // 2. Actual output matches expected output
        const passed =
          Boolean(data?.success) &&
          !isErrorFound &&
          actualOutput === expectedOutput;

        runs.push({
          // Use index because your test case doesn't have an id
          id: index + 1,

          // Test case input
          input: testCase.input,

          // Expected output
          expectedOutput,

          // Actual output
          actualOutput,

          // Original input sent to backend
          sentInput: serializedInput,

          // Whether this testcase is a sample testcase
          isSample: Boolean(testCase.isSample),

          // Whether testcase passed
          passed,

          // Whether execution produced an error
          isErrorFound,

          // Runtime information from backend
          runtime: data?.runtime ?? null,

          // Memory information from backend
          memory: data?.memory ?? null,

          // Optional error information
          error: data?.error ?? null,

          // Optional stderr
          stderr: data?.stderr ?? null,
        });
      }

      // Check if ALL test cases passed
      const isAccepted =
        runs.length > 0 && runs.every((result) => result.passed);

      setExecutionResult({
        verdict: isAccepted ? "accepted" : "wrong-answer",

        message: isAccepted
          ? "Accepted: every testcase produced the expected output."
          : "Wrong answer: at least one testcase did not match the expected output.",

        runs,
      });
    } catch (error) {
      setExecutionResult({
        verdict: "wrong-answer",

        message: error?.response?.data?.error
          ? `Execution Error: ${error.response.data.error}`
          : `Execution Error: ${error.message}`,

        runs: [],
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full min-h-0 overflow-hidden">
      {/* Editor Controls Bar */}
      <div className="h-11 border-b border-rose-950/80 bg-[#12080a] px-4 flex items-center justify-between shrink-0">
        {/* Select Language */}
        <select
          className="bg-[#1c0d12] hover:bg-rose-950/60 text-xs font-bold px-3 py-1 rounded-xl text-rose-400 border border-rose-950 flex items-center gap-1 transition-colors focus:outline-none focus:border-rose-500 cursor-pointer"
          value={selectedLanguage}
          onChange={(e) => {
            const nextLanguage = e.target.value;
            setSelectedLanguage(nextLanguage);
            setCode(getStarterCodeForLanguage(nextLanguage));
          }}
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {/* Run Button */}
          <button
            type="button"
            className="px-3.5 py-1 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors disabled:opacity-50 cursor-pointer shadow-sm shadow-emerald-950"
            onClick={handleCodeExecution}
            disabled={isRunning}
          >
            {isRunning ? "Running..." : "Run"}
          </button>

          {/* Submit Button */}
          <button
            type="button"
            className="px-3.5 py-1 text-xs font-bold rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white transition-colors cursor-pointer shadow-sm shadow-rose-950"
          >
            Submit
          </button>

          {/* Reset Button */}
          <button
            type="button"
            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-800/80 transition-colors"
            onClick={() => {
              const selectedOption = languageOptions.find(
                (option) => option.value === selectedLanguage,
              );

              setCode(getStarterCodeForLanguage(selectedLanguage));
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Maximize Button */}
          <button
            type="button"
            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-800/80 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Core Editor */}
      <div className="flex-1 min-h-0 relative">
        <Editor
          height="90%"
          language={selectedLanguage}
          value={code}
          theme="vs-dark"
          options={{
            minimap: {
              enabled: false,
            },
            scrollBeyondLastLine: false,
            fontSize: 14,
            fontFamily: "Fira Code, monospace",
            automaticLayout: true,
          }}
          onChange={(value) => setCode(value ?? "")}
        />
      </div>

      {/* Terminal */}
      <ExecutionTerminal
        isOpen={isTerminalOpen}
        onToggle={() => setIsTerminalOpen((current) => !current)}
        demoproblem={demoproblem}
        problem={problem}
        testCases={testCases}
        output={executionResult}
      />
    </div>
  );
}
