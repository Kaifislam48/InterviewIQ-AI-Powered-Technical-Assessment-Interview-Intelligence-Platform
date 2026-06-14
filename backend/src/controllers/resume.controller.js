const resumeService = require('../services/resume.service');
const asyncHandler = require('../utils/asyncHandler');
const statusCodes = require('../constants/statusCodes');

const uploadResume = asyncHandler(async (req, res) => {
  const result = await resumeService.analyzeUserResume(req.user.id, req.file);
  res.status(statusCodes.CREATED).json({
    status: 'success',
    data: result,
  });
});

const getHistory = asyncHandler(async (req, res) => {
  const result = await resumeService.getResumeHistory(req.user.id);
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

const getLatest = asyncHandler(async (req, res) => {
  const result = await resumeService.getLatestResume(req.user.id);
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result || null,
  });
});

module.exports = {
  uploadResume,
  getHistory,
  getLatest,
};
