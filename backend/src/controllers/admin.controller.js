const adminService = require('../services/admin.service');
const asyncHandler = require('../utils/asyncHandler');
const statusCodes = require('../constants/statusCodes');

const listUsers = asyncHandler(async (req, res) => {
  const result = await adminService.getUsers();
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

const removeUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await adminService.deleteUser(id);
  res.status(statusCodes.OK).json({
    status: 'success',
    message: 'User successfully removed from platform',
  });
});

const getStats = asyncHandler(async (req, res) => {
  const result = await adminService.getPlatformStats();
  res.status(statusCodes.OK).json({
    status: 'success',
    data: result,
  });
});

const createAssessment = asyncHandler(async (req, res) => {
  const result = await adminService.createAssessment(req.user.id, req.body);
  res.status(statusCodes.CREATED).json({
    status: 'success',
    data: result,
  });
});

const removeAssessment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await adminService.deleteAssessment(id);
  res.status(statusCodes.OK).json({
    status: 'success',
    message: 'Assessment successfully deleted',
  });
});

module.exports = {
  listUsers,
  removeUser,
  getStats,
  createAssessment,
  removeAssessment,
};
