import React, { useState } from "react";
import { Check, Code2, Copy, X } from "lucide-react";

export default function ProblemQuickViewModal({ problem, onClose, onSolve }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  if (!problem) return null;

  const handleCopyExample = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-3xl border border-[#b7d2bb] bg-[#f4faf1] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#b7d2bb] bg-[#eef7eb] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3f7d55] text-white font-black text-sm">
              {problem.letter}
            </span>
            <div>
              <h2 className="text-lg font-bold text-[#183226]">
                {problem.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-[#668170]">
                <span
                  className={`font-semibold ${
                    problem.difficulty === "Easy"
                      ? "text-emerald-700"
                      : problem.difficulty === "Medium"
                      ? "text-amber-700"
                      : "text-rose-700"
                  }`}
                >
                  {problem.difficulty}
                </span>
                <span>•</span>
                <span>{problem.points} Points</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-[#668170] hover:bg-[#c5dfc9] hover:text-[#183226] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#547060] mb-2">
              Problem Description
            </h4>
            <p className="text-sm leading-relaxed text-[#244333] whitespace-pre-line">
              {problem.description}
            </p>
          </div>

          {/* Constraints */}
          {problem.constraints?.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#547060] mb-2">
                Constraints
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-[#244333] font-mono bg-[#eef7eb] p-3 rounded-xl border border-[#b7d2bb]">
                {problem.constraints.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Examples */}
          {problem.examples?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#547060]">
                Example Test Cases
              </h4>
              {problem.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[#b7d2bb] bg-[#eef7eb] p-4 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#3f7d55]">Example {idx + 1}</span>
                    <button
                      onClick={() =>
                        handleCopyExample(
                          `Input:\n${ex.input}\n\nOutput:\n${ex.output}`,
                          idx
                        )
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#668170] hover:text-[#183226]"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" /> Copy
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-1.5 font-mono">
                    <div>
                      <span className="text-[#668170]">Input:</span>
                      <pre className="mt-1 rounded-lg bg-white p-2.5 text-[#183226] border border-[#b7d2bb]">
                        {ex.input}
                      </pre>
                    </div>
                    <div>
                      <span className="text-[#668170]">Output:</span>
                      <pre className="mt-1 rounded-lg bg-white p-2.5 text-[#183226] border border-[#b7d2bb]">
                        {ex.output}
                      </pre>
                    </div>
                    {ex.explanation && (
                      <div className="pt-1 text-[#547060] font-sans">
                        <strong>Explanation:</strong> {ex.explanation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[#b7d2bb] bg-[#eef7eb] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-[#b7d2bb] px-4 py-2 text-xs font-bold text-[#547060] hover:bg-[#c5dfc9] hover:text-[#183226]"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onSolve(problem);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#3f7d55] px-5 py-2 text-xs font-bold text-white shadow-md shadow-[#8eae94]/30 hover:bg-[#326844]"
          >
            <Code2 className="h-4 w-4" />
            Solve in Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
