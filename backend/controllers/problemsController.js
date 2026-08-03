const express = require("express");
const Problem = require("../model/problems");
const TestCase = require("../model/test_cases");

module.exports.getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find();

    res.status(200).json({
      success: true,
      problems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.getProblemById = async (req, res) => {
  try {
    const problemId = req.params.id;
    const problem = await Problem.findById(problemId);
    console.log("Fetching problem:", problem.functionSignature.parameters);

     // Fetch test cases using problemNo
    const testCaseData = await TestCase.findOne({
      problemNo: problem.problemNo,
    });

    res.status(200).json({
      success: true,
      problem,
      testCases: testCaseData ? testCaseData.test_cases : [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
        message: error.message,
    });
  }
}

