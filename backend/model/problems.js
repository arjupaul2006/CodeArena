const mongoose = require("mongoose");

// Parameter Schema
const parameterSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

// Function Signature Schema
const functionSignatureSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      trim: true,
    },

    functionName: {
      type: String,
      required: true,
      trim: true,
    },

    returnType: {
      type: String,
      required: true,
      trim: true,
    },

    parameters: {
      type: [parameterSchema],
      default: [],
    },
  },
  { _id: false }
);

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

const problemSchema = new mongoose.Schema(
  {
    problemNo: {
      type: String,
      required: true,
      unique: true,
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

    // Used by the judge
    functionSignature: {
      type: functionSignatureSchema,
      required: true,
    },

    // Language templates shown in Monaco editor
    starterCode: {
      type: Map,
      of: String,
      default: {},
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
    collection: "problem_sets",
  }
);

module.exports = mongoose.model("Problem", problemSchema);