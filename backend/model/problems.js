const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema(
  {
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

    examples: [
      {
        input: {
          type: String,
          required: true,
        },

        output: {
          type: String,
          required: true,
        },

        explanation: {
          type: String,
        },
      },
    ],

    starterCode: {
      type: Map,
      of: String,
      default: {},
    },

    timeLimit: {
      type: Number,
      default: 2000,
    },

    memoryLimit: {
      type: Number,
      default: 128,
    },

    problemNo: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    collection: "problem_sets",
  }
);

const Problem = mongoose.model("Problem", problemSchema);

module.exports = Problem;