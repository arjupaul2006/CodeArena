const mongoose = require("mongoose");

const contextTestCaseSchema = new mongoose.Schema(
  {
    problemNo: {
      type: String,
      required: true,
    },

    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ContestProblem",
      required: true,
    },

    test_cases: [
      {
        input: {
          type: String,
          required: true,
        },

        expectedOutput: {
          type: String,
          required: true,
        },

        isSample: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: "contest_test_cases",
  }
);

const ContestTestCase = mongoose.model("ContestTestCase", contextTestCaseSchema);

module.exports = ContestTestCase;