const userRepository = require('../repositories/UserRepository');
const assessmentRepository = require('../repositories/AssessmentRepository');
const User = require('../models/User');
const Interview = require('../models/Interview');
const Resume = require('../models/Resume');
const CodingSubmission = require('../models/CodingSubmission');
const { ForbiddenError, NotFoundError } = require('../utils/errors');

const getUsers = async () => {
  return userRepository.findAll({}, '-password');
};

const deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }
  if (user.role === 'admin') {
    throw new ForbiddenError('Cannot delete admin users');
  }
  return userRepository.delete(userId);
};

const getPlatformStats = async () => {
  const totalUsers = await User.countDocuments({ role: 'candidate' });
  const totalInterviews = await Interview.countDocuments({});
  
  // Calculate Daily Active Users (users updated in last 24 hours)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const activeUsers = await User.countDocuments({
    updatedAt: { $gte: oneDayAgo },
    role: 'candidate',
  });

  // Calculate total AI queries (Resume runs + Mock Interview evaluations)
  const totalResumes = await Resume.countDocuments({});
  const totalCodingSubmissions = await CodingSubmission.countDocuments({});
  
  // Each interview has questions, which are evaluated
  const interviews = await Interview.find({});
  let totalEvaluatedQuestions = 0;
  interviews.forEach((i) => {
    totalEvaluatedQuestions += i.questions.filter((q) => q.userAnswer).length;
  });

  const totalAIUsage = totalResumes + totalEvaluatedQuestions + totalCodingSubmissions;

  return {
    totalUsers,
    totalInterviews,
    dailyActiveUsers: activeUsers || 1, // Fallback to 1 minimum for display
    aiUsageStatistics: {
      totalQueries: totalAIUsage,
      resumeAnalyses: totalResumes,
      interviewEvaluations: totalEvaluatedQuestions,
      codingSubmissions: totalCodingSubmissions,
    },
  };
};

const createAssessment = async (createdBy, assessmentData) => {
  return assessmentRepository.create({
    ...assessmentData,
    createdBy,
  });
};

const deleteAssessment = async (id) => {
  return assessmentRepository.delete(id);
};

module.exports = {
  getUsers,
  deleteUser,
  getPlatformStats,
  createAssessment,
  deleteAssessment,
};
