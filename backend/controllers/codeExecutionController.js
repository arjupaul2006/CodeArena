const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { exec } = require("child_process");

module.exports.executeCode = async (req, res) => {
  try {
    const { code, input } = req.body;

    const submissionId = uuidv4();

    const folderPath = path.join(__dirname, "..", "submissions", submissionId);

    fs.mkdirSync(folderPath, { recursive: true });

    fs.writeFileSync(path.join(folderPath, "main.c"), code);

    fs.writeFileSync(path.join(folderPath, "input.txt"), input || "");

    const dockerFolderPath = folderPath.replace(/\\/g, "/");

    const dockerCommand = `docker run --rm \
-v "${dockerFolderPath}:/app" \
--memory=128m \
--cpus=1 \
--network none \
gcc:13 \
bash -c "gcc /app/main.c -o /app/main && /app/main < /app/input.txt"`;

    exec(dockerCommand, { timeout: 5000 }, (error, stdout, stderr) => {
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
      });
    });
  } catch (err) {
    console.error("Execution Engine Error:", err);
    res.status(500).json({
      error: err.message,
    });
  }
};
