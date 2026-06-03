import React, { useMemo, useState } from "react";
import { ChevronUp, Terminal, CheckCircle, Play } from "lucide-react";

export default function ExecutionTerminal({ isOpen, onToggle }) {
  const [activeTab, setActiveTab] = useState("testcase");

  const testCases = useMemo(
    () => [
      {
        id: 1,
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
      },
      {
        id: 2,
        input: "nums = [3, 2, 4], target = 6",
        output: "[1, 2]",
      },
      {
        id: 3,
        input: "nums = [3, 3], target = 6",
        output: "[0, 1]",
      },
    ],
    [],
  );

  return (
    <div
      className={`absolute inset-x-0 bottom-0 z-20 border-t border-gray-800/80 bg-[#0f1422] shadow-[0_-20px_40px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out ${
        isOpen ? "translate-y-0" : "translate-y-[calc(100%-3.25rem)]"
      }`}
    >
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
          <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 mb-3">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Runtime: 12ms
          </div>

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
          </div>
        </div>

        {activeTab === "testcase" ? (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <CheckCircle className="w-4 h-4 fill-emerald-500/10" />
              <span>Accepted</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {testCases.map((caseData) => (
                <div
                  key={caseData.id}
                  className="p-3 bg-[#131929]/55 border border-gray-800/70 rounded-xl space-y-2 font-mono text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-bold block">
                      Case {caseData.id}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-gray-500">
                      Auto
                    </span>
                  </div>
                  <div className="space-y-1.5 text-[11px]">
                    <div>
                      <span className="text-gray-500">Input:</span>{" "}
                      <span className="text-gray-200 font-semibold">
                        {caseData.input}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Output:</span>{" "}
                      <span className="text-emerald-400 font-semibold">
                        {caseData.output}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            <div className="text-xs text-gray-400 font-medium">
              Results will appear here after running the code.
            </div>
            <div className="p-3 rounded-xl border border-dashed border-gray-700 bg-[#131929]/30 text-xs text-gray-500">
              No output yet.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
