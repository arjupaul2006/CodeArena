const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { exec } = require("child_process");

const languages = {
  c: {
    filename: "main.c",
    image: "codearena-judge",
    command:
      "gcc /app/main.c -o /app/main && /usr/bin/time -v /app/main < /app/input.txt",
  },

  cpp: {
    filename: "main.cpp",
    image: "codearena-judge",
    command:
      "g++ /app/main.cpp -o /app/main && /usr/bin/time -v /app/main < /app/input.txt",
  },

  python: {
    filename: "main.py",
    image: "codearena-judge",
    command: "/usr/bin/time -v python3 /app/main.py < /app/input.txt",
  },

  javascript: {
    filename: "main.js",
    image: "codearena-judge",
    command: "/usr/bin/time -v node /app/main.js < /app/input.txt",
  },

  java: {
    filename: "Main.java",
    image: "codearena-judge",
    command:
      "javac /app/Main.java && /usr/bin/time -v java -cp /app Main < /app/input.txt",
  },
};

module.exports.executeCode = async (req, res) => {
  try {
    const { code, input, language, problem } = req.body;

    // if the language is not supported, return an error
    if (!languages[language]) {
      return res.status(400).json({
        success: false,
        error: "Unsupported language",
      });
    }

    const config = languages[language];
    const submissionId = uuidv4();
    const folderPath = path.join(__dirname, "..", "submissions", submissionId);

    fs.mkdirSync(folderPath, { recursive: true });
    fs.writeFileSync(path.join(folderPath, config.filename), code);
    fs.writeFileSync(path.join(folderPath, "input.txt"), input || "");

    const dockerFolderPath = folderPath.replace(/\\/g, "/");

    // docker command - formatted as single string with 256MB memory limit
    const dockerCommand = `docker run --rm -v "${dockerFolderPath}:/app" --memory=256m --cpus=1 --network none ${config.image} bash -c "${config.command}"`;

    const startTime = process.hrtime.bigint();

    // execute the docker command with 10 second timeout for C++ compilation + execution
    exec(dockerCommand, { timeout: 10000 }, (error, stdout, stderr) => {
      const endTime = process.hrtime.bigint();
      const executionTimeMs = Number(endTime - startTime) / 1e6;

      const rawStderr = stderr || "";

      // Extract memory usage from /usr/bin/time output
      const memoryMatch = rawStderr.match(
        /Maximum resident set size \(kbytes\):\s+(\d+)/,
      );
      const memoryKB = memoryMatch ? parseInt(memoryMatch[1]) : 0;

      // Clean stderr by removing /usr/bin/time statistics report
      let cleanStderr = rawStderr
        .replace(/Command being timed:[\s\S]*?Exit status:\s+\d+/g, "")
        .replace(/Command terminated by signal \d+/g, "")
        .trim();

      // Check if command was terminated by a Linux signal
      if (rawStderr.includes("Command terminated by signal 11")) {
        cleanStderr = "Runtime Error: Segmentation Fault (SIGSEGV - Signal 11). Out-of-bounds vector/array access or null pointer dereference.";
      } else if (rawStderr.includes("Command terminated by signal 6")) {
        cleanStderr = "Runtime Error: Program Aborted (SIGABRT - Signal 6). Unhandled exception or failed assertion.";
      } else if (rawStderr.includes("Command terminated by signal 8")) {
        cleanStderr = "Runtime Error: Floating Point Exception (SIGFPE - Signal 8). Division by zero.";
      }

      try {
        console.log("STDOUT:", stdout);
        console.log("STDERR:", rawStderr);
        if (error) console.log("ERROR:", error);

        if (error || cleanStderr.startsWith("Runtime Error:")) {
          // If timeout occurred
          if (error?.killed || error?.signal === "SIGTERM") {
            return res.json({
              success: false,
              error: "Time Limit Exceeded (Execution timed out)",
              stderr: "Execution timed out after 10 seconds.",
            });
          }

          // Return compiler / runtime error output
          return res.json({
            success: false,
            error: cleanStderr || error?.message || "Execution Error",
            stderr: cleanStderr,
          });
        }

        res.json({
          success: true,
          output: stdout,
          stderr: cleanStderr,
          runtime: `${executionTimeMs.toFixed(2)} ms`,
          memory: `${memoryKB} KB`,
        });
      } finally {
        try {
          if (fs.existsSync(folderPath)) {
            fs.rmSync(folderPath, {
              recursive: true,
              force: true,
            });
          }
        } catch (err) {
          console.error("Cleanup failed:", err.message);
        }
      }
    });
  } catch (err) {
    console.error("Execution Engine Error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
};

