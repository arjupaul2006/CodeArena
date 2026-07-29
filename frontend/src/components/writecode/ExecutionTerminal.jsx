import React, { useState } from "react";
import { ChevronUp, Terminal, CheckCircle, Play } from "lucide-react";

export default function ExecutionTerminal({
  isOpen,
  onToggle,
  problem,
  output,
}) {
  const [activeTab, setActiveTab] = useState("testcase");

  const testCases = problem?.test_cases ?? [];
  const runs = output?.runs ?? [];
  console.log("ExecutionTerminal - testCases:", runs);
  const verdict = output?.verdict;

  // separate the runs by their id for easy access
  const resultById = new Map(runs.map((result) => [result.id, result]));

  const failingRuns = runs.filter((result) => !result.passed);
  const sharedErrorMessage =
    failingRuns.length > 0 &&
    new Set(failingRuns.map((result) => result.actualOutput).filter(Boolean))
      .size === 1
      ? failingRuns[0]?.actualOutput
      : null;
  const languageErrorMessage = failingRuns.find((result) => result.isErrorFound)
    ? "Language Error"
    : null;

  return (
    <div
      className={`absolute inset-x-0 bottom-0 z-20 border-t border-gray-800/80 bg-[#0f1422] shadow-[0_-20px_40px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out ${
        isOpen ? "translate-y-0" : "translate-y-[calc(100%-3.25rem)]"
      }`}
    >
      {/* Slider Button */}
      <button
        type="button"
        onClick={onToggle}
        className="h-12 w-full px-4 border-b border-gray-800/60 bg-[#131929]/85 flex items-center justify-between text-xs font-bold text-gray-200 hover:text-white transition-colors"
      >
        <span className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5" />
          Testcase
        </span>
        <ChevronUp
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-0" : "rotate-180"}`}
        />
      </button>

      <div className="max-h-[38vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="px-4 pt-3 pb-2 border-b border-gray-800/60 bg-[#101624]">
          <div className="flex items-center justify-between gap-3 text-[11px] font-semibold text-gray-400 mb-3">
            <span className="flex items-center gap-2">
              <span
                className={`inline-flex h-1.5 w-1.5 rounded-full ${
                  verdict === "accepted"
                    ? "bg-emerald-400"
                    : verdict === "wrong-answer"
                      ? "bg-red-400"
                      : "bg-gray-500"
                }`}
              />
              {output?.message ?? "Run your code to see test results."}
            </span>
            {runs.length > 0 ? (
              <span className="text-gray-500">
                {runs.filter((result) => result.passed).length}/{runs.length}{" "}
                passed
              </span>
            ) : null}
          </div>

          {/* Testcase and Result Tabs  */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab("testcase")}
              className={`h-9 px-3 rounded-t-md border-b-2 transition-colors ${
                activeTab === "testcase"
                  ? "text-white border-blue-500 bg-[#131929]/80"
                  : "text-gray-400 border-transparent hover:text-white hover:bg-[#131929]/50"
              }`}
            >
              Testcase
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("result")}
              className={`h-9 px-3 rounded-t-md border-b-2 transition-colors ${
                activeTab === "result"
                  ? "text-white border-blue-500 bg-[#131929]/80"
                  : "text-gray-400 border-transparent hover:text-white hover:bg-[#131929]/50"
              }`}
            >
              Result
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("error")}
              className={`h-9 px-3 rounded-t-md border-b-2 transition-colors ${
                activeTab === "error"
                  ? "text-white border-blue-500 bg-[#131929]/80"
                  : "text-gray-400 border-transparent hover:text-white hover:bg-[#131929]/50"
              }`}
            >
              Error
            </button>
          </div>
        </div>

        {/* TestCase Tab Content */}
        {activeTab === "testcase" && (
          <div className="p-4 space-y-4">
            {/* Accepted or not */}
            {verdict ? (
              <div
                className={`flex items-center gap-2 text-xs font-bold ${
                  verdict === "accepted" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                <CheckCircle className="w-4 h-4 fill-emerald-500/10" />

                <span>
                  {verdict === "accepted" ? "Accepted" : "Wrong Answer"}
                </span>
              </div>
            ) : null}

            {/* TestCase Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {testCases.map((caseData, index) => {
                const caseId = index + 1;
                const result = resultById.get(caseId);

                return (
                  <div
                    key={caseId}
                    className="p-3 bg-[#131929]/55 border border-gray-800/70 rounded-xl space-y-2 font-mono text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 font-bold block">
                        Case {caseId}
                      </span>

                      {caseData.isSample && (
                        <span className="text-[10px] text-blue-400">
                          Sample
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      {/* Input */}
                      <div>
                        <span className="text-gray-500">Input:</span>

                        <pre className="mt-1 text-gray-200 font-semibold whitespace-pre-wrap bg-[#0f1422] p-2 rounded-md">
                          {caseData.input}
                        </pre>
                      </div>

                      {/* Expected Output */}
                      <div>
                        <span className="text-gray-500">Output:</span>{" "}
                        <span className="text-emerald-400 font-semibold">
                          {caseData.expectedOutput}
                        </span>
                      </div>

                      {/* Actual Output */}
                      {result ? (
                        <div>
                          <span className="text-gray-500">Actual:</span>{" "}
                          <span
                            className={`font-semibold ${
                              result.passed
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {result.actualOutput || "No output"}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Result Tab Content */}
        {activeTab === "result" && (
          <div className="p-4 space-y-3">
            <div className="text-xs text-gray-400 font-medium">
              {output?.message ??
                "Results will appear here after running the code."}
            </div>
            {runs.length > 0 ? (
              <div className="space-y-2 text-xs">
                {runs.map((result) => (
                  <div
                    key={result.id}
                    className="p-3 rounded-xl border border-gray-800 bg-[#131929]/30"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="font-bold text-gray-200">
                        Case {result.id}
                      </span>
                      <span
                        className={`text-[10px] uppercase tracking-wider font-semibold ${
                          result.passed ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {result.passed ? "Accepted" : "Wrong Answer"}
                      </span>
                    </div>
                    <div className="space-y-1 text-gray-400">
                      <div>
                        Expected:{" "}
                        <span className="text-gray-200">
                          {result.expectedOutput}
                        </span>
                      </div>
                      <div>
                        Actual:{" "}
                        <span
                          className={
                            result.passed ? "text-emerald-400" : "text-red-400"
                          }
                        >
                          {result.actualOutput}
                        </span>
                      </div>
                      {result.runtime ? (
                        <div>
                          Runtime:{" "}
                          <span className="text-gray-200">
                            {result.runtime}
                          </span>
                        </div>
                      ) : null}
                      {result.memory ? (
                        <div>
                          Memory:{" "}
                          <span className="text-gray-200">{result.memory}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-dashed border-gray-700 bg-[#131929]/30 text-xs text-gray-500">
                No output yet.
              </div>
            )}
          </div>
        )}

        {/* Error Tab Content */}
        {activeTab === "error" && (
          <div className="p-4 space-y-3">
            {verdict === "wrong-answer" ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {sharedErrorMessage ??
                  languageErrorMessage ??
                  output?.message ??
                  "Wrong answer: one or more testcases failed."}
              </div>
            ) : (
              <div className="text-xs text-gray-500 font-medium">
                No error message available.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
