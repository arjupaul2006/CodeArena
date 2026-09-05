import React, { useState } from "react";
import { ThumbsUp, ThumbsDown, Star, FileText, FlaskConical } from "lucide-react";

export default function ProblemDescription({ demoproblem, problem }) {
  const [activeTab, setActiveTab] = useState("description");
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);

  if (!problem) {
    return <div className="p-5 text-[#244333] font-medium">Loading problem details...</div>;
  }

  const testCasesList =
    problem?.test_cases ||
    problem?.testCases ||
    demoproblem?.test_cases ||
    [];

  const formatValue = (value) => {
    if (Array.isArray(value)) {
      return `[${value.map((item) => formatValue(item)).join(", ")}]`;
    }

    if (value !== null && typeof value === "object") {
      return `{ ${Object.entries(value)
        .map(([key, nestedValue]) => `${key}: ${formatValue(nestedValue)}`)
        .join(", ")} }`;
    }

    return String(value);
  };

  const renderFormatted = (val) => {
    if (val === undefined || val === null) return "";
    if (typeof val === "string") return val;
    return formatValue(val);
  };

  const difficultyColor = {
    Easy: "bg-emerald-500/15 text-emerald-800 border-emerald-500/30",
    Medium: "bg-amber-500/15 text-amber-800 border-amber-500/30",
    Hard: "bg-rose-500/15 text-rose-800 border-rose-500/30",
  };

  return (
    <div className="flex flex-col h-full bg-[#e8f3e8]">
      {/* Top Tab Bar */}
      <div className="flex items-center gap-1 border-b border-[#b7d2bb] bg-[#dcecdf]/70 px-4 pt-2 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("description")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer border-b-2 -mb-px ${
            activeTab === "description"
              ? "border-[#3f7d55] text-[#183226] bg-[#e8f3e8] rounded-t-lg shadow-xs"
              : "border-transparent text-[#547060] hover:text-[#183226] hover:bg-[#e8f3e8]/60 rounded-t-lg"
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-[#3f7d55]" />
          Description
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("testcases")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer border-b-2 -mb-px ${
            activeTab === "testcases"
              ? "border-[#3f7d55] text-[#183226] bg-[#e8f3e8] rounded-t-lg shadow-xs"
              : "border-transparent text-[#547060] hover:text-[#183226] hover:bg-[#e8f3e8]/60 rounded-t-lg"
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5 text-[#3f7d55]" />
          Testcases
          {testCasesList.length > 0 && (
            <span className="text-[10px] bg-[#3f7d55]/15 text-[#2f6b45] px-2 py-0.5 rounded-full font-extrabold ml-0.5">
              {testCasesList.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Tab Content Container */}
      <div className="p-5 lg:p-7 space-y-6 overflow-y-auto flex-1">
        {activeTab === "description" ? (
          <>
            {/* Title Header */}
            <div className="space-y-2.5 border-b border-[#b7d2bb]/60 pb-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-[#183226] tracking-tight">
                  {problem?.title}
                </h1>
                <span
                  className={`text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-md border ${
                    difficultyColor[problem?.difficulty] ||
                    "bg-[#dcecdf] text-[#244333] border-[#b7d2bb]"
                  }`}
                >
                  {problem?.difficulty}
                </span>
              </div>
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {problem?.tags &&
                  problem?.tags.map((t, i) => (
                    <span
                      key={i}
                      className="text-[11px] text-[#2f6b45] bg-[#f4faf1] px-2.5 py-0.5 rounded-lg border border-[#b7d2bb] font-semibold"
                    >
                      {t}
                    </span>
                  ))}
              </div>

              {/* Interaction Stats */}
              <div className="flex items-center gap-4 text-xs font-semibold text-[#668170] pt-1">
                <button type="button" className="flex items-center gap-1.5 hover:text-[#183226] transition-colors cursor-pointer bg-[#f4faf1] px-2.5 py-1 rounded-lg border border-[#b7d2bb]/60">
                  <ThumbsUp className="w-3.5 h-3.5 text-[#3f7d55]" /> 14.2k
                </button>
                <button type="button" className="flex items-center gap-1.5 hover:text-[#183226] transition-colors cursor-pointer bg-[#f4faf1] px-2.5 py-1 rounded-lg border border-[#b7d2bb]/60">
                  <ThumbsDown className="w-3.5 h-3.5 text-[#547060]" /> 205
                </button>
                <button type="button" className="flex items-center gap-1.5 hover:text-[#183226] transition-colors cursor-pointer bg-[#f4faf1] px-2.5 py-1 rounded-lg border border-[#b7d2bb]/60">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" /> Favorite
                </button>
              </div>
            </div>

            {/* Markdown / Body Prompt Text */}
            <div className="text-sm sm:text-base text-[#385a43] leading-relaxed max-w-3xl font-medium whitespace-pre-line">
              {problem?.description}
            </div>

            {/* Examples and Constraints */}
            <div className="space-y-6">
              {/* Examples Box */}
              {problem?.examples && problem.examples.length > 0 && (
                <div>
                  <h3 className="text-sm font-extrabold text-[#183226] mb-3 flex items-center gap-2">
                    <span>Examples</span>
                  </h3>
                  <div className="space-y-3">
                    {problem.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="bg-[#f4faf1] border border-[#b7d2bb] p-4 rounded-xl space-y-3 shadow-xs"
                      >
                        <div className="space-y-3">
                          {/* Input */}
                          <div>
                            <div className="text-xs text-[#547060] font-bold mb-1">
                              Input
                            </div>
                            <pre className="text-xs font-mono text-[#183226] bg-[#e8f3e8] p-2.5 rounded-lg border border-[#b7d2bb] overflow-auto whitespace-pre-wrap">
                              {renderFormatted(ex.input)}
                            </pre>
                          </div>

                          {/* Output */}
                          <div>
                            <div className="text-xs text-[#547060] font-bold mb-1">
                              Output
                            </div>
                            <div className="text-sm font-bold text-emerald-800 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 inline-flex">
                              {renderFormatted(ex.output)}
                            </div>
                          </div>

                          {/* Explanation */}
                          {ex.explanation && (
                            <div>
                              <div className="text-xs text-[#547060] font-bold mb-1">
                                Explanation
                              </div>
                              <div className="text-xs text-[#385a43]">
                                {ex.explanation}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Constraints */}
              {problem?.constraints && problem.constraints.length > 0 && (
                <div>
                  <h3 className="text-sm font-extrabold text-[#183226] mb-2">
                    Constraints
                  </h3>
                  <ul className="space-y-2">
                    {problem.constraints.map((c, i) => (
                      <li
                        key={i}
                        className="text-xs text-[#183226] font-mono bg-[#f4faf1] px-3 py-2 rounded-lg border border-[#b7d2bb]"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Testcases Tab View */
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-extrabold text-[#183226]">
                Problem Test Cases
              </h2>
              <p className="text-xs text-[#547060] mt-0.5">
                Preview sample inputs and expected outputs configured for this challenge.
              </p>
            </div>

            {testCasesList.length === 0 ? (
              <div className="p-8 text-center bg-[#f4faf1] border border-[#b7d2bb] rounded-xl text-xs text-[#547060]">
                No test cases available for this problem.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Case Selector Tabs */}
                <div className="flex flex-wrap gap-2">
                  {testCasesList.map((tc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedCaseIdx(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedCaseIdx === idx
                          ? "bg-[#3f7d55] text-white border-[#3f7d55] shadow-xs"
                          : "bg-[#f4faf1] text-[#244333] border-[#b7d2bb] hover:bg-[#e4f2e4]"
                      }`}
                    >
                      Case {idx + 1}
                      {tc.isSample && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold ${
                            selectedCaseIdx === idx
                              ? "bg-white/20 text-white"
                              : "bg-emerald-500/15 text-emerald-800"
                          }`}
                        >
                          Sample
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Selected Case Detail Card */}
                {testCasesList[selectedCaseIdx] && (
                  <div className="bg-[#f4faf1] border border-[#b7d2bb] p-5 rounded-xl space-y-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-extrabold text-[#183226] uppercase tracking-wider">
                        Case {selectedCaseIdx + 1} Details
                      </h4>
                      {testCasesList[selectedCaseIdx].isSample && (
                        <span className="text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-800 px-2 py-0.5 rounded border border-emerald-500/30">
                          Sample Test Case
                        </span>
                      )}
                    </div>

                    {/* Input */}
                    <div>
                      <div className="text-xs font-bold text-[#547060] mb-1.5">
                        Input
                      </div>
                      <pre className="text-xs font-mono text-[#183226] bg-[#e8f3e8] p-3 rounded-lg border border-[#b7d2bb] overflow-auto whitespace-pre-wrap">
                        {renderFormatted(testCasesList[selectedCaseIdx].input)}
                      </pre>
                    </div>

                    {/* Expected Output */}
                    <div>
                      <div className="text-xs font-bold text-[#547060] mb-1.5">
                        Expected Output
                      </div>
                      <pre className="text-xs font-mono text-emerald-800 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/30 overflow-auto whitespace-pre-wrap">
                        {renderFormatted(
                          testCasesList[selectedCaseIdx].expectedOutput ||
                            testCasesList[selectedCaseIdx].output
                        )}
                      </pre>
                    </div>

                    {/* Explanation if present */}
                    {testCasesList[selectedCaseIdx].explanation && (
                      <div>
                        <div className="text-xs font-bold text-[#547060] mb-1">
                          Explanation
                        </div>
                        <div className="text-xs text-[#385a43] bg-[#e8f3e8]/60 p-2.5 rounded-lg border border-[#b7d2bb]/50">
                          {testCasesList[selectedCaseIdx].explanation}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
