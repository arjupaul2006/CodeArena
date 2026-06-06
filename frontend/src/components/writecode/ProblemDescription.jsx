import React from "react";
import { ThumbsUp, ThumbsDown, Star } from "lucide-react";

export default function ProblemDescription({ problem }) {
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

  const formatInput = (input) => {
    return Object.entries(input)
      .map(([key, value]) => `${key} = ${formatValue(value)}`)
      .join(", ");
  };

  return (
    <div className="p-5 lg:p-7 space-y-5 overflow-y-auto">
      {/* Title Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
            {problem.title}
          </h1>
          <span className="text-[10px] uppercase font-extrabold tracking-wider bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded border border-rose-500/20">
            {problem.difficulty}
          </span>
        </div>
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {problem.tags &&
            problem.tags.map((t, i) => (
              <span
                key={i}
                className="text-[11px] text-gray-300 bg-gray-800/30 px-2 py-0.5 rounded border border-gray-700"
              >
                {t}
              </span>
            ))}
        </div>

        {/* Interaction Stats */}
        <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
          <button className="flex items-center gap-1 hover:text-gray-300 transition-colors">
            <ThumbsUp className="w-3.5 h-3.5" /> 14.2k
          </button>
          <button className="flex items-center gap-1 hover:text-gray-300 transition-colors">
            <ThumbsDown className="w-3.5 h-3.5" /> 205
          </button>
          <button className="flex items-center gap-1 hover:text-gray-300 transition-colors">
            <Star className="w-3.5 h-3.5" /> Favorite
          </button>
        </div>
      </div>

      {/* Markdown / Body Prompt Text */}
      <div className="text-lg text-gray-300 leading-relaxed max-w-2xl font-medium whitespace-pre-line">
        {problem.description}
      </div>

      {/* Examples then Constraints */}
      <div className="space-y-6">
        {/* Examples Box */}
        <div>
          <h3 className="text-sm font-semibold text-gray-200 mb-2">Examples</h3>
          <div className="space-y-3">
            {problem.examples.map((ex, idx) => (
              <div
                key={idx}
                className="bg-[#0b1220] border border-gray-800/60 p-3 rounded-lg"
              >
                <div className="space-y-3">
                  {/* Input */}
                  <div>
                    <div className="text-xs text-gray-300 font-semibold mb-1">
                      Input
                    </div>
                    <pre className="text-xs font-mono text-gray-200 bg-gray-900/30 p-2 rounded overflow-auto">
                      {formatInput(ex.input)}
                    </pre>
                  </div>

                  {/* Output */}
                  <div>
                    <div className="text-xs text-gray-300 font-semibold mb-1">
                      Output
                    </div>
                    <div className="text-sm font-medium text-emerald-300 font-mono bg-gray-900/20 px-2 py-1.5 rounded border border-gray-800/50 inline-flex">
                      {formatValue(ex.output)}
                    </div>
                  </div>

                  {/* Explanation */}
                  {ex.explanation && (
                    <div>
                      <div className="text-xs text-gray-300 font-semibold mb-1">
                        Explanation
                      </div>
                      <div className="text-xs text-gray-400">
                        {ex.explanation}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Constraints */}
        <div>
          <h3 className="text-sm font-semibold text-gray-200 mb-2">
            Constraints
          </h3>
          <ul className="space-y-2">
            {problem.constraints.map((c, i) => (
              <li
                key={i}
                className="text-xs text-gray-300 bg-gray-800/30 px-3 py-2 rounded border border-gray-700"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Embedded Visual Prompt Asset */}
    </div>
  );
}
