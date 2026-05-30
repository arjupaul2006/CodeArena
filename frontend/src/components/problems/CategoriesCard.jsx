import React from 'react';
import { Database, Terminal, Cpu } from 'lucide-react'; // Simulating context or replace with layout standard icons

const cats = [
  { label: 'Algorithms', count: '1.4k' },
  { label: 'Database', count: '240' },
  { label: 'Shell', count: '42' },
  { label: 'Concurrency', count: '15' },
];

export default function CategoriesCard() {
  return (
    <div className="bg-[#0f1422] rounded-xl border border-gray-800 p-4">
      <h4 className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-3">Categories</h4>
      <div className="space-y-2">
        {cats.map((cat, idx) => (
          <div key={idx} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-800/30 cursor-pointer group transition-colors">
            <span className="text-sm text-gray-300 group-hover:text-blue-400 transition-colors">{cat.label}</span>
            <span className="text-xs font-mono font-semibold bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{cat.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}