const express = require("express");
const router = express.Router();
const codeExecutionController = require("../controllers/codeExecutionController");

// Route to handle code execution
router.post("/execute", codeExecutionController.executeCode);

module.exports = router;
