const mongoose = require('mongoose');

const weeklyRoadmapSchema = new mongoose.Schema({
  weekNumber: {
    type: Number,
    required: true,
  },
  theme: {
    type: String,
    required: true,
  },
  topics: {
    type: [String],
    default: [],
  },
  recommendedResources: {
    type: [String],
    default: [],
  },
  practiceChallenges: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingChallenge',
    },
  ],
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
});

const learningPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    weeklyRoadmap: [weeklyRoadmapSchema],
    weakAreas: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('LearningPlan', learningPlanSchema);
