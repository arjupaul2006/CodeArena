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
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-500/30">
            Easy
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/15 text-amber-800 border border-amber-500/30">
            Medium
          </span>
        );
      case 'hard':
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-500/15 text-rose-800 border border-rose-500/30">
            Hard
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-[#dcecdf] text-[#244333] border border-[#b7d2bb]">
            {difficulty || 'Unknown'}
          </span>
        );
    }
  };

  return (
    <div className="bg-[#f4faf1] backdrop-blur-md rounded-2xl border border-[#b7d2bb] overflow-hidden shadow-xl">
      {/* Table Header Controls / Toolbar */}
      <div className="p-4 sm:p-5 border-b border-[#b7d2bb] bg-[#eef7eb] flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#668170]" />
          <input
            type="text"
            placeholder="Search by title, tag, or #..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#ffffff] text-[#183226] placeholder-[#7da188] text-xs sm:text-sm pl-10 pr-4 py-2 rounded-xl border border-[#b7d2bb] focus:outline-none focus:border-[#3f7d55] focus:ring-1 focus:ring-[#3f7d55] transition-all"
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Difficulty Filter */}
          <div className="flex items-center bg-[#ffffff] p-1 rounded-xl border border-[#b7d2bb] text-xs">
            {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
              <button
                key={diff}
                onClick={() => {
                  setSelectedDifficulty(diff);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all duration-150 cursor-pointer ${selectedDifficulty === diff
                    ? 'bg-[#3f7d55] text-white font-bold shadow-md shadow-[#8eae94]/40'
                    : 'text-[#547060] hover:text-[#183226] hover:bg-[#e8f3e8]'
                  }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Random Pick Button */}
          <button
            onClick={handlePickRandom}
            className="flex items-center gap-1.5 bg-[#3f7d55] hover:bg-[#326844] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-[#8eae94]/30 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <Shuffle className="h-3.5 w-3.5" />
            <span>Random</span>
          </button>
        </div>
      </div>

      {/* Info Bar */}
      <div className="px-5 py-2.5 bg-[#e8f3e8] border-b border-[#b7d2bb] flex items-center justify-between text-xs text-[#547060]">
        <span className="font-medium">
          Showing <span className="text-[#183226] font-semibold">{filteredProblems.length}</span> problems
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-[#2f6b45] hover:text-[#183226] text-xs font-semibold transition-colors cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#b7d2bb] text-[11px] uppercase tracking-wider text-[#547060] bg-[#e8f3e8]">
              <th className="py-3.5 px-4 w-12 text-center font-bold">Status</th>
              <th className="py-3.5 px-4 font-bold">Title</th>
              <th className="py-3.5 px-4 w-32 font-bold">Difficulty</th>
              <th className="py-3.5 px-4 hidden lg:table-cell font-bold">Tags</th>
              <th className="py-3.5 px-4 w-16 text-center font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#b7d2bb] text-sm">
            {loading ? (
              // Loading Skeleton
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-4 text-center"><div className="h-4 w-4 bg-[#c5dfc9] rounded-full mx-auto" /></td>
                  <td className="py-4 px-4"><div className="h-4 w-48 bg-[#c5dfc9] rounded" /></td>
                  <td className="py-4 px-4"><div className="h-5 w-16 bg-[#c5dfc9] rounded-full" /></td>
                  <td className="py-4 px-4 hidden lg:table-cell"><div className="h-4 w-32 bg-[#c5dfc9] rounded" /></td>
                  <td className="py-4 px-4 text-center"><div className="h-4 w-6 bg-[#c5dfc9] rounded mx-auto" /></td>
                </tr>
              ))
            ) : displayedProblems.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan="5" className="py-12 text-center text-[#547060]">
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
                    className="hover:bg-[#eef7eb] transition-all duration-150 group cursor-pointer border-l-2 border-l-transparent hover:border-l-[#3f7d55]"
                  >
                    {/* Status Icon */}
                    <td className="py-3.5 px-4 text-center">
                      {prob.status === 'solved' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 inline" />
                      ) : (
                        <Circle className="h-4 w-4 text-[#8eae94] inline group-hover:text-[#3f7d55] transition-colors" />
                      )}
                    </td>

                    {/* Title */}
                    <td className="py-3.5 px-4 font-medium text-[#183226] group-hover:text-[#2f6b45] transition-colors">
                      <span className="text-[#668170] font-mono text-xs mr-2">#{probId}</span>
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
                            className="bg-[#e8f3e8] hover:bg-[#dcecdf] text-[#2f6b45] text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-[#b7d2bb] transition-colors"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Action Arrow */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex justify-center items-center text-[#668170] group-hover:text-[#3f7d55] group-hover:translate-x-1 transition-all">
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
      <div className="p-4 sm:px-6 border-t border-[#b7d2bb] bg-[#eef7eb] flex flex-col sm:flex-row gap-3 justify-between items-center text-xs text-[#547060]">
        <div>
          Page <span className="text-[#183226] font-semibold">{currentPage}</span> of{' '}
          <span className="text-[#183226] font-semibold">{totalPages}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-[#ffffff] hover:bg-[#dcecdf] text-[#244333] disabled:opacity-40 disabled:hover:bg-[#ffffff] transition-colors cursor-pointer border border-[#b7d2bb]"
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
                return <span key={pageNum} className="px-1 text-[#668170]">...</span>;
              }
              return null;
            }

            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer ${currentPage === pageNum
                    ? 'bg-[#3f7d55] text-white font-bold shadow-md shadow-[#8eae94]/40'
                    : 'text-[#547060] hover:bg-[#dcecdf] hover:text-[#183226]'
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-[#ffffff] hover:bg-[#dcecdf] text-[#244333] disabled:opacity-40 disabled:hover:bg-[#ffffff] transition-colors cursor-pointer border border-[#b7d2bb]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
