import React, { useState } from "react";
import { ChevronUp, Terminal, CheckCircle, Play } from "lucide-react";

export default function ExecutionTerminal({
  isOpen,
  onToggle,
  demoproblem,
  problem,
  testCases,
  output,
}) {
  const [activeTab, setActiveTab] = useState("testcase");

  // const testCases = testCases ||  [];
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
      className={`absolute inset-x-0 bottom-0 z-20 border-t border-[#b7d2bb] bg-[#f4faf1] shadow-[0_-20px_40px_rgba(49,92,61,0.15)] transition-transform duration-300 ease-out ${
        isOpen ? "translate-y-0" : "translate-y-[calc(100%-3.25rem)]"
      }`}
    >
      {/* Slider Button */}
      <button
        type="button"
        onClick={onToggle}
        className="h-12 w-full px-4 border-b border-[#b7d2bb] bg-[#e8f3e8] flex items-center justify-between text-xs font-bold text-[#244333] hover:text-[#183226] transition-colors"
      >
        <span className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5" />
          Testcase
        </span>
        <ChevronUp
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-0" : "rotate-180"}`}
        />
      </button>

      <div className="max-h-[38vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#a6cbaa] scrollbar-track-transparent">
        <div className="px-4 pt-3 pb-2 border-b border-[#b7d2bb] bg-[#eef7eb]">
          <div className="flex items-center justify-between gap-3 text-[11px] font-semibold text-[#547060] mb-3">
            <span className="flex items-center gap-2">
              <span
                className={`inline-flex h-1.5 w-1.5 rounded-full ${
                  verdict === "accepted"
                    ? "bg-emerald-600"
                    : verdict === "wrong-answer"
                      ? "bg-rose-600"
                      : "bg-[#668170]"
                }`}
              />
              {output?.message ?? "Run your code to see test results."}
            </span>
            {runs.length > 0 ? (
              <span className="text-[#668170]">
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
              className={`h-9 px-3.5 rounded-t-lg border-b-2 transition-colors cursor-pointer ${
                activeTab === "testcase"
                  ? "text-[#183226] border-[#3f7d55] bg-[#ffffff] font-bold shadow-xs"
                  : "text-[#547060] border-transparent hover:text-[#183226] hover:bg-[#dcecdf]"
              }`}
            >
              Testcase
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("result")}
              className={`h-9 px-3.5 rounded-t-lg border-b-2 transition-colors cursor-pointer ${
                activeTab === "result"
                  ? "text-[#183226] border-[#3f7d55] bg-[#ffffff] font-bold shadow-xs"
                  : "text-[#547060] border-transparent hover:text-[#183226] hover:bg-[#dcecdf]"
              }`}
            >
              Result
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("error")}
              className={`h-9 px-3.5 rounded-t-lg border-b-2 transition-colors cursor-pointer ${
                activeTab === "error"
                  ? "text-[#183226] border-[#3f7d55] bg-[#ffffff] font-bold shadow-xs"
                  : "text-[#547060] border-transparent hover:text-[#183226] hover:bg-[#dcecdf]"
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
                  verdict === "accepted" ? "text-emerald-700" : "text-rose-700"
                }`}
              >
                <CheckCircle className="w-4 h-4 fill-emerald-500/20" />

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
                    className="p-3 bg-[#ffffff] border border-[#b7d2bb] rounded-xl space-y-2 font-mono text-xs shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[#183226] font-bold block">
                        Case {caseId}
                      </span>

                      {caseData.isSample && (
                        <span className="text-[10px] text-[#3f7d55] font-semibold bg-[#e8f3e8] px-2 py-0.5 rounded border border-[#b7d2bb]">
                          Sample
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      {/* Input */}
                      <div>
                        <span className="text-[#668170]">Input:</span>

                        <pre className="mt-1 text-[#183226] font-semibold whitespace-pre-wrap bg-[#e8f3e8] border border-[#b7d2bb] p-2 rounded-md">
                          {caseData.input}
                        </pre>
                      </div>

                      {/* Expected Output */}
                      <div>
                        <span className="text-[#668170]">Output:</span>{" "}
                        <span className="text-emerald-800 font-semibold">
                          {caseData.expectedOutput}
                        </span>
                      </div>

                      {/* Actual Output */}
                      {result ? (
                        <div>
                          <span className="text-[#668170]">Actual:</span>{" "}
                          <span
                            className={`font-semibold ${
                              result.passed
                                ? "text-emerald-800"
                                : "text-rose-700"
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
            <div className="text-xs text-[#547060] font-medium">
              {output?.message ??
                "Results will appear here after running the code."}
            </div>
            {runs.length > 0 ? (
              <div className="space-y-2 text-xs">
                {runs.map((result) => (
                  <div
                    key={result.id}
                    className="p-3 rounded-xl border border-[#b7d2bb] bg-[#ffffff] shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className="font-bold text-[#183226]">
                        Case {result.id}
                      </span>
                      <span
                        className={`text-[10px] uppercase tracking-wider font-bold ${
                          result.passed ? "text-emerald-800" : "text-rose-700"
                        }`}
                      >
                        {result.passed ? "Accepted" : "Wrong Answer"}
                      </span>
                    </div>
                    <div className="space-y-1 text-[#547060]">
                      <div>
                        Expected:{" "}
                        <span className="text-[#183226]">
                          {result.expectedOutput}
                        </span>
                      </div>
                      <div>
                        Actual:{" "}
                        <span
                          className={
                            result.passed ? "text-emerald-800" : "text-rose-700"
                          }
                        >
                          {result.actualOutput}
                        </span>
                      </div>
                      {result.runtime ? (
                        <div>
                          Runtime:{" "}
                          <span className="text-[#183226]">
                            {result.runtime}
                          </span>
                        </div>
                      ) : null}
                      {result.memory ? (
                        <div>
                          Memory:{" "}
                          <span className="text-[#183226]">{result.memory}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-dashed border-[#b7d2bb] bg-[#ffffff] text-xs text-[#668170]">
                No output yet.
              </div>
            )}
          </div>
        )}

        {/* Error Tab Content */}
        {activeTab === "error" && (
          <div className="p-4 space-y-3">
            {verdict === "wrong-answer" ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-800 font-medium">
                {sharedErrorMessage ??
                  languageErrorMessage ??
                  output?.message ??
                  "Wrong answer: one or more testcases failed."}
              </div>
            ) : (
              <div className="text-xs text-[#668170] font-medium">
                No error message available.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
