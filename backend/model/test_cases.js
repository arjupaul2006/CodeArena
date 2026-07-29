const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema(
  {
    problemNo: {
      type: String,
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
    collection: "test_cases",
  }
);

const TestCase = mongoose.model("TestCase", testCaseSchema);

module.exports = TestCase;