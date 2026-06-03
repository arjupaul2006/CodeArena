import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { RotateCcw, Maximize2 } from "lucide-react";
import ExecutionTerminal from "./ExecutionTerminal";
import axios from "axios";

export default function CodeEditorPanel() {
  const languageOptions = [
    {
      label: "Python 3",
      value: "python",
      codeLines: "# Write your code here\nprint('Hello, World!')",
    },
    {
      label: "JavaScript",
      value: "javascript",
      codeLines: "// Write your code here\nconsole.log('Hello, World!');",
    },
    {
      label: "Java",
      value: "java",
      codeLines:
        '// Write your code here\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    },
    {
      label: "C++",
      value: "cpp",
      codeLines:
        '// Write your code here\n#include <iostream>\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
    },
    {
      label: "Go",
      value: "go",
      codeLines:
        '// Write your code here\npackage main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
    },
    {
      label: "Ruby",
      value: "ruby",
      codeLines: "# Write your code here\nputs 'Hello, World!'",
    },
    {
      label: "C#",
      value: "csharp",
      codeLines:
        '// Write your code here\nusing System;\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}',
    },
    {
      label: "PHP",
      value: "php",
      codeLines: "<?php\necho 'Hello, World!';\n?>",
    },
    {
      label: "Swift",
      value: "swift",
      codeLines: '// Write your code here\nprint("Hello, World!")',
    },
    {
      label: "Kotlin",
      value: "kotlin",
      codeLines:
        '// Write your code here\nfun main() {\n    println("Hello, World!")\n}',
    },
  ];

  // Inputs
  const input = "5";

  const [code, setCode] = useState(languageOptions[0].codeLines);

  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [isTerminalOpen, setIsTerminalOpen] = useState(true);

  // Function to handle code execution
  const handleCodeExecution = async () => {
    console.log("Executed code:", code)

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/execute`,
        {
          code,
          input,
        },
      );

      console.log("Execution response:", data);
    } catch (error) {
      console.error("Error during code execution:", error);
    }
  };

  return (
    <div className="relative flex flex-col h-full min-h-0 overflow-hidden">
      {/* Editor Controls Bar */}
      <div className="h-11 border-b border-gray-800/80 bg-[#131929]/60 px-4 flex items-center justify-between shrink-0">
        {/* Select Language */}
        <select
          className="bg-gray-800/80 hover:bg-gray-800 text-xs font-bold px-2.5 py-1 rounded-md text-blue-400 border border-gray-700/60 flex items-center gap-1 transition-colors focus:outline-none focus:ring-0 focus:ring-offset-gray-800"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* buttons */}
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 text-xs font-semibold rounded-md bg-emerald-600/90 hover:bg-emerald-500 text-white transition-colors"
            onClick={handleCodeExecution}
          >
            Run
          </button>

          <button className="px-3 py-1 text-xs font-semibold rounded-md bg-blue-600/90 hover:bg-blue-500 text-white transition-colors">
            Submit
          </button>
          <button className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-800/80 transition-colors">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-gray-800/80 transition-colors">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Core Editor */}
      <div className="flex-1 min-h-0 relative">
        <Editor
          height="90%"
          language={selectedLanguage}
          value={code}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            fontFamily: "Fira Code, monospace",
            automaticLayout: true,
          }}
          onChange={(value) => setCode(value)}
        />
      </div>

      {/* Terminal Sheet Execution Trays Container */}
      <ExecutionTerminal
        isOpen={isTerminalOpen}
        onToggle={() => setIsTerminalOpen((current) => !current)}
      />
    </div>
  );
}
