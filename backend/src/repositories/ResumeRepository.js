const Resume = require('../models/Resume');

class ResumeRepository {
  async create(resumeData) {
    return Resume.create(resumeData);
  }

  async findByUserId(userId) {
    return Resume.find({ userId }).sort({ createdAt: -1 });
  }

  async findLatestByUserId(userId) {
    return Resume.findOne({ userId }).sort({ createdAt: -1 });
  }

  async findById(id) {
    return Resume.findById(id);
  }

  async delete(id) {
    return Resume.findByIdAndDelete(id);
  }
}

module.exports = new ResumeRepository();
