const learningPlanService = require('../services/learningPlan.service');
const asyncHandler = require('../utils/asyncHandler');
const statusCodes = require('../constants/statusCodes');

const getPlan = asyncHandler(async (req, res) => {
  const result = await learningPlanService.getOrCreatePlan(req.user.id);
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

const regeneratePlan = asyncHandler(async (req, res) => {
  const result = await learningPlanService.getOrCreatePlan(req.user.id, true);
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

const updateMilestone = asyncHandler(async (req, res) => {
  const { weekNumber, status } = req.body;
  const result = await learningPlanService.updateMilestoneStatus(req.user.id, weekNumber, status);
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

module.exports = {
  getPlan,
  regeneratePlan,
  updateMilestone,
};
