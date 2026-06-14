const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    enum: ['technical', 'behavioral', 'hr'],
    required: true,
  },
  userAnswer: {
    type: String,
    default: '',
  },
  evaluation: {
    score: { type: Number, min: 0, max: 10, default: 0 },
    feedback: { type: String, default: '' },
    metrics: {
      technicalAccuracy: { type: Number, min: 0, max: 10, default: 0 },
      communication: { type: Number, min: 0, max: 10, default: 0 },
      problemSolving: { type: Number, min: 0, max: 10, default: 0 },
      confidence: { type: Number, min: 0, max: 10, default: 0 },
    },
  },
});

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    techStack: {
      type: [String],
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'completed'],
      default: 'pending',
    },
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    questions: [interviewQuestionSchema],
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    overallFeedback: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Interview', interviewSchema);
