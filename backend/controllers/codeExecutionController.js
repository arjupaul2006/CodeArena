const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { exec } = require("child_process");
const wrapperCpp = require("../wrappers/CppWrapper");
const wrapperJS = require("../wrappers/JSWrapper");
const wrapperPython = require("../wrappers/PyWrapper");
const wrapperJava = require("../wrappers/JavaWrapper");

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

    // code after wrapping
    let finalCode;
    switch (language) {
      case "cpp":
        finalCode = wrapperCpp(code, problem);
        break;
      case "javascript":
        finalCode = wrapperJS(code, problem);
        break;
      case "python":
        finalCode = wrapperPython(code, problem);
        break;
      case "java":
        finalCode = wrapperJava(code, problem);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: "Unsupported language",
        });
    }

    console.log("Final code after wrapping:", finalCode);

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

    fs.writeFileSync(path.join(folderPath, config.filename), finalCode);

    fs.writeFileSync(path.join(folderPath, "input.txt"), input || "");

    const dockerFolderPath = folderPath.replace(/\\/g, "/");

    // docker command
    const dockerCommand = `docker run --rm \
-v "${dockerFolderPath}:/app" \
--memory=128m \
--cpus=1 \
--network none \
${config.image} \
bash -c "${config.command}"`;

    const startTime = process.hrtime.bigint();

    // execute the docker command
    exec(dockerCommand, { timeout: 5000 }, (error, stdout, stderr) => {
      const endTime = process.hrtime.bigint();
      const executionTimeMs = Number(endTime - startTime) / 1e6;

      const memoryMatch = stderr.match(
        /Maximum resident set size \(kbytes\):\s+(\d+)/,
      );

      const memoryKB = memoryMatch ? parseInt(memoryMatch[1]) : 0;

      try {
        console.log("STDOUT:", stdout);
        console.log("STDERR:", stderr);
        console.log("ERROR:", error);

        if (error) {
          return res.json({
            success: false,
            error: error.message,
            stderr,
          });
        }

        res.json({
          success: true,
          output: stdout,
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
