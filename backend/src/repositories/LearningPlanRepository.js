const LearningPlan = require('../models/LearningPlan');

class LearningPlanRepository {
  async create(planData) {
    return LearningPlan.create(planData);
  }

  async findByUserId(userId) {
    return LearningPlan.findOne({ userId }).populate('weeklyRoadmap.practiceChallenges');
  }

  async updateByUserId(userId, updateData) {
    return LearningPlan.findOneAndUpdate({ userId }, updateData, { new: true, upsert: true }).populate('weeklyRoadmap.practiceChallenges');
  }
}

module.exports = new LearningPlanRepository();
