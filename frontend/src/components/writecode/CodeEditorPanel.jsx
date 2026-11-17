import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { RotateCcw, Maximize2 } from "lucide-react";
import axios from "axios";

const normalizeOutput = (value) => String(value ?? "").trim();

const areOutputsEqual = (actual, expected) => {
  const normActual = normalizeOutput(actual);
  const normExpected = normalizeOutput(expected);

  // Direct string match
  if (normActual === normExpected) return true;
  if (normActual.toLowerCase() === normExpected.toLowerCase()) return true;

  // Token-based / array comparison (stripping brackets '[', ']' and commas ',')
  const extractTokens = (str) =>
    str
      .replace(/[\[\]]/g, " ")
      .replace(/,/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  const actualTokens = extractTokens(normActual);
  const expectedTokens = extractTokens(normExpected);

  if (
    actualTokens.length > 0 &&
    actualTokens.length === expectedTokens.length
  ) {
    return actualTokens.every((tok, idx) => tok === expectedTokens[idx]);
  }

  return false;
};

export default function CodeEditorPanel({
  demoproblem,
  problem,
  submittedCode,
  submittedLanguage,
  testCases,
  sampleTestCases: propsSampleTestCases,
  runExecutionResult: propsRunExecutionResult,
  setRunExecutionResult: propsSetRunExecutionResult,
  submitExecutionResult: propsSubmitExecutionResult,
  setSubmitExecutionResult: propsSetSubmitExecutionResult,
  historySelection,
}) {
  const languageOptions = [
    {
      label: "Python 3",
      value: "python",
      id: 71,
      codeLines: "# Write your code here\nprint('Hello, World!')",
    },
    {
      label: "JavaScript",
      value: "javascript",
      id: 63,
      codeLines: "// Write your code here\nconsole.log('Hello, World!');",
    },
    {
      label: "Java",
      value: "java",
      id: 62,
      codeLines:
        'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    },
    {
      label: "C++",
      value: "cpp",
      id: 54,
      codeLines:
        '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
    },
    {
      label: "C",
      value: "c",
      id: 50,
      codeLines:
        '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
    },
    {
      label: "Go",
      value: "go",
      id: 60,
      codeLines:
        '// Write your code here\npackage main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
    },
    {
      label: "Ruby",
      value: "ruby",
      id: 72,
      codeLines: "# Write your code here\nputs 'Hello, World!'",
    },
    {
      label: "C#",
      value: "csharp",
      id: 51,
      codeLines:
        '// Write your code here\nusing System;\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}',
    },
    {
      label: "PHP",
      value: "php",
      id: 68,
      codeLines: "<?php\necho 'Hello, World!';\n?>",
    },
    {
      label: "Swift",
      value: "swift",
      id: 83,
      codeLines: '// Write your code here\nprint("Hello, World!")',
    },
    {
      label: "Kotlin",
      value: "kotlin",
      id: 78,
      codeLines:
        '// Write your code here\nfun main() {\n    println("Hello, World!")\n}',
    },
  ];

  const [localRunExecutionResult, setLocalRunExecutionResult] = useState({
    verdict: null,
    message: "Run your code to compare outputs against testcases.",
    runs: [],
  });

  const [localSubmitExecutionResult, setLocalSubmitExecutionResult] = useState({
    verdict: null,
    code: "",
    language: "",
    runtime: 0,
    memory: 0,
    message: "Submit your code to see submission results.",
    runs: [],
  });

  // state setters
  var setRunExecutionResult =
    propsSetRunExecutionResult ?? setLocalRunExecutionResult;
  var setSubmitExecutionResult =
    propsSetSubmitExecutionResult ?? setLocalSubmitExecutionResult;

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [code, setCode] = useState("");

  const [selectedLanguage, setSelectedLanguage] = useState("python");

  // All available test cases for the current problem
  const targetTestCases =
    testCases && testCases.length > 0
      ? testCases
      : problem?.test_cases ||
        problem?.testCases ||
        demoproblem?.test_cases ||
        [];

  // Array of sample test cases (filtered by isSample / is_sample flag)
  const sampleTestCases =
    propsSampleTestCases && propsSampleTestCases.length > 0
      ? propsSampleTestCases
      : targetTestCases.filter((tc) => tc.isSample || tc.is_sample);

  // Initialize code and language from submittedCode and submittedLanguage if available
  useEffect(() => {
    if (submittedCode) {
      setCode(submittedCode);
    }
    if (submittedLanguage) {
      setSelectedLanguage(submittedLanguage);
    }
  }, [submittedCode, submittedLanguage]);

  // Update code and language when historySelection changes
  useEffect(() => {
    if (!historySelection) return;

    setCode(historySelection.code || "");
    setSelectedLanguage(historySelection.language || "python");
  }, [historySelection]);

  // ----- Handle code execution for Run button (runs sample test cases)
  const handleRunCodeExecution = async () => {
    const setRunExecutionResult =
      propsSetRunExecutionResult ?? setLocalRunExecutionResult;

    const testCasesToRun =
      sampleTestCases.length > 0 ? sampleTestCases : targetTestCases;

    // --------------------------------
    // Check test cases
    // --------------------------------

    if (!testCasesToRun?.length) {
      setRunExecutionResult({
        verdict: "wrong-answer",
        message: "No test cases found for this problem.",
        runs: [],
        isSubmit: false,
      });

      return;
    }

    setIsRunning(true);

    try {
      const runs = [];

      // --------------------------------
      // Run each test case
      // --------------------------------

      for (let index = 0; index < testCasesToRun.length; index++) {
        const testCase = testCasesToRun[index];

        // Convert input to string
        const serializedInput =
          typeof testCase.input === "object"
            ? JSON.stringify(testCase.input)
            : String(testCase.input ?? "");

        const backendUrl =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

        // --------------------------------
        // Send code to backend
        // --------------------------------

        const { data } = await axios.post(`${backendUrl}/api/execute`, {
          code,
          input: serializedInput,
          language: selectedLanguage,

          languageId:
            languageOptions.find((option) => option.value === selectedLanguage)
              ?.id ?? null,

          problem: problem ?? null,
        });

        console.log("JDoodle Backend Response:", data);

        // --------------------------------
        // JDoodle result
        // --------------------------------

        const result = data?.result ?? {};

        // JDoodle output
        const actualOutput = normalizeOutput(result.output ?? "");

        // JDoodle error
        const executionError = result.error || data?.error || "";

        const stderr = result.error || "";

        // --------------------------------
        // Expected output
        // --------------------------------

        const expectedOutput = normalizeOutput(
          testCase.expectedOutput ?? testCase.output ?? "",
        );

        // --------------------------------
        // Check execution error
        // --------------------------------

        const isErrorFound = Boolean(executionError);

        // --------------------------------
        // Check output
        // --------------------------------

        const passed =
          Boolean(data?.success) &&
          !isErrorFound &&
          areOutputsEqual(actualOutput, expectedOutput);

        // --------------------------------
        // Store testcase result
        // --------------------------------

        runs.push({
          id: index + 1,
          input: testCase.input,
          sentInput: serializedInput,
          expectedOutput,
          actualOutput,
          isSample: Boolean(testCase.isSample || testCase.is_sample),
          passed,
          verdict:
            data?.verdict === "Accepted"
              ? passed
                ? "Accepted"
                : "Wrong Answer"
              : data?.verdict,
          isErrorFound,
          runtime: result.cpuTime ?? data?.cpuTime ?? null,
          memory: result.memory ?? data?.memory ?? null,
          error: executionError || null,
          stderr: stderr || null,
        });
      }

      // --------------------------------
      // Check all test cases
      // --------------------------------

      let verdict = "Wrong Answer";
      for (const run of runs) {
        if (run.isErrorFound) {
          verdict = "Runtime Error";
          break;
        }
        if (run.verdict === "Time Limit Exceeded") {
          verdict = "Time Limit Exceeded";
          break;
        }
        if (run.verdict !== "Accepted") {
          verdict = run.verdict || "Wrong Answer";
          break;
        }
      }

      if (runs.length > 0 && runs.every((run) => run.passed)) {
        verdict = "Accepted";
      }

      // --------------------------------
      // Final result
      // --------------------------------

      setRunExecutionResult({
        verdict: verdict,

        message:
          verdict === "Accepted"
            ? "All sample testcases passed successfully."
            : verdict === "Runtime Error"
              ? "Execution Error: At least one sample testcase produced an error."
              : verdict === "Time Limit Exceeded"
                ? "Execution Error: At least one sample testcase exceeded the time limit."
                : "Some sample testcases did not produce the expected output.",

        runs,

        isSubmit: false,
      });

      console.log("Final Execution Result:", runs);
    } catch (error) {
      console.error("Code Execution Error:", error, error.response.status);

      if (error.response && error.response.status === 504) {
        setRunExecutionResult({
          verdict: "Time Limit Exceeded",
          message:
            "Execution Service Timeout: The code execution took too long to respond.",
          runs: [],
          isSubmit: false,
        });
      } else if (error.response && error.response.status === 503) {
        setRunExecutionResult({
          verdict: "Internal Error",
          message: "Execution Service Error: JDoodle API credits exhausted.",
          runs: [],
          isSubmit: false,
        });
      } else {
        setRunExecutionResult({
          verdict: "Wrong Answer",

          message: error?.response?.data?.error
            ? `Execution Error: ${
                typeof error.response.data.error === "string"
                  ? error.response.data.error
                  : JSON.stringify(error.response.data.error)
              }`
            : `Execution Error: ${error?.message || "Unknown error"}`,

          runs: [],

          isSubmit: false,
        });
      }
    } finally {
      setIsRunning(false);
    }
  };

  // ----- Handle code execution for Submit button (runs ALL test cases including sample test cases)
  const handleSubmitCodeExecution = async () => {
    const setSubmitExecutionResult =
      propsSetSubmitExecutionResult ?? setLocalSubmitExecutionResult;

    const testCasesToSubmit = targetTestCases;

    // --------------------------------
    // Check test cases
    // --------------------------------

    if (!testCasesToSubmit?.length) {
      setSubmitExecutionResult({
        verdict: "wrong-answer",
        code: code,
        language: selectedLanguage,
        runtime: 0,
        memory: 0,
        message: "No test cases found for this problem.",
        runs: [],
        isSubmit: true,
      });

      return;
    }

    setIsSubmitting(true);

    try {
      const runs = [];

      let maxRuntime = 0;
      let maxMemory = 0;

      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

      // --------------------------------
      // Execute ALL test cases
      // --------------------------------

      for (let index = 0; index < testCasesToSubmit.length; index++) {
        const testCase = testCasesToSubmit[index];

        // --------------------------------
        // Serialize input
        // --------------------------------

        const serializedInput =
          typeof testCase.input === "object"
            ? JSON.stringify(testCase.input)
            : String(testCase.input ?? "");

        // --------------------------------
        // Send code to backend
        // --------------------------------

        const { data } = await axios.post(`${backendUrl}/api/execute`, {
          code,
          input: serializedInput,
          language: selectedLanguage,
          languageId:
            languageOptions.find((option) => option.value === selectedLanguage)
              ?.id ?? null,
          problem: problem ?? null,
        });

        console.log(`JDoodle response - Test Case ${index + 1}:`, data);

        // --------------------------------
        // Get JDoodle result
        // --------------------------------

        const result = data?.result ?? {};

        // --------------------------------
        // Actual output
        // --------------------------------

        const actualOutput = normalizeOutput(result.output ?? "");

        // --------------------------------
        // Error
        // --------------------------------

        const executionError = result.error || data?.error || "";

        const stderr = result.error || "";

        const isErrorFound = Boolean(executionError);

        // --------------------------------
        // Expected output
        // --------------------------------

        const expectedOutput = normalizeOutput(
          testCase.expectedOutput ?? testCase.output ?? "",
        );

        // --------------------------------
        // Check testcase
        // --------------------------------

        const passed =
          Boolean(data?.success) &&
          !isErrorFound &&
          areOutputsEqual(actualOutput, expectedOutput);

        // --------------------------------
        // Runtime
        // --------------------------------

        const runtimeValue = Number(result.cpuTime ?? 0);

        const runtime = Number.isFinite(runtimeValue) ? runtimeValue : 0;

        // --------------------------------
        // Memory
        // --------------------------------

        const memoryValue = Number(result.memory ?? 0);

        const memory = Number.isFinite(memoryValue) ? memoryValue : 0;

        // --------------------------------
        // Get maximum runtime
        // --------------------------------

        if (runtime > maxRuntime) {
          maxRuntime = runtime;
        }

        // --------------------------------
        // Get maximum memory
        // --------------------------------

        if (memory > maxMemory) {
          maxMemory = memory;
        }

        // --------------------------------
        // Store testcase result
        // --------------------------------

        runs.push({
          id: index + 1,
          input: testCase.input,
          sentInput: serializedInput,
          expectedOutput,
          actualOutput,
          isSample: Boolean(testCase.isSample || testCase.is_sample),
          passed,
          verdict:
            data?.verdict === "Accepted"
              ? passed
                ? "Accepted"
                : "Wrong Answer"
              : data?.verdict,
          isErrorFound,
          runtime,
          memory,
          error: executionError || null,
          stderr: stderr || null,
        });

        // --------------------------------
        // Stop immediately if execution
        // error occurs
        // --------------------------------

        if (isErrorFound) {
          break;
        }
      }

      // --------------------------------
      // Check ALL test cases
      // --------------------------------

      let verdict = "Wrong Answer";
      for (const run of runs) {
        if (run.isErrorFound) {
          verdict = "Runtime Error";
          break;
        }
        if (run.verdict === "Time Limit Exceeded") {
          verdict = "Time Limit Exceeded";
          break;
        }
        if (run.verdict !== "Accepted") {
          verdict = run.verdict;
          break;
        }
      }

      if (
        runs.length === testCasesToSubmit.length &&
        runs.every((run) => run.passed)
      ) {
        verdict = "Accepted";
      }

      // --------------------------------
      // Final submission result
      // --------------------------------

      setSubmitExecutionResult({
        verdict: verdict,
        code: code,
        language: selectedLanguage,
        runtime: maxRuntime,
        memory: maxMemory,
        message:
          verdict === "Accepted"
            ? "All sample testcases passed successfully."
            : verdict === "Compilation Error"
              ? "Execution Error: At least one sample testcase produced an error."
              : verdict === "Time Limit Exceeded"
                ? "Execution Error: At least one sample testcase exceeded the time limit."
                : "Some sample testcases did not produce the expected output.",
        runs,
        isSubmit: true,
      });
      console.log("Final Submission Result:", runs);
    } catch (error) {
      console.error("Submission execution error:", error);

      const submissionError = {
        code,
        language: selectedLanguage,
        runtime: 0,
        memory: 0,
        runs: [],
        isSubmit: true,
      };

      if (error?.response?.status === 504) {
        setSubmitExecutionResult({
          ...submissionError,
          verdict: "Time Limit Exceeded",
          message:
            "Execution Service Timeout: The code execution took too long to respond.",
        });
      } else if (error?.response?.status === 503) {
        setSubmitExecutionResult({
          ...submissionError,
          verdict: "Internal Error",
          message: "Execution Service Error: JDoodle API credits exhausted.",
        });
      } else {
        setSubmitExecutionResult({
          ...submissionError,
          verdict: "Wrong Answer",
          message: error?.response?.data?.error
            ? `Execution Error: ${
                typeof error.response.data.error === "string"
                  ? error.response.data.error
                  : JSON.stringify(error.response.data.error)
              }`
            : `Execution Error: ${error?.message || "Unknown error"}`,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full min-h-0 overflow-hidden">
      {/* Editor Controls Bar */}
      <div className="h-11 border-b border-[#b7d2bb] bg-[#eef7eb] px-4 flex items-center justify-between shrink-0">
        {/* Select Language */}
        <select
          className="bg-[#ffffff] hover:bg-[#e8f3e8] text-xs font-bold px-3 py-1 rounded-xl text-[#183226] border border-[#b7d2bb] flex items-center gap-1 transition-colors focus:outline-none focus:border-[#3f7d55] cursor-pointer"
          value={selectedLanguage}
          onChange={(e) => {
            const nextLanguage = e.target.value;
            setSelectedLanguage(nextLanguage);
            setCode(
              languageOptions.find((option) => option.value === nextLanguage)
                ?.codeLines ?? "",
            );
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
            className="px-3.5 py-1 text-xs font-bold rounded-xl bg-[#3f7d55] hover:bg-[#326844] text-white transition-colors disabled:opacity-50 cursor-pointer shadow-sm shadow-[#8eae94]/40"
            onClick={handleRunCodeExecution}
            disabled={isRunning || isSubmitting}
          >
            {isRunning ? "Running..." : "Run"}
          </button>

          {/* Submit Button */}
          <button
            type="button"
            className="px-3.5 py-1 text-xs font-bold rounded-xl bg-[#2f6b45] hover:bg-[#244333] text-white transition-colors disabled:opacity-50 cursor-pointer shadow-sm shadow-[#8eae94]/40"
            onClick={handleSubmitCodeExecution}
            disabled={isRunning || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>

          {/* Reset Button */}
          <button
            type="button"
            className="p-1.5 text-[#547060] hover:text-[#183226] rounded hover:bg-[#dcecdf] transition-colors cursor-pointer"
            onClick={() => {
              setCode(
                languageOptions.find(
                  (option) => option.value === selectedLanguage,
                )?.codeLines ?? "",
              );
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Maximize Button */}
          <button
            type="button"
            className="p-1.5 text-[#547060] hover:text-[#183226] rounded hover:bg-[#dcecdf] transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Core Editor */}
      <div className="flex-1 min-h-0 relative">
        <Editor
          height="100%"
          language={selectedLanguage}
          value={code}
          theme="vs"
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
    </div>
  );
}
