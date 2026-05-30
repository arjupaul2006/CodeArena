import React from 'react';
import { Terminal, Play, CheckCircle } from 'lucide-react';

export default function ExecutionTerminal() {
  return (
    <div className="border-t border-gray-800/80 bg-[#0f1422] shrink-0">
      {/* Sheet Segment Title Tabs */}
      <div className="h-10 px-4 border-b border-gray-800/60 bg-[#131929]/30 flex items-center gap-4 text-xs font-bold text-gray-400">
        <button className="text-white border-b-2 border-blue-500 h-full px-1">Test Results</button>
        <button className="hover:text-white transition-colors h-full px-1">Submissions</button>
      </div>

      {/* Active Output State Container */}
      <div className="p-4 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
          <CheckCircle className="w-4 h-4 fill-emerald-500/10" />
          <span>Accepted</span>
          <span className="text-gray-500 font-medium font-mono ml-2">Runtime: 12ms</span>
        </div>

        {/* Dynamic Multi-Case Test Matrix Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { id: 1, input: '[0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' },
            { id: 2, input: '[4,2,0,3,2,5]', output: '9' }
          ].map((caseData) => (
            <div key={caseData.id} className="p-3 bg-[#131929]/50 border border-gray-800/60 rounded-lg space-y-1.5 font-mono text-xs">
              <span className="text-gray-400 font-bold block">Case {caseData.id}</span>
              <div className="space-y-0.5">
                <div className="text-[11px]"><span className="text-gray-500">Input:</span> <span className="text-gray-300 font-semibold">{caseData.input}</span></div>
                <div className="text-[11px]"><span className="text-gray-500">Output:</span> <span className="text-emerald-400 font-semibold">{caseData.output}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Operational Footer Actions */}
      <div className="p-3 bg-[#131929]/60 border-t border-gray-800/60 flex items-center justify-between">
        <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white font-bold px-3 py-1.5 rounded hover:bg-gray-800/50 transition-colors">
          <Terminal className="w-3.5 h-3.5" /> Console
        </button>
        <div className="flex items-center gap-2">
          <button className="bg-gray-800/80 hover:bg-gray-700 text-xs font-bold text-gray-200 px-4 py-2 rounded-lg transition-colors">
            Run Code
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white px-4 py-2 rounded-lg shadow-md shadow-blue-900/20 transition-all">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}