import React from 'react';
import WorkspaceHeader from '../components/writecode/WorkspaceHeader';
import ProblemDescription from '../components/writecode/ProblemDescription';
import CodeEditorPanel from '../components/writecode/CodeEditorPanel';
import TopNav from '../components/problems/TopNav';

export default function WriteCode() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0b0f19] text-gray-300 font-sans antialiased">
      {/* Top Application Header */}
      <TopNav />

      {/* Main Split Panels */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 overflow-hidden h-[calc(100vh-4rem)]">
        
        {/* Left Side: Description Panel */}
        <div className="overflow-y-auto border-r border-gray-800/80 scrollbar-thin scrollbar-thumb-gray-800">
          <ProblemDescription />
        </div>

        {/* Right Side: Code Editor & Terminal Panel */}
        <div className="flex-1 min-h-0 bg-[#0f1422] flex flex-col overflow-hidden">
          <CodeEditorPanel />
        </div>
        
      </div>
    </div>
  );
}