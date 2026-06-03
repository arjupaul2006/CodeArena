import React from "react";
import WorkspaceHeader from "../components/writecode/WorkspaceHeader";
import ProblemDescription from "../components/writecode/ProblemDescription";
import CodeEditorPanel from "../components/writecode/CodeEditorPanel";
import TopNav from "../components/problems/TopNav";

export default function WriteCode() {
  return (
    <div className="flex flex-col h-screen bg-[#0b0f19] text-gray-300 font-sans antialiased overflow-hidden">
      {/* Top Application Header */}
      <TopNav />

      {/* Main Split Panels */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 min-h-0 overflow-hidden">
        {/* Left Panel */}
        <div className="h-full overflow-y-auto border-r border-gray-800/80 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <ProblemDescription />
        </div>

        {/* Right Panel */}
        <div className="relative h-full overflow-hidden bg-[#0f1422]">
          <CodeEditorPanel />
        </div>
      </div>
    </div>
  );
}