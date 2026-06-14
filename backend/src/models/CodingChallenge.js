const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  expectedOutput: {
    type: String,
    required: true,
  },
  isHidden: {
    type: Boolean,
    default: false,
  },
});

const starterCodeSchema = new mongoose.Schema({
  language: {
    type: String,
    enum: ['javascript', 'python', 'java', 'cpp', 'go', 'rust', 'ruby', 'typescript'],
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

const codingChallengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String, // Full Markdown content
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    category: {
      type: String,
      enum: [
        'Arrays',
        'Strings',
        'Linked List',
        'Stack',
        'Queue',
        'Trees',
        'Graphs',
        'Dynamic Programming',
      ],
      required: true,
    },
    inputFormat: {
      type: String,
      default: '',
    },
    outputFormat: {
      type: String,
      default: '',
    },
    constraints: {
      type: String,
      default: '',
    },
    sampleInput: {
      type: String,
      default: '',
    },
    sampleOutput: {
      type: String,
      default: '',
    },
    testCases: [testCaseSchema],
    starterCode: [starterCodeSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CodingChallenge', codingChallengeSchema);
