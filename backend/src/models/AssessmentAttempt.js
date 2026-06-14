const mongoose = require('mongoose');

const attemptAnswerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  },
  codingChallengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CodingChallenge',
  },
  selectedOptions: {
    type: [Number], // For MCQ
    default: [],
  },
  submittedCode: {
    type: String, // For coding
    default: '',
  },
  language: {
    type: String,
    default: '',
  },
  passed: {
    type: Boolean,
    default: false,
  },
});

const assessmentAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
      index: true,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    passed: {
      type: Boolean,
      required: true,
      default: false,
    },
    timeTaken: {
      type: Number, // in seconds
      required: true,
    },
    answers: [attemptAnswerSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AssessmentAttempt', assessmentAttemptSchema);
