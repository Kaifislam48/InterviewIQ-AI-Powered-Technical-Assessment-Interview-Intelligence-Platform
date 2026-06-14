const codingService = require('../services/coding.service');
const asyncHandler = require('../utils/asyncHandler');
const statusCodes = require('../constants/statusCodes');

const listChallenges = asyncHandler(async (req, res) => {
  const { category, difficulty } = req.query;
  const result = await codingService.getChallenges(category, difficulty);
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

const getChallenge = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await codingService.getChallengeById(id);
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

const submitCode = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { code, language } = req.body;
  const result = await codingService.submitChallenge(req.user.id, id, code, language);
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

const requestHint = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { code, language } = req.body;
  const result = await codingService.getChallengeHint(id, code, language);
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

const getSubmissionsHistory = asyncHandler(async (req, res) => {
  const result = await codingService.getUserSubmissions(req.user.id);
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

module.exports = {
  listChallenges,
  getChallenge,
  submitCode,
  requestHint,
  getSubmissionsHistory,
};
