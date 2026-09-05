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
    <div className="bg-[#f4faf1] rounded-xl border border-[#b7d2bb] p-4 shadow-lg">
      <h4 className="text-xs uppercase font-bold tracking-wider text-[#668170] mb-3">Categories</h4>
      <div className="space-y-2">
        {cats.map((cat, idx) => (
          <div key={idx} className="flex justify-between items-center p-2 rounded-lg hover:bg-[#e8f3e8] cursor-pointer group transition-colors">
            <span className="text-sm text-[#244333] group-hover:text-[#3f7d55] font-medium transition-colors">{cat.label}</span>
            <span className="text-xs font-mono font-semibold bg-[#dcecdf] text-[#2f6b45] px-2 py-0.5 rounded border border-[#b7d2bb]">{cat.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}