import React, { useState, useEffect, useContext } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Star,
  FileText,
  FlaskConical,
  Send,
  History,
  AlertCircle,
  XCircle,
  CheckCircle2,
} from "lucide-react";
import { UserDataContext } from "../../context/UserContext";
import axios from "axios";

export default function ProblemDescription({
  demoproblem,
  contestId,
  problem,
  submissionId,
  testCases,
  sampleTestCases,
  runExecutionResult,
  submitExecutionResult,
  onSubmissionHistorySelect,
  lastSubmission,
  setLastSubmission,
}) {
  const [activeTab, setActiveTab] = useState("description");
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);
  const [selectedFailedIdx, setSelectedFailedIdx] = useState(0);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [submissionHistoryLoading, setSubmissionHistoryLoading] = useState(false);
  const [submissionHistoryError, setSubmissionHistoryError] = useState("");
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const [selectedHistoryIdx, setSelectedHistoryIdx] = useState(0);

  const { user } = useContext(UserDataContext);

  useEffect(() => {
    if (runExecutionResult?.runs?.length > 0 || runExecutionResult?.verdict) {
      setActiveTab("testcases");
    }
  }, [runExecutionResult]);

  useEffect(() => {
    if (
      submitExecutionResult?.runs?.length > 0 ||
      submitExecutionResult?.verdict
    ) {
      setActiveTab("submission");
      setSelectedFailedIdx(0);
    }
  }, [submitExecutionResult]);

  const testCasesList =
    sampleTestCases && sampleTestCases.length > 0
      ? sampleTestCases
      : problem?.test_cases ||
        problem?.testCases ||
        demoproblem?.test_cases ||
        [];

  const runFailedRuns =
    runExecutionResult?.runs?.filter((r) => !r.passed) || [];
  const submitFailedRuns =
    submitExecutionResult?.runs?.filter((r) => !r.passed) || [];

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

  const { setUser } = useContext(UserDataContext);

  // Submit problem to the user's solvedProblems list when submission verdict is accepted
  useEffect(() => {
    const submitProblem = async () => {
      const token = localStorage.getItem("token");

      if (
        submitExecutionResult?.verdict === "Accepted" &&
        problem?._id &&
        (user?._id || token)
      ) {
        try {
          const backendUrl =
            import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

          const response = await axios.post(
            `${backendUrl}/api/submit-problem`,
            {
              contestId,
              problemId: problem._id,
            },
            {
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            },
          );

          if (response.data?.user && setUser) {
            setUser(response.data.user);
          }
        } catch (error) {
          console.error("Error submitting problem:", error);
        }
      }
    };

    submitProblem();
  }, [contestId, submitExecutionResult, problem?._id, user?._id, setUser]);

  // Submit problem to the submission history list
  useEffect(() => {
    // console.log("Submit execution result changed:", submitExecutionResult);
    const submitProblem = async () => {
      const token = localStorage.getItem("token");

      if (
        submitExecutionResult?.verdict !== null &&
        problem?._id &&
        (user?._id || token)
      ) {
        try {
          const backendUrl =
            import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

          const response = await axios.post(
            `${backendUrl}/api/submissionHistory`,
            {
              contestId,
              problemId: problem._id,
              code: submitExecutionResult?.code || "",
              language: submitExecutionResult?.language || "",
              status: submitExecutionResult?.verdict || "",
              runtime: submitExecutionResult?.runtime || 0,
              memory: submitExecutionResult?.memory || 0,
            },
            {
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            },
          );

          setHistoryRefreshKey((currentKey) => currentKey + 1);
        } catch (error) {
          console.error("Error submitting problem:", error);
        }
      }
    };

    submitProblem();
  }, [contestId, submitExecutionResult, problem?._id, user?._id]);

  // get submission history by problem id
  useEffect(() => {
    const fetchSubmissionHistoryByProblemId = async () => {
      const token = localStorage.getItem("token");
      if (!problem?._id || !token) {
        setSubmissionHistory([]);
        setSubmissionHistoryError("");
        return;
      }

      if (problem?._id) {
        setSubmissionHistoryLoading(true);
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"}/api/submissionHistoryByProblemId`,
            { problemId: problem._id },
            {
              headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
            },
          );
          setSubmissionHistory(response.data?.submissions || []);
          setLastSubmission(response.data?.submissions?.[0] || null);
          setSubmissionHistoryError("");
        } catch (error) {
          console.error(
            "Error fetching submission history by problem ID:",
            error,
          );
          setSubmissionHistoryError("Unable to load submission history.");
        } finally {
          setSubmissionHistoryLoading(false);
        }
      }
    };

    fetchSubmissionHistoryByProblemId();
  }, [problem?._id, historyRefreshKey]);

  return (
    <div className="flex flex-col h-full bg-[#e8f3e8] dark:bg-[#111813]">
      {/* Top Tab Bar */}
      <div className="flex items-center gap-1 border-b border-[#b7d2bb] dark:border-[#405747] bg-[#dcecdf] dark:bg-[#24382b]/70 px-4 pt-2 shrink-0">
        {/* Description Tab  */}
        <button
          type="button"
          onClick={() => setActiveTab("description")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer border-b-2 -mb-px ${
            activeTab === "description"
              ? "border-[#3f7d55] text-[#183226] dark:text-[#edf4ef] bg-[#e8f3e8] dark:bg-[#111813] rounded-t-lg shadow-xs"
              : "border-transparent text-[#547060] dark:text-[#aabdaf] hover:text-[#183226] dark:hover:text-[#edf4ef] dark:text-[#edf4ef] hover:bg-[#e8f3e8] dark:hover:bg-[#1a241d] dark:bg-[#111813]/60 rounded-t-lg"
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-[#3f7d55] dark:text-[#86c79a]" />
          Description
        </button>

        {/* TestCase Tab  */}
        <button
          type="button"
          onClick={() => setActiveTab("testcases")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer border-b-2 -mb-px ${
            activeTab === "testcases"
              ? "border-[#3f7d55] text-[#183226] dark:text-[#edf4ef] bg-[#e8f3e8] dark:bg-[#111813] rounded-t-lg shadow-xs"
              : "border-transparent text-[#547060] dark:text-[#aabdaf] hover:text-[#183226] dark:hover:text-[#edf4ef] dark:text-[#edf4ef] hover:bg-[#e8f3e8] dark:hover:bg-[#1a241d] dark:bg-[#111813]/60 rounded-t-lg"
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5 text-[#3f7d55] dark:text-[#86c79a]" />
          Testcases
          {testCasesList.length > 0 && (
            <span className="text-[10px] bg-[#3f7d55]/15 text-[#2f6b45] dark:text-[#86c79a] px-2 py-0.5 rounded-full font-extrabold ml-0.5">
              {testCasesList.length}
            </span>
          )}
        </button>

        {/* Submissions Tab */}
        <button
          type="button"
          onClick={() => setActiveTab("submission")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer border-b-2 -mb-px ${
            activeTab === "submission"
              ? "border-[#3f7d55] text-[#183226] dark:text-[#edf4ef] bg-[#e8f3e8] dark:bg-[#111813] rounded-t-lg shadow-xs"
              : "border-transparent text-[#547060] dark:text-[#aabdaf] hover:text-[#183226] dark:hover:text-[#edf4ef] dark:text-[#edf4ef] hover:bg-[#e8f3e8] dark:hover:bg-[#1a241d] dark:bg-[#111813]/60 rounded-t-lg"
          }`}
        >
          <Send className="w-3.5 h-3.5 text-[#3f7d55] dark:text-[#86c79a]" />
          Submissions
          {submitFailedRuns.length > 0 && (
            <span className="text-[10px] bg-rose-500/20 text-rose-700 px-2 py-0.5 rounded-full font-extrabold ml-0.5">
              {submitFailedRuns.length} Failed
            </span>
          )}
        </button>

        {/* Submission History Tab */}
        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer border-b-2 -mb-px ${
            activeTab === "history"
              ? "border-[#3f7d55] text-[#183226] dark:text-[#edf4ef] bg-[#e8f3e8] dark:bg-[#111813] rounded-t-lg shadow-xs"
              : "border-transparent text-[#547060] dark:text-[#aabdaf] hover:text-[#183226] dark:hover:text-[#edf4ef] dark:text-[#edf4ef] hover:bg-[#e8f3e8] dark:hover:bg-[#1a241d] dark:bg-[#111813]/60 rounded-t-lg"
          }`}
        >
          <History className="w-3.5 h-3.5 text-[#3f7d55] dark:text-[#86c79a]" />
          History
          {submissionHistory.length > 0 && (
            <span className="text-[10px] bg-[#3f7d55]/15 text-[#2f6b45] dark:text-[#86c79a] px-2 py-0.5 rounded-full font-extrabold ml-0.5">
              {submissionHistory.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Tab Content Container */}
      <div className="p-5 lg:p-7 space-y-6 overflow-y-auto flex-1">
        {activeTab === "description" ? (
          // Description Content
          <>
            {/* Title Header */}
            <div className="space-y-2.5 border-b border-[#b7d2bb] dark:border-[#405747]/60 pb-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-[#183226] dark:text-[#edf4ef] tracking-tight">
                  {problem?.title}
                </h1>
                <span
                  className={`text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-md border ${
                    difficultyColor[problem?.difficulty] ||
                    "bg-[#dcecdf] dark:bg-[#24382b] text-[#244333] dark:text-[#edf4ef] border-[#b7d2bb] dark:border-[#405747]"
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
                      className="text-[11px] text-[#2f6b45] dark:text-[#86c79a] bg-[#f4faf1] dark:bg-[#172019] px-2.5 py-0.5 rounded-lg border border-[#b7d2bb] dark:border-[#405747] font-semibold"
                    >
                      {t}
                    </span>
                  ))}
              </div>

              {/* Interaction Stats */}
              <div className="flex items-center gap-4 text-xs font-semibold text-[#668170] dark:text-[#aabdaf] pt-1">
                <button
                  type="button"
                  className="flex items-center gap-1.5 hover:text-[#183226] dark:hover:text-[#edf4ef] dark:text-[#edf4ef] transition-colors cursor-pointer bg-[#f4faf1] dark:bg-[#172019] px-2.5 py-1 rounded-lg border border-[#b7d2bb] dark:border-[#405747]/60"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-[#3f7d55] dark:text-[#86c79a]" /> 14.2k
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 hover:text-[#183226] dark:hover:text-[#edf4ef] dark:text-[#edf4ef] transition-colors cursor-pointer bg-[#f4faf1] dark:bg-[#172019] px-2.5 py-1 rounded-lg border border-[#b7d2bb] dark:border-[#405747]/60"
                >
                  <ThumbsDown className="w-3.5 h-3.5 text-[#547060] dark:text-[#aabdaf]" /> 205
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 hover:text-[#183226] dark:hover:text-[#edf4ef] dark:text-[#edf4ef] transition-colors cursor-pointer bg-[#f4faf1] dark:bg-[#172019] px-2.5 py-1 rounded-lg border border-[#b7d2bb] dark:border-[#405747]/60"
                >
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />{" "}
                  Favorite
                </button>
              </div>
            </div>

            {/* Markdown / Body Prompt Text */}
            <div className="text-sm sm:text-base text-[#385a43] dark:text-[#aabdaf] leading-relaxed max-w-3xl font-medium whitespace-pre-line">
              {problem?.description}
            </div>

            {/* Examples and Constraints */}
            <div className="space-y-6">
              {/* Examples Box */}
              {problem?.examples && problem.examples.length > 0 && (
                <div>
                  <h3 className="text-sm font-extrabold text-[#183226] dark:text-[#edf4ef] mb-3 flex items-center gap-2">
                    <span>Examples</span>
                  </h3>
                  <div className="space-y-3">
                    {problem.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="bg-[#f4faf1] dark:bg-[#172019] border border-[#b7d2bb] dark:border-[#405747] p-4 rounded-xl space-y-3 shadow-xs"
                      >
                        <div className="space-y-3">
                          {/* Input */}
                          <div>
                            <div className="text-xs text-[#547060] dark:text-[#aabdaf] font-bold mb-1">
                              Input
                            </div>
                            <pre className="text-xs font-mono text-[#183226] dark:text-[#edf4ef] bg-[#e8f3e8] dark:bg-[#111813] p-2.5 rounded-lg border border-[#b7d2bb] dark:border-[#405747] overflow-auto whitespace-pre-wrap">
                              {renderFormatted(ex.input)}
                            </pre>
                          </div>

                          {/* Output */}
                          <div>
                            <div className="text-xs text-[#547060] dark:text-[#aabdaf] font-bold mb-1">
                              Output
                            </div>
                            <div className="text-sm font-bold text-emerald-800 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 inline-flex">
                              {renderFormatted(ex.output)}
                            </div>
                          </div>

                          {/* Explanation */}
                          {ex.explanation && (
                            <div>
                              <div className="text-xs text-[#547060] dark:text-[#aabdaf] font-bold mb-1">
                                Explanation
                              </div>
                              <div className="text-xs text-[#385a43] dark:text-[#aabdaf]">
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
                  <h3 className="text-sm font-extrabold text-[#183226] dark:text-[#edf4ef] mb-2">
                    Constraints
                  </h3>
                  <ul className="space-y-2">
                    {problem.constraints.map((c, i) => (
                      <li
                        key={i}
                        className="text-xs text-[#183226] dark:text-[#edf4ef] font-mono bg-[#f4faf1] dark:bg-[#172019] px-3 py-2 rounded-lg border border-[#b7d2bb] dark:border-[#405747]"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : activeTab === "testcases" ? (
          /* Testcases Tab View */
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-extrabold text-[#183226] dark:text-[#edf4ef]">
                Problem Test Cases
              </h2>
              <p className="text-xs text-[#547060] dark:text-[#aabdaf] mt-0.5">
                Preview sample inputs, expected outputs, and actual execution
                results.
              </p>
            </div>

            {runExecutionResult?.verdict && (
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold shadow-xs ${
                  runExecutionResult.verdict === "Accepted"
                    ? "bg-emerald-500/15 text-emerald-800 border-emerald-500/30"
                    : "bg-rose-500/15 text-rose-800 border-rose-500/30"
                }`}
              >
                <span className="text-xs font-extrabold uppercase">
                  Status:{" "}
                  {runExecutionResult.verdict}
                </span>
                <span className="text-[11px] font-semibold opacity-90">
                  {runExecutionResult.message}
                </span>
              </div>
            )}

            {testCasesList.length === 0 ? (
              <div className="p-8 text-center bg-[#f4faf1] dark:bg-[#172019] border border-[#b7d2bb] dark:border-[#405747] rounded-xl text-xs text-[#547060] dark:text-[#aabdaf]">
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
                          : "bg-[#f4faf1] dark:bg-[#172019] text-[#244333] dark:text-[#edf4ef] border-[#b7d2bb] dark:border-[#405747] hover:bg-[#e4f2e4] dark:bg-[#1a241d]"
                      }`}
                    >
                      Case {idx + 1}
                      {tc.isSample && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold ${
                            selectedCaseIdx === idx
                              ? "bg-white dark:bg-[#172019]/20 text-white"
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
                {testCasesList[selectedCaseIdx] &&
                  (() => {
                    const runResult = runExecutionResult?.runs?.find(
                      (r) => r.id === selectedCaseIdx + 1,
                    );

                    return (
                      <div className="bg-[#f4faf1] dark:bg-[#172019] border border-[#b7d2bb] dark:border-[#405747] p-5 rounded-xl space-y-4 shadow-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-extrabold text-[#183226] dark:text-[#edf4ef] uppercase tracking-wider">
                              Case {selectedCaseIdx + 1} Details
                            </h4>
                            {runResult && (
                              <span
                                className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                                  runResult.passed
                                    ? "bg-emerald-500/15 text-emerald-800 border-emerald-500/30"
                                    : "bg-rose-500/15 text-rose-800 border-rose-500/30"
                                }`}
                              >
                                {runResult.verdict}
                              </span>
                            )}
                          </div>
                          {testCasesList[selectedCaseIdx].isSample && (
                            <span className="text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-800 px-2 py-0.5 rounded border border-emerald-500/30">
                              Sample Test Case
                            </span>
                          )}
                        </div>

                        {/* Input */}
                        <div>
                          <div className="text-xs font-bold text-[#547060] dark:text-[#aabdaf] mb-1.5">
                            Input
                          </div>
                          <pre className="text-xs font-mono text-[#183226] dark:text-[#edf4ef] bg-[#e8f3e8] dark:bg-[#111813] p-3 rounded-lg border border-[#b7d2bb] dark:border-[#405747] overflow-auto whitespace-pre-wrap">
                            {renderFormatted(
                              testCasesList[selectedCaseIdx].input,
                            )}
                          </pre>
                        </div>

                        {/* Expected Output */}
                        <div>
                          <div className="text-xs font-bold text-[#547060] dark:text-[#aabdaf] mb-1.5">
                            Expected Output
                          </div>
                          <pre className="text-xs font-mono text-emerald-800 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/30 overflow-auto whitespace-pre-wrap">
                            {renderFormatted(
                              testCasesList[selectedCaseIdx].expectedOutput ||
                                testCasesList[selectedCaseIdx].output,
                            )}
                          </pre>
                        </div>

                        {/* Actual Output (Shown after running code) */}
                        {runResult && (
                          <div>
                            <div className="text-xs font-bold text-[#547060] dark:text-[#aabdaf] mb-1.5">
                              Actual Output
                            </div>
                            <pre
                              className={`text-xs font-mono p-3 rounded-lg border overflow-auto whitespace-pre-wrap ${
                                runResult.passed
                                  ? "text-emerald-800 bg-emerald-500/10 border-emerald-500/30"
                                  : "text-rose-800 bg-rose-500/10 border-rose-500/30"
                              }`}
                            >
                              {renderFormatted(
                                runResult.actualOutput || "No output",
                              )}
                            </pre>
                          </div>
                        )}

                        {/* Explanation if present */}
                        {testCasesList[selectedCaseIdx].explanation && (
                          <div>
                            <div className="text-xs font-bold text-[#547060] dark:text-[#aabdaf] mb-1">
                              Explanation
                            </div>
                            <div className="text-xs text-[#385a43] dark:text-[#aabdaf] bg-[#e8f3e8] dark:bg-[#111813]/60 p-2.5 rounded-lg border border-[#b7d2bb] dark:border-[#405747]/50">
                              {testCasesList[selectedCaseIdx].explanation}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
              </div>
            )}
          </div>
        ) : activeTab === "history" ? (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-extrabold text-[#183226] dark:text-[#edf4ef]">
                Submission History
              </h2>
              <p className="text-xs text-[#547060] dark:text-[#aabdaf] mt-0.5">
                Review your submissions for this problem.
              </p>
            </div>

            {submissionHistoryLoading ? (
              <div className="p-8 text-center bg-[#f4faf1] dark:bg-[#172019] border border-[#b7d2bb] dark:border-[#405747] rounded-xl text-xs text-[#547060] dark:text-[#aabdaf]">
                Loading submission history...
              </div>
            ) : submissionHistoryError ? (
              <div className="p-8 text-center bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-800">
                {submissionHistoryError}
              </div>
            ) : submissionHistory.length === 0 ? (
              <div className="p-8 text-center bg-[#f4faf1] dark:bg-[#172019] border border-[#b7d2bb] dark:border-[#405747] rounded-xl text-xs text-[#547060] dark:text-[#aabdaf]">
                No submissions for this problem yet.
              </div>
            ) : (
              <div className="overflow-x-auto bg-[#f4faf1] dark:bg-[#172019] border border-[#b7d2bb] dark:border-[#405747] rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#b7d2bb] dark:border-[#405747] text-[10px] uppercase tracking-wider text-[#547060] dark:text-[#aabdaf] font-bold bg-[#e8f3e8] dark:bg-[#111813]">
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Language</th>
                      <th className="py-3 px-4">Runtime</th>
                      <th className="py-3 px-4">Memory</th>
                      <th className="py-3 px-4">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#b7d2bb] text-xs font-medium text-[#244333] dark:text-[#edf4ef]">
                    {submissionHistory.map((submission) => {
                      const accepted = submission.status === "Accepted";
                      const submittedAt = new Date(submission.submissionDate);

                      return (
                        <tr
                          key={submission._id}
                          onClick={() =>
                            onSubmissionHistorySelect?.({
                              code: submission.code,
                              language: submission.language,
                            })
                          }
                          className="hover:bg-[#eef7eb] dark:bg-[#1a241d] cursor-pointer"
                          title="Open this submission in the editor"
                        >
                          <td
                            className={`py-3 px-4 font-bold ${
                              accepted ? "text-emerald-700" : "text-rose-700"
                            }`}
                          >
                            {submission?.status || "N/A"}
                          </td>
                          <td className="py-3 px-4 font-mono">
                            {submission.language}
                          </td>
                          <td className="py-3 px-4 font-mono text-[#547060] dark:text-[#aabdaf]">
                            {submission.runtime ?? "N/A"} ms
                          </td>
                          <td className="py-3 px-4 font-mono text-[#547060] dark:text-[#aabdaf]">
                            {submission.memory ?? "N/A"} KB
                          </td>
                          <td className="py-3 px-4 text-[#668170] dark:text-[#aabdaf]">
                            {Number.isNaN(submittedAt.getTime())
                              ? "Unknown"
                              : submittedAt.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* Submission Tab View */
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-extrabold text-[#183226] dark:text-[#edf4ef]">
                Latest Submission Results
              </h2>
              <p className="text-xs text-[#547060] dark:text-[#aabdaf] mt-0.5">
                Review failed test cases, wrong outputs, and compilation or
                execution errors.
              </p>
            </div>

            {lastSubmission && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f4faf1] dark:bg-[#172019] border border-[#b7d2bb] dark:border-[#405747] rounded-xl p-4">
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-[#547060] dark:text-[#aabdaf]">
                    Status
                  </div>
                  <div
                    className={`mt-1 text-sm font-extrabold ${
                      lastSubmission.status === "Accepted"
                        ? "text-emerald-700"
                        : "text-rose-700"
                    }`}
                  >
                    {String(lastSubmission.status || "N/A").replaceAll(
                      "-",
                      " ",
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-[#547060] dark:text-[#aabdaf]">
                    Language
                  </div>
                  <div className="mt-1 text-sm font-mono font-bold text-[#183226] dark:text-[#edf4ef]">
                    {lastSubmission.language || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-[#547060] dark:text-[#aabdaf]">
                    Runtime
                  </div>
                  <div className="mt-1 text-sm font-mono font-bold text-[#183226] dark:text-[#edf4ef]">
                    {lastSubmission.runtime ?? "N/A"} ms
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-[#547060] dark:text-[#aabdaf]">
                    Memory
                  </div>
                  <div className="mt-1 text-sm font-mono font-bold text-[#183226] dark:text-[#edf4ef]">
                    {lastSubmission.memory ?? "N/A"} KB
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-4 border-t border-[#b7d2bb] dark:border-[#405747] pt-3">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-[#547060] dark:text-[#aabdaf]">
                    Submitted
                  </div>
                  <div className="mt-1 text-xs text-[#385a43] dark:text-[#aabdaf]">
                    {lastSubmission.submissionDate
                      ? new Date(lastSubmission.submissionDate).toLocaleString()
                      : "Unknown"}
                  </div>
                </div>
              </div>
            )}

            {!submitExecutionResult?.verdict && !lastSubmission ? (
              <div className="p-8 text-center bg-[#f4faf1] dark:bg-[#172019] border border-[#b7d2bb] dark:border-[#405747] rounded-xl text-xs text-[#547060] dark:text-[#aabdaf]">
                No submission results available yet. Submit your code to view
                results here.
              </div>
            ) : submitFailedRuns.length === 0 && submitExecutionResult?.verdict === "Accepted" ? (
              <div className="p-6 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Accepted! All Test Cases Passed
                </div>
                <p className="text-xs opacity-90">
                  Great job! Your solution passed all{" "}
                  {submitExecutionResult?.runs?.length || 0} test cases without
                  any errors.
                </p>
              </div>
            ) : submitFailedRuns.length > 0 && submitExecutionResult?.verdict !== "Accepted" && (
              <div className="space-y-4">
                {/* Overall Status Banner */}
                <div className="p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold shadow-xs bg-rose-500/15 text-rose-800 border-rose-500/30">
                  <span className="flex items-center gap-1.5 text-xs font-extrabold uppercase">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Status: {submitExecutionResult?.verdict || "Wrong Answer"} ({submitFailedRuns.length} of{" "}
                    {submitExecutionResult.runs.length} test cases failed)
                  </span>
                  <span className="text-[11px] font-semibold opacity-90">
                    {submitExecutionResult.message}
                  </span>
                </div>

                {/* Failed Case Selector Tabs */}
                <div className="flex flex-wrap gap-2">
                  {submitFailedRuns.map((run, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedFailedIdx(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                        selectedFailedIdx === idx
                          ? "bg-rose-700 text-white border-rose-700 shadow-xs"
                          : "bg-rose-500/10 text-rose-800 border-rose-500/30 hover:bg-rose-500/20"
                      }`}
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      Failed Case {run.id}
                    </button>
                  ))}
                </div>

                {/* Selected Failed Case Detail Card */}
                {(submitFailedRuns[selectedFailedIdx] || submitFailedRuns[0]) &&
                  (() => {
                    const run =
                      submitFailedRuns[selectedFailedIdx] ||
                      submitFailedRuns[0];

                    return (
                      <div className="bg-rose-50/60 border border-rose-200 p-5 rounded-xl space-y-4 shadow-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-extrabold text-rose-900 uppercase tracking-wider">
                              Case {run.id} Failure Details
                            </h4>
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border bg-rose-500/15 text-rose-800 border-rose-500/30">
                              {run?.verdict || "Failed"}
                            </span>
                          </div>
                          {run.isSample && (
                            <span className="text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-800 px-2 py-0.5 rounded border border-amber-500/30">
                              Sample Case
                            </span>
                          )}
                        </div>

                        {/* Execution Error or Stderr output */}
                        {(run.error || run.stderr) && (
                          <div>
                            <div className="text-xs font-bold text-rose-800 mb-1.5 flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />{" "}
                              Error Log / Stderr
                            </div>
                            <pre className="text-xs font-mono text-rose-900 bg-rose-100/80 p-3 rounded-lg border border-rose-300 overflow-auto whitespace-pre-wrap">
                              {run.error || run.stderr}
                            </pre>
                          </div>
                        )}

                        {/* Input */}
                        <div>
                          <div className="text-xs font-bold text-[#547060] dark:text-[#aabdaf] mb-1.5">
                            Input
                          </div>
                          <pre className="text-xs font-mono text-[#183226] dark:text-[#edf4ef] bg-[#e8f3e8] dark:bg-[#111813] p-3 rounded-lg border border-[#b7d2bb] dark:border-[#405747] overflow-auto whitespace-pre-wrap">
                            {renderFormatted(run.input)}
                          </pre>
                        </div>

                        {/* Expected Output */}
                        <div>
                          <div className="text-xs font-bold text-[#547060] dark:text-[#aabdaf] mb-1.5">
                            Expected Output
                          </div>
                          <pre className="text-xs font-mono text-emerald-800 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/30 overflow-auto whitespace-pre-wrap">
                            {renderFormatted(run.expectedOutput)}
                          </pre>
                        </div>

                        {/* Actual Output */}
                        <div>
                          <div className="text-xs font-bold text-[#547060] dark:text-[#aabdaf] mb-1.5">
                            Actual Output
                          </div>
                          <pre className="text-xs font-mono text-rose-800 bg-rose-500/10 p-3 rounded-lg border border-rose-500/30 overflow-auto whitespace-pre-wrap">
                            {renderFormatted(run.actualOutput || "No output")}
                          </pre>
                        </div>
                      </div>
                    );
                  })()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
