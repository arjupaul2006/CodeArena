const mongoose = require("mongoose");

// Example Schema (Displayed to users)
const exampleSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
      trim: true,
    },

    output: {
      type: String,
      required: true,
      trim: true,
    },

    explanation: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false }
);

// each problem scheme
const contestProblemSchema = new mongoose.Schema(
  {
    contextId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Contest",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    constraints: {
      type: [String],
      default: [],
    },

    // Display examples
    examples: {
      type: [exampleSchema],
      default: [],
    },

    score: {
      type: Number,
      default: 0,
    },

    timeLimit: {
      type: Number,
      default: 2000, // milliseconds
    },

    memoryLimit: {
      type: Number,
      default: 128, // MB
    },
  },
  {
    timestamps: true,
    collection: "contest_problems"
  }
);

module.exports = mongoose.model("ContestProblem", contestProblemSchema);

