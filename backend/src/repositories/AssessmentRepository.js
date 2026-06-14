const Assessment = require('../models/Assessment');
const AssessmentAttempt = require('../models/AssessmentAttempt');

class AssessmentRepository {
  // Assessment schemas operations
  async create(assessmentData) {
    return Assessment.create(assessmentData);
  }

  async findById(id) {
    return Assessment.findById(id).populate('questions').populate('codingChallenges');
  }

  async findAll(filter = {}) {
    return Assessment.find(filter).populate('questions').populate('codingChallenges');
  }

  async update(id, updateData) {
    return Assessment.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return Assessment.findByIdAndDelete(id);
  }

  // Attempt schemas operations
  async createAttempt(attemptData) {
    return AssessmentAttempt.create(attemptData);
  }

  async findAttemptsByUserId(userId) {
    return AssessmentAttempt.find({ userId }).populate('assessmentId').sort({ createdAt: -1 });
  }

  async findLatestAttemptByUserId(userId) {
    return AssessmentAttempt.findOne({ userId }).populate('assessmentId').sort({ createdAt: -1 });
  }

  async findAttemptById(id) {
    return AssessmentAttempt.findById(id).populate('assessmentId').populate('answers.questionId').populate('answers.codingChallengeId');
  }
}

module.exports = new AssessmentRepository();
