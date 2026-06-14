const Interview = require('../models/Interview');

class InterviewRepository {
  async create(interviewData) {
    return Interview.create(interviewData);
  }

  async findById(id) {
    return Interview.findById(id);
  }

  async findByUserId(userId) {
    return Interview.find({ userId }).sort({ createdAt: -1 });
  }

  async findLatestByUserId(userId) {
    return Interview.findOne({ userId }).sort({ createdAt: -1 });
  }

  async update(id, updateData) {
    return Interview.findByIdAndUpdate(id, updateData, { new: true });
  }

  async countAll(filter = {}) {
    return Interview.countDocuments(filter);
  }

  async getAverageScoreByUserId(userId) {
    const results = await Interview.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), status: 'completed' } },
      { $group: { _id: null, avgScore: { $avg: '$overallScore' } } }
    ]);
    return results.length > 0 ? Math.round(results[0].avgScore) : 0;
  }
}

// Ensure mongoose is required for aggregation
const mongoose = require('mongoose');

module.exports = new InterviewRepository();
