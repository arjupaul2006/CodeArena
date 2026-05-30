import React from 'react';
import { CheckCircle2, Circle, SlidersHorizontal, Shuffle, ChevronLeft, ChevronRight } from 'lucide-react';

const problems = [
  { id: 1, title: 'Two Sum', status: 'solved', difficulty: 'Easy', diffColor: 'text-emerald-400 bg-emerald-500/10', accept: '49.2%', tags: ['Array', 'Hash Table'] },
  { id: 2, title: 'Add Two Numbers', status: 'unsolved', difficulty: 'Medium', diffColor: 'text-amber-400 bg-amber-500/10', accept: '39.8%', tags: ['Linked List', 'Math'] },
  { id: 4, title: 'Median of Two Sorted Arrays', status: 'solved', difficulty: 'Hard', diffColor: 'text-rose-400 bg-rose-500/10', accept: '35.1%', tags: ['Binary Search', 'Divid & Conquer'] },
  { id: 15, title: '3Sum', status: 'unsolved', difficulty: 'Medium', diffColor: 'text-amber-400 bg-amber-500/10', accept: '31.4%', tags: ['Two Pointers', 'Sorting'] },
  { id: 21, title: 'Merge Two Sorted Lists', status: 'unsolved', difficulty: 'Easy', diffColor: 'text-emerald-400 bg-emerald-500/10', accept: '61.5%', tags: ['Recursion'] },
  { id: 33, title: 'Search in Rotated Sorted Array', status: 'solved', difficulty: 'Medium', diffColor: 'text-amber-400 bg-amber-500/10', accept: '38.4%', tags: ['Binary Search'] },
];

export default function ProblemTable() {
  return (
    <div className="bg-[#0f1422] rounded-xl border border-gray-800 overflow-hidden shadow-xl">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-gray-800 flex flex-wrap gap-3 justify-between items-center bg-[#131929]">
        <span className="text-xs text-gray-400 font-medium">Showing 1 to 50 of 2,410 problems</span>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-xs text-gray-200 px-3 py-1.5 rounded-md transition-colors"><SlidersHorizontal className="h-3.5 w-3.5"/> Filters</button>
          <button className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-xs text-gray-200 px-3 py-1.5 rounded-md transition-colors"><Shuffle className="h-3.5 w-3.5"/> Pick Random</button>
        </div>
      </div>

      {/* Table Container for horizontal scrolling on tiny viewports */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-800 text-[11px] uppercase tracking-wider text-gray-500 bg-[#0f1422]">
              <th className="py-3 px-4 w-12 text-center">Status</th>
              <th className="py-3 px-4">Title</th>
              <th className="py-3 px-4 w-28">Difficulty</th>
              <th className="py-3 px-4 w-24">Acceptance</th>
              <th className="py-3 px-4 hidden lg:table-cell max-w-[200px]">Tags</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 text-sm">
            {problems.map((prob) => (
              <tr key={prob.id} className="hover:bg-gray-800/30 transition-colors group cursor-pointer">
                <td className="py-3.5 px-4 text-center">
                  {prob.status === 'solved' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-600 inline group-hover:text-gray-400 transition-colors" />
                  )}
                </td>
                <td className="py-3.5 px-4 font-medium text-gray-200 group-hover:text-blue-400 transition-colors">
                  <span className="text-gray-500 mr-1">{prob.id}.</span> {prob.title}
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 text-xs rounded font-medium ${prob.diffColor}`}>
                    {prob.difficulty}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-gray-400 font-mono">{prob.accept}</td>
                <td className="py-3.5 px-4 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1.5">
                    {prob.tags.map((tag, i) => (
                      <span key={i} className="bg-gray-800/60 text-gray-400 text-[11px] px-2 py-0.5 rounded border border-gray-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-800 flex justify-center sm:justify-end items-center bg-[#131929]">
        <div className="flex items-center gap-1">
          <button className="p-1 rounded bg-gray-800 text-gray-400 hover:text-white disabled:opacity-40" disabled><ChevronLeft className="h-4 w-4"/></button>
          <button className="w-7 h-7 rounded text-xs font-semibold bg-blue-600 text-white">1</button>
          <button className="w-7 h-7 rounded text-xs font-semibold text-gray-400 hover:bg-gray-800 hover:text-white">2</button>
          <button className="w-7 h-7 rounded text-xs font-semibold text-gray-400 hover:bg-gray-800 hover:text-white">3</button>
          <span className="text-gray-600 px-1 text-xs">...</span>
          <button className="w-7 h-7 rounded text-xs font-semibold text-gray-400 hover:bg-gray-800 hover:text-white">49</button>
          <button className="p-1 rounded bg-gray-800 text-gray-400 hover:text-white"><ChevronRight className="h-4 w-4"/></button>
        </div>
      </div>
    </div>
  );
}