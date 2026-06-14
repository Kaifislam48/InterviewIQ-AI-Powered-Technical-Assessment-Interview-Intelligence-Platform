const assessmentService = require('../services/assessment.service');
const asyncHandler = require('../utils/asyncHandler');
const statusCodes = require('../constants/statusCodes');

const listAssessments = asyncHandler(async (req, res) => {
  const { type } = req.query;
  const result = await assessmentService.getAssessments(type);
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

const getAssessment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await assessmentService.getAssessmentById(id);
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

const submitAttempt = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { timeTaken, answers } = req.body;
  const result = await assessmentService.submitAssessment(req.user.id, id, timeTaken, answers);
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

const getAttemptsHistory = asyncHandler(async (req, res) => {
  const result = await assessmentService.getUserAttempts(req.user.id);
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

const getAttemptDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await assessmentService.getAttemptDetails(id);
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

module.exports = {
  listAssessments,
  getAssessment,
  submitAttempt,
  getAttemptsHistory,
  getAttemptDetails,
};
