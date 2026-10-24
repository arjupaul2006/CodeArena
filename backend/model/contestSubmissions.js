
const mongoose = require("mongoose");

const contestSubmissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contest",
    required: true
  },

  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true
  },

  language: {
    type: String,
    required: true
  },

  code: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: [
      "Pending",
      "Running",
      "Accepted",
      "Wrong Answer",
      "Compilation Error",
      "Runtime Error",
      "Time Limit Exceeded"
    ],
    default: "Pending"
  },

  passedTestCases: {
    type: Number,
    default: 0
  },

  totalTestCases: {
    type: Number,
    default: 0
  },

  executionTime: Number,
  memoryUsed: Number,

  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const contestSubmissionModel = mongoose.model("ContestSubmission", contestSubmissionSchema);

module.exports = contestSubmissionModel;
