const CodingSubmission = require('../models/CodingSubmission');

class CodingSubmissionRepository {
  async create(submissionData) {
    return CodingSubmission.create(submissionData);
  }

  async findByUserId(userId) {
    return CodingSubmission.find({ userId }).populate('challengeId').sort({ createdAt: -1 });
  }

  async findLatestByUserId(userId) {
    return CodingSubmission.findOne({ userId }).populate('challengeId').sort({ createdAt: -1 });
  }

  async countAll(filter = {}) {
    return CodingSubmission.countDocuments(filter);
  }
}

module.exports = new CodingSubmissionRepository();
