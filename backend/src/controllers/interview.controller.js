const interviewService = require('../services/interview.service');
const asyncHandler = require('../utils/asyncHandler');
const statusCodes = require('../constants/statusCodes');

const startInterview = asyncHandler(async (req, res) => {
  const { role, experienceLevel, techStack, difficulty } = req.body;
  const result = await interviewService.startNewInterview(
    req.user.id,
    role,
    experienceLevel,
    techStack,
    difficulty
  );
  res.status(statusCodes.CREATED).json({
    status: 'success',
    data: result,
  });
});

const submitAnswer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;
  const result = await interviewService.processUserAnswer(req.user.id, id, answer);
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

const getHistory = asyncHandler(async (req, res) => {
  const result = await interviewService.getInterviewHistory(req.user.id);
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

const getSession = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await interviewService.getInterviewSession(id);
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

module.exports = {
  startInterview,
  submitAnswer,
  getHistory,
  getSession,
};
