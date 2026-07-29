const express = require("express");
const Problem = require("../model/problems");

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
