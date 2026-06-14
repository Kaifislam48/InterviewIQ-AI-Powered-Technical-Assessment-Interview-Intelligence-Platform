const CodingChallenge = require('../models/CodingChallenge');

class CodingChallengeRepository {
  async create(challengeData) {
    return CodingChallenge.create(challengeData);
  }

  async findById(id) {
    return CodingChallenge.findById(id);
  }

  async findOne(filter = {}) {
    return CodingChallenge.findOne(filter);
  }

  async findAll(filter = {}) {
    return CodingChallenge.find(filter);
  }

  async update(id, updateData) {
    return CodingChallenge.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id) {
    return CodingChallenge.findByIdAndDelete(id);
  }
}

module.exports = new CodingChallengeRepository();
