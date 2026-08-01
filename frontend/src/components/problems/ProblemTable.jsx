import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowRight,
  Code2
} from 'lucide-react';


export default function ProblemTable() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch problems from backend API on component mount
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:4000/api/problems');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();

        if (data.problems && data.problems.length > 0) {
          setProblems(data.problems);
        }
      } catch (error) {
        console.warn('Backend unavailable, using fallback problem set:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  // Filter problems based on search and dropdown selections
  const filteredProblems = problems.filter((prob) => {
    const matchesSearch =
      prob.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prob.tags && prob.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (prob.problemNo && prob.problemNo.toString().includes(searchQuery)) ||
      (prob.id && prob.id.toString().includes(searchQuery));

    const matchesDiff =
      selectedDifficulty === 'All' ||
      (prob.difficulty && prob.difficulty.toLowerCase() === selectedDifficulty.toLowerCase());

    return matchesSearch && matchesDiff;
  });

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / itemsPerPage));
  const displayedProblems = filteredProblems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePickRandom = () => {
    if (problems.length === 0) return;
    const randomIndex = Math.floor(Math.random() * problems.length);
    const randomProb = problems[randomIndex];
    navigate(`/write-code?id=${randomProb._id || randomProb.slug || randomProb.problemNo || randomProb.id}`);
  };

  const getDifficultyBadge = (difficulty) => {
    const diff = (difficulty || '').toLowerCase();
    switch (diff) {
      case 'easy':
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
            Easy
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
            Medium
          </span>
        );
      case 'hard':
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]">
            Hard
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-800 text-gray-300 border border-gray-700">
            {difficulty || 'Unknown'}
          </span>
        );
    }
  };

  return (
    <div className="bg-[#1c0d12]/90 backdrop-blur-md rounded-2xl border border-rose-950/80 overflow-hidden shadow-2xl shadow-black/50">
      {/* Table Header Controls / Toolbar */}
      <div className="p-4 sm:p-5 border-b border-rose-950/80 bg-[#12080a] flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, tag, or #..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#12080a] text-slate-200 placeholder-slate-500 text-xs sm:text-sm pl-10 pr-4 py-2 rounded-xl border border-rose-950 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Difficulty Filter */}
          <div className="flex items-center bg-[#12080a] p-1 rounded-xl border border-rose-950 text-xs">
            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  setSelectedDifficulty(diff);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-150 cursor-pointer ${selectedDifficulty === diff
                    ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-950/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-rose-950/40'
                  }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Random Pick Button */}
          <button
            onClick={handlePickRandom}
            className="flex items-center gap-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg shadow-rose-950/30 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span>Random</span>
          </button>
        </div>
      </div>

      {/* Info Bar */}
      <div className="px-5 py-2.5 bg-[#12080a]/60 border-b border-rose-950/60 flex items-center justify-between text-xs text-slate-400">
        <span className="font-medium">
          Showing <span className="text-slate-200 font-semibold">{filteredProblems.length}</span> problems
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-rose-400 hover:text-rose-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-rose-950/80 text-[11px] uppercase tracking-wider text-slate-400 bg-[#12080a]">
              <th className="py-3.5 px-4 w-12 text-center font-semibold">Status</th>
              <th className="py-3.5 px-4 font-semibold">Title</th>
              <th className="py-3.5 px-4 w-32 font-semibold">Difficulty</th>
              <th className="py-3.5 px-4 hidden lg:table-cell font-semibold">Tags</th>
              <th className="py-3.5 px-4 w-16 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-950/60 text-sm">
            {loading ? (
              // Loading Skeleton
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-4 text-center"><div className="h-4 w-4 bg-rose-950/40 rounded-full mx-auto" /></td>
                  <td className="py-4 px-4"><div className="h-4 w-48 bg-rose-950/40 rounded" /></td>
                  <td className="py-4 px-4"><div className="h-5 w-16 bg-rose-950/40 rounded-full" /></td>
                  <td className="py-4 px-4 hidden lg:table-cell"><div className="h-4 w-32 bg-rose-950/40 rounded" /></td>
                  <td className="py-4 px-4 text-center"><div className="h-4 w-6 bg-rose-950/40 rounded mx-auto" /></td>
                </tr>
              ))
            ) : displayedProblems.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan="5" className="py-12 text-center text-slate-400">
                  No problems found matching your criteria.
                </td>
              </tr>
            ) : (
              displayedProblems.map((prob, index) => {
                const probId = prob.problemNo || prob.id || index + 1;

                return (
                  <tr
                    key={prob._id || index}
                    onClick={() => navigate(`/write-code?id=${prob._id || prob.slug || probId}`)}
                    className="hover:bg-rose-950/30 transition-all duration-150 group cursor-pointer border-l-2 border-l-transparent hover:border-l-rose-500"
                  >
                    {/* Status Icon */}
                    <td className="py-3.5 px-4 text-center">
                      {prob.status === 'solved' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 inline drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
                      ) : (
                        <Circle className="h-4 w-4 text-slate-600 inline group-hover:text-slate-400 transition-colors" />
                      )}
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-4 font-medium text-slate-200 group-hover:text-rose-400 transition-colors">
                      <span className="text-slate-500 font-mono text-xs mr-2">#{probId}</span>
                      <span className="font-semibold">{prob.title}</span>
                    </td>

                    {/* Difficulty Badge */}
                    <td className="py-3.5 px-4">
                      {getDifficultyBadge(prob.difficulty)}
                    </td>

                    {/* Tags */}
                    <td className="py-3.5 px-4 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1.5">
                        {prob.tags && prob.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="bg-[#12080a] hover:bg-rose-950/40 text-slate-300 text-[11px] font-medium px-2.5 py-0.5 rounded-full border border-rose-950 transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Action Arrow */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex justify-center items-center text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 sm:px-6 border-t border-rose-950/80 bg-[#12080a] flex flex-col sm:flex-row gap-3 justify-between items-center text-xs text-slate-400">
        <div>
          Page <span className="text-slate-200 font-semibold">{currentPage}</span> of{' '}
          <span className="text-slate-200 font-semibold">{totalPages}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-[#12080a] hover:bg-rose-950/50 text-slate-300 disabled:opacity-40 disabled:hover:bg-[#12080a] transition-colors cursor-pointer border border-rose-950"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page numbers */}
          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            if (
              totalPages > 7 &&
              pageNum !== 1 &&
              pageNum !== totalPages &&
              Math.abs(pageNum - currentPage) > 1
            ) {
              if (Math.abs(pageNum - currentPage) === 2) {
                return <span key={pageNum} className="px-1 text-slate-600">...</span>;
              }
              return null;
            }

            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer ${currentPage === pageNum
                    ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-950/40'
                    : 'text-slate-400 hover:bg-rose-950/50 hover:text-slate-200'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-[#12080a] hover:bg-rose-950/50 text-slate-300 disabled:opacity-40 disabled:hover:bg-[#12080a] transition-colors cursor-pointer border border-rose-950"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
